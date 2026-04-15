import { useState }         from 'react';
import { registrationsAPI } from '@/lib/api';
import { deptColorMap }     from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { Label }   from '@/components/ui/label';
import { Badge }   from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, ExternalLink, CheckCircle2, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Props { event: any; open: boolean; onClose: () => void; }

export const RegistrationModal = ({ event, open, onClose }: Props) => {
  const [step,    setStep]    = useState<'form'|'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [form,    setForm]    = useState({ name:'', email:'', phone:'', department:'', year:'' });

  if (!event) return null;

  // Support both MongoDB _id and legacy id
  const eventId = event._id || event.id;
  const dept    = event.department as keyof typeof deptColorMap;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) {
      return setError('Name and email are required.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return setError('Enter a valid email address.');
    }

    setLoading(true);
    try {
      await registrationsAPI.register({ eventId, ...form });
      setStep('success');
      toast.success('Registered successfully!');
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setError('');
    setForm({ name:'', email:'', phone:'', department:'', year:'' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        {/* Coloured header */}
        <motion.div className={`${deptColorMap[dept]} px-6 py-5 relative overflow-hidden`}
          initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/20"/>
          <motion.div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-foreground/10"
            animate={{ scale:[1,1.2,1], rotate:[0,90,0] }} transition={{ duration:8, repeat:Infinity, ease:'linear' }}/>
          <DialogHeader className="relative z-10">
            <Badge className="w-fit bg-primary-foreground/20 text-primary-foreground border-none mb-2 backdrop-blur-sm">{event.department}</Badge>
            <DialogTitle className="font-display text-xl text-primary-foreground">{event.title}</DialogTitle>
            <p className="text-primary-foreground/80 text-sm mt-1">{event.date} • {event.time}</p>
          </DialogHeader>
        </motion.div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.form key="form" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:20 }} transition={{ duration:0.25 }}
                onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="w-3.5 h-3.5 text-primary"/>Full Name *
                  </Label>
                  <Input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))}
                    placeholder="Enter your full name" className="h-11 rounded-xl" required maxLength={100}/>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="w-3.5 h-3.5 text-primary"/>Email Address *
                  </Label>
                  <Input type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                    placeholder="your.email@example.com" className="h-11 rounded-xl" required maxLength={255}/>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Phone className="w-3.5 h-3.5 text-primary"/>Phone
                    </Label>
                    <Input value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))}
                      placeholder="9876543210" className="h-11 rounded-xl" maxLength={15}/>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-primary"/>Year
                    </Label>
                    <Input value={form.year} onChange={e => setForm(f=>({...f,year:e.target.value}))}
                      placeholder="2nd Year" className="h-11 rounded-xl" maxLength={20}/>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-primary"/>Department
                  </Label>
                  <Input value={form.department} onChange={e => setForm(f=>({...f,department:e.target.value}))}
                    placeholder="Your department (e.g. CSE)" className="h-11 rounded-xl" maxLength={50}/>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0"/>{error}
                  </div>
                )}

                <motion.div whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
                  <Button type="submit" disabled={loading}
                    className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl text-base glow-primary">
                    <Sparkles className="w-4 h-4 mr-2"/>
                    {loading ? 'Registering…' : 'Register Now'}
                    {!loading && <ArrowRight className="w-4 h-4 ml-2"/>}
                  </Button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div key="success" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                transition={{ type:'spring', damping:20 }} className="text-center py-4 space-y-5">
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.1, damping:10 }}>
                  <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center glow-primary">
                    <CheckCircle2 className="w-10 h-10 text-primary-foreground"/>
                  </div>
                </motion.div>
                <div>
                  <h3 className="font-display text-xl font-bold">You're Registered!</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Welcome, {form.name}! A confirmation will be sent to {form.email}.
                  </p>
                </div>
                {event.googleFormUrl && (
                  <div className="space-y-3 pt-2">
                    <p className="text-sm text-muted-foreground">The organizer has an additional form:</p>
                    <Button onClick={() => window.open(event.googleFormUrl,'_blank','noopener,noreferrer')}
                      className="w-full h-12 gradient-accent text-accent-foreground font-semibold rounded-xl">
                      <ExternalLink className="w-4 h-4 mr-2"/>Open Google Form
                    </Button>
                  </div>
                )}
                <Button variant="ghost" onClick={handleClose} className="text-muted-foreground">Close</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
