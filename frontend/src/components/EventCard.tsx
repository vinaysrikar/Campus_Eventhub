import { EventItem, deptColorMap } from '@/lib/data';
import { Calendar, Clock, MapPin, Users, Star, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Props {
  event: EventItem;
  index?: number;
  onClick?: () => void;
}

const CountdownChip = ({ date }: { date: string }) => {
  const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
      <Timer className="w-3 h-3" />
      {diff === 0 ? 'Today' : `${diff}d left`}
    </span>
  );
};

export const EventCard = ({ event, index = 0, onClick }: Props) => {
  const fillPercent = Math.round((event.registrations / event.maxCapacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      onClick={onClick}
      className="group glass-card rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:glow-primary transition-all duration-300"
    >
      {/* Event Image Banner */}
      {(event as any).image && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={(event as any).image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
      )}

      {/* Color bar with shimmer (only show if no image) */}
      {!(event as any).image && (
        <div className={`h-1.5 ${deptColorMap[event.department]} relative overflow-hidden`}>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-xs font-semibold ${deptColorMap[event.department]} text-primary-foreground border-none`}>
                {event.department}
              </Badge>
              {event.featured && (
                <Badge className="gradient-accent text-accent-foreground text-xs border-none">
                  <Star className="w-3 h-3 mr-1" />Featured
                </Badge>
              )}
              <CountdownChip date={event.date} />
            </div>
            <h3 className="font-display font-bold text-lg leading-tight group-hover:text-primary transition-colors duration-300">
              {event.title}
            </h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />{event.date}</div>
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" />{event.time}</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" />{event.venue}</div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-muted-foreground"><Users className="w-3.5 h-3.5" />{event.registrations}/{event.maxCapacity}</span>
            <span className="font-semibold text-primary">{fillPercent}%</span>
          </div>
          <Progress value={fillPercent} className="h-1.5" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {event.tags.map(t => (
            <span key={t} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
