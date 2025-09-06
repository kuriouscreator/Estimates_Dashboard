import React, { useMemo, useState, useEffect } from "react";
import { setFaviconAccent } from "./utils/favicon";
import { useEstimates } from "./hooks/useEstimates";

// Quotes
const QUOTES = [
  "Small, steady outputs beat bursts.",
  "Focus is a force multiplier.",
  "Ship, learn, refine, repeat.",
  "Clarity creates speed.",
  "Progress loves constraints.",
  "Schedules create momentum.",
  "Depth today, breadth tomorrow.",
  "Energy is a resource—budget it.",
  "Fewer tasks, fuller attention.",
  "Quality is quiet consistency.",
  "Start. Then keep starting.",
  "Momentum makes decisions easier.",
  "Measure what matters daily.",
  "Protect your prime hours.",
  "Friction down, focus up.",
  "Work simple. Think clearly.",
  "Tiny wins compound.",
  "Make the next 30 minutes count.",
  "Default to action, not perfection.",
  "Constraints fuel creativity.",
];

function getLocalDateStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getDailyQuote() {
  const today = getLocalDateStr();
  try {
    const mapRaw = localStorage.getItem("quoteByDate");
    const historyRaw = localStorage.getItem("quoteHistory");
    const byDate = mapRaw ? JSON.parse(mapRaw) : {};
    let history = historyRaw ? JSON.parse(historyRaw) : [];
    if (byDate[today] != null) return QUOTES[byDate[today]];
    if (history.length >= QUOTES.length) history = [];
    const used = new Set(history);
    const candidates = QUOTES.map((_, i) => i).filter(i => !used.has(i));
    const pickIndex = candidates[Math.floor(Math.random() * candidates.length)];
    byDate[today] = pickIndex;
    history.push(pickIndex);
    localStorage.setItem("quoteByDate", JSON.stringify(byDate));
    localStorage.setItem("quoteHistory", JSON.stringify(history));
    return QUOTES[pickIndex];
  } catch {
    const idx = new Date().getDate() % QUOTES.length;
    return QUOTES[idx];
  }
}

// Accent
function getAccent(key) {
  if (key === 'green') {
    return {
      gradient: 'from-emerald-400/70 via-emerald-300/60 to-emerald-500/70',
      ring: 'focus:ring-emerald-300',
      ring4: 'focus:ring-4 focus:ring-emerald-200',
      borderHover: 'hover:border-emerald-300',
      sectionRing: 'focus-within:ring-emerald-300',
      btn: 'bg-emerald-600 text-white hover:bg-emerald-700',
      pillBorder: 'border-emerald-200',
      text: 'text-emerald-700',
      subtle: 'hover:bg-emerald-50',
    };
  }
  if (key === 'purple') {
    return {
      gradient: 'from-violet-400/70 via-violet-300/60 to-violet-500/70',
      ring: 'focus:ring-violet-300',
      ring4: 'focus:ring-4 focus:ring-violet-200',
      borderHover: 'hover:border-violet-300',
      sectionRing: 'focus-within:ring-violet-300',
      btn: 'bg-violet-600 text-white hover:bg-violet-700',
      pillBorder: 'border-violet-200',
      text: 'text-violet-700',
      subtle: 'hover:bg-violet-50',
    };
  }
  return {
    gradient: 'from-sky-400/70 via-sky-300/60 to-sky-500/70',
    ring: 'focus:ring-sky-300',
    ring4: 'focus:ring-4 focus:ring-sky-200',
    borderHover: 'hover:border-sky-300',
    sectionRing: 'focus-within:ring-sky-300',
    btn: 'bg-sky-600 text-white hover:bg-sky-700',
    pillBorder: 'border-sky-200',
    text: 'text-sky-700',
    subtle: 'hover:bg-sky-50',
  };
}

