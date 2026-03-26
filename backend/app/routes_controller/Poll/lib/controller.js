const Poll = require("../../../db/models/pollModal");

const createPoll = async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;
    if (!question || !options || options.length < 2 || !expiresAt)
      return res.status(400).json({ success: false, message: "question, at least 2 options and expiresAt are required." });
    const poll = await Poll.create({
      question,
      expiresAt,
      options: options.map(text => ({ text, votes: 0, votedBy: [] })),
    });
    res.status(201).json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllPolls = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";
    const polls = await Poll.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: polls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });
    res.json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const castVote = async (req, res) => {
  try {
    const { optionIndex, residentId } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });
    if (!poll.isActive || new Date() > new Date(poll.expiresAt))
      return res.status(400).json({ success: false, message: "This poll has expired or is inactive." });
    // Check if already voted
    const alreadyVoted = poll.options.some(o => o.votedBy.includes(residentId));
    if (alreadyVoted)
      return res.status(400).json({ success: false, message: "You have already voted in this poll." });
    if (optionIndex < 0 || optionIndex >= poll.options.length)
      return res.status(400).json({ success: false, message: "Invalid option." });
    poll.options[optionIndex].votes += 1;
    poll.options[optionIndex].votedBy.push(residentId);
    poll.totalVotes += 1;
    await poll.save();
    res.json({ success: true, data: poll, message: "Vote recorded!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!poll) return res.status(404).json({ success: false, message: "Poll not found" });
    res.json({ success: true, data: poll, message: "Poll closed." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deletePoll = async (req, res) => {
  try {
    await Poll.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Poll deleted." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createPoll, getAllPolls, getPollById, castVote, closePoll, deletePoll };