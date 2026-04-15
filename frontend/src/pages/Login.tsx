import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { authAPI } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, AlertCircle, Eye, EyeOff, UserPlus, Mail, ShieldCheck, CheckCircle2, ArrowLeft, ArrowRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const DEPARTMENTS = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'] as const;

const LogoIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
    <circle cx="20" cy="20" r="4" fill="white" opacity="0.95"/>
    <circle cx="20" cy="9"  r="3" fill="white" opacity="0.85"/>
    <circle cx="31" cy="20" r="3" fill="white" opacity="0.85"/>
    <circle cx="20" cy="31" r="3" fill="white" opacity="0.85"/>
    <circle cx="9"  cy="20" r="3" fill="white" opacity="0.85"/>
    <line x1="20" y1="16" x2="20" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="24" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="20" y1="24" x2="20" y2="28" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="20" x2="12" y2="20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = () => {
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) { toast.success('Welcome back!'); navigate('/dashboard'); }
    else setError('Invalid email or password. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="l-email">Email</Label>
        <Input id="l-email" type="email" placeholder="john.cse@gmail.com"
          value={email} onChange={e => setEmail(e.target.value)}
          className="h-12 rounded-xl text-base" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="l-pw">Password</Label>
        <div className="relative">
          <Input id="l-pw" type={showPw ? 'text' : 'password'} placeholder="Enter password"
            value={password} onChange={e => setPassword(e.target.value)}
            className="h-12 rounded-xl text-base pr-12" required />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}
      <Button type="submit" disabled={loading}
        className="w-full gradient-primary text-primary-foreground font-semibold h-12 rounded-xl text-base glow-primary">
        {loading ? 'Signing in…' : <><LogIn className="w-5 h-5 mr-2" />Sign In</>}
      </Button>
    </form>
  );
};

// ─── Register Form (3 steps) ───────────────────────────────────────────────────
const RegisterForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 fields
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [dept, setDept]       = useState('');
  const [step1Err, setStep1Err] = useState('');

  // Step 2 OTP
  const [otp, setOtp]         = useState('');
  const [step2Err, setStep2Err] = useState('');
  const [devCode, setDevCode] = useState('');   // shown only in dev mode
  const [resending, setResending] = useState(false);

  const [loading, setLoading] = useState(false);

  // ── Step 1: validate + send OTP ──────────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Err('');

    if (!name.trim())       return setStep1Err('Full name is required.');
    if (password.length < 6) return setStep1Err('Password must be at least 6 characters.');
    if (password !== confirmPw) return setStep1Err('Passwords do not match.');
    if (!dept)              return setStep1Err('Select your department.');

    // Validate email format on frontend too
    const emailRegex = /^[a-zA-Z0-9._%+-]+\.(cse|ece|mech|civil|eee|it)@gmail\.com$/i;
    if (!emailRegex.test(email)) {
      return setStep1Err('Email must be in format: name.dept@gmail.com  (e.g. john.cse@gmail.com)');
    }

    setLoading(true);
    try {
      const res = await authAPI.sendOTP(email);
      // Dev mode: backend returns the code directly
      if (res.data.code) setDevCode(res.data.code);
      toast.success('Verification code sent to your email!');
      setStep(2);
    } catch (err: any) {
      setStep1Err(err.response?.data?.error || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP + register ────────────────────────────────────────
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Err('');

    if (otp.length !== 6) return setStep2Err('Enter the 6-digit code from your email.');

    setLoading(true);
    try {
      // 1. Verify OTP
      await authAPI.verifyOTP(email, otp);

      // 2. Register account
      setStep(3);
      const res = await authAPI.register({ name, email, password, department: dept });
      localStorage.setItem('token', res.data.token);
      toast.success('Account created! Welcome to Campus EventHub 🎉');
      
      // FIX: Invalidate query so the dashboard and org chart are up-to-date
      // Using query invalidation logic handled globally, or just delay navigation slightly
      setTimeout(() => {
        navigate('/dashboard');
        window.location.reload(); // Quick fix to ensure OrgChart refreshes cache properly
      }, 500);
      const msg = err.response?.data?.error || 'Something went wrong.';
      if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('code') || msg.toLowerCase().includes('verif')) {
        setStep(2);
        setStep2Err(msg);
      } else {
        setStep(1);
        setStep1Err(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await authAPI.sendOTP(email);
      if (res.data.code) setDevCode(res.data.code);
      setOtp('');
      setStep2Err('');
      toast.success('New code sent!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const steps = [
    { n: 1, label: 'Details',  Icon: UserPlus },
    { n: 2, label: 'Verify',   Icon: ShieldCheck },
    { n: 3, label: 'Done',     Icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-5">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300
              ${step === s.n ? 'gradient-primary text-primary-foreground shadow' :
                step > s.n  ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                              'bg-secondary text-muted-foreground'}`}>
              <s.Icon className="w-3 h-3" />{s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-5 h-0.5 rounded-full transition-colors ${step > s.n ? 'bg-green-500' : 'bg-border'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <motion.form key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
            transition={{ duration: 0.22 }} onSubmit={handleStep1} className="space-y-4">

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl flex gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Use your college department email: <span className="font-mono font-semibold">name.dept@gmail.com</span><br/>
                Example: <span className="font-mono">john.cse@gmail.com</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)}
                className="h-11 rounded-xl" required />
            </div>

            <div className="space-y-2">
              <Label>College Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type="email" placeholder="john.cse@gmail.com" value={email}
                  onChange={e => setEmail(e.target.value)} className="h-11 rounded-xl pl-10" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input type={showPw ? 'text' : 'password'} placeholder="Min 6 chars" value={password}
                    onChange={e => setPassword(e.target.value)} className="h-11 rounded-xl pr-9" required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Confirm</Label>
                <Input type="password" placeholder="Repeat" value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)} className="h-11 rounded-xl" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <select value={dept} onChange={e => setDept(e.target.value)} required
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select dept</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {step1Err && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{step1Err}
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl">
              {loading ? 'Sending code…' : <><ArrowRight className="w-4 h-4 mr-2" />Send Verification Code</>}
            </Button>
          </motion.form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 2 && (
          <motion.form key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}
            transition={{ duration: 0.22 }} onSubmit={handleStep2} className="space-y-5">

            <div className="text-center space-y-2 py-2">
              <div className="w-14 h-14 mx-auto rounded-full gradient-primary flex items-center justify-center glow-primary">
                <ShieldCheck className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                A 6-digit code was sent to<br />
                <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            {/* Dev mode helper */}
            {devCode && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 rounded-xl p-3 text-center">
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                  Dev mode — email not configured. Your OTP:
                </p>
                <p className="text-2xl font-mono font-bold text-amber-700 dark:text-amber-400 tracking-widest mt-1">
                  {devCode}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label>6-Digit Verification Code</Label>
              <Input
                placeholder="• • • • • •"
                value={otp}
                maxLength={6}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="h-14 rounded-xl text-center text-3xl font-mono tracking-[0.6em]"
                required
              />
            </div>

            {step2Err && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />{step2Err}
              </div>
            )}

            <Button type="submit" disabled={loading}
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold rounded-xl">
              {loading ? 'Verifying…' : <><ShieldCheck className="w-4 h-4 mr-2" />Verify &amp; Create Account</>}
            </Button>

            <div className="flex items-center justify-between text-sm pt-1">
              <button type="button" onClick={() => setStep(1)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-3 h-3" />Back
              </button>
              <button type="button" onClick={handleResend} disabled={resending}
                className="text-primary hover:underline text-sm disabled:opacity-50">
                {resending ? 'Sending…' : 'Resend code'}
              </button>
            </div>
          </motion.form>
        )}

        {/* ── STEP 3: Creating ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
            className="text-center py-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center glow-primary animate-pulse">
              <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="font-semibold text-lg">Creating your account…</p>
            <p className="text-sm text-muted-foreground">You'll be redirected to the dashboard.</p>
          </motion.div>
        )}

      </AnimatePresence>

      <p className="text-xs text-center text-muted-foreground pt-1">
        Max 5 organizers allowed per department.
      </p>
    </div>
  );
};

// ─── Main Login Page ────────────────────────────────────────────────────────────
const Login = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-14 relative">
        <motion.div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/10 blur-[100px]"
          animate={{ y:[0,-30,0], scale:[1,1.1,1] }} transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }} />
        <motion.div className="absolute bottom-20 right-[10%] w-64 h-64 rounded-full bg-accent/10 blur-[100px]"
          animate={{ y:[0,20,0] }} transition={{ duration:10, repeat:Infinity, ease:'easeInOut' }} />

        <motion.div initial={{ opacity:0, y:30, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.6, ease:[0.16,1,0.3,1] }} className="w-full max-w-md relative z-10">

          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div whileHover={{ rotate:12, scale:1.1 }} transition={{ type:'spring', stiffness:300 }}
                className="w-16 h-16 mx-auto gradient-primary rounded-2xl flex items-center justify-center mb-4 glow-primary">
                <LogoIcon />
              </motion.div>
              <h1 className="font-display text-2xl font-bold text-gradient">Campus EventHub</h1>
              <p className="text-sm text-muted-foreground mt-1">Organizer portal</p>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-6">
              {(['login','register'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all
                    ${tab===t ? 'gradient-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>
                  {t==='login' ? <><LogIn className="w-4 h-4"/>Sign In</> : <><UserPlus className="w-4 h-4"/>Register</>}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'login' ? (
                <motion.div key="login" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div key="register" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
