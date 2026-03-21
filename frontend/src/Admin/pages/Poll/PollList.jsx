import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, closePoll, deletePoll } from "../../../store/slices/pollSlice";

const PollList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: polls, loading } = useSelector((s) => s.poll) ?? {};
  const [filter, setFilter] = useState("All");

  useEffect(() => { dispatch(fetchPolls()); }, [dispatch]);

  const filtered = useMemo(() =>
    (polls || []).filter((p) => {
      if (filter === "Active")   return p.isActive && new Date(p.expiresAt) > new Date();
      if (filter === "Expired")  return !p.isActive || new Date(p.expiresAt) <= new Date();
      return true;
    }), [polls, filter]);

  const getWinner = (poll) => {
    if (!poll.options.length) return null;
    return poll.options.reduce((a, b) => a.votes > b.votes ? a : b);
  };

  const isExpired = (poll) => !poll.isActive || new Date(poll.expiresAt) <= new Date();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Polls & Voting</h1>
          <p className="text-sm text-gray-500">Community polls and decision making</p>
        </div>
        <button onClick={() => navigate("/admin/poll/create")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium self-start">
          + Create Poll
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-3">
        {["All","Active","Expired"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-xl p-6 animate-pulse h-32"/>)
        ) : filtered.length > 0 ? (
          filtered.map((poll) => {
            const expired = isExpired(poll);
            const winner  = expired ? getWinner(poll) : null;
            return (
              <div key={poll._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${expired ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"}`}>
                        {expired ? "Closed" : "Active"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-3">{poll.question}</h3>

                    {/* Options with vote bars */}
                    <div className="space-y-2">
                      {poll.options.map((opt, i) => {
                        const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                        const isWinner = winner && opt.text === winner.text && expired;
                        return (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className={`font-medium ${isWinner ? "text-green-700" : "text-gray-700"}`}>
                                {isWinner && "🏆 "}{opt.text}
                              </span>
                              <span className="text-gray-400">{opt.votes} ({pct}%)</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${isWinner ? "bg-green-500" : "bg-indigo-400"}`}
                                style={{ width: `${pct}%` }}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-xs text-gray-400 mt-3">
                      Expires: {new Date(poll.expiresAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => navigate(`/admin/poll/${poll._id}`)} className="text-indigo-600 hover:underline text-sm">View</button>
                    {!expired && (
                      <button onClick={() => { if (window.confirm("Close this poll?")) dispatch(closePoll(poll._id)); }}
                        className="text-yellow-600 hover:underline text-sm">Close</button>
                    )}
                    <button onClick={() => { if (window.confirm("Delete this poll?")) dispatch(deletePoll(poll._id)); }}
                      className="text-red-500 hover:underline text-sm">Delete</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-sm">No polls found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollList;