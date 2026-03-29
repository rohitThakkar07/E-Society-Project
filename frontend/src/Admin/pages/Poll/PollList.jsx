import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiBarChart2, FiClock, FiXCircle } from "react-icons/fi";
import { fetchPolls, closePoll, deletePoll } from "../../../store/slices/pollSlice";

const PollList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const polls = useSelector((state) => state.polls?.list ?? []);
const loading = useSelector((state) => state.polls?.loading ?? false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchPolls());
  }, [dispatch]);

  // ✅ Helper to check expiry robustly
  const isExpiredPoll = (poll) => {
    if (!poll) return true;
    const now = new Date();
    const expiryDate = new Date(poll.expiresAt);
    return poll.isActive === false || expiryDate <= now;
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-52" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((poll) => {
            const expired = isExpiredPoll(poll);
            const winner = expired ? getWinner(poll) : null;
            const totalVotes = poll.totalVotes || 0;

            return (
              <div key={poll._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        expired ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
                      }`}>
                        {expired ? "Closed" : "Live"}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {totalVotes} Total Votes
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/poll/${poll._id}`)}
                        className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <FiEye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(poll._id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-800 text-lg mb-6 leading-tight">
                    {poll.question}
                  </h3>

                  <div className="space-y-4">
                    {poll.options?.map((opt, i) => {
                      const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                      const isWinner = winner && opt.text === winner.text && expired;

                      return (
                        <div key={i}>
                          <div className="flex justify-between text-xs font-bold mb-1.5">
                            <span className={isWinner ? "text-green-700" : "text-gray-600"}>
                              {isWinner && "🏆 "}{opt.text}
                            </span>
                            <span className="text-gray-400">{pct}%</span>
                          </div>
                          <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                isWinner ? "bg-green-500" : "bg-indigo-500"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <FiClock size={12} />
                    <span>Expires: {new Date(poll.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                  </div>
                  {!expired && (
                    <button
                      onClick={() => { if (window.confirm("Close poll?")) dispatch(closePoll(poll._id)); }}
                      className="text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <FiXCircle size={12} /> Close Now
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-2xl p-16 text-center border border-gray-100">
            <FiBarChart2 size={48} className="mx-auto mb-4 text-gray-200" />
            <h3 className="text-gray-900 font-bold mb-1">No Polls Found</h3>
            <p className="text-gray-400 text-sm">No records found for the "{filter}" category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollList;