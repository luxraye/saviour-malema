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

INSERT INTO partners (id, name, website, description, featured, "order") VALUES
  ('partner-foodforward',  'FoodForward SA',             'https://foodforwardsa.org',            'Food redistribution partner',  true, 1),
  ('partner-gog',          'Gift of the Givers',         'https://www.giftofthegivers.org',      'Humanitarian aid collaboration', true, 2),
  ('partner-unicef',       'UNICEF South Africa',        'https://www.unicef.org/southafrica',   'Child welfare & development', true, 3),
  ('partner-nmf',          'Nelson Mandela Foundation',  'https://www.nelsonmandela.org',        'Education & dignity advocate', true, 4),
  ('partner-afrikatikkun', 'Afrika Tikkun',              'https://afrikatikkun.org',             'Township development',        true, 5),
  ('partner-harambee',     'Harambee Youth Employment',  'https://harambee.co.za',              'Youth employment pipeline',   true, 6);
