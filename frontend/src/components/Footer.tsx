import { Link } from 'react-router-dom';
import { Calendar, Network, Info, Award, LayoutDashboard, CalendarDays } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="border-t bg-card/60 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                CE
              </div>
              <span className="font-display font-bold text-lg text-gradient">
                Campus EventHub
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              The central portal to discover, register, and organize all events, workshops, hackathons, and technical symposiums across all university departments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Events
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <CalendarDays className="w-3.5 h-3.5" /> Calendar View
                </Link>
              </li>
              <li>
                <Link to="/org-chart" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Network className="w-3.5 h-3.5" /> Organizational Structure
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5" /> Organizer Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Platform stats / info */}
          <div>
            <h4 className="font-display font-semibold text-sm mb-4">For Evaluators & Recruiters</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-accent" /> Role-based Login system
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-accent" /> OTP-verified registrations
              </li>
              <li className="flex items-center gap-2">
                📂 CSV/Excel data export
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 University Event Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with 💜 for developers and recruiters.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
