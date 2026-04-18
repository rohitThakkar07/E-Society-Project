const connectDB = require("../config/db");
const Poll = require("../models/pollModal");
const User = require("../models/userModel");
const Resident = require("../models/residentsModel");

const pollQuestions = [
  {
    question: "Which theme should we have for the Annual Day?",
    options: ["Bollywood Night", "Traditional Village", "Neon Glow", "Masquerade"]
  },
  {
    question: "Preferred time for the next General Body Meeting (GBM)?",
    options: ["Saturday morning", "Saturday evening", "Sunday morning", "Sunday evening"]
  },
  {
    question: "Should we install more CCTV cameras in the basement?",
    options: ["Yes, immediately", "Maybe, check budget first", "No, existing are enough"]
  },
  {
    question: "Rating for the new Housekeeping Agency?",
    options: ["Excellent", "Good", "Average", "Poor"]
  },
  {
    question: "Which new equipment should we add to the gym?",
    options: ["Cross Trainer", "Squat Rack", "Yoga Mats", "Leg Press"]
  },
  {
    question: "Should we allow food delivery bikes up to the wing entrance?",
    options: ["Yes", "Only during rains", "No, keep at main gate"]
  },
  {
    question: "Best date for the Holi celebration?",
    options: ["On the actual day", "On the following Sunday", "Both days"]
  },
  {
    question: "Do you support the proposed hike in maintenance for Solar Panels?",
    options: ["Yes, great idea", "Yes, but lower hike", "No, not interested"]
  },
  {
    question: "Preferred location for the new kids play area?",
    options: ["Behind Wing A", "Near Main Gate", "Existing garden area"]
  },
  {
    question: "Frequency of pest control service?",
    options: ["Every Month", "Every 2 Months", "Quarterly"]
  }
];

const seedPolls = async () => {
  try {
    await connectDB();

    // 1. Clear existing polls
    await Poll.deleteMany({});
    console.log("🗑️ Cleared existing polls.");

    // 2. Get an admin user and some residents for votes
    const admin = await User.findOne({ role: "admin" });
    const residents = await Resident.find({}).limit(10);

    const pollsToInsert = [];

    // 3. Generate 20 polls
    for (let i = 0; i < 20; i++) {
        const data = pollQuestions[i % pollQuestions.length];
        
        const options = data.options.map(opt => ({
            text: opt,
            votes: 0,
            votedBy: []
        }));

        // Add some random votes to the first few residents
        if (residents.length > 0) {
            const numVotes = Math.floor(Math.random() * residents.length);
            for (let v = 0; v < numVotes; v++) {
                const optIndex = Math.floor(Math.random() * options.length);
                options[optIndex].votes += 1;
                options[optIndex].votedBy.push(residents[v]._id);
            }
        }

        const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

        pollsToInsert.push({
            question: data.question + (i >= 10 ? ` (V${Math.floor(i/10)+1})` : ""),
            options,
            createdBy: admin ? admin._id : null,
            expiresAt: new Date(Date.now() + 15 * 86400000), // 15 days from now
            isActive: true,
            totalVotes
        });
    }

    await Poll.insertMany(pollsToInsert);
    console.log(`✅ ${pollsToInsert.length} Polls seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding polls failed:", error);
    process.exit(1);
  }
};

seedPolls();
