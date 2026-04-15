import { EventItem, deptColorMap } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, MapPin, Users, User, Star, Sparkles, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  event: EventItem | null;
  open: boolean;
  onClose: () => void;
  onRegister?: (event: EventItem) => void;
}

export const EventDetailModal = ({ event, open, onClose, onRegister }: Props) => {
  if (!event) return null;
  const fill = Math.round((event.registrations / event.maxCapacity) * 100);
  const daysLeft = Math.ceil((new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        <motion.div
          className={`${deptColorMap[event.department]} px-6 py-5 relative overflow-hidden`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/10" />
          <motion.div
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-primary-foreground/10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-none backdrop-blur-sm">{event.department}</Badge>
              {event.featured && <Badge className="gradient-accent text-accent-foreground border-none"><Star className="w-3 h-3 mr-1" />Featured</Badge>}
              <Badge variant="outline" className="capitalize text-primary-foreground border-primary-foreground/30">{event.status}</Badge>
              {daysLeft >= 0 && (
                <Badge className="bg-primary-foreground/15 text-primary-foreground border-none">
                  <Timer className="w-3 h-3 mr-1" />{daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                </Badge>
              )}
            </div>
            <DialogTitle className="font-display text-2xl text-primary-foreground">{event.title}</DialogTitle>
          </DialogHeader>
        </motion.div>

        {/* Event Image */}
        {(event as any).image && (
          <div className="relative w-full max-h-56 overflow-hidden">
            <img
              src={(event as any).image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-5">
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: Calendar, text: event.date },
              { icon: Clock, text: event.time },
              { icon: MapPin, text: event.venue },
              { icon: User, text: event.organizer },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/50"
              >
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-secondary/30">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-primary" />{event.registrations} / {event.maxCapacity}</span>
              <span className="font-semibold text-primary">{fill}% filled</span>
            </div>
            <Progress value={fill} className="h-2" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {event.tags.map(t => <span key={t} className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">{t}</span>)}
          </div>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={() => onRegister?.(event)}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl text-base glow-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />Register Now
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
