-- ─────────────────────────────────────────────
-- The Saviour Malema Foundation · Schema
-- ─────────────────────────────────────────────

-- Moments table
CREATE TABLE moments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Donation','Anniversary','Education','Food Relief','Community Care')),
  impact TEXT NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog posts
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  cover_image_url TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Newsletter subscribers
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  confirmed BOOLEAN DEFAULT false
);

-- Donation / contact inquiries
CREATE TABLE donation_inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT,
  pledge_amount NUMERIC,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Programme cards (editable from admin)
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  icon_name TEXT NOT NULL DEFAULT 'HeartHandshake',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stat TEXT,
  accent TEXT NOT NULL DEFAULT 'ember' CHECK (accent IN ('ember','gold','grove')),
  "order" INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Team members (editable from admin)
CREATE TABLE team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  "order" INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Partners & collaborators
CREATE TABLE partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  featured BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 99,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── RLS ─────────────────────────────────────

ALTER TABLE moments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Moments are publicly readable" ON moments FOR SELECT USING (true);
CREATE POLICY "Admins can insert moments" ON moments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update moments" ON moments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete moments" ON moments FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts are publicly readable" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins can read all posts" ON blog_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert posts" ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update posts" ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete posts" ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read subscribers" ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE donation_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit inquiry" ON donation_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read inquiries" ON donation_inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update inquiry status" ON donation_inquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete inquiries" ON donation_inquiries FOR DELETE USING (auth.role() = 'authenticated');

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are publicly readable" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Team members are publicly readable" ON team_members FOR SELECT USING (true);
CREATE POLICY "Admins can manage team members" ON team_members FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Partners are publicly readable" ON partners FOR SELECT USING (true);
CREATE POLICY "Admins can manage partners" ON partners FOR ALL USING (auth.role() = 'authenticated');

-- ─── Storage ──────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Media is publicly readable"
  ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- ─── Seed data ────────────────────────────────

INSERT INTO moments (title, date, category, impact, image_url, featured) VALUES
  ('Foundation Created', '2024-02-18', 'Anniversary', 'The first volunteer circle formed around a promise to serve overlooked families with dignity.', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80', true),
  ('Winter Warmth Donation', '2024-06-08', 'Donation', 'Blankets, school jerseys, and warm meals reached families during the coldest weeks of the year.', 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80', false),
  ('Back-to-School Kits', '2025-01-20', 'Education', 'Learners received stationery, bags, shoes, and mentorship check-ins for a stronger start.', 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1600&q=80', true),
  ('Community Pantry Weekend', '2025-04-12', 'Food Relief', 'A weekend pantry supported households facing urgent food insecurity.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80', false),
  ('First Anniversary Outreach', '2025-02-18', 'Anniversary', 'The anniversary became a service day with elders, youth volunteers, and partner families.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80', true);

INSERT INTO services (id, icon_name, title, description, stat, accent, "order") VALUES
  ('svc-food',      'Utensils',       'Food Relief',          'Weekly food parcels, hot-meal drives, and emergency pantry support for households facing hunger.',                                           '500+ families monthly', 'ember', 1),
  ('svc-education', 'GraduationCap',  'Education Support',    'School supplies, bursaries, mentorship circles, and digital literacy programs for committed learners.',                                      '350+ learners supported', 'gold',  2),
  ('svc-health',    'Stethoscope',    'Health & Wellness',    'Dignity kits, hygiene drives, first-aid workshops, and linking families to essential healthcare.',                                           '12 clinics reached',    'grove', 3),
  ('svc-youth',     'Users',          'Youth Development',    'Skills workshops, sports programs, and mentorship that give young people direction and confidence.',                                         '150+ youth enrolled',   'gold',  4),
  ('svc-elders',    'HeartHandshake', 'Elder Care',           'Home visits, essential supplies, companionship drives, and advocacy for dignified elder welfare.',                                          '80 elders reached',     'ember', 5),
  ('svc-stability', 'Building2',      'Community Stability',  'Neighbourhood wellness programs, safe-space initiatives, and partnerships for stronger communities.',                                       '15 communities engaged','grove', 6);

INSERT INTO team_members (id, name, role, bio, photo_url, "order") VALUES
  ('team-founder',   'Saviour Malema',    'Founder & Executive Director', 'With a background in social work and community advocacy, Saviour established the foundation in 2024 on one conviction — that every Botswana family deserves dignified, practical care.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 1),
  ('team-outreach',  'Naledi Mokoena',    'Head of Outreach',             'Naledi coordinates ground operations, volunteer networks, and community partnerships, ensuring every drive reaches its intended families.', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80', 2),
  ('team-education', 'Kgomotso Sithole',  'Education Programme Lead',     'A former teacher, Kgomotso designs the back-to-school drives, learner mentorship programme, and digital literacy initiatives.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 3),
  ('team-food',      'Thabo Dlamini',     'Food Relief Coordinator',      'Thabo manages logistics for weekly food parcel distribution, the community pantry network, and emergency response across partner sites.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', 4);

INSERT INTO partners (id, name, website, description, featured, "order") VALUES
  ('partner-unicef-bw',   'UNICEF Botswana',            'https://www.unicef.org/botswana',         'Child welfare & development',      true, 1),
  ('partner-redcross',    'Botswana Red Cross',          'https://www.redcross.org.bw',             'Emergency relief & humanitarian aid', true, 2),
  ('partner-childline',   'Childline Botswana',          'https://childline.org.bw',                'Child protection & welfare',        true, 3),
  ('partner-worldvision', 'World Vision Botswana',       'https://www.wvi.org/botswana',            'Community development partner',     true, 4),
  ('partner-sos',         'SOS Children''s Villages BW', 'https://www.sos-childrensvillages.org',   'Family strengthening & orphan care', true, 5),
  ('partner-stepping',    'Stepping Stones International','https://www.steppingstonesint.org',      'Youth empowerment in Botswana',     true, 6);
