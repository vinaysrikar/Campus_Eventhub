const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Event = require("./models/Event");

const seedEvents = [
  // ── CSE (4 events) ──────────────────────────────────────────
  {
    title: "HackFusion 2026",
    description: "A 36-hour national level hackathon bringing together the brightest minds to solve real-world problems using cutting-edge technology. Build innovative solutions, win exciting prizes, and network with industry leaders.",
    department: "CSE",
    date: "2026-04-20",
    time: "09:00 AM",
    venue: "Main Auditorium",
    organizer: "Dr. Priya Sharma",
    maxCapacity: 300,
    status: "upcoming",
    tags: ["Hackathon", "Coding", "Innovation"],
    featured: true,
  },
  {
    title: "AI/ML Bootcamp",
    description: "Intensive 3-day bootcamp covering machine learning fundamentals, deep learning architectures, and practical AI applications with hands-on projects using TensorFlow and PyTorch.",
    department: "CSE",
    date: "2026-04-25",
    time: "10:00 AM",
    venue: "CS Lab Complex",
    organizer: "Prof. Rajesh Kumar",
    maxCapacity: 200,
    status: "upcoming",
    tags: ["AI", "Machine Learning", "Bootcamp"],
    featured: false,
  },
  {
    title: "Web Dev Summit",
    description: "A full-day conference featuring talks on React, Next.js, Node.js, and modern full-stack development practices. Includes live coding sessions and portfolio reviews.",
    department: "CSE",
    date: "2026-05-02",
    time: "09:30 AM",
    venue: "Seminar Hall B",
    organizer: "Ms. Anitha R.",
    maxCapacity: 250,
    status: "upcoming",
    tags: ["Web Development", "React", "Full Stack"],
    featured: false,
  },
  {
    title: "Competitive Programming Contest",
    description: "Test your algorithmic problem-solving skills in this intense 5-hour coding contest. Problems range from beginner to advanced level with exciting prizes for the top performers.",
    department: "CSE",
    date: "2026-05-10",
    time: "02:00 PM",
    venue: "Computer Center",
    organizer: "Mr. Vikram S.",
    maxCapacity: 150,
    status: "upcoming",
    tags: ["Coding", "Algorithms", "Competition"],
    featured: false,
  },

  // ── ECE (4 events) ──────────────────────────────────────────
  {
    title: "CircuitCraft Workshop",
    description: "Hands-on workshop on advanced PCB design, circuit simulation, and IoT integration with real-world applications. Learn to design and fabricate your own circuit boards.",
    department: "ECE",
    date: "2026-04-22",
    time: "10:00 AM",
    venue: "ECE Lab Block",
    organizer: "Dr. Suresh M.",
    maxCapacity: 120,
    status: "upcoming",
    tags: ["Workshop", "IoT", "Hardware"],
    featured: true,
  },
  {
    title: "VLSI Design Workshop",
    description: "Explore VLSI chip design methodologies with hands-on experience using industry-standard EDA tools. Covers RTL design, synthesis, and physical design flow.",
    department: "ECE",
    date: "2026-04-28",
    time: "10:00 AM",
    venue: "VLSI Lab",
    organizer: "Prof. Lakshmi N.",
    maxCapacity: 80,
    status: "upcoming",
    tags: ["VLSI", "Workshop", "Chip Design"],
    featured: false,
  },
  {
    title: "Embedded Systems Hackathon",
    description: "24-hour hackathon focused on building innovative embedded systems projects using Arduino, Raspberry Pi, and ESP32 platforms. Industry mentors will guide teams throughout.",
    department: "ECE",
    date: "2026-05-05",
    time: "08:00 AM",
    venue: "ECE Seminar Hall",
    organizer: "Mr. Arjun K.",
    maxCapacity: 100,
    status: "upcoming",
    tags: ["Embedded", "Arduino", "Hackathon"],
    featured: false,
  },
  {
    title: "5G & Beyond Symposium",
    description: "National symposium exploring the latest advancements in 5G communication, antenna design, and future wireless technologies. Features keynotes from telecom industry experts.",
    department: "ECE",
    date: "2026-05-12",
    time: "09:30 AM",
    venue: "Conference Hall",
    organizer: "Ms. Divya P.",
    maxCapacity: 200,
    status: "upcoming",
    tags: ["5G", "Communication", "Symposium"],
    featured: false,
  },

  // ── MECH (4 events) ─────────────────────────────────────────
  {
    title: "RoboWars Championship",
    description: "Inter-college robotics competition featuring battle bots, line followers, and autonomous navigation challenges. Build, compete, and showcase your engineering prowess!",
    department: "MECH",
    date: "2026-04-21",
    time: "11:00 AM",
    venue: "Mechanical Workshop",
    organizer: "Dr. Arun B.",
    maxCapacity: 200,
    status: "upcoming",
    tags: ["Robotics", "Competition", "Engineering"],
    featured: true,
  },
  {
    title: "AutoExpo Technical Fest",
    description: "Annual technical festival showcasing automobile innovations, EV prototypes, 3D-printed models, and advanced manufacturing techniques with live demonstrations.",
    department: "MECH",
    date: "2026-04-30",
    time: "10:00 AM",
    venue: "Open Ground",
    organizer: "Prof. Kavitha S.",
    maxCapacity: 500,
    status: "upcoming",
    tags: ["TechFest", "Automobile", "Exhibition"],
    featured: false,
  },
  {
    title: "CAD/CAM Workshop",
    description: "Learn advanced 3D modeling, simulation, and CNC programming using SolidWorks and CATIA. Includes hands-on sessions on CNC machining and rapid prototyping.",
    department: "MECH",
    date: "2026-05-08",
    time: "09:00 AM",
    venue: "CAD Lab",
    organizer: "Mr. Ravi T.",
    maxCapacity: 60,
    status: "upcoming",
    tags: ["CAD", "CAM", "Workshop"],
    featured: false,
  },
  {
    title: "Thermal Engineering Seminar",
    description: "Expert seminar covering heat transfer analysis, HVAC system design, and renewable thermal energy systems. Includes case studies from leading thermal engineering firms.",
    department: "MECH",
    date: "2026-05-15",
    time: "02:00 PM",
    venue: "Seminar Hall C",
    organizer: "Ms. Sneha G.",
    maxCapacity: 120,
    status: "upcoming",
    tags: ["Thermal", "Seminar", "HVAC"],
    featured: false,
  },

  // ── CIVIL (4 events) ────────────────────────────────────────
  {
    title: "Bridge Building Contest",
    description: "Design and build model bridges tested for load-bearing capacity. Combines creativity with structural engineering principles. Open to teams of 2-4 students.",
    department: "CIVIL",
    date: "2026-04-23",
    time: "02:00 PM",
    venue: "Civil Engineering Lab",
    organizer: "Dr. Ramya K.",
    maxCapacity: 100,
    status: "upcoming",
    tags: ["Design", "Structural", "Contest"],
    featured: true,
  },
  {
    title: "Smart City Hackathon",
    description: "Collaborative hackathon focused on developing innovative solutions for urban infrastructure challenges including traffic management, waste disposal, and water conservation.",
    department: "CIVIL",
    date: "2026-05-01",
    time: "09:00 AM",
    venue: "Innovation Center",
    organizer: "Prof. Ganesh M.",
    maxCapacity: 120,
    status: "upcoming",
    tags: ["Hackathon", "Smart City", "Urban"],
    featured: false,
  },
  {
    title: "GIS & Remote Sensing Workshop",
    description: "Hands-on workshop on Geographic Information Systems, satellite imagery analysis, and drone-based surveying techniques for modern civil engineering projects.",
    department: "CIVIL",
    date: "2026-05-06",
    time: "10:00 AM",
    venue: "GIS Lab",
    organizer: "Mr. Karthik S.",
    maxCapacity: 80,
    status: "upcoming",
    tags: ["GIS", "Remote Sensing", "Workshop"],
    featured: false,
  },
  {
    title: "Sustainable Construction Expo",
    description: "Exhibition showcasing green building materials, eco-friendly construction techniques, and sustainable architecture designs. Features industry expert panel discussions.",
    department: "CIVIL",
    date: "2026-05-14",
    time: "11:00 AM",
    venue: "Exhibition Hall",
    organizer: "Ms. Pooja R.",
    maxCapacity: 200,
    status: "upcoming",
    tags: ["Sustainability", "Green Building", "Expo"],
    featured: false,
  },

  // ── EEE (4 events) ──────────────────────────────────────────
  {
    title: "Power Systems Symposium",
    description: "National symposium on renewable energy systems, smart grids, and the future of power distribution. Features keynotes from leading power sector professionals.",
    department: "EEE",
    date: "2026-04-24",
    time: "09:30 AM",
    venue: "Seminar Hall A",
    organizer: "Dr. Sanjay P.",
    maxCapacity: 150,
    status: "upcoming",
    tags: ["Symposium", "Energy", "Sustainability"],
    featured: true,
  },
  {
    title: "Green Energy Expo",
    description: "Exhibition and seminar on solar panels, wind energy, battery storage innovations, and electric vehicle charging infrastructure. Live demonstrations of solar installations.",
    department: "EEE",
    date: "2026-05-03",
    time: "11:00 AM",
    venue: "Exhibition Hall",
    organizer: "Prof. Deepa L.",
    maxCapacity: 250,
    status: "upcoming",
    tags: ["Expo", "Green Energy", "Innovation"],
    featured: false,
  },
  {
    title: "Electric Vehicle Design Challenge",
    description: "Inter-college competition to design and prototype EV motor controllers. Teams will build working motor drive circuits and compete on efficiency and performance metrics.",
    department: "EEE",
    date: "2026-05-09",
    time: "10:00 AM",
    venue: "EEE Lab Block",
    organizer: "Mr. Harish K.",
    maxCapacity: 100,
    status: "upcoming",
    tags: ["EV", "Motor Design", "Competition"],
    featured: false,
  },
  {
    title: "PLC & Automation Workshop",
    description: "Industrial automation workshop covering PLC programming, SCADA systems, and Industry 4.0 concepts. Hands-on training with Siemens and Allen Bradley controllers.",
    department: "EEE",
    date: "2026-05-16",
    time: "09:00 AM",
    venue: "Automation Lab",
    organizer: "Ms. Revathi S.",
    maxCapacity: 80,
    status: "upcoming",
    tags: ["PLC", "Automation", "Workshop"],
    featured: false,
  },

  // ── IT (4 events) ───────────────────────────────────────────
  {
    title: "CyberSec Summit",
    description: "Deep dive into cybersecurity threats, ethical hacking demonstrations, CTF challenges, and network defense strategies. Learn from certified security professionals.",
    department: "IT",
    date: "2026-04-26",
    time: "10:00 AM",
    venue: "IT Seminar Hall",
    organizer: "Dr. Ashwin R.",
    maxCapacity: 180,
    status: "upcoming",
    tags: ["Security", "Hacking", "Network"],
    featured: true,
  },
  {
    title: "Cloud Computing Workshop",
    description: "Learn to deploy, scale, and manage cloud infrastructure using AWS and Azure with live demonstrations. Covers EC2, S3, Lambda, and containerization with Docker.",
    department: "IT",
    date: "2026-05-04",
    time: "10:00 AM",
    venue: "IT Lab 3",
    organizer: "Prof. Nisha K.",
    maxCapacity: 100,
    status: "upcoming",
    tags: ["Cloud", "AWS", "Docker"],
    featured: false,
  },
  {
    title: "DevOps & CI/CD Pipeline Workshop",
    description: "Master modern DevOps practices including Git workflows, Jenkins pipelines, Kubernetes orchestration, and monitoring with Prometheus and Grafana dashboards.",
    department: "IT",
    date: "2026-05-11",
    time: "09:30 AM",
    venue: "IT Lab 1",
    organizer: "Mr. Dinesh P.",
    maxCapacity: 80,
    status: "upcoming",
    tags: ["DevOps", "CI/CD", "Kubernetes"],
    featured: false,
  },
  {
    title: "Data Analytics & Visualization Bootcamp",
    description: "Two-day bootcamp on data analytics using Python, Pandas, and Power BI. Learn to extract insights from real-world datasets and create compelling data visualizations.",
    department: "IT",
    date: "2026-05-17",
    time: "10:00 AM",
    venue: "IT Seminar Hall",
    organizer: "Ms. Swathi M.",
    maxCapacity: 120,
    status: "upcoming",
    tags: ["Data Analytics", "Python", "Bootcamp"],
    featured: false,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing events
    const deleted = await Event.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing events`);

    // Insert seed events
    const inserted = await Event.insertMany(seedEvents);
    console.log(`🌱 Seeded ${inserted.length} events (4 per department × 6 departments)`);

    // Summary
    const depts = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "IT"];
    for (const dept of depts) {
      const count = inserted.filter(e => e.department === dept).length;
      console.log(`   ${dept}: ${count} events`);
    }

    console.log("\n✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
