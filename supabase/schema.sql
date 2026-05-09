-- ═══════════════════════════════════════════════════════════════
-- The Saviour Malema Foundation · Full Database Schema
-- Run this in the Supabase SQL Editor on a fresh (empty) project.
-- ═══════════════════════════════════════════════════════════════


-- ─── Drop existing tables (clean slate) ─────────────────────────
DROP TABLE IF EXISTS partners            CASCADE;
DROP TABLE IF EXISTS team_members        CASCADE;
DROP TABLE IF EXISTS services            CASCADE;
DROP TABLE IF EXISTS donation_inquiries  CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS blog_posts          CASCADE;
DROP TABLE IF EXISTS moments             CASCADE;


-- ═══════════════════════════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════════════════════════

-- ─── Moments (living timeline) ───────────────────────────────────
CREATE TABLE moments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  date        DATE        NOT NULL,
  category    TEXT        NOT NULL
                CHECK (category IN ('Donation','Anniversary','Education','Food Relief','Community Care')),
  impact      TEXT        NOT NULL,
  image_url   TEXT,
  featured    BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Blog posts / Updates ────────────────────────────────────────
CREATE TABLE blog_posts (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT        NOT NULL,
  slug            TEXT        UNIQUE NOT NULL,
  excerpt         TEXT,
  body            TEXT        NOT NULL DEFAULT '',
  cover_image_url TEXT,
  published       BOOLEAN     NOT NULL DEFAULT false,
  published_at    TIMESTAMPTZ,
  author_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Newsletter subscribers ──────────────────────────────────────
CREATE TABLE newsletter_subscribers (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        UNIQUE NOT NULL,
  confirmed     BOOLEAN     NOT NULL DEFAULT false,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Donation / contact inquiries ───────────────────────────────
CREATE TABLE donation_inquiries (
  id             TEXT        PRIMARY KEY,
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT,
  interest       TEXT,
  pledge_amount  NUMERIC,
  message        TEXT,
  status         TEXT        NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new','contacted','closed')),
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Programme cards (editable from admin) ──────────────────────
CREATE TABLE services (
  id          TEXT        PRIMARY KEY,
  icon_name   TEXT        NOT NULL DEFAULT 'HeartHandshake',
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL,
  stat        TEXT,
  accent      TEXT        NOT NULL DEFAULT 'ember'
                CHECK (accent IN ('ember','gold','grove')),
  "order"     INTEGER     NOT NULL DEFAULT 99,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Team members (editable from admin) ─────────────────────────
CREATE TABLE team_members (
  id         TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL,
  role       TEXT        NOT NULL,
  bio        TEXT,
  photo_url  TEXT,
  "order"    INTEGER     NOT NULL DEFAULT 99,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Partners & collaborators ────────────────────────────────────
CREATE TABLE partners (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  description TEXT,
  featured    BOOLEAN     NOT NULL DEFAULT true,
  "order"     INTEGER     NOT NULL DEFAULT 99,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

-- ─── moments ────────────────────────────────────────────────────
ALTER TABLE moments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "moments_select_public"
  ON moments FOR SELECT USING (true);

CREATE POLICY "moments_insert_admin"
  ON moments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "moments_update_admin"
  ON moments FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "moments_delete_admin"
  ON moments FOR DELETE USING (auth.role() = 'authenticated');

-- ─── blog_posts ─────────────────────────────────────────────────
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blog_select_published"
  ON blog_posts FOR SELECT USING (published = true);

CREATE POLICY "blog_select_admin"
  ON blog_posts FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "blog_insert_admin"
  ON blog_posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "blog_update_admin"
  ON blog_posts FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "blog_delete_admin"
  ON blog_posts FOR DELETE USING (auth.role() = 'authenticated');

-- ─── newsletter_subscribers ──────────────────────────────────────
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "newsletter_insert_public"
  ON newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_select_admin"
  ON newsletter_subscribers FOR SELECT USING (auth.role() = 'authenticated');

-- ─── donation_inquiries ──────────────────────────────────────────
ALTER TABLE donation_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inquiries_insert_public"
  ON donation_inquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "inquiries_select_admin"
  ON donation_inquiries FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "inquiries_update_admin"
  ON donation_inquiries FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "inquiries_delete_admin"
  ON donation_inquiries FOR DELETE USING (auth.role() = 'authenticated');

-- ─── services ───────────────────────────────────────────────────
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "services_select_public"
  ON services FOR SELECT USING (true);

CREATE POLICY "services_all_admin"
  ON services FOR ALL USING (auth.role() = 'authenticated');

-- ─── team_members ────────────────────────────────────────────────
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_select_public"
  ON team_members FOR SELECT USING (true);

CREATE POLICY "team_all_admin"
  ON team_members FOR ALL USING (auth.role() = 'authenticated');

-- ─── partners ────────────────────────────────────────────────────
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners_select_public"
  ON partners FOR SELECT USING (true);

CREATE POLICY "partners_all_admin"
  ON partners FOR ALL USING (auth.role() = 'authenticated');


-- ═══════════════════════════════════════════════════════════════
-- STORAGE
-- ═══════════════════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
  VALUES ('media', 'media', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "media_upload_admin"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "media_update_admin"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "media_delete_admin"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "media_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');


-- ═══════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════

-- ─── Moments ─────────────────────────────────────────────────────
INSERT INTO moments (title, date, category, impact, image_url, featured) VALUES
  (
    'Foundation Created',
    '2024-02-18',
    'Anniversary',
    'The first volunteer circle formed around a promise to serve overlooked families with dignity.',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80',
    true
  ),
  (
    'Winter Warmth Donation',
    '2024-06-08',
    'Donation',
    'Blankets, school jerseys, and warm meals reached families during the coldest weeks of the year.',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1600&q=80',
    false
  ),
  (
    'Back-to-School Kits',
    '2025-01-20',
    'Education',
    'Learners received stationery, bags, shoes, and mentorship check-ins for a stronger start.',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1600&q=80',
    true
  ),
  (
    'Community Pantry Weekend',
    '2025-04-12',
    'Food Relief',
    'A weekend pantry supported households facing urgent food insecurity.',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80',
    false
  ),
  (
    'First Anniversary Outreach',
    '2025-02-18',
    'Anniversary',
    'The anniversary became a service day with elders, youth volunteers, and partner families.',
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80',
    true
  );

-- ─── Blog posts ───────────────────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, body, cover_image_url, published, published_at) VALUES
  (
    'Winter Warmth Drive: 300 Families Reached',
    'winter-warmth-drive-300-families',
    'Our mid-year warmth initiative broke records — blankets, jerseys, and hot meals for over 300 households in the coldest weeks of the year.',
    E'## The Drive That Changed Winter\n\nWhen temperatures dropped across the region, The Saviour Malema Foundation mobilised its largest winter drive to date. Over three weekends in June and July, volunteers distributed blankets, warm jerseys, school-weight coats, and hot meals to more than 300 families identified through our community outreach network.\n\n### What We Delivered\n\n- **620 blankets** across 4 townships\n- **300+ hot meals** prepared by volunteer cooks\n- **150 school jerseys** for learners returning in winter terms\n- Emergency dignity kits for families with infants\n\n### A Note from the Founder\n\n> "No family should face winter without warmth. This drive reminded us why we exist — not just to give, but to restore dignity one blanket at a time."\n\nWe are grateful to every volunteer, donor, and partner who made this possible.',
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    true,
    '2025-07-15T08:00:00Z'
  ),
  (
    'Back-to-School 2025: Kits, Mentors & Fresh Starts',
    'back-to-school-2025',
    '350 learners began the school year with fully stocked backpacks, new shoes, and a mentor they could call their own.',
    E'## A Fresh Start for 350 Learners\n\nJanuary 2025 marked the foundation''s most comprehensive back-to-school drive. This year, we moved beyond stationery packs to provide learners with a complete support ecosystem — supplies, shoes, and someone to check in on them throughout the year.\n\n### What Changed in 2025\n\n- Dedicated **learner mentors** for Grade 8 and Grade 11 students\n- **Digital literacy sessions** using donated tablets\n- Monthly **check-in calls** with parents and guardians\n\n| Item | Count |\n|------|-------|\n| Learner kits | 350 |\n| Pairs of shoes | 200 |\n| Tablet devices | 45 |\n| Mentor pairs | 120 |',
    'https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=800&q=80',
    true,
    '2025-01-22T09:00:00Z'
  ),
  (
    'The Community Pantry Model: One Year On',
    'community-pantry-one-year',
    'A year ago we launched a pop-up weekend pantry. Today it serves three locations and has inspired two independent community-led spin-offs.',
    E'## From Pop-Up to Permanent Fixture\n\nThe Community Pantry started as a single Saturday experiment. One year later, it has become one of the foundation''s most replicated models — now operating every weekend at three community centres.\n\n### Community-Led Spin-Offs\n\nTwo neighbourhood groups have launched their own weekly distributions using the foundation''s model. We provide operational guidance and supplier introductions. They own their programmes completely.\n\n### What''s Next\n\nWe are developing a **Pantry Starter Kit** — a resource pack any community group can use to launch a dignified, community-run food distribution point. Expected release: Q1 2026.',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
    true,
    '2025-04-14T10:00:00Z'
  );

-- ─── Programme cards ──────────────────────────────────────────────
INSERT INTO services (id, icon_name, title, description, stat, accent, "order") VALUES
  (
    'svc-food',
    'Utensils',
    'Food Relief',
    'Weekly food parcels, hot-meal drives, and emergency pantry support for households facing hunger.',
    '500+ families monthly',
    'ember',
    1
  ),
  (
    'svc-education',
    'GraduationCap',
    'Education Support',
    'School supplies, bursaries, mentorship circles, and digital literacy programs for committed learners.',
    '350+ learners supported',
    'gold',
    2
  ),
  (
    'svc-health',
    'Stethoscope',
    'Health & Wellness',
    'Dignity kits, hygiene drives, first-aid workshops, and linking families to essential healthcare.',
    '12 clinics reached',
    'grove',
    3
  ),
  (
    'svc-youth',
    'Users',
    'Youth Development',
    'Skills workshops, sports programs, and mentorship that give young people direction and confidence.',
    '150+ youth enrolled',
    'gold',
    4
  ),
  (
    'svc-elders',
    'HeartHandshake',
    'Elder Care',
    'Home visits, essential supplies, companionship drives, and advocacy for dignified elder welfare.',
    '80 elders reached',
    'ember',
    5
  ),
  (
    'svc-stability',
    'Building2',
    'Community Stability',
    'Neighbourhood wellness programs, safe-space initiatives, and partnerships for stronger communities.',
    '15 communities engaged',
    'grove',
    6
  );

-- ─── Team members ─────────────────────────────────────────────────
INSERT INTO team_members (id, name, role, bio, photo_url, "order") VALUES
  (
    'team-founder',
    'Saviour Malema',
    'Founder & Executive Director',
    'With a background in social work and community advocacy, Saviour established the foundation in 2024 on one conviction — that every Botswana family deserves dignified, practical care.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    1
  ),
  (
    'team-outreach',
    'Naledi Mokoena',
    'Head of Outreach',
    'Naledi coordinates ground operations, volunteer networks, and community partnerships, ensuring every drive reaches its intended families.',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
    2
  ),
  (
    'team-education',
    'Kgomotso Sithole',
    'Education Programme Lead',
    'A former teacher, Kgomotso designs the back-to-school drives, learner mentorship programme, and digital literacy initiatives.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    3
  ),
  (
    'team-food',
    'Thabo Dlamini',
    'Food Relief Coordinator',
    'Thabo manages logistics for weekly food parcel distribution, the community pantry network, and emergency response across partner sites.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    4
  );

-- ─── Partners ─────────────────────────────────────────────────────
INSERT INTO partners (id, name, website, description, featured, "order") VALUES
  (
    'partner-unicef-bw',
    'UNICEF Botswana',
    'https://www.unicef.org/botswana',
    'Child welfare & development',
    true,
    1
  ),
  (
    'partner-redcross',
    'Botswana Red Cross',
    'https://www.redcross.org.bw',
    'Emergency relief & humanitarian aid',
    true,
    2
  ),
  (
    'partner-childline',
    'Childline Botswana',
    'https://childline.org.bw',
    'Child protection & welfare',
    true,
    3
  ),
  (
    'partner-worldvision',
    'World Vision Botswana',
    'https://www.wvi.org/botswana',
    'Community development partner',
    true,
    4
  ),
  (
    'partner-sos',
    'SOS Children''s Villages BW',
    'https://www.sos-childrensvillages.org',
    'Family strengthening & orphan care',
    true,
    5
  ),
  (
    'partner-stepping',
    'Stepping Stones International',
    'https://www.steppingstonesint.org',
    'Youth empowerment in Botswana',
    true,
    6
  );
