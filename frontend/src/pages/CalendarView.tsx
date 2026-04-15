import { useState, useMemo }  from 'react';
import { useQuery }           from '@tanstack/react-query';
import { eventsAPI }          from '@/lib/api';
import { deptColorMap }       from '@/lib/data';
import { Navbar }             from '@/components/Navbar';
import { EventDetailModal }   from '@/components/EventDetailModal';
import { RegistrationModal }  from '@/components/RegistrationModal';
import { Badge }              from '@/components/ui/badge';
import { Button }             from '@/components/ui/button';
import { Skeleton }           from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const CalendarView = () => {
  const [currentDate,   setCurrentDate]   = useState(new Date()); // Current month
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registerEvent, setRegisterEvent] = useState<any>(null);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch ALL events from backend
  const { data: allEvents = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn:  async () => { const r = await eventsAPI.getAll(); return r.data; },
  });

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const prevDays    = new Date(year, month, 0).getDate();
    const days: { date:number; month:'prev'|'current'|'next'; events:any[] }[] = [];

    for (let i = firstDay-1; i >= 0; i--) days.push({ date:prevDays-i, month:'prev', events:[] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr  = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dayEvts  = allEvents.filter((e: any) => e.date === dateStr);
      days.push({ date:d, month:'current', events:dayEvts });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ date:i, month:'next', events:[] });
    return days;
  }, [year, month, allEvents]);

  const upcomingInMonth = useMemo(() => {
    const monthStr = `${year}-${String(month+1).padStart(2,'0')}`;
    return allEvents
      .filter((e: any) => e.date.startsWith(monthStr))
      .sort((a: any, b: any) => a.date.localeCompare(b.date));
  }, [year, month, allEvents]);

  const today   = new Date();
  const isToday = (d: number) => today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;

  const handleRegister = (event: any) => { setSelectedEvent(null); setRegisterEvent(event); };

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="gradient-hero text-primary-foreground py-12 px-4 relative overflow-hidden">
        <motion.div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl"
          animate={{ y:[0,-20,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}/>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-2">
            Event <span className="text-accent">Calendar</span>
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }} className="opacity-80">
            See all events at a glance
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Calendar grid */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="glass-card rounded-2xl p-6 overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month-1, 1))} className="rounded-full">
                <ChevronLeft className="w-5 h-5"/>
              </Button>
              <AnimatePresence mode="wait">
                <motion.h2 key={`${year}-${month}`} initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:10 }}
                  className="font-display text-2xl font-bold">{MONTHS[month]} {year}</motion.h2>
              </AnimatePresence>
              <Button variant="ghost" size="icon" onClick={() => setCurrentDate(new Date(year, month+1, 1))} className="rounded-full">
                <ChevronRight className="w-5 h-5"/>
              </Button>
            </div>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>)}
            </div>
            {/* Days */}
            {isLoading ? (
              <div className="grid grid-cols-7 gap-1">
                {[...Array(42)].map((_,i) => <Skeleton key={i} className="h-[80px] rounded-xl"/>)}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => (
                  <motion.div key={i} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.005 }}
                    className={`min-h-[80px] md:min-h-[100px] p-1.5 rounded-xl border transition-all duration-200
                      ${day.month !== 'current'  ? 'bg-muted/30 border-transparent opacity-40' :
                        isToday(day.date)         ? 'bg-primary/10 border-primary/30 glow-primary' :
                        day.events.length > 0     ? 'border-accent/30 hover:border-accent/60 hover:bg-accent/5' :
                                                    'border-border/30 hover:border-border'}`}>
                    <div className={`text-xs font-semibold mb-1 ${isToday(day.date) ? 'text-primary font-bold' : day.month !== 'current' ? 'text-muted-foreground' : ''}`}>
                      {day.date}
                    </div>
                    <div className="space-y-0.5">
                      {day.events.slice(0,2).map((evt: any) => (
                        <motion.button key={evt._id || evt.id} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                          onClick={() => setSelectedEvent(evt)}
                          className={`w-full text-left text-[10px] md:text-xs px-1.5 py-0.5 rounded-md truncate font-medium text-primary-foreground ${deptColorMap[evt.department as keyof typeof deptColorMap]}`}>
                          {evt.title}
                        </motion.button>
                      ))}
                      {day.events.length > 2 && <div className="text-[10px] text-muted-foreground text-center">+{day.events.length-2}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} className="space-y-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <CalIcon className="w-5 h-5 text-accent"/>Events in {MONTHS[month]}
            </h3>
            {isLoading && [...Array(3)].map((_,i) => <Skeleton key={i} className="h-24 rounded-xl"/>)}
            {!isLoading && upcomingInMonth.length === 0 && <p className="text-sm text-muted-foreground">No events this month.</p>}
            {!isLoading && upcomingInMonth.map((evt: any, i: number) => {
              const diff = Math.ceil((new Date(evt.date).getTime() - Date.now()) / (1000*60*60*24));
              return (
                <motion.div key={evt._id || evt.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*0.05 }} whileHover={{ x:4 }} onClick={() => setSelectedEvent(evt)}
                  className="glass-card rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={`${deptColorMap[evt.department as keyof typeof deptColorMap]} text-primary-foreground border-none text-[10px]`}>{evt.department}</Badge>
                    <span className="text-xs text-muted-foreground">{evt.date}</span>
                  </div>
                  <h4 className="font-display font-semibold text-sm">{evt.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{evt.venue} • {evt.time}</p>
                  {diff < 0
                    ? <span className="text-[10px] text-muted-foreground">Event passed</span>
                    : diff === 0
                    ? <span className="text-[10px] font-bold text-accent">Today!</span>
                    : <span className="text-[10px] font-semibold text-primary">{diff} day{diff>1?'s':''} away</span>
                  }
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <EventDetailModal event={selectedEvent} open={!!selectedEvent} onClose={() => setSelectedEvent(null)} onRegister={handleRegister}/>
      <RegistrationModal event={registerEvent} open={!!registerEvent} onClose={() => setRegisterEvent(null)}/>
    </div>
  );
};

export default CalendarView;
