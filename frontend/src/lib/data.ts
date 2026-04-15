export type Department = 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'EEE' | 'IT';

export interface Organizer {
  id: string;
  name: string;
  email: string;
  department: Department;
  role: string;
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  department: Department;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  image?: string;
  registrations: number;
  maxCapacity: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  tags: string[];
  featured?: boolean;
  googleFormUrl?: string;
}

export const departments: { id: Department; name: string; fullName: string; color: string }[] = [
  { id: 'CSE', name: 'CSE', fullName: 'Computer Science & Engineering', color: 'dept-cse' },
  { id: 'ECE', name: 'ECE', fullName: 'Electronics & Communication', color: 'dept-ece' },
  { id: 'MECH', name: 'MECH', fullName: 'Mechanical Engineering', color: 'dept-mech' },
  { id: 'CIVIL', name: 'CIVIL', fullName: 'Civil Engineering', color: 'dept-civil' },
  { id: 'EEE', name: 'EEE', fullName: 'Electrical & Electronics', color: 'dept-eee' },
  { id: 'IT', name: 'IT', fullName: 'Information Technology', color: 'dept-it' },
];

export const organizers: Organizer[] = [
  // CSE
  { id: 'cse1', name: 'Dr. Priya Sharma', email: 'priya.cse@university.edu', department: 'CSE', role: 'Head Organizer', avatar: 'PS' },
  { id: 'cse2', name: 'Prof. Rajesh Kumar', email: 'rajesh.cse@university.edu', department: 'CSE', role: 'Event Coordinator', avatar: 'RK' },
  { id: 'cse3', name: 'Ms. Anitha R.', email: 'anitha.cse@university.edu', department: 'CSE', role: 'Technical Lead', avatar: 'AR' },
  { id: 'cse4', name: 'Mr. Vikram S.', email: 'vikram.cse@university.edu', department: 'CSE', role: 'Coordinator', avatar: 'VS' },
  { id: 'cse5', name: 'Dr. Meena T.', email: 'meena.cse@university.edu', department: 'CSE', role: 'Faculty Advisor', avatar: 'MT' },
  // ECE
  { id: 'ece1', name: 'Dr. Suresh M.', email: 'suresh.ece@university.edu', department: 'ECE', role: 'Head Organizer', avatar: 'SM' },
  { id: 'ece2', name: 'Prof. Lakshmi N.', email: 'lakshmi.ece@university.edu', department: 'ECE', role: 'Event Coordinator', avatar: 'LN' },
  { id: 'ece3', name: 'Mr. Arjun K.', email: 'arjun.ece@university.edu', department: 'ECE', role: 'Technical Lead', avatar: 'AK' },
  { id: 'ece4', name: 'Ms. Divya P.', email: 'divya.ece@university.edu', department: 'ECE', role: 'Coordinator', avatar: 'DP' },
  { id: 'ece5', name: 'Dr. Mohan R.', email: 'mohan.ece@university.edu', department: 'ECE', role: 'Faculty Advisor', avatar: 'MR' },
  // MECH
  { id: 'mech1', name: 'Dr. Arun B.', email: 'arun.mech@university.edu', department: 'MECH', role: 'Head Organizer', avatar: 'AB' },
  { id: 'mech2', name: 'Prof. Kavitha S.', email: 'kavitha.mech@university.edu', department: 'MECH', role: 'Event Coordinator', avatar: 'KS' },
  { id: 'mech3', name: 'Mr. Ravi T.', email: 'ravi.mech@university.edu', department: 'MECH', role: 'Technical Lead', avatar: 'RT' },
  { id: 'mech4', name: 'Ms. Sneha G.', email: 'sneha.mech@university.edu', department: 'MECH', role: 'Coordinator', avatar: 'SG' },
  { id: 'mech5', name: 'Dr. Prakash V.', email: 'prakash.mech@university.edu', department: 'MECH', role: 'Faculty Advisor', avatar: 'PV' },
  // CIVIL
  { id: 'civil1', name: 'Dr. Ramya K.', email: 'ramya.civil@university.edu', department: 'CIVIL', role: 'Head Organizer', avatar: 'RK' },
  { id: 'civil2', name: 'Prof. Ganesh M.', email: 'ganesh.civil@university.edu', department: 'CIVIL', role: 'Event Coordinator', avatar: 'GM' },
  { id: 'civil3', name: 'Mr. Karthik S.', email: 'karthik.civil@university.edu', department: 'CIVIL', role: 'Technical Lead', avatar: 'KS' },
  { id: 'civil4', name: 'Ms. Pooja R.', email: 'pooja.civil@university.edu', department: 'CIVIL', role: 'Coordinator', avatar: 'PR' },
  { id: 'civil5', name: 'Dr. Naveen B.', email: 'naveen.civil@university.edu', department: 'CIVIL', role: 'Faculty Advisor', avatar: 'NB' },
  // EEE
  { id: 'eee1', name: 'Dr. Sanjay P.', email: 'sanjay.eee@university.edu', department: 'EEE', role: 'Head Organizer', avatar: 'SP' },
  { id: 'eee2', name: 'Prof. Deepa L.', email: 'deepa.eee@university.edu', department: 'EEE', role: 'Event Coordinator', avatar: 'DL' },
  { id: 'eee3', name: 'Mr. Harish K.', email: 'harish.eee@university.edu', department: 'EEE', role: 'Technical Lead', avatar: 'HK' },
  { id: 'eee4', name: 'Ms. Revathi S.', email: 'revathi.eee@university.edu', department: 'EEE', role: 'Coordinator', avatar: 'RS' },
  { id: 'eee5', name: 'Dr. Venkat M.', email: 'venkat.eee@university.edu', department: 'EEE', role: 'Faculty Advisor', avatar: 'VM' },
  // IT
  { id: 'it1', name: 'Dr. Ashwin R.', email: 'ashwin.it@university.edu', department: 'IT', role: 'Head Organizer', avatar: 'AR' },
  { id: 'it2', name: 'Prof. Nisha K.', email: 'nisha.it@university.edu', department: 'IT', role: 'Event Coordinator', avatar: 'NK' },
  { id: 'it3', name: 'Mr. Dinesh P.', email: 'dinesh.it@university.edu', department: 'IT', role: 'Technical Lead', avatar: 'DP' },
  { id: 'it4', name: 'Ms. Swathi M.', email: 'swathi.it@university.edu', department: 'IT', role: 'Coordinator', avatar: 'SM' },
  { id: 'it5', name: 'Dr. Balaji T.', email: 'balaji.it@university.edu', department: 'IT', role: 'Faculty Advisor', avatar: 'BT' },
];

export const events: EventItem[] = [
  {
    id: 'evt1', title: 'HackFusion 2026', description: 'A 36-hour national level hackathon bringing together the brightest minds to solve real-world problems using cutting-edge technology.',
    department: 'CSE', date: '2026-03-20', time: '09:00 AM', venue: 'Main Auditorium', organizer: 'Dr. Priya Sharma',
    registrations: 245, maxCapacity: 300, status: 'upcoming', tags: ['Hackathon', 'Coding', 'Innovation'], featured: true,
    googleFormUrl: 'https://forms.google.com/example-hackfusion',
  },
  {
    id: 'evt2', title: 'CircuitCraft Workshop', description: 'Hands-on workshop on advanced PCB design and IoT integration with real-world applications.',
    department: 'ECE', date: '2026-03-22', time: '10:00 AM', venue: 'ECE Lab Block', organizer: 'Dr. Suresh M.',
    registrations: 80, maxCapacity: 120, status: 'upcoming', tags: ['Workshop', 'IoT', 'Hardware'],
    googleFormUrl: 'https://forms.google.com/example-circuitcraft',
  },
  {
    id: 'evt3', title: 'RoboWars Championship', description: 'Inter-college robotics competition featuring battle bots, line followers, and autonomous navigation challenges.',
    department: 'MECH', date: '2026-03-25', time: '11:00 AM', venue: 'Mechanical Workshop', organizer: 'Dr. Arun B.',
    registrations: 150, maxCapacity: 200, status: 'upcoming', tags: ['Robotics', 'Competition', 'Engineering'], featured: true,
    googleFormUrl: 'https://forms.google.com/example-robowars',
  },
  {
    id: 'evt4', title: 'Bridge Building Contest', description: 'Design and build model bridges tested for load-bearing capacity. Combines creativity with structural engineering principles.',
    department: 'CIVIL', date: '2026-03-28', time: '02:00 PM', venue: 'Civil Engineering Lab', organizer: 'Dr. Ramya K.',
    registrations: 60, maxCapacity: 100, status: 'upcoming', tags: ['Design', 'Structural', 'Contest'],
  },
  {
    id: 'evt5', title: 'Power Systems Symposium', description: 'National symposium on renewable energy systems, smart grids, and the future of power distribution.',
    department: 'EEE', date: '2026-04-02', time: '09:30 AM', venue: 'Seminar Hall A', organizer: 'Dr. Sanjay P.',
    registrations: 95, maxCapacity: 150, status: 'upcoming', tags: ['Symposium', 'Energy', 'Sustainability'],
  },
  {
    id: 'evt6', title: 'CyberSec Summit', description: 'Deep dive into cybersecurity threats, ethical hacking demonstrations, and network defense strategies.',
    department: 'IT', date: '2026-04-05', time: '10:00 AM', venue: 'IT Seminar Hall', organizer: 'Dr. Ashwin R.',
    registrations: 110, maxCapacity: 180, status: 'upcoming', tags: ['Security', 'Hacking', 'Network'], featured: true,
    googleFormUrl: 'https://forms.google.com/example-cybersec',
  },
  {
    id: 'evt7', title: 'AI/ML Bootcamp', description: 'Intensive 3-day bootcamp covering machine learning fundamentals, deep learning, and practical AI applications.',
    department: 'CSE', date: '2026-04-10', time: '09:00 AM', venue: 'CS Lab Complex', organizer: 'Prof. Rajesh Kumar',
    registrations: 180, maxCapacity: 200, status: 'upcoming', tags: ['AI', 'Machine Learning', 'Bootcamp'],
  },
  {
    id: 'evt8', title: 'VLSI Design Workshop', description: 'Explore VLSI chip design methodologies with hands-on experience using industry-standard EDA tools.',
    department: 'ECE', date: '2026-04-12', time: '10:00 AM', venue: 'VLSI Lab', organizer: 'Prof. Lakshmi N.',
    registrations: 55, maxCapacity: 80, status: 'upcoming', tags: ['VLSI', 'Workshop', 'Design'],
  },
  {
    id: 'evt9', title: 'AutoExpo Technical Fest', description: 'Annual technical festival showcasing automobile innovations, EV prototypes, and advanced manufacturing techniques.',
    department: 'MECH', date: '2026-04-15', time: '10:00 AM', venue: 'Open Ground', organizer: 'Prof. Kavitha S.',
    registrations: 200, maxCapacity: 500, status: 'upcoming', tags: ['TechFest', 'Automobile', 'Exhibition'],
  },
  {
    id: 'evt10', title: 'Smart City Hackathon', description: 'Collaborative hackathon focused on developing innovative solutions for urban infrastructure challenges.',
    department: 'CIVIL', date: '2026-04-18', time: '09:00 AM', venue: 'Innovation Center', organizer: 'Prof. Ganesh M.',
    registrations: 75, maxCapacity: 120, status: 'upcoming', tags: ['Hackathon', 'Smart City', 'Urban'],
  },
  {
    id: 'evt11', title: 'Cloud Computing Workshop', description: 'Learn to deploy, scale, and manage cloud infrastructure using AWS and Azure with live demonstrations.',
    department: 'IT', date: '2026-04-20', time: '10:00 AM', venue: 'IT Lab 3', organizer: 'Prof. Nisha K.',
    registrations: 90, maxCapacity: 100, status: 'upcoming', tags: ['Cloud', 'AWS', 'Workshop'],
  },
  {
    id: 'evt12', title: 'Green Energy Expo', description: 'Exhibition and seminar on solar panels, wind energy, and battery storage innovations.',
    department: 'EEE', date: '2026-04-22', time: '11:00 AM', venue: 'Exhibition Hall', organizer: 'Prof. Deepa L.',
    registrations: 130, maxCapacity: 250, status: 'upcoming', tags: ['Expo', 'Green Energy', 'Innovation'],
  },
];

export const deptColorMap: Record<Department, string> = {
  CSE: 'bg-dept-cse',
  ECE: 'bg-dept-ece',
  MECH: 'bg-dept-mech',
  CIVIL: 'bg-dept-civil',
  EEE: 'bg-dept-eee',
  IT: 'bg-dept-it',
};

export const deptTextColorMap: Record<Department, string> = {
  CSE: 'text-dept-cse',
  ECE: 'text-dept-ece',
  MECH: 'text-dept-mech',
  CIVIL: 'text-dept-civil',
  EEE: 'text-dept-eee',
  IT: 'text-dept-it',
};

export const deptBorderColorMap: Record<Department, string> = {
  CSE: 'border-dept-cse',
  ECE: 'border-dept-ece',
  MECH: 'border-dept-mech',
  CIVIL: 'border-dept-civil',
  EEE: 'border-dept-eee',
  IT: 'border-dept-it',
};
