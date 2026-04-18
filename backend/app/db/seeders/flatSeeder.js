const connectDB = require("../config/db");
const Flat = require("../models/flatModal");

// 🔹 Real Indian Names (50)
const indianNames = [
  "Ramesh Patel","Amit Shah","Neha Desai","Kiran Joshi","Pooja Mehta",
  "Rahul Trivedi","Sneha Parmar","Vikas Yadav","Anjali Gupta","Suresh Nair",
  "Rajesh Verma","Priya Singh","Nitin Sharma","Kavita Iyer","Deepak Choudhary",
  "Mehul Bhatt","Jignesh Patel","Farhan Pathan","Salman Shaikh","Jyoti Pathan",
  "Harsh Patel","Komal Shah","Bhavesh Patel","Nisha Patel","Hardik Pandya",
  "Ritu Sharma","Manish Gupta","Ayesha Khan","Imran Khan","Sanjay Patel",
  "Hina Sheikh","Tushar Mehta","Alok Mishra","Pankaj Tripathi","Sunita Yadav",
  "Vijay Kumar","Rekha Devi","Arvind Kejriwal","Mukesh Ambani","Gautam Adani",
  "Ravi Shankar","Kajal Agarwal","Rohit Sharma","Virat Kohli","MS Dhoni",
  "Siddharth Malhotra","Kiara Advani","Ranveer Singh","Deepika Padukone","Alia Bhatt"
];

const blocks = ["A", "B", "C"];
const types = ["2BHK", "3BHK", "4BHK"];
const statuses = ["Occupied", "Vacant", "Under Maintenance"];

let phoneBase = 9876500000;

const generateFlats = () => {
  const flats = [];

  for (let i = 1; i <= 50; i++) {
    const wing = blocks[i % blocks.length];
    const type = types[i % types.length];

    let status = statuses[i % statuses.length];

    //  fix logical issue
    let occupancyType = status === "Vacant" ? "Vacant" : (i % 2 === 0 ? "Owner" : "Tenant");

    const name = indianNames[i - 1];

    flats.push({
      flatNumber: `${100 + i}`,
      floor: Math.ceil(i / 5),
      wing,
      type,

      area:
        type === "2BHK" ? 850 :
        type === "3BHK" ? 1200 : 1600,

      owner: {
        name,
        phone: `${phoneBase + i}`,
        email: name.toLowerCase().replace(/ /g, ".") + "@gmail.com"
      },

      status,
      occupancyType,

      monthlyMaintenance:
        type === "2BHK" ? 2200 :
        type === "3BHK" ? 3000 : 4000,
    });
  }

  return flats;
};

const seedFlats = async () => {
  try {
    await connectDB();

    const flats = generateFlats();

    await Flat.deleteMany();
    console.log("🗑️ Old flats removed");

    await Flat.insertMany(flats);

    console.log(" 50 Flats Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(" Seeder Error:", error);
    process.exit(1);
  }
};

seedFlats();