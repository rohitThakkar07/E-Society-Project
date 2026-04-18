import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiBarChart2, FiClock, FiXCircle, FiUsers } from "react-icons/fi";
import { fetchPolls, closePoll, deletePoll } from "../../../store/slices/pollSlice";

const PollList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const polls = useSelector((state) => state.poll?.list ?? []);
  const loading = useSelector((state) => state.poll?.loading ?? false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  // ✅ Helper to check expiry robustly
  const isExpiredPoll = (poll) => {
    if (!poll) return true;
    if (poll.isActive === false) return true;
    if (!poll.expiresAt) return false;
    const now = new Date();
    const expiryDate = new Date(poll.expiresAt);
    if (Number.isNaN(expiryDate.getTime())) return false;
    return expiryDate <= now;
  };

  // ✅ Filtering logic
  const filtered = useMemo(() => {
    if (!polls || polls.length === 0) return [];
    if (filter === "All") return polls;
    return polls.filter((p) => {
      const expired = isExpiredPoll(p);
      if (filter === "Active") return !expired;
      if (filter === "Expired") return expired;
      return true;
    });
  }, [polls, filter]);

  const getWinner = (poll) => {
    if (!poll.options || poll.options.length === 0) return null;
    return poll.options.reduce((a, b) => (a.votes > b.votes ? a : b));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this poll? This cannot be undone.")) {
      dispatch(deletePoll(id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <FiBarChart2 className="text-indigo-600" /> Polls & Voting
          </h1>
          <p className="text-sm text-gray-500">Engage residents with community polls and decision making.</p>
        </div>
        <button
          onClick={() => navigate("/admin/poll/create")}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
        >
          <FiPlus /> Create Poll
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-8 w-fit flex gap-1">
        {["All", "Active", "Expired"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* POLL CARDS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100 animate-pulse h-64 shadow-sm" />
          )) }
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((poll) => {
            const expired = isExpiredPoll(poll);
            const totalVotes = (poll.options || []).reduce((sum, opt) => sum + (opt.votes || 0), 0);
            const winner = getWinner(poll);

            return (
              <div key={poll._id} className="group relative bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/50 hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                {/* BACKGROUND ACCENT */}
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 transition-colors ${expired ? 'bg-gray-400' : 'bg-indigo-500'}`} />
                
                <div>
                  {/* STATUS & DATE */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      expired ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-700"
                    }`}>
                      {expired ? "Closed" : "Active"}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                      <FiClock size={12} />
                      {new Date(poll.expiresAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                    </div>
                  </div>

                  {/* QUESTION */}
                  <h3 className="text-lg font-bold text-gray-900 leading-tight mb-6 group-hover:text-indigo-600 transition-colors">
                    {poll.question}
                  </h3>

                  {/* OPTIONS & PROGRESS */}
                  <div className="space-y-4 mb-8">
                    {poll.options?.map((opt, idx) => {
                      const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      const isWinner = winner && winner._id === opt._id && totalVotes > 0;
                      
                      return (
                        <div key={idx} className="relative">
                          <div className="flex justify-between items-center text-[11px] font-bold mb-1.5">
                            <span className={isWinner ? "text-indigo-600" : "text-gray-600"}>
                              {opt.text}
                            </span>
                            <span className="text-gray-400">{percentage}% ({opt.votes})</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                isWinner ? "bg-indigo-600" : "bg-indigo-200"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <FiUsers size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 leading-none uppercase tracking-tighter">Total Participation</p>
                      <p className="text-sm font-black text-gray-800 leading-none mt-1">{totalVotes}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {!expired && (
                      <button
                        onClick={() => { if (window.confirm("Close poll now?")) dispatch(closePoll(poll._id)); }}
                        className="p-2.5 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all active:scale-90"
                        title="Close Early"
                      >
                        <FiXCircle size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(poll._id)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-90"
                      title="Delete Poll"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-20 text-center border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiBarChart2 size={40} />
          </div>
          <h3 className="text-gray-900 font-black mb-2 uppercase tracking-widest text-sm">No Polls Found</h3>
          <p className="text-gray-400 text-xs font-bold max-w-xs mx-auto">
            You haven't posted any polls for the "{filter}" category yet. Use the button above to start engaging with residents.
          </p>
        </div>
      )}
    </div>
  );
};

export default PollList;
