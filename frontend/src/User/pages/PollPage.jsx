import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart2,
  Plus,
  X,
  Clock,
  Users,
  Trash2,
  Lock,
  UserCheck,
  Sparkles,
  CheckCircle2,
  Vote,
  ArrowRight,
} from "lucide-react";
import {
  fetchPolls,
  createPoll,
  castVote,
  deletePoll,
  closePoll,
} from "../../store/slices/pollSlice";
import { SkeletonGrid } from "../../components/PageLoader";

const COLORS = [
  { fill: "bg-blue-500", soft: "bg-blue-500/10", text: "text-blue-500", glow: "rgba(59,130,246,0.3)" },
  { fill: "bg-indigo-500", soft: "bg-indigo-500/10", text: "text-indigo-500", glow: "rgba(99,102,241,0.3)" },
  { fill: "bg-emerald-500", soft: "bg-emerald-500/10", text: "text-emerald-500", glow: "rgba(16,185,129,0.3)" },
  { fill: "bg-amber-500", soft: "bg-amber-500/10", text: "text-amber-500", glow: "rgba(245,158,11,0.3)" },
];

const getTotalVotes = (poll) => (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
const getPercent = (votes, total) => (total === 0 ? 0 : Math.round((votes / total) * 100));
const isPollClosed = (poll) => {
  const isExpiredByDate = poll.expiresAt && new Date(poll.expiresAt) < new Date();
  return poll.isActive === false || isExpiredByDate;
};

// --- POLL CARD COMPONENT ---
const PollCard = ({ poll, userId, isAdmin, onVote, onDelete, onClose, index }) => {
  const totalVotes = getTotalVotes(poll);
  const closed = isPollClosed(poll);
  const isExpiredByDate = poll.expiresAt && new Date(poll.expiresAt) < new Date();

  const votedOptionIndex = useMemo(
    () => (poll.options || []).findIndex((opt) => opt.votedBy?.includes(userId)),
    [poll.options, userId]
  );

  const hasVoted = votedOptionIndex !== -1;
  const canVote = !closed && !hasVoted;
  const winningVotes = Math.max(...(poll.options || []).map((opt) => opt.votes || 0), 0);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-7 transition-all duration-500 ${
        closed ? "opacity-90" : "hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
      }`}
      style={{ animation: `fadeUp 0.6s ease forwards ${index * 0.1}s`, opacity: 0 }}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 opacity-60" />

      <div className="mb-6 flex items-start justify-between">
        <div className="flex flex-wrap gap-2">
          {closed ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-slate-500/20">
              <Lock size={10} /> {isExpiredByDate ? "Expired" : "Closed"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Poll
            </span>
          )}
          {hasVoted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-500 border border-indigo-500/20">
              <UserCheck size={10} /> Recorded
            </span>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onDelete(poll._id)} className="rounded-xl bg-rose-500/10 p-2 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-black leading-tight text-[var(--text)] group-hover:text-indigo-400 transition-colors">{poll.question}</h3>
        <p className="mt-2 line-clamp-2 text-xs font-medium text-[var(--text-muted)] opacity-70">
          {poll.description || "Community opinion poll."}
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between rounded-2xl bg-[var(--bg)] px-4 py-3 border border-[var(--border)] group-hover:border-indigo-500/30 transition-all">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          <Users size={14} className="text-indigo-500" />
          {totalVotes} Votes
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          <Clock size={14} className="text-indigo-500" />
          {closed ? "Locked" : "Active"}
        </div>
      </div>

      <div className="space-y-3 pb-2 flex-grow">
        {(poll.options || []).map((opt, idx) => {
          const palette = COLORS[idx % COLORS.length];
          const pct = getPercent(opt.votes || 0, totalVotes);
          const isUserChoice = votedOptionIndex === idx;
          const showResults = closed || hasVoted;
          const isLeading = winningVotes > 0 && (opt.votes || 0) === winningVotes;

          return (
            <div key={idx} className="relative">
              {showResults ? (
                <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${isUserChoice ? "border-indigo-500/50 bg-indigo-500/5" : "border-[var(--border)] bg-[var(--bg)]"}`}>
                  <div 
                    className={`absolute inset-y-0 left-0 ${isUserChoice ? "bg-indigo-500/20" : "bg-slate-500/10"} transition-all duration-1000 ease-out`}
                    style={{ width: `${pct}%`, boxShadow: isUserChoice ? `0 0 15px ${palette.glow}` : "none" }}
                  />
                  <div className="relative flex items-center justify-between gap-3 px-4 py-3.5">
                    <div className={`flex items-center gap-2 text-sm font-bold ${isUserChoice ? "text-indigo-500" : "text-[var(--text)]"}`}>
                      {isUserChoice && <UserCheck size={14} />}
                      {isLeading && !isUserChoice && <CheckCircle2 size={14} className="text-emerald-500" />}
                      <span>{opt.text}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-black ${isUserChoice ? "text-indigo-500" : "text-[var(--text)]"}`}>{pct}%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  disabled={!canVote}
                  onClick={() => onVote(poll._id, idx)}
                  className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 text-left text-sm font-bold text-[var(--text-muted)] transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-indigo-500 active:scale-95"
                >
                  <div className="flex items-center justify-between">
                    <span>{opt.text}</span>
                    <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
};

const PollsPage = () => {
  const dispatch = useDispatch();
  const { list: polls = [], loading } = useSelector((state) => state.poll || {});
  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = user?.profileId || user?._id;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("active");
  const [form, setForm] = useState({ question: "", description: "", options: ["", ""] });

  useEffect(() => { dispatch(fetchPolls()); }, [dispatch]);

  const activePolls = useMemo(() => polls.filter((p) => !isPollClosed(p)), [polls]);
  const closedPolls = useMemo(() => polls.filter((p) => isPollClosed(p)), [polls]);
  const totalVotesAcrossPolls = useMemo(() => polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0), [polls]);
  const votedPollsCount = useMemo(
    () => polls.filter((poll) => (poll.options || []).some((opt) => opt.votedBy?.includes(userId))).length,
    [polls, userId]
  );

  const filteredPolls = useMemo(() => {
    if (tab === "active") return activePolls;
    if (tab === "closed") return closedPolls;
    return polls;
  }, [polls, activePolls, closedPolls, tab]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const validOptions = form.options.filter((o) => o.trim());
    if (validOptions.length < 2) return;
    await dispatch(createPoll({ ...form, options: validOptions.map((text) => ({ text, votes: 0 })) }));
    setShowForm(false);
    setForm({ question: "", description: "", options: ["", ""] });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-all duration-300 sm:p-8 lg:p-12 pt-28">
      <div className="mx-auto max-w-7xl m-12">
        
        {/* --- HEADER BOX (AS PER IMAGE) --- */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(14,165,233,0.15),rgba(99,102,241,0.08),rgba(255,255,255,0.02))] p-8 shadow-sm transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur-md">
                <Sparkles size={14} className="text-sky-500 animate-pulse" />
                Community Voting Space
              </div>
              <div className="flex items-center gap-4 mb-4">
                <BarChart2 className="text-indigo-500 shrink-0" size={40} />
                <h1 className="text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">Discussions & Polls</h1>
              </div>
              <p className="text-sm font-medium leading-relaxed text-[var(--text-muted)] opacity-80 max-w-xl">
                Share opinions, see live community sentiment, and make society decisions feel transparent and participatory.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
              {[
                { label: "Active", value: activePolls.length, tone: "bg-emerald-500/10 text-emerald-500" },
                { label: "Closed", value: closedPolls.length, tone: "bg-slate-500/10 text-slate-500" },
                { label: "Total Votes", value: totalVotesAcrossPolls, tone: "bg-blue-500/10 text-blue-500" },
                { label: "You Joined", value: votedPollsCount, tone: "bg-indigo-500/10 text-indigo-500" },
              ].map((item) => (
                <div key={item.label} className="min-w-[120px] rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition-all hover:-translate-y-1">
                  <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${item.tone}`}>{item.label}</div>
                  <div className="text-2xl font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TABS BOX (AS PER IMAGE) --- */}
        <div className="mt-8 flex flex-col gap-4 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2 p-1 rounded-2xl border border-[var(--border)] bg-[var(--bg)] w-fit">
            {[
              { key: "active", label: "Active", count: activePolls.length },
              { key: "closed", label: "Closed", count: closedPolls.length },
              { key: "all", label: "All", count: polls.length },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-xl px-7 py-3 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  tab === t.key ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-indigo-600 hover:-translate-y-1 active:scale-95"
            >
              <Plus size={18} /> New Poll
            </button>
          )}
        </div>

        {/* --- GRID & EMPTY STATE --- */}
        {loading ? (
          <div className="mt-10"><SkeletonGrid count={6} gridClassName="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3" itemClassName="h-96 rounded-[3rem]" /></div>
        ) : filteredPolls.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll, idx) => (
              <PollCard
                key={poll._id}
                index={idx}
                poll={poll}
                userId={userId}
                isAdmin={isAdmin}
                onVote={(id, optionIndex) => dispatch(castVote({ id, data: { optionIndex } }))}
                onDelete={(id) => window.confirm("Delete?") && dispatch(deletePoll(id))}
                onClose={(id) => window.confirm("Close?") && dispatch(closePoll(id))}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 py-32 rounded-[3rem] border border-dashed border-[var(--border)] bg-[var(--card)] text-center">
            <BarChart2 size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-black uppercase tracking-[0.3em] opacity-40">No Discussions Found</p>
          </div>
        )}
      </div>

      {/* --- FORM MODAL --- */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md overflow-hidden rounded-[3rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl animate-scaleUp">
             <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-black uppercase tracking-tight">Create Poll</h2>
                <button onClick={() => setShowForm(false)} className="rounded-2xl bg-[var(--bg)] p-3 hover:text-indigo-500 transition-colors border border-[var(--border)]"><X size={20} /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <input required className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 text-sm font-bold text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Question?" value={form.question} onChange={e => setForm({...form, question: e.target.value})} />
                <textarea rows={2} className="w-full rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-5 py-4 text-sm font-medium text-[var(--text)] outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Context..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                <div className="space-y-3">
                  {form.options.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                      <input required className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-bold text-[var(--text)] outline-none" placeholder={`Choice ${i+1}`} value={opt} onChange={e => {
                          const next = [...form.options]; next[i] = e.target.value; setForm({...form, options: next});
                      }} />
                      {form.options.length > 2 && <button type="button" onClick={() => setForm({...form, options: form.options.filter((_, idx) => idx !== i)})} className="text-rose-500"><X size={18}/></button>}
                    </div>
                  ))}
                  {form.options.length < 5 && <button type="button" onClick={() => setForm({...form, options: [...form.options, ""]})} className="text-[10px] font-black uppercase text-indigo-500">+ Add Choice</button>}
                </div>
                <button type="submit" className="w-full rounded-2xl bg-indigo-600 py-4 text-[11px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-indigo-700">Broadcast</button>
              </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default PollsPage;