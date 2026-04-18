import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit, FiTrash2, FiPlus, FiEye, FiBarChart2, FiClock, FiXCircle } from "react-icons/fi";
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse h-52" />
          )) }
        </div>
      ) : filtered.length > 0 ? (
        <div className="admin-table-wrap shadow-sm">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Poll Question</th>
                <th>Status</th>
                <th>Votes</th>
                <th>Expires</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((poll) => {
                const expired = isExpiredPoll(poll);
                const totalVotes = (poll.options || []).reduce((sum, opt) => sum + (opt.votes || 0), 0);
                return (
                  <tr key={poll._id} className="hover:bg-slate-50 transition-colors">
                    <td className="max-w-md">
                      <div className="font-bold text-slate-800 leading-tight">{poll.question}</div>
                      <div className="flex gap-2 mt-2">
                        {poll.options?.slice(0, 2).map((o, idx) => (
                          <span key={idx} className="text-[9px] font-bold text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded uppercase">
                            {o.text} ({o.votes})
                          </span>
                        ))}
                        {poll.options?.length > 2 && <span className="text-[9px] font-bold text-slate-300">+{poll.options.length - 2} more</span>}
                      </div>
                    </td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        expired ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
                      }`}>
                        {expired ? "Closed" : "Live"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FiUsers size={12} className="text-slate-400" />
                        <span className="text-xs font-black text-slate-700">{totalVotes}</span>
                      </div>
                    </td>
                    <td className="text-xs font-bold text-slate-500">
                      {new Date(poll.expiresAt).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' })}
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        {!expired && (
                          <button
                            onClick={() => { if (window.confirm("Close poll?")) dispatch(closePoll(poll._id)); }}
                            className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                            title="Close Now"
                          >
                            <FiXCircle size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(poll._id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100">
          <FiBarChart2 size={48} className="mx-auto mb-4 text-gray-200" />
          <h3 className="text-gray-900 font-bold mb-1 uppercase tracking-widest text-sm">No Polls Found</h3>
          <p className="text-gray-400 text-xs font-bold">No records found for the "{filter}" category.</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default PollList;
