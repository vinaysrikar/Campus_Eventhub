import { useState }               from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth }                from '@/lib/auth-context';
import { eventsAPI, registrationsAPI, uploadAPI } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { Navbar }                 from '@/components/Navbar';
import { deptColorMap }           from '@/lib/data';
import { Button }                 from '@/components/ui/button';
import { Input }                  from '@/components/ui/input';
import { Label }                  from '@/components/ui/label';
import { Textarea }               from '@/components/ui/textarea';
import { Badge }                  from '@/components/ui/badge';
import { Skeleton }               from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Calendar, Clock, Users, Download, ImageIcon, Eye, BarChart3, TrendingUp } from 'lucide-react';
import { motion }                 from 'framer-motion';
import { toast }                  from 'sonner';
import { Navigate }               from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const qc = useQueryClient();

  const [showForm,           setShowForm]           = useState(false);
  const [editingEvent,       setEditingEvent]       = useState<any>(null);
  const [imageFile,          setImageFile]          = useState<File | null>(null);
  const [viewingRegistrations, setViewingRegistrations] = useState<string | null>(null);
  const [showAnalytics,      setShowAnalytics]      = useState(false);

  const emptyForm = { title:'', description:'', date:'', time:'', venue:'', maxCapacity:'', tags:'', googleFormUrl:'', image:'' };
  const [form, setForm] = useState(emptyForm);

  if (loading) return null; // Avoid early redirect while verifying session
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;

  // Fetch dept events (or all for admin)
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', user.department],
    queryFn:  async () => {
      const params = user.isAdmin ? {} : { department: user.department };
      const r = await eventsAPI.getAll(params);
      return r.data;
    },
  });

  // Fetch registrations for selected event
  const { data: registrations = [], isLoading: regLoading } = useQuery({
    queryKey: ['registrations', viewingRegistrations],
    queryFn:  async () => {
      if (!viewingRegistrations) return [];
      const r = await registrationsAPI.getForEvent(viewingRegistrations);
      return r.data;
    },
    enabled: !!viewingRegistrations,
  });

  const totalCapacity      = events.reduce((s: number, e: any) => s + e.maxCapacity, 0);
  const totalRegistrations = events.reduce((s: number, e: any) => s + (e.registrations || 0), 0);

  const openNew = () => {
    setEditingEvent(null); setImageFile(null); setForm(emptyForm); setShowForm(true);
  };
  const openEdit = (evt: any) => {
    setEditingEvent(evt); setImageFile(null);
    setForm({
      title: evt.title, description: evt.description, date: evt.date, time: evt.time,
      venue: evt.venue, maxCapacity: String(evt.maxCapacity), tags: (evt.tags||[]).join(', '),
      googleFormUrl: evt.googleFormUrl||'', image: evt.image||'',
    });
    setShowForm(true);
  };

  // Save (create or update)
  const saveMutation = useMutation({
    mutationFn: async (e: React.FormEvent) => {
      (e as any).preventDefault?.();
      let imageUrl = form.image;
      if (imageFile) {
        try {
          const r = await uploadAPI.uploadImage(imageFile);
          imageUrl = r.data.url;
        } catch (uploadErr: any) {
          throw new Error(uploadErr.response?.data?.error || 'Image upload failed. Please try a smaller image (max 5MB).');
        }
      }
      const payload = {
        title: form.title, description: form.description, date: form.date, time: form.time,
        venue: form.venue, maxCapacity: Number(form.maxCapacity)||100,
        tags: form.tags.split(',').map((t:string)=>t.trim()).filter(Boolean),
        googleFormUrl: form.googleFormUrl.trim()||undefined,
        image: imageUrl,
      };
      if (editingEvent) return eventsAPI.update(editingEvent._id, payload);
      return eventsAPI.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success(editingEvent ? 'Event updated!' : 'Event created!');
      setShowForm(false);
    },
    onError: (err: any) => toast.error(err.response?.data?.error || err.message || 'Something went wrong.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventsAPI.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['events'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast.success('Event deleted.');
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Delete failed.'),
  });

  const exportCSV = () => {
    if (!registrations.length) return toast.error('No registrations to export.');
    const rows = [
      ['Name','Email','Phone','Department','Year','Registered At'],
      ...registrations.map((r: any) => [r.name, r.email, r.phone||'', r.department||'', r.year||'', new Date(r.createdAt).toLocaleString()]),
    ];
    const csv  = rows.map(r => r.map((v: string) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a'); a.href=url; a.download=`registrations-${viewingRegistrations}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <Navbar/>
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground flex items-center gap-2 flex-wrap mt-1">
              Managing events for
              <Badge className={`${deptColorMap[user.department as keyof typeof deptColorMap]} text-primary-foreground border-none`}>{user.department}</Badge>
              {user.isAdmin && <Badge className="bg-amber-500 text-white border-none">Admin</Badge>}
            </p>
          </div>
          <Button onClick={openNew} className="gradient-accent text-accent-foreground font-semibold">
            <Plus className="w-4 h-4 mr-2"/>Add Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label:'Total Events',   value:events.length,                                                           icon:Calendar },
            { label:'Upcoming',       value:events.filter((e:any)=>e.status==='upcoming').length,                    icon:Clock    },
            { label:'Total Capacity', value:totalCapacity,                                                           icon:Users    },
            { label:'Registrations',  value:totalRegistrations,                                                      icon:Users    },
          ].map((s,i) => (
            <motion.div key={s.label} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:i*0.05 }} className="glass-card rounded-xl p-4 text-center">
              <s.icon className="w-5 h-5 mx-auto mb-1 text-accent"/>
              <div className="font-display font-bold text-xl">{isLoading ? '…' : s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Analytics Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant={showAnalytics ? 'default' : 'outline'} onClick={() => setShowAnalytics(!showAnalytics)} className="gap-2">
            <BarChart3 className="w-4 h-4"/>{showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </Button>
        </div>

        {/* Analytics Charts */}
        {showAnalytics && (
          <AnalyticsSection />
        )}

        {/* Events table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="text-left p-4 font-semibold">Event</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-left p-4 font-semibold hidden md:table-cell">Venue</th>
                  <th className="text-left p-4 font-semibold hidden sm:table-cell">Registrations</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && [...Array(4)].map((_,i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4"><Skeleton className="h-5 w-40"/></td>
                    <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-24"/></td>
                    <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-32"/></td>
                    <td className="p-4 hidden sm:table-cell"><Skeleton className="h-4 w-16"/></td>
                    <td className="p-4"><Skeleton className="h-8 w-16 ml-auto"/></td>
                  </tr>
                ))}
                {!isLoading && events.map((evt: any, i: number) => (
                  <motion.tr key={evt._id} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.03 }}
                    className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium">{evt.title}</div>
                      <div className="text-xs text-muted-foreground md:hidden">{evt.date}</div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{evt.date}</td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{evt.venue}</td>
                    <td className="p-4 hidden sm:table-cell">
                      <button onClick={() => setViewingRegistrations(evt._id)}
                        className="hover:text-primary hover:underline transition-colors">
                        {evt.registrations||0}/{evt.maxCapacity}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewingRegistrations(evt._id)} title="View registrations">
                          <Eye className="w-4 h-4"/>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(evt)}><Edit2 className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                          onClick={() => deleteMutation.mutate(evt._id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && events.length === 0 && (
            <div className="p-10 text-center text-muted-foreground">No events yet. Click "Add Event" to create one.</div>
          )}
        </div>
      </div>

      {/* Add/Edit Event Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(e); }} className="space-y-4">
            <div className="space-y-2"><Label>Title</Label>
              <Input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required/></div>
            <div className="space-y-2"><Label>Description</Label>
              <Textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Date</Label>
                <Input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} min={new Date().toISOString().split('T')[0]} required/></div>
              <div className="space-y-2"><Label>Time</Label>
                <Input value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} placeholder="09:00 AM" required/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Venue</Label>
                <Input value={form.venue} onChange={e=>setForm(f=>({...f,venue:e.target.value}))} required/></div>
              <div className="space-y-2"><Label>Max Capacity</Label>
                <Input type="number" min="1" value={form.maxCapacity} onChange={e=>setForm(f=>({...f,maxCapacity:e.target.value}))} required/></div>
            </div>
            <div className="space-y-2"><Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="Workshop, AI, Coding"/></div>
            <div className="space-y-2">
              <Label>Event Image / Brochure</Label>
              {/* Preview current or new image */}
              {(imageFile || form.image) && (
                <div className="relative rounded-xl overflow-hidden border bg-secondary/30">
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : form.image}
                    alt="Event preview"
                    className="w-full h-36 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => { setImageFile(null); setForm(f => ({ ...f, image: '' })); }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
                  >✕</button>
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer border rounded-xl px-4 py-2 hover:bg-secondary transition-colors text-sm w-fit">
                <ImageIcon className="w-4 h-4"/>
                {imageFile ? '📎 ' + imageFile.name : form.image ? 'Replace image' : 'Choose image (optional)'}
                <input type="file" accept="image/*" className="hidden" onChange={e=>setImageFile(e.target.files?.[0]||null)}/>
              </label>
            </div>
            <div className="space-y-2"><Label>Google Form URL (optional)</Label>
              <Input value={form.googleFormUrl} onChange={e=>setForm(f=>({...f,googleFormUrl:e.target.value}))} placeholder="https://forms.google.com/..."/>
            </div>
            <Button type="submit" disabled={saveMutation.isPending} className="w-full gradient-accent text-accent-foreground font-semibold">
              {saveMutation.isPending ? 'Saving…' : editingEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Registrations Dialog */}
      <Dialog open={!!viewingRegistrations} onOpenChange={() => setViewingRegistrations(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center justify-between pr-8">
              <span>Registrations</span>
              <Button size="sm" variant="outline" onClick={exportCSV} disabled={!registrations.length}>
                <Download className="w-4 h-4 mr-2"/>Export CSV
              </Button>
            </DialogTitle>
          </DialogHeader>
          {regLoading ? (
            <div className="space-y-2">{[...Array(4)].map((_,i) => <Skeleton key={i} className="h-12 rounded-xl"/>)}</div>
          ) : registrations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b">
                  <th className="text-left p-3">Name</th><th className="text-left p-3">Email</th>
                  <th className="text-left p-3 hidden sm:table-cell">Phone</th>
                  <th className="text-left p-3 hidden sm:table-cell">Dept</th>
                  <th className="text-left p-3 hidden md:table-cell">Year</th>
                </tr></thead>
                <tbody>
                  {registrations.map((r: any) => (
                    <tr key={r._id} className="border-b last:border-0 hover:bg-secondary/30">
                      <td className="p-3 font-medium">{r.name}</td>
                      <td className="p-3 text-muted-foreground text-xs">{r.email}</td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">{r.phone||'—'}</td>
                      <td className="p-3 text-muted-foreground hidden sm:table-cell">{r.department||'—'}</td>
                      <td className="p-3 text-muted-foreground hidden md:table-cell">{r.year||'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ── Analytics Charts Section ──────────────────────────────────────────────────
const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981'];

const AnalyticsSection = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['stats-analytics'],
    queryFn: async () => { const r = await eventsAPI.getStats(); return r.data; },
  });

  if (isLoading) return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
    </div>
  );

  if (!stats) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-3 gap-6 mb-8">

      {/* Bar Chart — Registrations per Event */}
      <div className="glass-card rounded-2xl p-5 col-span-2 md:col-span-1">
        <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary"/>Registrations per Event
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.perEvent || []} layout="vertical" margin={{ left: 0 }}>
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            />
            <Bar dataKey="registrations" fill="#6366f1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart — Events per Department */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-sm mb-4">🏛️ Events by Department</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={stats.perDepartment || []}
              cx="50%" cy="50%"
              innerRadius={45} outerRadius={75}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              style={{ fontSize: 10 }}
            >
              {(stats.perDepartment || []).map((_: any, i: number) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart — Daily Registration Trend */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent"/>7-Day Trend
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={stats.dailyTrend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }} />
            <Line type="monotone" dataKey="registrations" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default Dashboard;
