require("dotenv").config();
const mongoose    = require("mongoose");
const connectDB   = require("../config/db");
const User        = require("../models/User");
const Event       = require("../models/Event");
const Organizer   = require("../models/Organizer");

const seed = async () => {
  await connectDB();
  console.log("🌱 Seeding database...");

  await User.deleteMany();
  await Event.deleteMany();
  await Organizer.deleteMany();

  // ── Users (organizers with gmail-dept format) ──────────────────────────────
  const users = await User.create([
    { name:"Dr. Priya Sharma",    email:"priya.cse@gmail.com",    password:"Password@123", department:"CSE",   role:"Head Organizer" },
    { name:"Prof. Rajesh Kumar",  email:"rajesh.cse@gmail.com",   password:"Password@123", department:"CSE",   role:"Event Coordinator" },
    { name:"Ms. Anitha R.",       email:"anitha.cse@gmail.com",   password:"Password@123", department:"CSE",   role:"Technical Lead" },
    { name:"Mr. Vikram S.",       email:"vikram.cse@gmail.com",   password:"Password@123", department:"CSE",   role:"Coordinator" },
    { name:"Dr. Meena T.",        email:"meena.cse@gmail.com",    password:"Password@123", department:"CSE",   role:"Faculty Advisor" },
    { name:"Dr. Suresh M.",       email:"suresh.ece@gmail.com",   password:"Password@123", department:"ECE",   role:"Head Organizer" },
    { name:"Prof. Lakshmi N.",    email:"lakshmi.ece@gmail.com",  password:"Password@123", department:"ECE",   role:"Event Coordinator" },
    { name:"Mr. Arjun K.",        email:"arjun.ece@gmail.com",    password:"Password@123", department:"ECE",   role:"Technical Lead" },
    { name:"Ms. Divya P.",        email:"divya.ece@gmail.com",    password:"Password@123", department:"ECE",   role:"Coordinator" },
    { name:"Dr. Mohan R.",        email:"mohan.ece@gmail.com",    password:"Password@123", department:"ECE",   role:"Faculty Advisor" },
    { name:"Dr. Arun B.",         email:"arun.mech@gmail.com",    password:"Password@123", department:"MECH",  role:"Head Organizer" },
    { name:"Prof. Kavitha S.",    email:"kavitha.mech@gmail.com", password:"Password@123", department:"MECH",  role:"Event Coordinator" },
    { name:"Mr. Ravi T.",         email:"ravi.mech@gmail.com",    password:"Password@123", department:"MECH",  role:"Technical Lead" },
    { name:"Ms. Sneha G.",        email:"sneha.mech@gmail.com",   password:"Password@123", department:"MECH",  role:"Coordinator" },
    { name:"Dr. Prakash V.",      email:"prakash.mech@gmail.com", password:"Password@123", department:"MECH",  role:"Faculty Advisor" },
    { name:"Dr. Ramya K.",        email:"ramya.civil@gmail.com",  password:"Password@123", department:"CIVIL", role:"Head Organizer" },
    { name:"Prof. Ganesh M.",     email:"ganesh.civil@gmail.com", password:"Password@123", department:"CIVIL", role:"Event Coordinator" },
    { name:"Mr. Karthik S.",      email:"karthik.civil@gmail.com",password:"Password@123", department:"CIVIL", role:"Technical Lead" },
    { name:"Ms. Pooja R.",        email:"pooja.civil@gmail.com",  password:"Password@123", department:"CIVIL", role:"Coordinator" },
    { name:"Dr. Naveen B.",       email:"naveen.civil@gmail.com", password:"Password@123", department:"CIVIL", role:"Faculty Advisor" },
    { name:"Dr. Sanjay P.",       email:"sanjay.eee@gmail.com",   password:"Password@123", department:"EEE",   role:"Head Organizer" },
    { name:"Prof. Deepa L.",      email:"deepa.eee@gmail.com",    password:"Password@123", department:"EEE",   role:"Event Coordinator" },
    { name:"Mr. Harish K.",       email:"harish.eee@gmail.com",   password:"Password@123", department:"EEE",   role:"Technical Lead" },
    { name:"Ms. Revathi S.",      email:"revathi.eee@gmail.com",  password:"Password@123", department:"EEE",   role:"Coordinator" },
    { name:"Dr. Venkat M.",       email:"venkat.eee@gmail.com",   password:"Password@123", department:"EEE",   role:"Faculty Advisor" },
    { name:"Dr. Ashwin R.",       email:"ashwin.it@gmail.com",    password:"Password@123", department:"IT",    role:"Head Organizer" },
    { name:"Prof. Nisha K.",      email:"nisha.it@gmail.com",     password:"Password@123", department:"IT",    role:"Event Coordinator" },
    { name:"Mr. Dinesh P.",       email:"dinesh.it@gmail.com",    password:"Password@123", department:"IT",    role:"Technical Lead" },
    { name:"Ms. Swathi M.",       email:"swathi.it@gmail.com",    password:"Password@123", department:"IT",    role:"Coordinator" },
    { name:"Dr. Balaji T.",       email:"balaji.it@gmail.com",    password:"Password@123", department:"IT",    role:"Faculty Advisor" },
    { name:"Admin",               email:"admin.cse@gmail.com",    password:"Admin@123",    department:"CSE",   role:"Head Organizer", isAdmin:true },
  ]);
  console.log(`✅ Created ${users.length} users`);

  // ── Organizers (for OrgChart — mirrors users) ──────────────────────────────
  const orgDocs = users
    .filter(u => !u.isAdmin)
    .map(u => ({
      name:       u.name,
      email:      u.email,
      department: u.department,
      role:       u.role,
      avatar:     u.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
    }));
  await Organizer.create(orgDocs);
  console.log(`✅ Created ${orgDocs.length} organizers`);

  // ── Events ─────────────────────────────────────────────────────────────────
  const u = (email) => users.find(x => x.email === email);

  const events = await Event.create([
    // MARCH events — will appear in Calendar
    { title:"HackFusion 2026",         description:"A 36-hour national level hackathon bringing together the brightest minds to solve real-world problems using cutting-edge technology.",        department:"CSE",   date:"2026-03-20", time:"09:00 AM", venue:"Main Auditorium",      organizer:"Dr. Priya Sharma",   organizerId:u("priya.cse@gmail.com")?._id,   maxCapacity:300, status:"upcoming", tags:["Hackathon","Coding","Innovation"], featured:true,  googleFormUrl:"https://forms.google.com/example-hackfusion" },
    { title:"CircuitCraft Workshop",   description:"Hands-on workshop on advanced PCB design and IoT integration with real-world applications in smart devices.",                                department:"ECE",   date:"2026-03-22", time:"10:00 AM", venue:"ECE Lab Block",         organizer:"Dr. Suresh M.",      organizerId:u("suresh.ece@gmail.com")?._id,  maxCapacity:120, status:"upcoming", tags:["Workshop","IoT","Hardware"],      featured:false, googleFormUrl:"https://forms.google.com/example-circuitcraft" },
    { title:"RoboWars Championship",   description:"Inter-college robotics competition featuring battle bots, line followers, and autonomous navigation challenges.",                             department:"MECH",  date:"2026-03-25", time:"11:00 AM", venue:"Mechanical Workshop",   organizer:"Dr. Arun B.",        organizerId:u("arun.mech@gmail.com")?._id,   maxCapacity:200, status:"upcoming", tags:["Robotics","Competition","Engineering"], featured:true },
    { title:"Bridge Building Contest", description:"Design and build model bridges tested for load-bearing capacity. Combines creativity with structural engineering principles.",                department:"CIVIL", date:"2026-03-28", time:"02:00 PM", venue:"Civil Engineering Lab", organizer:"Dr. Ramya K.",       organizerId:u("ramya.civil@gmail.com")?._id, maxCapacity:100, status:"upcoming", tags:["Design","Structural","Contest"],  featured:false },
    // APRIL events
    { title:"Power Systems Symposium", description:"National symposium on renewable energy systems, smart grids, and the future of power distribution.",                                         department:"EEE",   date:"2026-04-02", time:"09:30 AM", venue:"Seminar Hall A",        organizer:"Dr. Sanjay P.",      organizerId:u("sanjay.eee@gmail.com")?._id,  maxCapacity:150, status:"upcoming", tags:["Symposium","Energy","Sustainability"], featured:false },
    { title:"CyberSec Summit",         description:"Deep dive into cybersecurity threats, ethical hacking demonstrations, and network defense strategies.",                                      department:"IT",    date:"2026-04-05", time:"10:00 AM", venue:"IT Seminar Hall",       organizer:"Dr. Ashwin R.",      organizerId:u("ashwin.it@gmail.com")?._id,   maxCapacity:180, status:"upcoming", tags:["Security","Hacking","Network"],   featured:true,  googleFormUrl:"https://forms.google.com/example-cybersec" },
    { title:"AI/ML Bootcamp",          description:"Intensive 3-day bootcamp covering machine learning fundamentals, deep learning, and practical AI applications.",                             department:"CSE",   date:"2026-04-10", time:"09:00 AM", venue:"CS Lab Complex",        organizer:"Prof. Rajesh Kumar", organizerId:u("rajesh.cse@gmail.com")?._id,  maxCapacity:200, status:"upcoming", tags:["AI","Machine Learning","Bootcamp"], featured:false },
    { title:"VLSI Design Workshop",    description:"Explore VLSI chip design methodologies with hands-on experience using industry-standard EDA tools.",                                        department:"ECE",   date:"2026-04-12", time:"10:00 AM", venue:"VLSI Lab",              organizer:"Prof. Lakshmi N.",   organizerId:u("lakshmi.ece@gmail.com")?._id, maxCapacity:80,  status:"upcoming", tags:["VLSI","Workshop","Design"],       featured:false },
    { title:"AutoExpo Technical Fest", description:"Annual technical festival showcasing automobile innovations, EV prototypes, and advanced manufacturing techniques.",                        department:"MECH",  date:"2026-04-15", time:"10:00 AM", venue:"Open Ground",           organizer:"Prof. Kavitha S.",   organizerId:u("kavitha.mech@gmail.com")?._id,maxCapacity:500, status:"upcoming", tags:["TechFest","Automobile","Exhibition"], featured:false },
    { title:"Smart City Hackathon",    description:"Collaborative hackathon focused on developing innovative solutions for urban infrastructure and smart city challenges.",                     department:"CIVIL", date:"2026-04-18", time:"09:00 AM", venue:"Innovation Center",     organizer:"Prof. Ganesh M.",    organizerId:u("ganesh.civil@gmail.com")?._id,maxCapacity:120, status:"upcoming", tags:["Hackathon","Smart City","Urban"],  featured:false },
    { title:"Cloud Computing Workshop",description:"Learn to deploy, scale, and manage cloud infrastructure using AWS and Azure with live hands-on demonstrations.",                            department:"IT",    date:"2026-04-20", time:"10:00 AM", venue:"IT Lab 3",              organizer:"Prof. Nisha K.",     organizerId:u("nisha.it@gmail.com")?._id,    maxCapacity:100, status:"upcoming", tags:["Cloud","AWS","Workshop"],         featured:false },
    { title:"Green Energy Expo",       description:"Exhibition and seminar on solar panels, wind energy, and battery storage innovations for a sustainable future.",                            department:"EEE",   date:"2026-04-22", time:"11:00 AM", venue:"Exhibition Hall",       organizer:"Prof. Deepa L.",     organizerId:u("deepa.eee@gmail.com")?._id,   maxCapacity:250, status:"upcoming", tags:["Expo","Green Energy","Innovation"],featured:false },
  ]);
  console.log(`✅ Created ${events.length} events`);

  console.log("\n🎉 Seed complete!");
  console.log("─────────────────────────────────────────────────────────");
  console.log("Demo logins (password for all: Password@123)");
  console.log("  CSE:   priya.cse@gmail.com");
  console.log("  ECE:   suresh.ece@gmail.com");
  console.log("  MECH:  arun.mech@gmail.com");
  console.log("  CIVIL: ramya.civil@gmail.com");
  console.log("  EEE:   sanjay.eee@gmail.com");
  console.log("  IT:    ashwin.it@gmail.com");
  console.log("  Admin: admin.cse@gmail.com  /  Admin@123");
  console.log("─────────────────────────────────────────────────────────");
  process.exit(0);
};

seed().catch(err => { console.error("Seed failed:", err); process.exit(1); });
