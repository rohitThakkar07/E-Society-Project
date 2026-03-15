import React, { useState } from "react";

const DiscussionPolls = () => {
  const [activeTab, setActiveTab] = useState("discussions");

  const [discussions] = useState([
    {
      id: 1,
      title: "Proposal for new Gym Equipment",
      author: "Rahul Sharma (A-102)",
      date: "2 days ago",
      replies: 12,
      views: 45,
      tag: "General",
      content:
        "I think we should upgrade the treadmills in the clubhouse. The current ones are breaking down frequently.",
    },
    {
      id: 2,
      title: "Stray Dog Issue near Gate 2",
      author: "Priya Singh (B-505)",
      date: "5 hours ago",
      replies: 8,
      views: 32,
      tag: "Safety",
      content:
        "There are too many stray dogs chasing bikes at night. Can we discuss a humane relocation or shelter plan?",
    },
    {
      id: 3,
      title: "Carpooling for Tech Park",
      author: "Amit Verma (C-301)",
      date: "1 week ago",
      replies: 24,
      views: 110,
      tag: "Transport",
      content:
        "Looking for people traveling to Electronic City daily at 9 AM. Let's share rides!",
    },
  ]);

  const [polls] = useState([
    {
      id: 1,
      question:
        "Should we increase the maintenance fee by 5% for better security?",
      totalVotes: 150,
      options: [
        { label: "Yes, Security is priority", votes: 90, percent: 60 },
        { label: "No, it's already high", votes: 45, percent: 30 },
        { label: "Discuss in AGM first", votes: 15, percent: 10 },
      ],
      userVoted: false,
    },
    {
      id: 2,
      question: "Preferred timing for Swimming Pool cleaning?",
      totalVotes: 85,
      options: [
        { label: "Monday Morning (6-10 AM)", votes: 20, percent: 23 },
        { label: "Tuesday Afternoon (12-4 PM)", votes: 55, percent: 65 },
        { label: "Wednesday Evening", votes: 10, percent: 12 },
      ],
      userVoted: true,
    },
  ]);

  const handleVote = (pollId, optionLabel) => {
    alert(`You voted for: "${optionLabel}"`);
  };

  return (
    <div className="max-w-6xl mx-auto my-12 px-4">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Community Voice</h2>
        <p className="text-gray-500">
          Discuss issues, share ideas, and vote on important society decisions.
        </p>
      </div>

      {/* TABS */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 border rounded-full p-1">
          <button
            onClick={() => setActiveTab("discussions")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "discussions"
                ? "bg-white shadow font-bold"
                : "text-gray-500"
            }`}
          >
            <i className="far fa-comments mr-2"></i>Discussions
          </button>

          <button
            onClick={() => setActiveTab("polls")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === "polls"
                ? "bg-white shadow font-bold"
                : "text-gray-500"
            }`}
          >
            <i className="fas fa-poll mr-2"></i>Active Polls
          </button>
        </div>
      </div>

      {/* DISCUSSIONS TAB */}
      {activeTab === "discussions" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold text-gray-800">Recent Topics</h4>
            <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded">
              <i className="fas fa-plus mr-1"></i> Start New Topic
            </button>
          </div>

          <div className="bg-white shadow-sm rounded divide-y">
            {discussions.map((topic) => (
              <a
                key={topic.id}
                href="#"
                className="block p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between">
                  <h5 className="font-bold text-blue-600">{topic.title}</h5>
                  <small className="text-gray-500">{topic.date}</small>
                </div>

                <p className="text-gray-600 mt-1 truncate max-w-[80%]">
                  {topic.content}
                </p>

                <div className="flex justify-between items-center mt-3">
                  <small className="text-gray-500">
                    <i className="fas fa-user-circle mr-1"></i>
                    {topic.author}
                  </small>

                  <div className="flex items-center gap-4">
                    <span className="text-xs bg-gray-100 border px-2 py-1 rounded">
                      {topic.tag}
                    </span>
                    <small className="text-gray-500">
                      <i className="far fa-comment-dots"></i> {topic.replies}
                    </small>
                    <small className="text-gray-500">
                      <i className="far fa-eye"></i> {topic.views}
                    </small>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* POLLS TAB */}
      {activeTab === "polls" && (
        <div className="grid md:grid-cols-2 gap-6">
          {polls.map((poll) => (
            <div key={poll.id} className="bg-white shadow-sm rounded h-full">
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <span className="bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                    Live Poll
                  </span>
                  <small className="text-gray-500">
                    {poll.totalVotes} Votes
                  </small>
                </div>

                <h5 className="font-bold text-lg mb-6">{poll.question}</h5>

                <div className="space-y-3">
                  {poll.options.map((option, index) => (
                    <div key={index} className="relative">
                      {poll.userVoted && (
                        <div
                          className="absolute inset-0 bg-blue-500/10 rounded"
                          style={{ width: `${option.percent}%` }}
                        ></div>
                      )}

                      <button
                        onClick={() =>
                          !poll.userVoted &&
                          handleVote(poll.id, option.label)
                        }
                        disabled={poll.userVoted}
                        className={`w-full text-left border px-4 py-2 rounded relative ${
                          poll.userVoted
                            ? "bg-gray-100"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between">
                          <span>{option.label}</span>
                          {poll.userVoted && (
                            <span className="font-bold">
                              {option.percent}%
                            </span>
                          )}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>

                {poll.userVoted ? (
                  <p className="text-center text-green-600 mt-4 text-sm">
                    <i className="fas fa-check-circle mr-1"></i>
                    You have already voted
                  </p>
                ) : (
                  <p className="text-center text-gray-500 mt-4 text-sm">
                    Select an option to vote
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionPolls;