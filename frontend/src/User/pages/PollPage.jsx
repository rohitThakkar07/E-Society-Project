import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BarChart2, Plus, X, CheckCircle, Clock,
    Users, Trash2, Lock, ChevronRight, UserCheck
} from "lucide-react";
import {
    fetchPolls,
    createPoll,
    castVote,
    deletePoll,
    closePoll
} from "../../store/slices/pollSlice";

// --- Style Helpers ---
const COLORS = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500"];
const LIGHT_COLORS = ["bg-blue-50/50 border-blue-200", "bg-violet-50/50 border-violet-200", "bg-emerald-50/50 border-emerald-200", "bg-amber-50/50 border-amber-200", "bg-rose-50/50 border-rose-200", "bg-cyan-50/50 border-cyan-200"];
const TEXT_COLORS = ["text-blue-700", "text-violet-700", "text-emerald-700", "text-amber-700", "text-rose-700", "text-cyan-700"];

const getTotalVotes = (poll) => (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);
const getPercent = (votes, total) => total === 0 ? 0 : Math.round((votes / total) * 100);

// --- Poll Card Component ---
const PollCard = ({ poll, userId, isAdmin, onVote, onDelete, onClose }) => {
    const totalVotes = getTotalVotes(poll);
    
    // ✅ Logic 1: Determine if poll is expired by date OR status
    const isExpiredByDate = poll.expiresAt && new Date(poll.expiresAt) < new Date();
    const isClosed = poll.isActive === false || isExpiredByDate;

    // ✅ Logic 2: Identify if user has already voted
    const votedOptionIndex = useMemo(() => {
        return (poll.options || []).findIndex(opt => opt.votedBy?.includes(userId));
    }, [poll.options, userId]);

    const hasVoted = votedOptionIndex !== -1;

    // A user can only click/vote if the poll is NOT closed and they HAVEN'T voted yet
    const canVote = !isClosed && !hasVoted;

    return (
        <div className={`bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col h-full transition-all 
            ${isClosed ? "opacity-80 grayscale-[0.2]" : "hover:shadow-md border-slate-100"}`}>
            
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        {isClosed ? (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">
                                <Lock size={10} /> {isExpiredByDate ? "Expired" : "Closed"}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                            </span>
                        )}
                        {hasVoted && !isClosed && (
                            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600">
                                Voted
                            </span>
                        )}
                    </div>

                    {isAdmin && (
                        <div className="flex gap-1">
                            {!isClosed && (
                                <button onClick={() => onClose(poll._id)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition">
                                    <Lock size={14} />
                                </button>
                            )}
                            <button onClick={() => onDelete(poll._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2">{poll.question}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{poll.description || "Community opinion poll."}</p>
            </div>

            <div className="px-6 pb-6 space-y-2.5 mt-auto">
                {poll.options.map((opt, idx) => {
                    const pct = getPercent(opt.votes || 0, totalVotes);
                    const isUserChoice = votedOptionIndex === idx;
                    
                    // Show results if poll is closed OR if user has already voted
                    const showResults = isClosed || hasVoted;

                    return showResults ? (
                        /* ✅ RESULT VIEW: Colored based on selection */
                        <div key={idx} className={`relative rounded-2xl border transition-all overflow-hidden ${
                            isUserChoice 
                            ? "bg-blue-50 border-blue-200 ring-1 ring-blue-100" 
                            : "bg-slate-50 border-slate-100"
                        }`}>
                            <div 
                                className={`absolute top-0 left-0 h-full transition-all duration-1000 opacity-20 ${
                                    isUserChoice ? "bg-blue-500" : COLORS[idx % COLORS.length]
                                }`} 
                                style={{ width: `${pct}%` }} 
                            />
                            <div className="relative flex items-center justify-between px-4 py-3.5">
                                <span className={`text-sm font-bold flex items-center gap-2 ${isUserChoice ? "text-blue-700" : "text-slate-600"}`}>
                                    {isUserChoice && <UserCheck size={14} className="text-blue-600" />}
                                    {opt.text}
                                </span>
                                <span className={`text-xs font-black ${isUserChoice ? "text-blue-600" : "text-slate-400"}`}>
                                    {pct}%
                                </span>
                            </div>
                        </div>
                    ) : (
                        /* ✅ VOTE BUTTON: Only interactive if canVote is true */
                        <button
                            key={idx}
                            disabled={!canVote}
                            onClick={() => onVote(poll._id, idx)}
                            className={`w-full text-left px-5 py-3.5 rounded-2xl border transition-all text-sm font-bold active:scale-[0.98]
                                ${canVote 
                                    ? "border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50" 
                                    : "border-slate-100 text-slate-300 cursor-not-allowed"
                                }`}
                        >
                            {opt.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Main Page ---
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

    useEffect(() => { dispatch(fetchPolls()); }, [dispatch]);

   const filteredPolls = useMemo(() => {
    return polls.filter(p => {
        const isExpiredByDate = p.expiresAt && new Date(p.expiresAt) < new Date();
        const isActuallyActive = p.isActive && !isExpiredByDate;

        if (tab === "active") return isActuallyActive;
        if (tab === "closed") return !isActuallyActive;
        return true;
    });
}, [polls, tab]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const validOptions = form.options.filter(o => o.trim());
        if (validOptions.length < 2) return;
        await dispatch(createPoll({ ...form, options: validOptions.map(text => ({ text, votes: 0 })) }));
        setShowForm(false);
        setForm({ question: "", description: "", options: ["", ""] });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <BarChart2 className="text-blue-600" size={32} /> Discussions & Polls
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Participate in community decision making.</p>
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">
                            <Plus size={20} /> Create New Poll
                        </button>
                    )}
                </div>

                {/* Tab Switcher */}
                <div className="inline-flex p-1.5 bg-white border border-slate-200 rounded-2xl mb-10 shadow-sm">
                    {["active", "closed"].map((t) => (
                        <button key={t} onClick={() => setTab(t)} className={`px-8 py-2.5 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${tab === t ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-400 hover:text-slate-600"}`}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <div key={i} className="h-80 bg-white rounded-[32px] animate-pulse border border-slate-100" />)}
                    </div>
                ) : filteredPolls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPolls.map(poll => (
                            <PollCard key={poll._id} poll={poll} userId={userId} isAdmin={isAdmin} 
                                onVote={(id, optionIndex) => dispatch(castVote({ id, data: { optionIndex } }))}
                                onDelete={(id) => window.confirm("Delete?") && dispatch(deletePoll(id))}
                                onClose={(id) => window.confirm("Close?") && dispatch(closePoll(id))}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-[40px] border border-slate-100">
                        <BarChart2 size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No {tab} polls found</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="font-black text-slate-800 uppercase tracking-tight">Launch Society Poll</h2>
                            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white rounded-xl transition text-slate-400"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-8 space-y-5">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Question</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 ring-blue-100" placeholder="e.g. Best time for Holi event?" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 block">Options</label>
                                {form.options.map((opt, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input required className="flex-1 px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-medium outline-none" placeholder={`Option ${i + 1}`} value={opt} onChange={e => {
                                            const n = [...form.options]; n[i] = e.target.value; setForm({ ...form, options: n });
                                        }} />
                                        {form.options.length > 2 && <button type="button" onClick={() => setForm({ ...form, options: form.options.filter((_, idx) => idx !== i) })} className="text-slate-300 hover:text-red-500"><X size={16} /></button>}
                                    </div>
                                ))}
                                {form.options.length < 6 && <button type="button" onClick={() => setForm({ ...form, options: [...form.options, ""] })} className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1 mt-2 tracking-widest"><Plus size={12} /> Add Choice</button>}
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100 mt-4 active:scale-95 transition-all">Broadcast Poll</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PollsPage;