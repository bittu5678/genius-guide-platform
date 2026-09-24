import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Bell, BookOpen, CalendarDays, CheckCircle2, ChevronRight, ClipboardCheck,
  ArrowLeft, ArrowRight, Clock3, Eye, EyeOff, FileBarChart, FileText, Flag, Gauge, GraduationCap, LayoutDashboard,
  LogOut, Menu, Moon, MoreHorizontal, Search, Settings, Sparkles, Sun,
  Target, TrendingUp, Trophy, UserRound, Users, X, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Role = "admin" | "student";
type Theme = "light" | "dark";
type IconType = typeof Gauge;

const adminNav: Array<[string, IconType]> = [
  ["Dashboard", LayoutDashboard], ["Students", Users], ["Tests", ClipboardCheck],
  ["Question Bank", BookOpen], ["Results", Trophy], ["Reports", FileBarChart], ["Settings", Settings],
];
const studentNav: Array<[string, IconType]> = [
  ["Dashboard", LayoutDashboard], ["My Tests", ClipboardCheck], ["My Results", Trophy],
  ["Test Series", FileText], ["Study Material", BookOpen], ["Settings", Settings],
];

export function CoachingLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="CoachingApp">
      <div className="logo-symbol relative grid size-11 shrink-0 place-items-center rounded-[14px] bg-primary text-primary-foreground shadow-brand">
        <GraduationCap className="size-6" strokeWidth={2.4} />
        <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full bg-brand-orange ring-[3px] ring-background">
          <BookOpen className="size-2.5 text-brand-orange-foreground" strokeWidth={2.6} />
        </span>
      </div>
      {!compact && <span className="text-[21px] font-bold text-foreground">Coaching<span className="text-primary">App</span></span>}
    </div>
  );
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return (
    <Button variant="ghost" size="icon" className="size-10 rounded-xl" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}

export default function CoachingApp() {
  const [role, setRole] = useState<Role>("admin");
  const [session, setSession] = useState<Role | null>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedRole = window.localStorage.getItem("coachingapp-session");
    const storedTheme = window.localStorage.getItem("coachingapp-theme") as Theme | null;
    if (storedRole === "admin" || storedRole === "student") setSession(storedRole);
    if (storedTheme === "light" || storedTheme === "dark") setTheme(storedTheme);
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("coachingapp-theme", theme);
  }, [theme]);

  const login = () => {
    window.localStorage.setItem("coachingapp-session", role);
    setSession(role);
  };
  const logout = () => {
    window.localStorage.removeItem("coachingapp-session");
    setSession(null);
  };

  if (!ready) return <div className="min-h-screen bg-background" />;
  return session
    ? <Dashboard role={session} theme={theme} setTheme={setTheme} logout={logout} />
    : <Login role={role} setRole={setRole} theme={theme} setTheme={setTheme} login={login} />;
}

function Login({ role, setRole, theme, setTheme, login }: { role: Role; setRole: (role: Role) => void; theme: Theme; setTheme: (theme: Theme) => void; login: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [forgot, setForgot] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); login(); };

  return (
    <main className="login-shell relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <CoachingLogo />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="login-art relative hidden overflow-hidden bg-sidebar lg:flex lg:flex-col lg:justify-end lg:p-14 xl:p-20">
          <div className="visual-grid absolute inset-0 opacity-60" />
          <div className="relative z-10 max-w-xl pb-8">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary"><Sparkles className="size-4" /> Smart learning, simplified</span>
            <h1 className="text-5xl font-bold leading-[1.12] text-foreground xl:text-6xl">Everything your coaching institute needs.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">Manage students, conduct online tests and turn performance data into better learning outcomes.</p>
            <div className="mt-10 flex gap-8">
              <LoginMetric value="98%" label="Student satisfaction" />
              <LoginMetric value="10k+" label="Tests completed" />
              <LoginMetric value="24/7" label="Learning access" />
            </div>
          </div>
          <div className="login-glow absolute -right-28 top-28 size-[430px] rounded-full" />
        </section>

        <section className="flex items-center justify-center px-5 pb-10 pt-28 sm:px-10 lg:pt-24">
          <div className="w-full max-w-md animate-rise">
            <div className="mb-8 lg:hidden"><span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><Zap className="size-3.5" /> Learn. Test. Grow.</span></div>
            <p className="text-sm font-semibold text-primary">WELCOME BACK</p>
            <h2 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Sign in to CoachingApp</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Enter your details to access your workspace.</p>

            <div className="mt-8 grid grid-cols-2 rounded-2xl bg-muted p-1.5" aria-label="Choose account role">
              {(["admin", "student"] as Role[]).map((item) => (
                <Button key={item} type="button" variant={role === item ? "default" : "ghost"} className="h-11 rounded-xl capitalize shadow-none" onClick={() => setRole(item)}>
                  {item === "admin" ? <Gauge /> : <GraduationCap />}{item}
                </Button>
              ))}
            </div>

            <form className="mt-7 space-y-5" onSubmit={submit}>
              <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Email or mobile number</span><div className="relative"><UserRound className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="h-12 rounded-xl bg-card pl-11 shadow-none" placeholder={role === "admin" ? "admin@coachingapp.com" : "student@coachingapp.com"} required /></div></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-foreground">Password</span><div className="relative"><Input className="h-12 rounded-xl bg-card pr-12 shadow-none" type={showPassword ? "text" : "password"} placeholder="Enter your password" required minLength={4} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 size-10 rounded-lg text-muted-foreground" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></label>
              <div className="flex items-center justify-between text-sm"><label className="flex cursor-pointer items-center gap-2 text-muted-foreground"><input type="checkbox" defaultChecked className="size-4 accent-[var(--primary)]" /> Remember me</label><Button type="button" variant="link" className="h-auto p-0 text-sm" onClick={() => setForgot(true)}>Forgot password?</Button></div>
              {forgot && <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">Demo mode: password recovery will be available when accounts are connected.</div>}
              <Button className="h-12 w-full rounded-xl text-sm shadow-brand">Sign in as {role}<ChevronRight /></Button>
            </form>
            <p className="mt-7 text-center text-xs leading-5 text-muted-foreground">Demo access · Use any email and password</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function LoginMetric({ value, label }: { value: string; label: string }) {
  return <div><p className="text-2xl font-bold text-foreground">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>;
}

function Dashboard({ role, theme, setTheme, logout }: { role: Role; theme: Theme; setTheme: (theme: Theme) => void; logout: () => void }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const nav = role === "admin" ? adminNav : studentNav;
  const title = active === "Dashboard" ? `Good morning, ${role === "admin" ? "Amar" : "Aarav"}` : active;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[258px] border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex lg:flex-col">
        <div className="px-3"><CoachingLogo /></div>
        <nav className="mt-10 flex-1 space-y-1">
          {nav.map(([label, Icon]) => <NavItem key={label} label={label} Icon={Icon} active={active === label} onClick={() => setActive(label)} />)}
        </nav>
        <div className="rounded-[18px] border border-primary/15 bg-primary/8 p-4">
          <div className="mb-3 grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></div>
          <p className="text-sm font-semibold">{role === "admin" ? "Grow your institute" : "Keep your streak alive"}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{role === "admin" ? "Explore smart reports and insights." : "You’ve studied 5 days in a row."}</p>
        </div>
        <Button variant="ghost" className="mt-3 h-11 justify-start rounded-xl text-muted-foreground" onClick={logout}><LogOut /> Logout</Button>
      </aside>

      {mobileMenu && <div className="fixed inset-0 z-50 bg-overlay/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenu(false)}><aside className="h-full w-[285px] bg-sidebar p-5" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between"><CoachingLogo /><Button variant="ghost" size="icon" onClick={() => setMobileMenu(false)}><X /></Button></div><nav className="mt-8 space-y-1">{nav.map(([label, Icon]) => <NavItem key={label} label={label} Icon={Icon} active={active === label} onClick={() => { setActive(label); setMobileMenu(false); }} />)}</nav><Button variant="ghost" className="mt-6 w-full justify-start text-muted-foreground" onClick={logout}><LogOut /> Logout</Button></aside></div>}

      <div className="lg:pl-[258px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenu(true)} aria-label="Open menu"><Menu /></Button><div><h1 className="text-lg font-semibold sm:text-xl">{title}</h1><p className="hidden text-xs text-muted-foreground sm:block">Here’s what’s happening with your learning today.</p></div></div>
          <div className="flex items-center gap-1 sm:gap-2"><div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input className="h-10 w-48 rounded-xl bg-muted pl-9 lg:w-56" placeholder="Search anything..." /></div><ThemeToggle theme={theme} setTheme={setTheme} /><Button variant="ghost" size="icon" className="relative size-10 rounded-xl" aria-label="Notifications"><Bell /><span className="absolute right-2 top-2 size-2 rounded-full bg-brand-orange ring-2 ring-background" /></Button><div className="ml-1 grid size-9 place-items-center rounded-xl bg-primary text-xs font-bold text-primary-foreground">{role === "admin" ? "AK" : "AS"}</div></div>
        </header>
        <main className="mx-auto max-w-[1500px] px-4 py-6 pb-24 sm:px-7 lg:px-10 lg:py-8">{active !== "Dashboard" ? <EmptySection title={active} role={role} /> : role === "admin" ? <AdminDashboard /> : <StudentDashboard />}</main>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 flex h-16 items-center justify-around rounded-[18px] border border-border bg-card/95 px-2 shadow-card backdrop-blur-xl lg:hidden">
        {nav.slice(0, 4).map(([label, Icon]) => <button key={label} className={cn("flex h-12 min-w-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium", active === label ? "bg-primary/10 text-primary" : "text-muted-foreground")} onClick={() => setActive(label)}><Icon className="size-4" />{label.replace("My ", "")}</button>)}
      </nav>
    </div>
  );
}

function NavItem({ label, Icon, active, onClick }: { label: string; Icon: IconType; active: boolean; onClick: () => void }) {
  return <Button variant="ghost" className={cn("h-11 w-full justify-start rounded-xl px-3", active ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-brand" : "text-muted-foreground")} onClick={onClick}><Icon />{label}</Button>;
}

function AdminDashboard() {
  const cards = [
    ["Total Students", "1,248", "+12.5%", Users, "primary"],
    ["Total Tests", "86", "+8 this month", FileText, "orange"],
    ["Completed Tests", "64", "74.4% completion", CheckCircle2, "green"],
    ["Pending Tests", "22", "4 due this week", CalendarDays, "pink"],
  ] as const;
  return <div className="animate-rise space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, note, Icon, color]) => <StatCard key={label} label={label} value={value} note={note} Icon={Icon} color={color} />)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
      <Panel title="Test Performance" subtitle="Average score across all subjects" action="Last 6 months"><PerformanceChart /></Panel>
      <Panel title="Recent Activity" subtitle="Latest updates from your institute"><ActivityList /></Panel>
    </div>
    <div className="grid gap-6 xl:grid-cols-[1fr_1.65fr]">
      <Panel title="Upcoming Tests" subtitle="Scheduled for this week"><UpcomingTests /></Panel>
      <Panel title="Student Growth" subtitle="New enrollments and active learners"><GrowthChart /></Panel>
    </div>
  </div>;
}

function StudentDashboard() {
  const [testOpen, setTestOpen] = useState(false);
  if (testOpen) return <TestFlow onExit={() => setTestOpen(false)} />;
  return <div className="animate-rise space-y-6">
    <section className="student-banner relative overflow-hidden rounded-[20px] bg-primary p-6 text-primary-foreground shadow-brand sm:p-8">
      <div className="relative z-10 max-w-xl"><p className="text-sm font-medium text-primary-foreground/75">YOUR WEEKLY GOAL</p><h2 className="mt-2 text-2xl font-bold sm:text-3xl">You’re making great progress, Aarav!</h2><p className="mt-2 text-sm text-primary-foreground/80">Complete two more tests to reach your weekly target.</p><div className="mt-6 flex items-center gap-4"><Progress value={72} className="max-w-sm bg-primary-foreground/20 [&>div]:bg-primary-foreground"/><span className="text-sm font-semibold">72%</span></div></div>
      <Trophy className="absolute -bottom-7 right-5 size-40 text-primary-foreground opacity-10 sm:right-12" />
    </section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="My Tests" value="12" note="3 pending" Icon={ClipboardCheck} color="primary"/><StatCard label="My Results" value="84%" note="+6% this month" Icon={Trophy} color="orange"/><StatCard label="Test Series" value="5" note="2 in progress" Icon={FileText} color="green"/><StatCard label="Study Material" value="28" note="6 new resources" Icon={BookOpen} color="pink"/></div>
    <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
      <Panel title="Performance overview" subtitle="Your progress over the last six tests" action="All subjects"><PerformanceChart student /></Panel>
      <Panel title="Overall performance" subtitle="Based on your recent attempts"><div className="flex flex-col items-center py-3"><ScoreRing value={84} /><div className="mt-6 grid w-full grid-cols-3 gap-2 text-center"><MiniMetric value="82%" label="Accuracy"/><MiniMetric value="428" label="Questions"/><MiniMetric value="#12" label="Rank"/></div></div></Panel>
    </div>
    <Panel title="Upcoming exams" subtitle="Stay prepared for your next challenges" action="View calendar"><StudentExams onStart={() => setTestOpen(true)} /></Panel>
  </div>;
}

function StatCard({ label, value, note, Icon, color }: { label: string; value: string; note: string; Icon: IconType; color: string }) {
  return <article className="group rounded-[20px] border border-border bg-card p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover"><div className="flex items-start justify-between"><div className={cn("grid size-11 place-items-center rounded-[14px]", `stat-${color}`)}><Icon className="size-5" /></div><Button variant="ghost" size="icon" className="size-8 rounded-lg text-muted-foreground"><MoreHorizontal /></Button></div><p className="mt-5 text-sm text-muted-foreground">{label}</p><div className="mt-1 flex items-end justify-between gap-2"><strong className="text-3xl font-bold">{value}</strong><span className="text-[11px] font-medium text-positive">{note}</span></div></article>;
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: string; children: React.ReactNode }) {
  return <section className="rounded-[20px] border border-border bg-card p-5 shadow-card sm:p-6"><div className="mb-6 flex items-start justify-between gap-4"><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs text-muted-foreground">{subtitle}</p></div>{action && <Button variant="outline" className="h-8 rounded-lg px-3 text-xs">{action}<ChevronRight className="size-3" /></Button>}</div>{children}</section>;
}

function PerformanceChart({ student = false }: { student?: boolean }) {
  const values = student ? [42, 55, 49, 68, 72, 84] : [48, 64, 58, 74, 69, 86, 81];
  return <div><div className="flex h-52 items-end gap-3 border-b border-border px-1 sm:gap-5">{values.map((value, index) => <div key={index} className="group flex h-full flex-1 items-end"><div className="relative w-full rounded-t-lg bg-primary/12 transition-all duration-500 group-hover:bg-primary/20" style={{ height: `${value}%` }}><div className="absolute inset-x-0 bottom-0 rounded-t-lg bg-primary" style={{ height: `${Math.max(18, value - 18)}%` }} /><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-muted-foreground">{value}%</span></div></div>)}</div><div className="mt-3 flex justify-between text-[10px] text-muted-foreground">{(student ? ["Test 1","Test 2","Test 3","Test 4","Test 5","Test 6"] : ["Mar","Apr","May","Jun","Jul","Aug","Sep"]).map(x => <span key={x}>{x}</span>)}</div></div>;
}

function ActivityList() {
  const items = [["Riya completed Physics Mock Test", "2 min ago", CheckCircle2, "green"], ["New student enrolled: Kabir Shah", "18 min ago", UserRound, "primary"], ["Maths Weekly Test was published", "1 hour ago", FileText, "orange"], ["Class XII report generated", "3 hours ago", FileBarChart, "pink"]] as const;
  return <div className="space-y-1">{items.map(([title,time,Icon,color]) => <div key={title} className="flex items-center gap-3 rounded-xl p-2.5 transition hover:bg-muted"><div className={cn("grid size-9 shrink-0 place-items-center rounded-xl", `stat-${color}`)}><Icon className="size-4"/></div><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium sm:text-sm">{title}</p><p className="mt-0.5 text-[11px] text-muted-foreground">{time}</p></div></div>)}</div>;
}

function UpcomingTests() {
  return <div className="space-y-3">{[["25","SEP","Physics Mock Test","Class XII · 10:00 AM"],["27","SEP","Mathematics Weekly","Class XI · 11:30 AM"],["30","SEP","Chemistry Chapter 6","Class XII · 09:00 AM"]].map(([day,mon,title,meta]) => <div key={title} className="flex items-center gap-3 rounded-xl bg-muted/60 p-3"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-card text-center shadow-sm"><span className="text-sm font-bold leading-3">{day}</span><span className="text-[8px] font-semibold text-primary">{mon}</span></div><div className="min-w-0"><p className="truncate text-sm font-medium">{title}</p><p className="mt-1 text-[11px] text-muted-foreground">{meta}</p></div></div>)}</div>;
}

function GrowthChart() {
  const points = "0,120 60,104 120,110 180,76 240,82 300,45 360,54 420,20 480,28 540,10";
  return <div className="h-52 w-full"><svg viewBox="0 0 540 145" className="h-full w-full overflow-visible text-primary" preserveAspectRatio="none" aria-label="Student growth line chart"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".28"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path d={`M ${points} L 540 145 L 0 145 Z`} fill="url(#area)"/><polyline points={points} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>{points.split(" ").map((p,i)=>{const [cx,cy]=p.split(","); return <circle key={i} cx={cx} cy={cy} r="4" fill="var(--card)" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke"/>})}</svg></div>;
}

function ScoreRing({ value }: { value: number }) {
  return <div className="relative grid size-40 place-items-center rounded-full bg-[conic-gradient(var(--primary)_0_84%,var(--muted)_84%_100%)]"><div className="grid size-[126px] place-items-center rounded-full bg-card text-center"><div><strong className="text-4xl">{value}%</strong><p className="mt-1 text-xs text-muted-foreground">Average score</p></div></div></div>;
}
function MiniMetric({ value, label }: { value: string; label: string }) { return <div><p className="font-semibold">{value}</p><p className="mt-1 text-[10px] text-muted-foreground">{label}</p></div>; }
function StudentExams({ onStart }: { onStart: () => void }) { return <div className="grid gap-3 md:grid-cols-3">{[["Physics","Full syllabus mock","Available now","15 min"],["Mathematics","Calculus & algebra","27 Sep · 11:30 AM","60 min"],["Chemistry","Organic chemistry","30 Sep · 09:00 AM","75 min"]].map(([subject,title,date,time],i)=><div key={subject} className="rounded-2xl border border-border bg-muted/40 p-4 transition hover:border-primary/30"><div className="flex items-center justify-between"><span className="rounded-lg bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">{subject}</span><span className="text-[10px] text-muted-foreground">{time}</span></div><h4 className="mt-4 text-sm font-semibold">{title}</h4><p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground"><CalendarDays className="size-3.5"/>{date}</p><Button variant={i === 0 ? "default" : "outline"} className="mt-4 h-9 w-full rounded-xl text-xs" onClick={i === 0 ? onStart : undefined}>{i === 0 ? "Start test" : "View details"}</Button></div>)}</div>; }

type DemoQuestion = { id: number; section: string; text: string; options: string[]; answer: number };
const demoQuestions: DemoQuestion[] = [
  { id: 1, section: "Physics", text: "Which physical quantity is measured in newtons?", options: ["Energy", "Force", "Power", "Pressure"], answer: 1 },
  { id: 2, section: "Physics", text: "The speed of light in vacuum is approximately:", options: ["3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁸ m/s", "3 × 10⁹ m/s"], answer: 2 },
  { id: 3, section: "Physics", text: "Which law explains action and reaction forces?", options: ["Newton’s first law", "Newton’s second law", "Newton’s third law", "Law of gravitation"], answer: 2 },
  { id: 4, section: "Mathematics", text: "What is the derivative of x²?", options: ["x", "2x", "x³", "2"], answer: 1 },
  { id: 5, section: "Mathematics", text: "If 3x + 5 = 20, what is x?", options: ["3", "4", "5", "6"], answer: 2 },
  { id: 6, section: "Mathematics", text: "What is the value of sin 90°?", options: ["0", "0.5", "1", "Undefined"], answer: 2 },
];

function TestFlow({ onExit }: { onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [review, setReview] = useState<number[]>([]);
  const [seconds, setSeconds] = useState(15 * 60);
  const [confirm, setConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const question = demoQuestions[index];
  const score = useMemo(() => demoQuestions.filter((q) => answers[q.id] === q.answer).length, [answers]);

  useEffect(() => {
    if (submitted) return;
    if (seconds <= 0) { setSubmitted(true); return; }
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [seconds, submitted]);

  if (submitted) return <TestResults answers={answers} score={score} seconds={seconds} onExit={onExit} />;
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  const answered = Object.keys(answers).length;
  const sectionNames = ["Physics", "Mathematics"];

  return <div className="animate-rise -mx-1 sm:mx-0">
    <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-[20px] border border-border bg-card p-4 shadow-card sm:flex sm:justify-between sm:p-5">
      <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="shrink-0 rounded-xl" onClick={onExit} aria-label="Exit test"><ArrowLeft /></Button><div className="min-w-0"><h2 className="truncate text-base font-semibold sm:text-lg">Full Syllabus Mock Test</h2><p className="text-xs text-muted-foreground">6 questions · 6 marks</p></div></div>
      <div className={cn("flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 font-semibold", seconds < 300 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary")}><Clock3 className="size-4"/><span className="tabular-nums">{minutes}:{remainingSeconds}</span></div>
    </div>

    <div className="mb-5 flex gap-2 overflow-x-auto pb-1">{sectionNames.map((section) => { const first = demoQuestions.findIndex((q) => q.section === section); return <Button key={section} variant={question.section === section ? "default" : "outline"} className="h-10 shrink-0 rounded-xl" onClick={() => setIndex(first)}>{section}<span className="text-[10px] opacity-70">3 Qs</span></Button>; })}</div>

    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-[20px] border border-border bg-card p-5 shadow-card sm:p-7">
        <div className="flex items-center justify-between"><span className="text-xs font-semibold text-primary">QUESTION {index + 1} OF {demoQuestions.length}</span><span className="rounded-lg bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">+1 mark</span></div>
        <h3 className="mt-6 text-lg font-semibold leading-8 sm:text-xl">{question.text}</h3>
        <div className="mt-7 space-y-3">{question.options.map((option, optionIndex) => <button key={option} className={cn("grid w-full grid-cols-[36px_minmax(0,1fr)] items-center gap-3 rounded-2xl border p-3 text-left text-sm transition sm:p-4", answers[question.id] === optionIndex ? "border-primary bg-primary/10 text-foreground shadow-sm" : "border-border bg-background/40 text-muted-foreground hover:border-primary/40 hover:text-foreground")} onClick={() => setAnswers((current) => ({ ...current, [question.id]: optionIndex }))}><span className={cn("grid size-9 place-items-center rounded-xl border text-xs font-semibold", answers[question.id] === optionIndex ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>{String.fromCharCode(65 + optionIndex)}</span><span className="min-w-0">{option}</span></button>)}</div>
        <div className="mt-8 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-t border-border pt-5">
          <Button variant="outline" className="rounded-xl px-3 sm:px-4" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft/><span className="hidden sm:inline">Previous</span></Button>
          <Button variant="ghost" className={cn("justify-self-center rounded-xl px-2 text-xs sm:px-4", review.includes(question.id) && "bg-brand-orange/10 text-brand-orange")} onClick={() => setReview((items) => items.includes(question.id) ? items.filter((id) => id !== question.id) : [...items, question.id])}><Flag/><span className="hidden sm:inline">{review.includes(question.id) ? "Marked" : "Mark for review"}</span></Button>
          {index < demoQuestions.length - 1 ? <Button className="rounded-xl px-3 sm:px-4" onClick={() => setIndex(index + 1)}><span className="hidden sm:inline">Next</span><ArrowRight/></Button> : <Button className="rounded-xl bg-positive px-3 text-primary-foreground hover:bg-positive/90" onClick={() => setConfirm(true)}>Submit</Button>}
        </div>
      </section>

      <aside className="h-fit rounded-[20px] border border-border bg-card p-5 shadow-card">
        <div className="flex items-center justify-between"><div><h3 className="text-sm font-semibold">Question palette</h3><p className="mt-1 text-[11px] text-muted-foreground">{answered} of 6 answered</p></div><span className="text-xl font-bold text-primary">{Math.round(answered / 6 * 100)}%</span></div>
        <Progress value={answered / 6 * 100} className="mt-4" />
        {sectionNames.map((section) => <div key={section} className="mt-5"><p className="mb-2 text-[11px] font-semibold text-muted-foreground">{section.toUpperCase()}</p><div className="grid grid-cols-3 gap-2">{demoQuestions.map((q, qIndex) => q.section === section && <Button key={q.id} variant="outline" size="icon" className={cn("size-10 rounded-xl", index === qIndex && "border-primary ring-2 ring-primary/20", answers[q.id] !== undefined && "bg-primary text-primary-foreground hover:bg-primary/90", review.includes(q.id) && "border-brand-orange ring-2 ring-brand-orange/20")} onClick={() => setIndex(qIndex)}>{q.id}</Button>)}</div></div>)}
        <div className="mt-6 space-y-2 border-t border-border pt-4 text-[10px] text-muted-foreground"><p className="flex items-center gap-2"><span className="size-3 rounded bg-primary"/>Answered</p><p className="flex items-center gap-2"><span className="size-3 rounded border border-brand-orange"/>Marked for review</p></div>
        <Button className="mt-5 w-full rounded-xl" onClick={() => setConfirm(true)}>Submit test</Button>
      </aside>
    </div>
    {confirm && <div className="fixed inset-0 z-[60] grid place-items-center bg-overlay/70 p-4 backdrop-blur-sm"><div className="w-full max-w-md animate-rise rounded-[20px] border border-border bg-card p-6 shadow-card"><div className="grid size-12 place-items-center rounded-2xl bg-brand-orange/10 text-brand-orange"><ClipboardCheck /></div><h3 className="mt-5 text-xl font-semibold">Submit your test?</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">You answered {answered} of 6 questions. Once submitted, your answers can’t be changed.</p><div className="mt-6 flex gap-3"><Button variant="outline" className="flex-1 rounded-xl" onClick={() => setConfirm(false)}>Keep reviewing</Button><Button className="flex-1 rounded-xl" onClick={() => { setConfirm(false); setSubmitted(true); }}>Submit now</Button></div></div></div>}
  </div>;
}

function TestResults({ answers, score, seconds, onExit }: { answers: Record<number, number>; score: number; seconds: number; onExit: () => void }) {
  const answered = Object.keys(answers).length;
  const percentage = Math.round(score / demoQuestions.length * 100);
  const used = 15 * 60 - seconds;
  return <div className="animate-rise space-y-5">
    <section className="relative overflow-hidden rounded-[20px] bg-primary p-6 text-primary-foreground shadow-brand sm:p-9"><div className="relative z-10 max-w-xl"><span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-semibold"><CheckCircle2 className="size-4"/> Attempt submitted</span><h2 className="mt-5 text-3xl font-bold">Great effort, Aarav!</h2><p className="mt-2 text-sm text-primary-foreground/75">Your result is ready. Review each answer to see where you can improve.</p></div><Trophy className="absolute -bottom-8 right-6 size-44 text-primary-foreground opacity-10"/></section>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Final Score" value={`${score}/6`} note={`${percentage}%`} Icon={Trophy} color="primary"/><StatCard label="Accuracy" value={`${percentage}%`} note={`${score} correct`} Icon={Target} color="green"/><StatCard label="Attempted" value={`${answered}/6`} note={`${6 - answered} skipped`} Icon={ClipboardCheck} color="orange"/><StatCard label="Time Used" value={`${Math.floor(used / 60)}m ${used % 60}s`} note="of 15 min" Icon={Clock3} color="pink"/></div>
    <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
      <Panel title="Section breakdown" subtitle="Performance by subject"><div className="space-y-5">{["Physics", "Mathematics"].map((section) => { const qs = demoQuestions.filter((q) => q.section === section); const correct = qs.filter((q) => answers[q.id] === q.answer).length; return <div key={section}><div className="mb-2 flex items-center justify-between text-sm"><span className="font-medium">{section}</span><span className="font-semibold">{correct}/3</span></div><Progress value={correct / 3 * 100}/></div>; })}</div><Button className="mt-7 w-full rounded-xl" onClick={onExit}><ArrowLeft/>Back to dashboard</Button></Panel>
      <Panel title="Answer review" subtitle="Correct answers and your selections"><div className="max-h-[410px] space-y-3 overflow-y-auto pr-1">{demoQuestions.map((q) => { const selected = answers[q.id]; const correct = selected === q.answer; return <div key={q.id} className="rounded-xl border border-border bg-muted/35 p-4"><div className="flex gap-3"><span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-xs font-semibold", correct ? "stat-green" : "stat-pink")}>{q.id}</span><div className="min-w-0"><p className="text-sm font-medium leading-5">{q.text}</p><p className={cn("mt-2 text-xs", correct ? "text-positive" : "text-destructive")}>{selected === undefined ? "Not answered" : `Your answer: ${q.options[selected]}`}</p>{!correct && <p className="mt-1 text-xs text-positive">Correct answer: {q.options[q.answer]}</p>}</div></div></div>; })}</div></Panel>
    </div>
  </div>;
}
function EmptySection({ title, role }: { title: string; role: Role }) { return <div className="animate-rise grid min-h-[65vh] place-items-center"><div className="max-w-sm text-center"><div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-primary/10 text-primary"><Target className="size-7"/></div><h2 className="mt-5 text-2xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your {title.toLowerCase()} workspace is ready for {role} demo data.</p><Button className="mt-6 rounded-xl" onClick={() => window.location.reload()}>Back to dashboard</Button></div></div>; }
