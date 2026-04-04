import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPolls, castVote } from "../../store/slices/pollSlice";
import { fetchEvents } from "../../store/slices/eventSlice";

const DiscussionPolls = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("discussions");

  const { list: polls = [], loading: pollLoading } = useSelector((state) => state.poll);
  const { events = [], loading: eventLoading } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(fetchPolls());
    dispatch(fetchEvents());
  }, [dispatch]);

  const upcomingEvents = useMemo(() => {
    return (events || [])
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  const pastEvents = useMemo(() => {
    return (events || [])
      .filter((e) => new Date(e.date) < new Date())
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events]);

  const getTotalVotes = (poll) => (poll.options || []).reduce((sum, o) => sum + (o.votes || 0), 0);

  const handleVote = async (pollId, optionIndex) => {
    await dispatch(castVote({ id: pollId, data: { optionIndex } }));
  };

  return (
    <div className="max-w-6xl mx-auto my-8 sm:my-12 px-4 min-h-[60vh] text-[var(--text)]">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[var(--text)]">Community Voice</h2>
        <p className="text-[var(--text-muted)]">
          Discuss issues, share ideas, and vote on important society decisions.
        </p>
      </div>

      {/* TABS */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-[var(--accent-bg)] border border-[var(--border)] rounded-full p-1">
          <button
            type="button"
            onClick={() => setActiveTab("discussions")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "discussions"
                ? "bg-[var(--card)] shadow font-bold text-[var(--text)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            <i className="far fa-comments mr-2"></i>Discussions
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("polls")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "polls"
                ? "bg-[var(--card)] shadow font-bold text-[var(--text)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            <i className="fas fa-poll mr-2"></i>Active Polls
          </button>
        </div>
      </div>

      {/* DISCUSSIONS TAB -- using real event data */}
      {activeTab === "discussions" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">Event Bulletin</h4>
            <span className="text-sm text-gray-500">{upcomingEvents.length} upcoming · {pastEvents.length} past</span>
          </div>

          {eventLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : ( 
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map((ev) => (
                <div key={ev._id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-blue-600 font-bold">{ev.title}</h5>
                      <p className="text-xs text-slate-400">{new Date(ev.date).toLocaleDateString()} {ev.time ? `• ${ev.time}` : ""}</p>
                    </div>
                    <span className="text-[10px] uppercase text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">Upcoming</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{ev.description || "No description provided."}</p>
                  <div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-2">
                    {ev.location && <span>📍 {ev.location}</span>}
                    {ev.organizer && <span>👤 {ev.organizer}</span>}
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 bg-white rounded-2xl p-6 text-center">No upcoming events yet.</p>
              )}

              {pastEvents.length > 0 && (
                <div>
                  <h6 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Past Events</h6>
                  <div className="grid md:grid-cols-2 gap-3">
                    {pastEvents.slice(0, 4).map((ev) => (
                      <div key={ev._id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <p className="text-xs text-slate-500"><span className="font-semibold">{new Date(ev.date).toLocaleDateString()}</span> {ev.time ? `• ${ev.time}` : ""}</p>
                        <p className="font-semibold text-slate-700">{ev.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* POLLS TAB */}
      {activeTab === "polls" && (
        <div>
          {pollLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
              ))}
            </div>
          ) : polls?.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {polls.map((poll) => {
                const totalVotes = getTotalVotes(poll);
                const userId = JSON.parse(localStorage.getItem("userData") || "{}").profileId;
                const hasVoted = (poll.options || []).some((opt) => opt.votedBy?.includes(userId));

                return (
                  <div key={poll._id} className="bg-white shadow-sm rounded h-full">
                    <div className="p-6">
                      <div className="flex justify-between mb-4">
                        <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                          Live Poll
                        </span>
                        <small className="text-gray-500">{totalVotes} Votes</small>
                      </div>

                      <h5 className="font-bold text-lg mb-6">{poll.question}</h5>

                      <div className="space-y-3">
                        {(poll.options || []).map((option, index) => {
                          const pct = totalVotes ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0;
                          return (
                            <button
                              key={index}
                              onClick={() => !hasVoted && handleVote(poll._id, index)}
                              disabled={hasVoted}
                              className={`w-full text-left border border-[var(--border)] px-4 py-2 rounded relative ${hasVoted ? "bg-[var(--accent-bg)]" : "hover:bg-[var(--accent-soft)]"}`}
                            >
                              <div className="flex justify-between">
                                <span>{option.text || option.label}</span>
                                <span className="font-bold">{pct}%</span>
                              </div>
                              {hasVoted && (
                                <div className="h-1.5 mt-2 bg-blue-400 rounded" style={{ width: `${pct}%` }} />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <p className={`text-center mt-4 text-sm ${hasVoted ? "text-green-600" : "text-gray-500"}`}>
                        {hasVoted ? "Thanks for voting!" : "Cast your vote to view results."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center py-10 text-gray-500 bg-white rounded-2xl border border-slate-200">No polls available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscussionPolls;