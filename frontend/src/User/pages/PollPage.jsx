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
  closePoll
} from "../../store/slices/pollSlice";
import { SkeletonGrid } from "../../components/PageLoader";

const COLORS = [
  { fill: "bg-blue-500", soft: "bg-blue-50 border-blue-200", text: "text-blue-700", glow: "rgba(59,130,246,0.18)" },
  { fill: "bg-violet-500", soft: "bg-violet-50 border-violet-200", text: "text-violet-700", glow: "rgba(139,92,246,0.18)" },
  { fill: "bg-emerald-500", soft: "bg-emerald-50 border-emerald-200", text: "text-emerald-700", glow: "rgba(16,185,129,0.18)" },
  { fill: "bg-amber-500", soft: "bg-amber-50 border-amber-200", text: "text-amber-700", glow: "rgba(245,158,11,0.18)" },
  { fill: "bg-rose-500", soft: "bg-rose-50 border-rose-200", text: "text-rose-700", glow: "rgba(244,63,94,0.18)" },
  { fill: "bg-cyan-500", soft: "bg-cyan-50 border-cyan-200", text: "text-cyan-700", glow: "rgba(6,182,212,0.18)" },
];

const getTotalVotes = (poll) => (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
const getPercent = (votes, total) => (total === 0 ? 0 : Math.round((votes / total) * 100));
const isPollClosed = (poll) => {
  const isExpiredByDate = poll.expiresAt && new Date(poll.expiresAt) < new Date();
  return poll.isActive === false || isExpiredByDate;
};

const PollCard = ({ poll, userId, isAdmin, onVote, onDelete, onClose }) => {
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
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all duration-300 ${
        closed ? "opacity-90" : "hover:-translate-y-1.5 hover:shadow-xl"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[var(--accent)] via-sky-400 to-emerald-400" />

      <div className="p-6 pb-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {closed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                <Lock size={10} />
                {isExpiredByDate ? "Expired" : "Closed"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Poll
              </span>
            )}
            {hasVoted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-blue-600">
                <UserCheck size={10} />
                Your vote recorded
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-1">
              {!closed && (
                <button onClick={() => onClose(poll._id)} className="rounded-xl p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600">
                  <Lock size={14} />
                </button>
              )}
              <button onClick={() => onDelete(poll._id)} className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="mb-5">
          <h3 className="mb-2 text-xl font-black leading-tight text-[var(--text)]">{poll.question}</h3>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">
            {poll.description || "Community opinion poll."}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <Users size={14} />
            {totalVotes} votes
          </div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
            <Clock size={14} />
            {closed ? "Results locked" : "Vote now"}
          </div>
        </div>
      </div>

      <div className="space-y-3 px-6 pb-6">
        {(poll.options || []).map((opt, idx) => {
          const palette = COLORS[idx % COLORS.length];
          const pct = getPercent(opt.votes || 0, totalVotes);
          const isUserChoice = votedOptionIndex === idx;
          const showResults = closed || hasVoted;
          const isLeading = winningVotes > 0 && (opt.votes || 0) === winningVotes;

          if (showResults) {
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-2xl border transition-all ${
                  isUserChoice ? "border-blue-200 bg-blue-50 ring-1 ring-blue-100" : `bg-slate-50 ${palette.soft}`
                }`}
                style={{ boxShadow: `0 10px 30px -25px ${palette.glow}` }}
              >
                <div
                  className={`absolute left-0 top-0 h-full ${isUserChoice ? "bg-blue-500" : palette.fill} opacity-20 transition-all duration-1000`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className={`flex items-center gap-2 text-sm font-bold ${isUserChoice ? "text-blue-700" : "text-slate-700"}`}>
                    {isUserChoice && <UserCheck size={15} className="text-blue-600" />}
                    {isLeading && !isUserChoice && <CheckCircle2 size={15} className={palette.text} />}
                    <span>{opt.text}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-black ${isUserChoice ? "text-blue-600" : "text-slate-500"}`}>{pct}%</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{opt.votes || 0} votes</div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={idx}
              disabled={!canVote}
              onClick={() => onVote(poll._id, idx)}
              className={`w-full rounded-2xl border px-5 py-4 text-left text-sm font-bold transition-all active:scale-[0.98] ${
                canVote
                  ? "border-slate-200 bg-[var(--bg)] text-slate-700 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-50"
                  : "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span>{opt.text}</span>
                <ArrowRight size={16} className={canVote ? "text-blue-500" : "text-slate-300"} />
              </span>
            </button>
          );
        })}
      </div>
    </article>
  );
};

const PollsPage = () => {
  const dispatch = useDispatch();
  const pollState = useSelector((state) => state.poll);
  const { list: polls = [], loading } = pollState || {};

  const user = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = user?.profileId || user?._id;
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("active");
  const [form, setForm] = useState({ question: "", description: "", options: ["", ""] });

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

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
    <div className="min-h-screen bg-[var(--bg)] p-4 text-[var(--text)] transition-colors duration-300 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(14,165,233,0.12),rgba(99,102,241,0.08),rgba(255,255,255,0.02))] p-6 shadow-sm sm:p-8">
          <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-44 w-44 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] backdrop-blur">
                <Sparkles size={13} className="text-sky-500" />
                Community voting space
              </div>
              <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">
                <BarChart2 className="text-[var(--accent)]" size={32} />
                Discussions & Polls
              </h1>
              <p className="mt-3 max-w-xl text-sm font-medium leading-6 text-[var(--text-muted)] sm:text-base">
                Share opinions, see live community sentiment, and make society decisions feel transparent and participatory.
              </p>
              {activePolls[0] && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-black text-[var(--text)] shadow-sm">
                  <Vote size={16} className="text-[var(--accent)]" />
                  Hottest live poll:
                  <span className="max-w-[240px] truncate text-[var(--accent)]">{activePolls[0].question}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Active", value: activePolls.length, tone: "bg-emerald-50 text-emerald-600" },
                { label: "Closed", value: closedPolls.length, tone: "bg-slate-100 text-slate-600" },
                { label: "Total Votes", value: totalVotesAcrossPolls, tone: "bg-sky-50 text-sky-600" },
                { label: "You Joined", value: votedPollsCount, tone: "bg-indigo-50 text-indigo-600" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
                  <div className={`mb-3 inline-flex rounded-xl px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${item.tone}`}>
                    {item.label}
                  </div>
                  <div className="text-2xl font-black text-[var(--text)]">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="inline-flex w-fit rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-1.5 shadow-sm">
            {[
              { key: "active", label: "Active", count: activePolls.length },
              { key: "closed", label: "Closed", count: closedPolls.length },
              { key: "all", label: "All", count: polls.length },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-[0.18em] transition-all ${
                  tab === t.key
                    ? "bg-[var(--accent)] text-white shadow-md"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="user-btn-primary flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold active:scale-95"
            >
              <Plus size={20} /> Create New Poll
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between px-1">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {filteredPolls.length} polls in this view
          </p>
          <p className="text-sm font-semibold text-[var(--text-muted)]">
            {tab === "active" ? "Vote before these close." : tab === "closed" ? "Browse completed community decisions." : "See every discussion in one place."}
          </p>
        </div>

        {loading ? (
          <div className="mt-6">
            <SkeletonGrid count={6} gridClassName="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" itemClassName="h-80" />
          </div>
        ) : filteredPolls.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll) => (
              <PollCard
                key={poll._id}
                poll={poll}
                userId={userId}
                isAdmin={isAdmin}
                onVote={(id, optionIndex) => dispatch(castVote({ id, data: { optionIndex } }))}
                onDelete={(id) => window.confirm("Delete this poll?") && dispatch(deletePoll(id))}
                onClose={(id) => window.confirm("Close this poll?") && dispatch(closePoll(id))}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] py-24 text-center shadow-sm">
            <BarChart2 size={48} className="mx-auto mb-4 text-[var(--border)]" />
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[var(--text-muted)]">No {tab} polls found</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Try creating a new poll or switching tabs.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 backdrop-blur-sm" style={{ background: "color-mix(in srgb, var(--text) 50%, transparent)" }}>
          <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--accent-bg)] p-6">
              <h2 className="font-black uppercase tracking-tight text-[var(--text)]">Launch Society Poll</h2>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl p-2 text-[var(--text-muted)] transition hover:bg-[var(--accent-soft)]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5 p-8">
              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Question</label>
                <input
                  required
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 font-bold text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder="e.g. Best time for Holi event?"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Description</label>
                <textarea
                  rows={3}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-sm font-medium text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  placeholder="Give residents context before they vote..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="mb-1 block text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Options</label>
                {form.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      required
                      className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-2.5 text-sm font-medium text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const next = [...form.options];
                        next[i] = e.target.value;
                        setForm({ ...form, options: next });
                      }}
                    />
                    {form.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, options: form.options.filter((_, idx) => idx !== i) })}
                        className="text-[var(--text-muted)] transition hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}

                {form.options.length < 6 && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, options: [...form.options, ""] })}
                    className="mt-2 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--accent)]"
                  >
                    <Plus size={12} /> Add Choice
                  </button>
                )}
              </div>

              <button type="submit" className="user-btn-primary mt-4 w-full rounded-2xl py-4 font-black uppercase tracking-[0.2em] transition-all active:scale-95">
                Broadcast Poll
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollsPage;
