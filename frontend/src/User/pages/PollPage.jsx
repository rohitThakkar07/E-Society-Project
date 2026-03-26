import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BarChart2, Plus, X, CheckCircle, Clock,
    Users, Trash2, Lock, ChevronRight,
} from "lucide-react";
// ✅ FIXED: Removed voteOnPoll, using castVote
import {
    fetchPolls,
    createPoll,
    castVote,
    deletePoll,
    closePoll
} from "../../store/slices/pollSlice";

// ─── Helpers ──────────────────────────────────────────────
const COLORS = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
const LIGHT_COLORS = ["bg-blue-50 border-blue-200", "bg-violet-50 border-violet-200", "bg-emerald-50 border-emerald-200", "bg-amber-50 border-amber-200", "bg-rose-50 border-rose-200", "bg-cyan-50 border-cyan-200"];
const TEXT_COLORS = ["text-blue-700", "text-violet-700", "text-emerald-700", "text-amber-700", "text-rose-700", "text-cyan-700"];

const getTotalVotes = (poll) => (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
const getPercent = (votes, total) => total === 0 ? 0 : Math.round((votes / total) * 100);

// ─── Poll Card Component ──────────────────────────────────
const PollCard = ({ poll, userId, isAdmin, onVote, onDelete, onClose }) => {
    const totalVotes = getTotalVotes(poll);
    const isClosed = poll.status === "Closed" || poll.isClosed;

    // Logic to check if user has already voted
    const hasVoted = poll.voters?.includes(userId);
    const showResults = hasVoted || isClosed;

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition hover:shadow-md">
            <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        {isClosed ? (
                            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                                <Lock size={10} /> Closed
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" /> Active
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Users size={11} /> {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                        </span>
                    </div>

                    {isAdmin && (
                        <div className="flex items-center gap-1 shrink-0">
                            {!isClosed && (
                                <button onClick={() => onClose(poll._id)} className="text-xs text-amber-600 hover:text-amber-800 border border-amber-100 px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1">
                                    <Lock size={11} /> Close
                                </button>
                            )}
                            <button onClick={() => onDelete(poll._id)} className="text-xs text-red-500 hover:text-red-700 border border-red-100 px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1">
                                <Trash2 size={11} /> Delete
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-slate-800 text-base leading-snug mb-1">{poll.question}</h3>
                {poll.description && <p className="text-sm text-slate-400 leading-relaxed mb-3">{poll.description}</p>}
            </div>

            <div className="px-5 pb-5 space-y-2">
                {(poll.options || []).map((opt, idx) => {
                    const pct = getPercent(opt.votes || 0, totalVotes);
                    const isWinner = isClosed && (opt.votes || 0) === Math.max(...poll.options.map(o => o.votes || 0));

                    return showResults ? (
                        <div key={idx} className={`relative rounded-xl border overflow-hidden ${isWinner ? LIGHT_COLORS[idx % LIGHT_COLORS.length] : "bg-slate-50 border-slate-100"}`}>
                            <div className={`absolute top-0 left-0 h-full transition-all duration-700 opacity-20 ${COLORS[idx % COLORS.length]}`} style={{ width: `${pct}%` }} />
                            <div className="relative flex items-center justify-between px-4 py-3">
                                <span className={`text-sm font-semibold ${isWinner ? TEXT_COLORS[idx % TEXT_COLORS.length] : "text-slate-700"}`}>{opt.text}</span>
                                <span className={`text-sm font-bold ${isWinner ? TEXT_COLORS[idx % TEXT_COLORS.length] : "text-slate-500"}`}>{pct}%</span>
                            </div>
                        </div>
                    ) : (
                        <button key={idx} onClick={() => onVote(poll._id, idx)} className="w-full text-left px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition text-sm font-medium">
                            {opt.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ─── Main Polls Page ──────────────────────────────────────
const PollsPage = () => {
    const dispatch = useDispatch();
    // Ensure we fall back to an empty object if state is undefined
    const { list: polls = [], loading } = useSelector((s) => s.poll || {});

    const user = JSON.parse(localStorage.getItem("userData") || "{}");
    const userId = user?.profileId || user?._id;
    const isAdmin = user?.role?.toLowerCase() === "admin";

    const [showForm, setShowForm] = useState(false);
    const [tab, setTab] = useState("active");
    const [form, setForm] = useState({ question: "", description: "", options: ["", ""] });

    useEffect(() => { dispatch(fetchPolls()); }, [dispatch]);

    const active = polls.filter((p) => p.status !== "Closed" && !p.isClosed);
    const closed = polls.filter((p) => p.status === "Closed" || p.isClosed);
    const shown = tab === "active" ? active : closed;

    const handleCreate = async (e) => {
        e.preventDefault();
        const validOptions = form.options.filter(o => o.trim());
        if (validOptions.length < 2) return;

        await dispatch(createPoll({
            question: form.question,
            description: form.description,
            options: validOptions.map(text => ({ text, votes: 0 }))
        }));
        setShowForm(false);
        setForm({ question: "", description: "", options: ["", ""] });
    };

    // ✅ FIXED: Updated to call castVote instead of voteOnPoll
    const handleVote = (id, optionIndex) => {
        dispatch(castVote({ id, data: { optionIndex } }));
    };

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-slate-50">
            <div className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-10 shadow-sm">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <BarChart2 size={20} className="text-violet-500" />
                            <h1 className="text-2xl font-bold text-slate-800">Discussions & Polls</h1>
                        </div>
                        <p className="text-sm text-slate-400">{active.length} active · {closed.length} closed</p>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-700 transition">
                            <Plus size={16} /> Create Poll
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white border border-slate-200 rounded-2xl flex p-1 mb-8 w-fit">
                    {["active", "closed"].map((v) => (
                        <button key={v} onClick={() => setTab(v)} className={`px-5 py-2 rounded-xl text-sm font-semibold transition capitalize ${tab === v ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                            {v}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shown.map((poll) => (
                            <PollCard
                                key={poll._id}
                                poll={poll}
                                userId={userId}
                                isAdmin={isAdmin}
                                onVote={handleVote}
                                onDelete={(id) => dispatch(deletePoll(id))}
                                onClose={(id) => dispatch(closePoll(id))}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* CREATE FORM MODAL */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between mb-6">
                            <h2 className="text-lg font-bold">New Poll</h2>
                            <button onClick={() => setShowForm(false)}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input required className="w-full px-3 py-2 border rounded-xl" placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
                            {form.options.map((opt, i) => (
                                <input key={i} required className="w-full px-3 py-2 border rounded-xl" placeholder={`Option ${i + 1}`} value={opt} onChange={e => {
                                    const newOpts = [...form.options];
                                    newOpts[i] = e.target.value;
                                    setForm({ ...form, options: newOpts });
                                }} />
                            ))}
                            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold">Launch</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollsPage;