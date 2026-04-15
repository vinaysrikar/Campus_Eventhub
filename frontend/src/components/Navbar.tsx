import { Link, useLocation } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogIn, LogOut, Menu, Network, X, Moon, Sun, CalendarDays } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion } from 'framer-motion';

const EventHubLogo = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="40" height="40" rx="10" fill="url(#navLogoGrad)"/>
    <circle cx="20" cy="20" r="4" fill="white" opacity="0.95"/>
    <circle cx="20" cy="9" r="3" fill="white" opacity="0.85"/>
    <circle cx="31" cy="20" r="3" fill="white" opacity="0.85"/>
    <circle cx="20" cy="31" r="3" fill="white" opacity="0.85"/>
    <circle cx="9" cy="20" r="3" fill="white" opacity="0.85"/>
    <line x1="20" y1="16" x2="20" y2="12" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round"/>
    <line x1="24" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round"/>
    <line x1="20" y1="24" x2="20" y2="28" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round"/>
    <line x1="16" y1="20" x2="12" y2="20" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" strokeLinecap="round"/>
    <circle cx="28" cy="12" r="2" fill="white" opacity="0.5"/>
    <circle cx="12" cy="28" r="2" fill="white" opacity="0.5"/>
    <line x1="22" y1="18" x2="26.5" y2="13.5" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
    <line x1="18" y1="22" x2="13.5" y2="26.5" stroke="white" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round"/>
    <defs>
      <linearGradient id="navLogoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient>
    </defs>
  </svg>
);

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Events', icon: Calendar },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/org-chart', label: 'Org Chart', icon: Network },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-9 h-9 flex items-center justify-center"
          >
            <EventHubLogo />
          </motion.div>
          <span className="font-display font-bold text-xl tracking-tight text-gradient">
            Campus EventHub
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive(l.to) ? 'gradient-primary text-primary-foreground shadow-lg glow-primary' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
              <l.icon className="w-4 h-4" />{l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-accent" />}
          </motion.button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{user?.avatar}</div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4 mr-1" />Logout</Button>
            </div>
          ) : (
            <Link to="/login"><Button size="sm" className="gradient-primary text-primary-foreground glow-primary"><LogIn className="w-4 h-4 mr-1" />Organizer Login</Button></Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-accent" />}
          </button>
          <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t bg-card p-4 space-y-2"
        >
          {links.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${isActive(l.to) ? 'gradient-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              <l.icon className="w-4 h-4" />{l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileOpen(false); }}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}><Button className="w-full gradient-primary text-primary-foreground"><LogIn className="w-4 h-4 mr-2" />Organizer Login</Button></Link>
          )}
        </motion.div>
      )}
    </nav>
  );
};
