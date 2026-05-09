import {
  HeartHandshake, BookOpen, Home, Utensils, GraduationCap,
  Stethoscope, Users, Building2, Baby, Heart, Shield, Truck,
  Globe, Star, Leaf, Package,
} from "lucide-react";

export const STORAGE_KEY        = "tsmf_site_moments";
export const DONATIONS_KEY      = "tsmf_donation_inquiries";
export const PARTNERS_KEY       = "tsmf_partners";
export const PLEDGE_SETTINGS_KEY = "tsmf_pledge_settings";
export const BLOG_KEY           = "tsmf_blog_posts";
export const SERVICES_KEY       = "tsmf_services";
export const TEAM_KEY           = "tsmf_team";

// ── Icon registry for programme cards ────────────────────
export const SERVICE_ICON_MAP = {
  Utensils,
  GraduationCap,
  Stethoscope,
  Users,
  HeartHandshake,
  Building2,
  Baby,
  Heart,
  Home,
  BookOpen,
  Shield,
  Truck,
  Globe,
  Star,
  Leaf,
  Package,
};

export const SERVICE_ACCENTS = [
  { value: "ember", label: "Orange" },
  { value: "gold",  label: "Blue"   },
  { value: "grove", label: "Teal"   },
];

export const CATEGORIES = [
  "Donation",
  "Anniversary",
  "Education",
  "Food Relief",
  "Community Care",
];

// ── Moments seed data ─────────────────────────────────────
export const defaultMoments = [
  {
    id: "founding-day",
    title: "Foundation Created",
    date: "2024-02-18",
    category: "Anniversary",
    impact: "The first volunteer circle formed around a promise to serve overlooked families with dignity.",
    image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
    featured: true,
  },
  {
    id: "winter-drive",
    title: "Winter Warmth Donation",
    date: "2024-06-08",
    category: "Donation",
    impact: "Blankets, school jerseys, and warm meals reached families during the coldest weeks of the year.",
    image_url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80",
    featured: false,
  },
  {
    id: "learner-kits",
    title: "Back-to-School Kits",
    date: "2025-01-20",
    category: "Education",
    impact: "Learners received stationery, bags, shoes, and mentorship check-ins for a stronger start.",
    image_url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1600&q=80",
    featured: true,
  },
  {
    id: "food-relief",
    title: "Community Pantry Weekend",
    date: "2025-04-12",
    category: "Food Relief",
    impact: "A weekend pantry supported households facing urgent food insecurity.",
    image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
    featured: false,
  },
  {
    id: "first-anniversary",
    title: "First Anniversary Outreach",
    date: "2025-02-18",
    category: "Anniversary",
    impact: "The anniversary became a service day with elders, youth volunteers, and partner families.",
    image_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
    featured: true,
  },
];

export const emptyMoment = {
  id: "",
  title: "",
  date: "",
  category: "Donation",
  impact: "",
  image_url: "",
  featured: false,
};

export const impactAreas = [
  {
    icon: HeartHandshake,
    title: "Relief & Dignity",
    text: "Food parcels, clothing drives, hygiene support, and rapid care for families facing urgent need.",
  },
  {
    icon: BookOpen,
    title: "Learning Access",
    text: "School supplies, mentorship circles, digital literacy, and bursary pathways for committed learners.",
  },
  {
    icon: Home,
    title: "Community Stability",
    text: "Outreach programs that support safe homes, elder care, youth resilience, and neighborhood wellness.",
  },
];

// ── Services / Programmes seed data ──────────────────────
// icon_name is a string key into SERVICE_ICON_MAP
export const defaultServices = [
  {
    id: "svc-food",
    icon_name: "Utensils",
    title: "Food Relief",
    description: "Weekly food parcels, hot-meal drives, and emergency pantry support for households facing hunger.",
    stat: "500+ families monthly",
    accent: "ember",
    order: 1,
  },
  {
    id: "svc-education",
    icon_name: "GraduationCap",
    title: "Education Support",
    description: "School supplies, bursaries, mentorship circles, and digital literacy programs for committed learners.",
    stat: "350+ learners supported",
    accent: "gold",
    order: 2,
  },
  {
    id: "svc-health",
    icon_name: "Stethoscope",
    title: "Health & Wellness",
    description: "Dignity kits, hygiene drives, first-aid workshops, and linking families to essential healthcare.",
    stat: "12 clinics reached",
    accent: "grove",
    order: 3,
  },
  {
    id: "svc-youth",
    icon_name: "Users",
    title: "Youth Development",
    description: "Skills workshops, sports programs, and mentorship that give young people direction and confidence.",
    stat: "150+ youth enrolled",
    accent: "gold",
    order: 4,
  },
  {
    id: "svc-elders",
    icon_name: "HeartHandshake",
    title: "Elder Care",
    description: "Home visits, essential supplies, companionship drives, and advocacy for dignified elder welfare.",
    stat: "80 elders reached",
    accent: "ember",
    order: 5,
  },
  {
    id: "svc-stability",
    icon_name: "Building2",
    title: "Community Stability",
    description: "Neighbourhood wellness programs, safe-space initiatives, and partnerships for stronger communities.",
    stat: "15 communities engaged",
    accent: "grove",
    order: 6,
  },
];

// ── Team seed data ────────────────────────────────────────
export const defaultTeam = [
  {
    id: "team-founder",
    name: "Saviour Malema",
    role: "Founder & Executive Director",
    bio: "With a background in social work and community advocacy, Saviour established the foundation in 2024 on one conviction — that every Botswana family deserves dignified, practical care.",
    photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    order: 1,
  },
  {
    id: "team-outreach",
    name: "Naledi Mokoena",
    role: "Head of Outreach",
    bio: "Naledi coordinates ground operations, volunteer networks, and community partnerships, ensuring every drive reaches its intended families.",
    photo_url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    order: 2,
  },
  {
    id: "team-education",
    name: "Kgomotso Sithole",
    role: "Education Programme Lead",
    bio: "A former teacher, Kgomotso designs the back-to-school drives, learner mentorship programme, and digital literacy initiatives.",
    photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    order: 3,
  },
  {
    id: "team-food",
    name: "Thabo Dlamini",
    role: "Food Relief Coordinator",
    bio: "Thabo manages logistics for weekly food parcel distribution, the community pantry network, and emergency response across partner sites.",
    photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    order: 4,
  },
];

// ── Partners seed data ────────────────────────────────────
export const defaultPartners = [
  {
    id: "partner-unicef-bw",
    name: "UNICEF Botswana",
    logo_url: "",
    website: "https://www.unicef.org/botswana",
    description: "Child welfare & development",
    featured: true,
    order: 1,
  },
  {
    id: "partner-redcross",
    name: "Botswana Red Cross",
    logo_url: "",
    website: "https://www.redcross.org.bw",
    description: "Emergency relief & humanitarian aid",
    featured: true,
    order: 2,
  },
  {
    id: "partner-childline",
    name: "Childline Botswana",
    logo_url: "",
    website: "https://childline.org.bw",
    description: "Child protection & welfare",
    featured: true,
    order: 3,
  },
  {
    id: "partner-worldvision",
    name: "World Vision Botswana",
    logo_url: "",
    website: "https://www.wvi.org/botswana",
    description: "Community development partner",
    featured: true,
    order: 4,
  },
  {
    id: "partner-sos",
    name: "SOS Children's Villages BW",
    logo_url: "",
    website: "https://www.sos-childrensvillages.org",
    description: "Family strengthening & orphan care",
    featured: true,
    order: 5,
  },
  {
    id: "partner-stepping",
    name: "Stepping Stones International",
    logo_url: "",
    website: "https://www.steppingstonesint.org",
    description: "Youth empowerment in Botswana",
    featured: true,
    order: 6,
  },
];

// ── Pledge settings ───────────────────────────────────────
export const defaultPledgeSettings = {
  currency: "P",
  min: 100,
  max: 1500,
  step: 50,
  defaultAmount: 250,
  unit1Label: "meals",
  unit1Divisor: 12,
  unit2Label: "dignity kits",
  unit2Divisor: 85,
  unit2Min: 1,
};

// ── Blog seed data ────────────────────────────────────────
export const defaultBlogPosts = [
  {
    id: "post-winter-warmth",
    title: "Winter Warmth Drive: 300 Families Reached",
    slug: "winter-warmth-drive-300-families",
    excerpt: "Our mid-year warmth initiative broke records — blankets, jerseys, and hot meals for over 300 households in the coldest weeks of the year.",
    cover_image_url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    body: `## The Drive That Changed Winter

When temperatures dropped across the region, The Saviour Malema Foundation mobilised its largest winter drive to date. Over three weekends in June and July, volunteers distributed blankets, warm jerseys, school-weight coats, and hot meals to more than 300 families identified through our community outreach network.

### What We Delivered

- **620 blankets** across 4 townships
- **300+ hot meals** prepared by volunteer cooks
- **150 school jerseys** for learners returning in winter terms
- Emergency dignity kits for families with infants

### A Note from the Founder

> "No family should face winter without warmth. This drive reminded us why we exist — not just to give, but to restore dignity one blanket at a time."

We are grateful to every volunteer, donor, and partner who made this possible.`,
    published: true,
    published_at: "2025-07-15T08:00:00Z",
  },
  {
    id: "post-back-to-school",
    title: "Back-to-School 2025: Kits, Mentors & Fresh Starts",
    slug: "back-to-school-2025",
    excerpt: "350 learners began the school year with fully stocked backpacks, new shoes, and a mentor they could call their own.",
    cover_image_url: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80",
    body: `## A Fresh Start for 350 Learners

January 2025 marked the foundation's most comprehensive back-to-school drive. This year, we moved beyond stationery packs to provide learners with a complete support ecosystem — supplies, shoes, and someone to check in on them throughout the year.

### What Changed in 2025

- Dedicated **learner mentors** for Grade 8 and Grade 11 students
- **Digital literacy sessions** using donated tablets
- Monthly **check-in calls** with parents and guardians

| Item | Count |
|------|-------|
| Learner kits | 350 |
| Pairs of shoes | 200 |
| Tablet devices | 45 |
| Mentor pairs | 120 |`,
    published: true,
    published_at: "2025-01-22T09:00:00Z",
  },
  {
    id: "post-community-pantry",
    title: "The Community Pantry Model: One Year On",
    slug: "community-pantry-one-year",
    excerpt: "A year ago we launched a pop-up weekend pantry. Today it serves three locations and has inspired two independent community-led spin-offs.",
    cover_image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    body: `## From Pop-Up to Permanent Fixture

The Community Pantry started as a single Saturday experiment. One year later, it has become one of the foundation's most replicated models — now operating every weekend at three community centres.

### Community-Led Spin-Offs

Two neighbourhood groups have launched their own weekly distributions using the foundation's model. We provide operational guidance and supplier introductions. They own their programmes completely.

### What's Next

We are developing a **Pantry Starter Kit** — a resource pack any community group can use to launch a dignified, community-run food distribution point. Expected release: Q1 2026.`,
    published: true,
    published_at: "2025-04-14T10:00:00Z",
  },
];

export const INQUIRY_INTERESTS = [
  "Donate Funds",
  "Volunteer",
  "Sponsor a Drive",
  "Corporate Partnership",
  "General Enquiry",
];
