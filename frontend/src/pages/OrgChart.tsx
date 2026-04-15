import { useQuery }       from '@tanstack/react-query';
import { organizersAPI }  from '@/lib/api';
import { departments, deptColorMap, deptBorderColorMap } from '@/lib/data';
import { Navbar }         from '@/components/Navbar';
import { Skeleton }       from '@/components/ui/skeleton';
import { motion }         from 'framer-motion';
import { Crown, Users, ChevronDown } from 'lucide-react';

const OrgChart = () => {
  const { data: organizers = [], isLoading } = useQuery({
    queryKey: ['organizers'],
    queryFn:  async () => { const r = await organizersAPI.getAll(); return r.data; },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="gradient-hero text-primary-foreground py-16 px-4 relative overflow-hidden">
        <motion.div className="absolute top-0 left-[20%] w-72 h-72 rounded-full bg-primary/20 blur-[100px]"
          animate={{ y:[0,-20,0] }} transition={{ duration:8, repeat:Infinity }}/>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-3">
            Organizational <span className="text-accent">Structure</span>
          </motion.h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }} className="opacity-80">
            Event management hierarchy across all departments
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Top level */}
        <div className="flex flex-col items-center mb-12">
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            className="glass-card rounded-2xl p-6 text-center max-w-xs shadow-xl border-2 border-primary glow-primary">
            <div className="w-14 h-14 mx-auto gradient-primary rounded-xl flex items-center justify-center mb-3">
              <Crown className="w-7 h-7 text-primary-foreground"/>
            </div>
            <h3 className="font-display font-bold text-lg">Event Management</h3>
            <p className="text-sm text-muted-foreground">Central Administration</p>
          </motion.div>
          <div className="w-0.5 h-10 bg-border"/>
          <ChevronDown className="w-5 h-5 text-muted-foreground -mt-1"/>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_,i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden">
                <Skeleton className="h-16 w-full"/>
                <div className="p-4 space-y-2">
                  {[...Array(5)].map((_,j) => <Skeleton key={j} className="h-12 rounded-xl"/>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Department cards */}
        {!isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, di) => {
              const deptOrgs = organizers.filter((o: any) => o.department === dept.id);
              return (
                <motion.div key={dept.id} initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:di*0.1 }} whileHover={{ y:-4 }}
                  className={`glass-card rounded-2xl overflow-hidden border-t-4 ${deptBorderColorMap[dept.id]} hover:shadow-xl transition-all`}>
                  <div className={`${deptColorMap[dept.id]} p-4 text-center`}>
                    <h3 className="font-display font-bold text-lg text-primary-foreground">{dept.name}</h3>
                    <p className="text-xs text-primary-foreground/80">{dept.fullName}</p>
                  </div>
                  <div className="p-4 space-y-2">
                    {deptOrgs.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">No organizers yet</p>
                    )}
                    {deptOrgs.map((org: any, oi: number) => (
                      <motion.div key={org._id || org.id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay:di*0.1+oi*0.05 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary transition-colors">
                        <div className={`w-9 h-9 rounded-full ${deptColorMap[dept.id]} flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0`}>
                          {org.avatar || org.name?.split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.role}</p>
                        </div>
                        {oi === 0 && <Crown className="w-4 h-4 text-accent ml-auto flex-shrink-0"/>}
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-1 justify-center pt-2 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5"/>
                      {deptOrgs.length}/5 organizers
                    </div>
                    {/* Capacity bar */}
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div className={`h-full ${deptColorMap[dept.id]} transition-all duration-500`}
                        style={{ width:`${(deptOrgs.length/5)*100}%` }}/>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgChart;
