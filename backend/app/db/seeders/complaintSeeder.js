const connectDB = require("../config/db");
const Complaint = require("../models/complaintModel");
const Resident = require("../models/residentsModel");

const complaintData = [
  {
    title: "Leaking Pipe in Kitchen",
    description: "The pipe under the kitchen sink is leaking heavily. Need urgent repair.",
    category: "Water",
    priority: "High",
    attachment: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80"
  },
  {
    title: "No Electricity in Hallway",
    description: "The common hallway lights are not working since last evening.",
    category: "Electricity",
    priority: "Medium",
    attachment: "https://images.unsplash.com/photo-1544724569-5f546fa6622d?w=800&q=80"
  },
  {
    title: "Elevator Making Noise",
    description: "Wing B elevator is making a loud grinding noise during operation.",
    category: "Maintenance",
    priority: "High",
    attachment: "https://images.unsplash.com/photo-1516733968668-db3751070cb1?w=800&q=80"
  },
  {
    title: "Security Guard Sleeping",
    description: "Found the night guard sleeping at the main gate around 2 AM.",
    category: "Security",
    priority: "Medium",
    attachment: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=80"
  },
  {
    title: "Garbage Not Collected",
    description: "Housekeeping hasn't collected garbage from my floor for 2 days.",
    category: "Other",
    priority: "Low",
    attachment: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80"
  },
  {
    title: "Low Water Pressure",
    description: "Water pressure is very low in the master bathroom.",
    category: "Water",
    priority: "Medium",
    attachment: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800&q=80"
  },
  {
    title: "Broken Bench in Garden",
    description: "One of the benches in the children's park is broken and unsafe.",
    category: "Maintenance",
    priority: "Low",
    attachment: "https://images.unsplash.com/photo-1518005020251-58296d8f8d48?w=800&q=80"
  },
  {
    title: "Faulty CCTV Camera",
    description: "The CCTV camera near the parking exit seems to be non-functional.",
    category: "Security",
    priority: "High",
    attachment: "https://images.unsplash.com/photo-1557597774-9d2739f05a76?w=800&q=80"
  },
  {
    title: "Gym Equipment Repair",
    description: "The treadmill in the society gym is showing an error code.",
    category: "Maintenance",
    priority: "Medium",
    attachment: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80"
  },
  {
    title: "Pest Control Required",
    description: "Seeing many cockroaches in the basement parking area.",
    category: "Other",
    priority: "Low",
    attachment: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&q=80"
  }
];

const statuses = ["Pending", "In Progress", "Resolved", "Rejected"];

const seedComplaints = async () => {
  try {
    await connectDB();

    // 1. Clear existing complaints
    await Complaint.deleteMany({});
    console.log("Cleared existing complaints.");

    // 2. Get all residents
    const residents = await Resident.find({});
    if (residents.length === 0) {
      console.log("No residents found. Please run seed:residents first.");
      process.exit(1);
    }

    const complaintsToInsert = [];

    // 3. Generate 20 complaints
    for (let i = 0; i < 20; i++) {
        const resident = residents[Math.floor(Math.random() * residents.length)];
        const data = complaintData[i % complaintData.length];
        const status = statuses[i % statuses.length];
        
        complaintsToInsert.push({
            resident: resident._id,
            title: data.title + (i > 10 ? ` (Report ${i})` : ""),
            description: data.description,
            category: data.category,
            status: status,
            priority: data.priority,
            attachment: data.attachment,
            resolvedAt: status === "Resolved" ? new Date() : null,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000) // last 10 days
        });
    }

    await Complaint.insertMany(complaintsToInsert);
    console.log(`${complaintsToInsert.length} Complaints seeded successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding complaints failed:", error);
    process.exit(1);
  }
};

seedComplaints();