// Helpers
function fmtDateTime(date, time) { if (!date && !time) return ""; if (!date) return time; if (!time) return date; return `${date} ${time}`; }
function cryptoRandomId() { try { const a = new Uint8Array(16); crypto.getRandomValues(a); return Array.from(a, b => b.toString(16).padStart(2, "0")).join(""); } catch { return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2); } }
function toISODate(d) { const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); return `${y}-${m}-${day}`; }
function toISOMonth(d) { const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); return `${y}-${m}`; }
function toHHMM(d) { const hh = String(d.getHours()).padStart(2, '0'); const mm = String(d.getMinutes()).padStart(2, '0'); return `${hh}:${mm}`; }
function parseYearMonth(ym) { const m = /^(\d{4})-(\d{2})$/.exec(String(ym)); if (!m) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 }; return { year: Number(m[1]), month: Number(m[2]) }; }
function addMonths(date, count) { const d = new Date(date); const month = d.getMonth() + count; d.setMonth(month); if (d.getDate() !== 1) d.setDate(1); return d; }
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate() + days); return d; }
function getWeekRange(ref) { const base = new Date(ref); const start = new Date(base.getFullYear(), base.getMonth(), base.getDate()); const day = start.getDay(); const startOfWeek = new Date(start); startOfWeek.setDate(start.getDate() - day); const endOfWeek = addDays(startOfWeek, 6); return { start: toISODate(startOfWeek), end: toISODate(endOfWeek) }; }
function finalizeAsDone(record, now = new Date()) { const safeNow = now instanceof Date && !Number.isNaN(now.getTime()) ? now : new Date(); return { ...record, status: 'Done', dateReturned: toISODate(safeNow), timeReturned: toHHMM(safeNow) }; }

// Welcome
function Welcome({ onContinue, accentKey, setAccent }) {
  const ACCENT = useMemo(() => getAccent(accentKey), [accentKey]);
  const [quote, setQuote] = useState("");
  useEffect(() => { setQuote(getDailyQuote()); }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className={`h-1 bg-gradient-to-r ${ACCENT.gradient}`} />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome.</h1>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1 backdrop-blur" aria-label="Accent selector">
            {["blue", "green", "purple"].map((key) => (
              <button
                key={key}
                onClick={() => setAccent(key)}
                aria-pressed={accentKey === key}
                className={`h-4 w-4 rounded-full border transition-all duration-200 opacity-70 hover:opacity-100 ${
                  key === 'blue' ? 'bg-sky-400 border-sky-300' : key === 'green' ? 'bg-emerald-400 border-emerald-300' : 'bg-violet-400 border-violet-300'
                } ${accentKey===key ? 'outline outline-1 outline-slate-300' : 'outline-none'}`}
                title={`${key} accent`}
              />
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6">
          <p className="text-5xl leading-tight tracking-tight text-slate-900">Make fewer, better clicks.</p>
          <p className="text-slate-600 max-w-prose">This workspace is designed for calm focus—simple inputs, clear counts, and just enough color. Start your day where it matters.</p>

          <div className={`mt-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
            <p className="text-xs uppercase tracking-wider text-slate-500">Today’s note</p>
            <p className="mt-2 text-lg text-slate-800">“{quote}”</p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={onContinue} className={`h-11 rounded-2xl ${ACCENT.btn} px-6 font-medium shadow-sm focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`}>Enter app</button>
            <button onClick={onContinue} className={`h-11 rounded-2xl border ${ACCENT.pillBorder} bg-white px-6 text-slate-700 ${ACCENT.subtle} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`}>Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Accent
  const [accent, setAccent] = useState("blue");
  const ACCENT = useMemo(() => getAccent(accent), [accent]);
  useEffect(() => { setFaviconAccent(accent); }, [accent]);

  // Welcome
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return localStorage.getItem("welcomeDismissed") !== "true"; } catch { return true; }
  });
  function dismissWelcome() {
    setShowWelcome(false);
    try { localStorage.setItem("welcomeDismissed", "true"); } catch {}
  }

  // Data - using Supabase
  const { 
    estimates, 
    loading, 
    error, 
    addEstimate, 
    updateEstimate, 
    deleteEstimate, 
    markBilled, 
    updateStatus, 
    updateFinalAmount 
  } = useEstimates();

  // Hidden manual seed
  useEffect(() => {
    function onKey(e){
      const mod = (e.ctrlKey || e.metaKey) && e.altKey && (e.key === 's' || e.key === 'S');
      if(mod){ e.preventDefault(); seedSample(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Form
  const [form, setForm] = useState({
    estimateType: "Initial",
    claimNumber: "",
    clientName: "",
    taskNumber: "",
    dateReceived: "",
    timeReceived: "",
    dateReturned: "",
    timeReturned: "",
    finalAmount: "",
    status: "Not Started",
  });
  const [errors, setErrors] = useState({});

  const [rangeFilter, setRangeFilter] = useState("daily");
  const [anchorDate, setAnchorDate] = useState(toISODate(new Date()));
  const [anchorMonth, setAnchorMonth] = useState(toISOMonth(new Date()));

  const [calcAnchorDate, setCalcAnchorDate] = useState(toISODate(new Date()));
  const [otHours, setOtHours] = useState(0);
  const [ptoHours, setPtoHours] = useState(0);

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!String(form.claimNumber).trim()) e.claimNumber = "Required";
    if (!String(form.clientName).trim()) e.clientName = "Required";
    if (!String(form.taskNumber).trim()) e.taskNumber = "Required";
    if (!form.dateReceived) e.dateReceived = "Required";
    if (!form.timeReceived) e.timeReceived = "Required";

    if (form.dateReturned || form.timeReturned) {
      if (!form.dateReturned) e.dateReturned = "Required when time returned is set";
      if (!form.timeReturned) e.timeReturned = "Required when date returned is set";
    }

    if (form.dateReturned && form.timeReturned && form.dateReceived && form.timeReceived) {
      const received = new Date(`${form.dateReceived}T${form.timeReceived}`);
      const returned = new Date(`${form.dateReturned}T${form.timeReturned}`);
      if (!Number.isNaN(received.getTime()) && !Number.isNaN(returned.getTime())) {
        if (returned < received) { e.dateReturned = "Returned before received"; e.timeReturned = "Returned before received"; }
      }
    }

    if (form.finalAmount) {
      const num = Number(String(form.finalAmount).replace(/[^0-9.\\-]/g, ""));
      if (Number.isNaN(num)) e.finalAmount = "Invalid amount";
    }

    setErrors(e); return Object.keys(e).length === 0;
  }

  function formatCurrencyOnBlur() {
    if (!form.finalAmount) return;
    const raw = String(form.finalAmount).replace(/[^0-9.\\-]/g, "");
    const num = Number(raw);
    if (!Number.isNaN(num)) setField("finalAmount", num.toLocaleString(undefined, { style: "currency", currency: "USD" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    
    const payload = {
      ...form,
      finalAmountCents: form.finalAmount ? Math.round(Number(String(form.finalAmount).replace(/[^0-9.\\-]/g, "")) * 100) : 0,
      createdAtISO: new Date().toISOString(),
      billed: form.estimateType === "Final" ? false : null,
    };
    
    try {
      await addEstimate(payload);
      setForm({ estimateType: "Initial", claimNumber: "", clientName: "", taskNumber: "", dateReceived: "", timeReceived: "", dateReturned: "", timeReturned: "", finalAmount: "", status: "Not Started" });
      setErrors({});
    } catch (err) {
      console.error('Failed to save estimate:', err);
      setErrors({ submit: 'Failed to save estimate. Please try again.' });
    }
  }

  function isWithinFilter(dateStr, filter, refDate = new Date()) {
    if (!dateStr) return false; const d = new Date(String(dateStr)); if (Number.isNaN(d.getTime())) return false;
    const base = refDate instanceof Date && !Number.isNaN(refDate.getTime()) ? refDate : new Date();
    const startOfDay = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    if (filter === "daily") { const end = addDays(startOfDay, 1); return d >= startOfDay && d < end; }
    if (filter === "weekly") { const day = startOfDay.getDay(); const startOfWeek = new Date(startOfDay); startOfWeek.setDate(startOfDay.getDate() - day); const endOfWeek = addDays(startOfWeek, 7); return d >= startOfWeek && d < endOfWeek; }
    const startOfMonth = new Date(base.getFullYear(), base.getMonth(), 1); const nextMonth = new Date(base.getFullYear(), base.getMonth() + 1, 1); return d >= startOfMonth && d < nextMonth;
  }
  const selectedRefDate = useMemo(() => rangeFilter === "monthly" ? new Date(`${anchorMonth}-01`) : new Date(anchorDate), [rangeFilter, anchorDate, anchorMonth]);

  const initialCount = useMemo(() => estimates.filter(r => r.estimateType === "Initial" && isWithinFilter(r.dateReturned, rangeFilter, selectedRefDate)).length, [estimates, rangeFilter, selectedRefDate]);
  const finalCount   = useMemo(() => estimates.filter(r => r.estimateType === "Final"   && isWithinFilter(r.dateReturned, rangeFilter, selectedRefDate)).length, [estimates, rangeFilter, selectedRefDate]);
  const totalCount = initialCount + finalCount;

  const finalQueue = useMemo(() => estimates.filter(r => r.estimateType === "Final" && r.billed === false), [estimates]);
  
  async function handleMarkBilled(id) { 
    try {
      await markBilled(id);
    } catch (err) {
      console.error('Failed to mark as billed:', err);
    }
  }

  async function handleDeleteEstimate(id) {
    if (window.confirm('Delete this estimate? This cannot be undone.')) {
      try {
        await deleteEstimate(id);
      } catch (err) {
        console.error('Failed to delete estimate:', err);
        alert('Failed to delete estimate. Please try again.');
      }
    }
  }

  const workQueue = useMemo(() => estimates.filter(r => r.status === 'Not Started' || r.status === 'In Progress'), [estimates]);
  
  async function handleQueueAmountChange(id, value) { 
    try {
      await updateFinalAmount(id, value);
    } catch (err) {
      console.error('Failed to update amount:', err);
    }
  }
  
  async function handleQueueAmountBlur(id) {
    try {
      const estimate = estimates.find(r => r.id === id);
      if (!estimate) return;
      
      const raw = String(estimate.finalAmount || '').replace(/[^0-9.\\-]/g, '');
      const num = Number(raw);
      const formattedAmount = Number.isNaN(num) ? '' : num.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
      
      await updateFinalAmount(id, formattedAmount);
    } catch (err) {
      console.error('Failed to format amount:', err);
    }
  }
  
  async function handleQueueStatusChange(id, newStatus) {
    try {
      await updateStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  }

  // Calculator
  const weeklyRefDate = useMemo(() => new Date(calcAnchorDate), [calcAnchorDate]);
  const initialWeekly = useMemo(() => estimates.filter(r => r.estimateType === 'Initial' && isWithinFilter(r.dateReturned, 'weekly', weeklyRefDate)).length, [estimates, weeklyRefDate]);
  const finalWeekly   = useMemo(() => estimates.filter(r => r.estimateType === 'Final'   && isWithinFilter(r.dateReturned, 'weekly', weeklyRefDate)).length, [estimates, weeklyRefDate]);
  const weeklyTotal   = initialWeekly + finalWeekly;

  const BASE_WEEK_HOURS = 40;
  const effectiveHours = useMemo(() => { const ot = Number(otHours) || 0; const pto = Number(ptoHours) || 0; const hours = BASE_WEEK_HOURS + ot - pto; return Math.max(1, hours); }, [otHours, ptoHours]);
  const estimatesPerHour = useMemo(() => weeklyTotal / effectiveHours, [weeklyTotal, effectiveHours]);
  const estimatesPerDay  = useMemo(() => estimatesPerHour * 8, [estimatesPerHour]);

  // Period queues pickers
  const [dqDate, setDqDate] = useState(toISODate(new Date()));
  const [wqDate, setWqDate] = useState(toISODate(new Date()));
  const [mqMonth, setMqMonth] = useState(toISOMonth(new Date()));
  const dailyQueue = useMemo(() => estimates.filter(r => isWithinFilter(r.dateReturned, 'daily', new Date(dqDate))), [estimates, dqDate]);
  const weeklyQueue = useMemo(() => estimates.filter(r => isWithinFilter(r.dateReturned, 'weekly', new Date(wqDate))), [estimates, wqDate]);
  const monthlyQueue = useMemo(() => estimates.filter(r => isWithinFilter(r.dateReturned, 'monthly', new Date(`${mqMonth}-01`))), [estimates, mqMonth]);

  async function seedSample() {
    const today = new Date(); 
    const y = toISODate(today);
    const samples = [
      { estimateType: 'Initial', claimNumber:'1001', clientName:'Acme Co', taskNumber:'T-01', dateReceived:y, timeReceived:'09:00', dateReturned:y, timeReturned:'11:00', finalAmount:'', status:'Done', billed:null },
      { estimateType: 'Final', claimNumber:'1002', clientName:'Globex',  taskNumber:'T-02', dateReceived:y, timeReceived:'10:00', dateReturned:y, timeReturned:'14:00', finalAmount:'$250.00', status:'Done', billed:false },
      { estimateType: 'Final', claimNumber:'1003', clientName:'Initech', taskNumber:'T-03', dateReceived:y, timeReceived:'08:00', dateReturned:'', timeReturned:'', finalAmount:'$100.00', status:'In Progress', billed:false },
    ]; 
    
    try {
      for (const sample of samples) {
        await addEstimate(sample);
      }
    } catch (err) {
      console.error('Failed to seed sample data:', err);
    }
  }

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading estimates...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Connection Error</h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showWelcome) return <Welcome onContinue={dismissWelcome} accentKey={accent} setAccent={setAccent} />;

  return (
    <div className="min-h-screen antialiased">
      <div className={`h-1 bg-gradient-to-r ${ACCENT.gradient}`}></div>
      <div className="bg-slate-50 text-slate-900">
        <header className="sticky top-0 border-b border-slate-200/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg font-medium tracking-tight text-slate-800">Estimate form.</h1>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-2 py-1 backdrop-blur" aria-label="Accent selector">
                {["blue", "green", "purple"].map((key) => (
                  <button
                    key={key}
                    onClick={() => setAccent(key)}
                    aria-pressed={accent === key}
                    className={`h-4 w-4 rounded-full border transition-all duration-200 opacity-70 hover:opacity-100 ${
                      key === 'blue' ? 'bg-sky-400 border-sky-300' : key === 'green' ? 'bg-emerald-400 border-emerald-300' : 'bg-violet-400 border-violet-300'
                    } ${accent===key ? 'outline outline-1 outline-slate-300' : 'outline-none'}`}
                    title={`${key} accent`}
                  />
                ))}
              </div>

              <select value={rangeFilter} onChange={e => setRangeFilter(e.target.value)} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 pr-8 text-sm focus:outline-none ${ACCENT.ring} transition-all duration-200`}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              {rangeFilter !== 'monthly' ? (
                <input type="date" value={anchorDate} onChange={e => setAnchorDate(e.target.value)} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm focus:outline-none ${ACCENT.ring} transition-all duration-200`} aria-label={rangeFilter === 'daily' ? 'Pick day' : 'Pick a date within the week'} />
              ) : (
                <input type="month" value={anchorMonth} onChange={e => setAnchorMonth(e.target.value)} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm focus:outline-none ${ACCENT.ring} transition-all duration-200`} aria-label="Pick month" />
              )}

              <div className="flex items-center gap-1">
                <button onClick={() => {
                  if (rangeFilter === 'daily') { const d = new Date(anchorDate); d.setDate(d.getDate() - 1); setAnchorDate(toISODate(d)); }
                  else if (rangeFilter === 'weekly') { const d = new Date(anchorDate); d.setDate(d.getDate() - 7); setAnchorDate(toISODate(d)); }
                  else { const m = parseYearMonth(anchorMonth); const prev = addMonths(new Date(m.year, m.month - 1, 1), -1); setAnchorMonth(toISOMonth(prev)); }
                }} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`} aria-label="Previous period">◀</button>

                <button onClick={() => { if (rangeFilter === 'monthly') setAnchorMonth(toISOMonth(new Date())); else setAnchorDate(toISODate(new Date())); }} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`} aria-label="Jump to current">Today</button>

                <button onClick={() => {
                  if (rangeFilter === 'daily') { const d = new Date(anchorDate); d.setDate(d.getDate() + 1); setAnchorDate(toISODate(d)); }
                  else if (rangeFilter === 'weekly') { const d = new Date(anchorDate); d.setDate(d.getDate() + 7); setAnchorDate(toISODate(d)); }
                  else { const m = parseYearMonth(anchorMonth); const next = addMonths(new Date(m.year, m.month - 1, 1), 1); setAnchorMonth(toISOMonth(next)); }
                }} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`} aria-label="Next period">▶</button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8 grid gap-8">
          {/* Form */}
          <section className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] focus-within:ring-2 ${ACCENT.sectionRing}`}>
            <h2 className="mb-4 text-base font-semibold text-slate-800">Details.</h2>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Estimate type</label>
                  <select value={form.estimateType} onChange={e => setField("estimateType", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 pr-10 focus:outline-none ${ACCENT.ring4} transition-all duration-200`}>
                    <option>Initial</option>
                    <option>Final</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select value={form.status} onChange={e => setField("status", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 pr-10 focus:outline-none ${ACCENT.ring4} transition-all duration-200`}>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Done</option>
                  </select>
                  {errors.status && <p className="text-xs text-red-600 mt-1">{errors.status}</p>}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Claim number</label>
                  <input type="text" inputMode="numeric" placeholder="e.g. 123456" value={form.claimNumber} onChange={e => setField("claimNumber", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 placeholder-slate-400 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                  {errors.claimNumber && <p className="text-xs text-red-600 mt-1">{errors.claimNumber}</p>}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Client name</label>
                  <input type="text" placeholder="Full name" value={form.clientName} onChange={e => setField("clientName", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 placeholder-slate-400 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                  {errors.clientName && <p className="text-xs text-red-600 mt-1">{errors.clientName}</p>}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Task number</label>
                  <input type="text" placeholder="e.g. T-0092" value={form.taskNumber} onChange={e => setField("taskNumber", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 placeholder-slate-400 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                  {errors.taskNumber && <p className="text-xs text-red-600 mt-1">{errors.taskNumber}</p>}
                </div>

                {/* Received group */}
                <fieldset className="sm:col-span-2 grid gap-2">
                  <legend className="text-sm font-medium text-slate-700">Estimate request received.</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-slate-600">Date</label>
                      <input type="date" value={form.dateReceived} onChange={e => setField("dateReceived", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                      {errors.dateReceived && <p className="text-xs text-red-600 mt-1">{errors.dateReceived}</p>}
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-slate-600">Time</label>
                      <input type="time" step="60" inputMode="numeric" placeholder="HH:MM" value={form.timeReceived} onChange={e => setField("timeReceived", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                      {errors.timeReceived && <p className="text-xs text-red-600 mt-1">{errors.timeReceived}</p>}
                    </div>
                  </div>
                </fieldset>

                {/* Returned group */}
                <fieldset className="sm:col-span-2 grid gap-2">
                  <legend className="text-sm font-medium text-slate-700">Estimate returned.</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-slate-600">Date</label>
                      <input type="date" value={form.dateReturned} onChange={e => setField("dateReturned", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                      {errors.dateReturned && <p className="text-xs text-red-600 mt-1">{errors.dateReturned}</p>}
                    </div>
                    <div className="grid gap-2">
                      <label className="text-xs font-medium text-slate-600">Time</label>
                      <input type="time" step="60" inputMode="numeric" placeholder="HH:MM" value={form.timeReturned} onChange={e => setField("timeReturned", e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                      {errors.timeReturned && <p className="text-xs text-red-600 mt-1">{errors.timeReturned}</p>}
                    </div>
                  </div>
                </fieldset>

                <div className="sm:col-span-2 grid gap-2">
                  <label className="text-sm font-medium text-slate-700">Final estimate amount</label>
                  <input type="text" inputMode="decimal" placeholder="$0.00" value={form.finalAmount} onChange={e => setField("finalAmount", e.target.value)} onBlur={formatCurrencyOnBlur} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 placeholder-slate-400 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                  {errors.finalAmount && <p className="text-xs text-red-600 mt-1">{errors.finalAmount}</p>}
                </div>
              </div>

              {errors.submit && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}
              <div className="mt-6 flex items-center justify-end">
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setForm({ estimateType: "Initial", claimNumber: "", clientName: "", taskNumber: "", dateReceived: "", timeReceived: "", dateReturned: "", timeReturned: "", finalAmount: "", status: "Not Started" }); setErrors({}); }} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-5 ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`}>Reset</button>
                  <button type="submit" className={`h-11 rounded-2xl ${ACCENT.btn} px-6 font-medium shadow-sm focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95`}>Save</button>
                </div>
              </div>
            </form>
          </section>

          {/* Dashboard */}
          <section className="grid gap-6 md:grid-cols-3">
            {[
              { label: 'Total estimates.', value: totalCount },
              { label: 'Initial estimates.', value: initialCount },
              { label: 'Final estimates.', value: finalCount },
            ].map((c, i) => (
              <div key={i} className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] focus-within:ring-2 ${ACCENT.sectionRing}`}>
                <h3 className="text-base font-semibold tracking-tight text-slate-800">{c.label}</h3>
                <p className="mt-4 text-5xl font-semibold tabular-nums text-slate-900">{c.value}</p>
              </div>
            ))}
          </section>

          {/* Period queues */}
          <section className="grid gap-6">
            <h2 className="text-base font-semibold text-slate-800">Period queues.</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Daily queue */}
              <div className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">Daily.</h3>
                  <input type="date" value={dqDate} onChange={e => setDqDate(e.target.value)} className="h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
                {dailyQueue.length === 0 ? <p className="mt-3 text-sm text-slate-500">No estimates returned on this day.</p> : (
                  <ul className="mt-3 divide-y divide-slate-200/70">
                    {dailyQueue.map(item => (
                      <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-slate-800">{item.clientName} • #{item.claimNumber}</p>
                          <p className="text-xs text-slate-500 truncate">Type {item.estimateType} • Returned {fmtDateTime(item.dateReturned, item.timeReturned) || "—"}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          {item.estimateType === 'Final' && item.billed === false && (
                            <button onClick={() => handleMarkBilled(item.id)} className={`h-8 rounded-lg border ${ACCENT.pillBorder} bg-white px-2 text-xs ${ACCENT.text} ${ACCENT.subtle} focus:outline-none ${ACCENT.ring} whitespace-nowrap`}>Bill</button>
                          )}
                          {item.status !== 'Done' && (
                            <button onClick={() => handleQueueStatusChange(item.id, 'Done')} className={`h-8 rounded-lg ${ACCENT.btn} px-2 text-xs text-white focus:outline-none ${ACCENT.ring} whitespace-nowrap`}>Done</button>
                          )}
                          <button onClick={() => handleDeleteEstimate(item.id)} className="h-8 rounded-lg border border-slate-300/80 bg-white px-2 text-xs text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 whitespace-nowrap">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Weekly queue */}
              <div className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">Weekly.</h3>
                  <input type="date" value={wqDate} onChange={e => setWqDate(e.target.value)} className="h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
                {weeklyQueue.length === 0 ? <p className="mt-3 text-sm text-slate-500">No estimates returned in this week.</p> : (
                  <ul className="mt-3 divide-y divide-slate-200/70">
                    {weeklyQueue.map(item => (
                      <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-slate-800">{item.clientName} • #{item.claimNumber}</p>
                          <p className="text-xs text-slate-500 truncate">Type {item.estimateType} • Returned {fmtDateTime(item.dateReturned, item.timeReturned) || "—"}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          {item.estimateType === 'Final' && item.billed === false && (
                            <button onClick={() => handleMarkBilled(item.id)} className={`h-8 rounded-lg border ${ACCENT.pillBorder} bg-white px-2 text-xs ${ACCENT.text} ${ACCENT.subtle} focus:outline-none ${ACCENT.ring} whitespace-nowrap`}>Bill</button>
                          )}
                          {item.status !== 'Done' && (
                            <button onClick={() => handleQueueStatusChange(item.id, 'Done')} className={`h-8 rounded-lg ${ACCENT.btn} px-2 text-xs text-white focus:outline-none ${ACCENT.ring} whitespace-nowrap`}>Done</button>
                          )}
                          <button onClick={() => handleDeleteEstimate(item.id)} className="h-8 rounded-lg border border-slate-300/80 bg-white px-2 text-xs text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 whitespace-nowrap">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Monthly queue */}
              <div className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">Monthly.</h3>
                  <input type="month" value={mqMonth} onChange={e => setMqMonth(e.target.value)} className="h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200" />
                </div>
                {monthlyQueue.length === 0 ? <p className="mt-3 text-sm text-slate-500">No estimates returned in this month.</p> : (
                  <ul className="mt-3 divide-y divide-slate-200/70">
                    {monthlyQueue.map(item => (
                      <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate text-slate-800">{item.clientName} • #{item.claimNumber}</p>
                          <p className="text-xs text-slate-500 truncate">Type {item.estimateType} • Returned {fmtDateTime(item.dateReturned, item.timeReturned) || "—"}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                          {item.estimateType === 'Final' && item.billed === false && (
                            <button onClick={() => handleMarkBilled(item.id)} className={`h-8 rounded-lg border ${ACCENT.pillBorder} bg-white px-2 text-xs ${ACCENT.text} ${ACCENT.subtle} focus:outline-none ${ACCENT.ring} whitespace-nowrap`}>Bill</button>
                          )}
                          {item.status !== 'Done' && (
                            <button onClick={() => handleQueueStatusChange(item.id, 'Done')} className={`h-8 rounded-lg ${ACCENT.btn} px-2 text-xs text-white focus:outline-none ${ACCENT.ring} whitespace-nowrap`}>Done</button>
                          )}
                          <button onClick={() => handleDeleteEstimate(item.id)} className="h-8 rounded-lg border border-slate-300/80 bg-white px-2 text-xs text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 whitespace-nowrap">Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Final & Work queues */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
              <h3 className="text-base font-semibold tracking-tight text-slate-800">Final estimates queue.</h3>
              {finalQueue.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No final estimates awaiting billing.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-200/70">
                  {finalQueue.map(item => (
                    <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-slate-800">{item.clientName} • #{item.claimNumber}</p>
                        <p className="text-xs text-slate-500 truncate">Task {item.taskNumber} • Returned {fmtDateTime(item.dateReturned, item.timeReturned) || "—"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleMarkBilled(item.id)} className={`h-9 rounded-xl border ${ACCENT.pillBorder} bg-white px-3 text-sm ${ACCENT.text} ${ACCENT.subtle} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95 whitespace-nowrap`}>Mark billed</button>
                        <button onClick={() => handleDeleteEstimate(item.id)} className="h-9 rounded-xl border border-slate-300/80 bg-white px-3 text-sm text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all duration-200 active:scale-95 whitespace-nowrap">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
              <h3 className="text-base font-semibold tracking-tight text-slate-800">Work queue.</h3>
              {workQueue.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No estimates pending work.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-200/70">
                  {workQueue.map(item => (
                    <li key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-slate-800">{item.clientName} • #{item.claimNumber}</p>
                        <p className="text-xs text-slate-500 truncate">Status {item.status} • Received {fmtDateTime(item.dateReceived, item.timeReceived) || "—"}</p>
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="grid gap-1.5">
                            <label className="text-xs text-slate-600">Final amount</label>
                            <input
                              type="text"
                              inputMode="decimal"
                              placeholder="$0.00"
                              value={item.finalAmount || ""}
                              onChange={(e) => handleQueueAmountChange(item.id, e.target.value)}
                              onBlur={() => handleQueueAmountBlur(item.id)}
                              className="h-9 rounded-xl border border-slate-300/80 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                            />
                          </div>
                          <div className="grid gap-1.5">
                            <label className="text-xs text-slate-600">Update status</label>
                            <select
                              value={item.status}
                              onChange={(e) => handleQueueStatusChange(item.id, e.target.value)}
                              className="h-9 rounded-xl border border-slate-300/80 bg-white px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                              <option>Not Started</option>
                              <option>In Progress</option>
                              <option>Done</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button onClick={() => handleDeleteEstimate(item.id)} className="h-9 rounded-xl border border-slate-300/80 bg-white px-3 text-sm text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all duration-200 active:scale-95 whitespace-nowrap">Delete</button>
                        <button onClick={() => handleQueueStatusChange(item.id, 'In Progress')} className={`h-9 rounded-xl border ${ACCENT.pillBorder} bg-white px-3 text-sm ${ACCENT.text} ${ACCENT.subtle} focus:outline-none ${ACCENT.ring} transition-all duration-200 active:scale-95 whitespace-nowrap`}>Set In Progress</button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Calculator */}
          <section className={`rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm focus-within:ring-2 ${ACCENT.sectionRing}`}>
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <h2 className="text-base font-semibold text-slate-800">Productivity calculator.</h2>
              <p className="text-xs text-slate-500">Week of <span className="font-medium">{getWeekRange(new Date(calcAnchorDate)).start}</span> to <span className="font-medium">{getWeekRange(new Date(calcAnchorDate)).end}</span></p>
            </div>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button onClick={() => { const d = new Date(calcAnchorDate); d.setDate(d.getDate() - 7); setCalcAnchorDate(toISODate(d)); }} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-3 text-sm ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all`}>◀ Prev week</button>
              <input type="date" value={calcAnchorDate} onChange={e => setCalcAnchorDate(e.target.value)} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-2 text-sm focus:outline-none ${ACCENT.ring} transition-all`} aria-label="Pick a date within the week" />
              <button onClick={() => setCalcAnchorDate(toISODate(new Date()))} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-3 text-sm ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all`}>This week</button>
              <button onClick={() => { const d = new Date(calcAnchorDate); d.setDate(d.getDate() + 7); setCalcAnchorDate(toISODate(d)); }} className={`h-9 rounded-xl border border-slate-300/80 bg-white px-3 text-sm ${ACCENT.borderHover} focus:outline-none ${ACCENT.ring} transition-all`}>Next week ▶</button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Overtime (OT) hours this week</label>
                <input type="number" min="0" step="1" inputMode="numeric" value={otHours} onChange={e => setOtHours(e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">PTO hours this week</label>
                <input type="number" min="0" step="1" inputMode="numeric" value={ptoHours} onChange={e => setPtoHours(e.target.value)} className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Weekly estimates (auto)</label>
                <input type="text" value={weeklyTotal} readOnly className={`h-11 rounded-2xl border border-slate-300/80 bg-white px-3 text-slate-800 focus:outline-none ${ACCENT.ring4} transition-all duration-200`} />
                <p className="sr-only">Sum of Initial + Final returned in this week.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-slate-200/70 p-4 bg-white">
                <p className="text-xs text-slate-500">Effective hours</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{effectiveHours}</p>
                <p className="sr-only">40 base + OT − PTO.</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 p-4 bg-white">
                <p className="text-xs text-slate-500">Estimates per hour</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{estimatesPerHour.toFixed(2)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 p-4 bg-white">
                <p className="text-xs text-slate-500">Estimates per 8-hour day</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">{estimatesPerDay.toFixed(2)}</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="mx-auto max-w-5xl px-4 py-10 text-center text-xs text-slate-500">
          Designed with restraint: calm surfaces, soft accents, and clear hierarchy.
        </footer>
      </div>
    </div>
  );
}
