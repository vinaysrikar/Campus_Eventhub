import { useQuery }      from '@tanstack/react-query';
import { eventsAPI }     from '@/lib/api';
import { Calendar, Users, Building2, UserCheck } from 'lucide-react';
import { motion }        from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const AnimatedNumber = ({ target }: { target: number }) => {
  const [val, setVal] = useState(0);
  const ref     = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    started.current = false;
    setVal(0);
  }, [target]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 1200;
        const start    = performance.now();
        const animate  = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          setVal(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <div ref={ref}>{val.toLocaleString()}</div>;
};

export const StatsBar = () => {
  const { data } = useQuery({
    queryKey: ['stats'],
    queryFn:  async () => { const r = await eventsAPI.getStats(); return r.data; },
  });

  const items = [
    { label: 'Total Events',        value: data?.totalEvents        ?? 0, icon: Calendar   },
    { label: 'Active Departments',  value: data?.activeDepartments  ?? 0, icon: Building2  },
    { label: 'Registrations',       value: data?.totalRegistrations ?? 0, icon: Users      },
    { label: 'Upcoming',            value: data?.upcomingEvents     ?? 0, icon: UserCheck  },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((s, i) => (
        <motion.div key={s.label}
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          transition={{ delay:i*0.1, duration:0.5 }} whileHover={{ y:-4, transition:{ duration:0.2 } }}
          className="glass-card rounded-2xl p-6 text-center group hover:shadow-xl hover:glow-primary transition-all">
          <div className="w-10 h-10 mx-auto mb-3 rounded-xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <s.icon className="w-5 h-5 text-primary-foreground"/>
          </div>
          <div className="font-display font-bold text-3xl text-gradient">
            <AnimatedNumber target={s.value}/>
          </div>
          <div className="text-xs text-muted-foreground mt-1 font-medium uppercase tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
};
