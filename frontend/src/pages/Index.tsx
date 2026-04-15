import { useState, useMemo, useRef } from 'react';
import { useQuery }                  from '@tanstack/react-query';
import { eventsAPI }                 from '@/lib/api';
import { Department }                from '@/lib/data';
import { Navbar }                    from '@/components/Navbar';
import { EventCard }                 from '@/components/EventCard';
import { DeptFilter }                from '@/components/DeptFilter';
import { StatsBar }                  from '@/components/StatsBar';
import { EventDetailModal }          from '@/components/EventDetailModal';
import { RegistrationModal }         from '@/components/RegistrationModal';
import { Skeleton }                  from '@/components/ui/skeleton';
import { Search, ChevronDown, Zap, Star, ArrowRight } from 'lucide-react';
import { Input }                     from '@/components/ui/input';
import { Button }                    from '@/components/ui/button';
import { Badge }                     from '@/components/ui/badge';
import { motion, useScroll, useTransform } from 'framer-motion';
import { deptColorMap }              from '@/lib/data';

const Index = () => {
  const [dept,          setDept]          = useState<Department | 'ALL'>('ALL');
  const [search,        setSearch]        = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registerEvent, setRegisterEvent] = useState<any>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  // Fetch all events from backend
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn:  async () => { const r = await eventsAPI.getAll(); return r.data; },
  });

  const featuredEvents = useMemo(() => allEvents.filter((e: any) => e.featured), [allEvents]);

  const filtered = useMemo(() => {
    return allEvents.filter((e: any) => {
      const matchDept   = dept === 'ALL' || e.department === dept;
      const matchSearch = !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        (e.tags || []).some((t: string) => t.toLowerCase().includes(search.toLowerCase()));
      return matchDept && matchSearch;
    });
  }, [allEvents, dept, search]);

  const handleRegister = (event: any) => { setSelectedEvent(null); setRegisterEvent(event); };

  return (
    <div className="min-h-screen scroll-smooth">
      <Navbar />

      {/* ── Hero ── */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }}
        className="gradient-hero text-primary-foreground py-28 md:py-44 px-4 relative overflow-hidden">
        <motion.div className="absolute top-10 left-[5%] w-80 h-80 rounded-full bg-primary/20 blur-[100px]"
          animate={{ y:[0,-40,0], x:[0,30,0], scale:[1,1.2,1] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }}/>
        <motion.div className="absolute bottom-0 right-[10%] w-96 h-96 rounded-full bg-accent/15 blur-[120px]"
          animate={{ y:[0,30,0] }} transition={{ duration:12, repeat:Infinity, ease:'easeInOut' }}/>
        <motion.div className="absolute top-1/3 left-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground/5"
          animate={{ rotate:[0,360] }} transition={{ duration:30, repeat:Infinity, ease:'linear' }}/>
        {[...Array(6)].map((_,i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-accent/40"
            style={{ left:`${15+i*15}%`, top:`${20+(i%3)*25}%` }}
            animate={{ y:[0,-30,0], opacity:[0.3,0.8,0.3] }} transition={{ duration:4+i, repeat:Infinity, delay:i*0.5 }}/>
        ))}
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/10 text-sm mb-6">
            <Zap className="w-4 h-4 text-accent"/><span>Your one-stop campus event platform</span>
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8, delay:0.1, ease:[0.16,1,0.3,1] }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]">
            Campus{' '}<span className="relative"><span className="text-accent">EventHub</span>
              <motion.span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full gradient-accent"
                initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ delay:0.8, duration:0.6 }}/>
            </span>
          </motion.h1>
          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
            className="text-lg md:text-xl opacity-80 mb-10 leading-relaxed max-w-xl mx-auto">
            Discover, register, and participate in workshops, hackathons, competitions and more.
          </motion.p>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
            <Input placeholder="Search events, tags..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-12 bg-card/90 backdrop-blur-md text-card-foreground h-14 rounded-2xl border-none shadow-2xl text-base"/>
          </motion.div>
          <motion.button onClick={() => eventsRef.current?.scrollIntoView({ behavior:'smooth' })}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
            className="mt-14 mx-auto flex flex-col items-center gap-1 text-primary-foreground/60 hover:text-primary-foreground/90 transition-colors">
            <span className="text-xs font-medium tracking-wider uppercase">Explore Events</span>
            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:2, repeat:Infinity }}>
              <ChevronDown className="w-5 h-5"/>
            </motion.div>
          </motion.button>
        </div>
      </motion.section>

      <div ref={eventsRef} className="container mx-auto px-4 py-14 space-y-14">
        <StatsBar />

        {/* ── Featured Events ── */}
        {!isLoading && featuredEvents.length > 0 && !search && dept === 'ALL' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
                  <Star className="w-4 h-4 text-accent-foreground"/>
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold">Featured Events</h2>
                  <p className="text-xs text-muted-foreground">Highlighted picks across departments</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1 text-xs" onClick={() => eventsRef.current?.scrollIntoView({ behavior:'smooth' })}>
                View all <ArrowRight className="w-3 h-3"/>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {featuredEvents.map((event: any, i: number) => (
                <motion.div key={event._id || event.id}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:i*0.08 }} whileHover={{ y:-6, transition:{ duration:0.2 } }}
                  onClick={() => setSelectedEvent(event)}
                  className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:glow-primary transition-all duration-300">
                  <div className={`h-1.5 ${deptColorMap[event.department as keyof typeof deptColorMap]} relative overflow-hidden`}>
                    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"
                      animate={{ x:['-100%','200%'] }} transition={{ duration:3, repeat:Infinity, ease:'linear' }}/>
                  </div>
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ background: 'var(--color-primary)' }}/>
                  <div className="relative p-5 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`text-xs font-semibold ${deptColorMap[event.department as keyof typeof deptColorMap]} text-primary-foreground border-none`}>
                        {event.department}
                      </Badge>
                      <Badge className="gradient-accent text-accent-foreground text-xs border-none">
                        <Star className="w-3 h-3 mr-1 fill-current"/>Featured
                      </Badge>
                    </div>
                    <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-xs text-muted-foreground">
                        <div>{event.date} • {event.time}</div>
                        <div>{event.venue}</div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-semibold text-primary">{event.registrations}/{event.maxCapacity}</div>
                        <div className="text-muted-foreground">registered</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(event.tags || []).slice(0,3).map((t: string) => (
                        <span key={t} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <DeptFilter selected={dept} onSelect={setDept} />

        <div className="flex items-center gap-3 -mb-8">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground"/>
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{dept==='ALL' ? 'All Events' : `${dept} Events`}</h2>
            <p className="text-xs text-muted-foreground">{filtered.length} event{filtered.length!==1?'s':''} found</p>
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <Skeleton className="h-1.5 w-full"/>
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20 rounded-full"/>
                  <Skeleton className="h-6 w-3/4"/>
                  <Skeleton className="h-12 w-full"/>
                  <Skeleton className="h-4 w-full"/>
                  <Skeleton className="h-4 w-2/3"/>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((e: any, i: number) => (
              <EventCard key={e._id || e.id} event={{ ...e, id: e._id || e.id }} index={i} onClick={() => setSelectedEvent(e)} />
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No events found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search</p>
          </motion.div>
        )}
      </div>

      <footer className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p className="font-display font-semibold text-gradient text-lg mb-1">Campus EventHub</p>
          <p>© 2026 University Event Management System. All rights reserved.</p>
        </div>
      </footer>

      <EventDetailModal event={selectedEvent} open={!!selectedEvent} onClose={() => setSelectedEvent(null)} onRegister={handleRegister}/>
      <RegistrationModal event={registerEvent} open={!!registerEvent} onClose={() => setRegisterEvent(null)}/>
    </div>
  );
};

export default Index;
