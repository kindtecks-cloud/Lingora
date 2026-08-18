-- Lingora database foundation (PostgreSQL / Supabase-ready)
-- This schema is a planning/development artifact; it is NOT connected to the GitHub Pages prototype yet.

create table if not exists profiles (
  id uuid primary key,
  role text not null check (role in ('student','tutor')),
  full_name text not null,
  email text unique not null,
  avatar_url text,
  country text,
  created_at timestamptz not null default now()
);

create table if not exists tutors (
  id uuid primary key references profiles(id) on delete cascade,
  bio text,
  languages text[] not null default '{}',
  levels text[] not null default '{}',
  goals text[] not null default '{}',
  price_eur numeric(6,2) not null check (price_eur between 4 and 10),
  experience_years integer not null default 0,
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  approved boolean not null default false
);

create table if not exists availability_slots (
  id uuid primary key,
  tutor_id uuid not null references tutors(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'available' check (status in ('available','booked','blocked'))
);

create table if not exists bookings (
  id uuid primary key,
  student_id uuid not null references profiles(id),
  tutor_id uuid not null references tutors(id),
  slot_id uuid not null references availability_slots(id),
  status text not null default 'pending' check (status in ('pending','confirmed','cancelled','completed')),
  amount_eur numeric(6,2) not null,
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','paid','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key,
  booking_id uuid unique not null references bookings(id),
  student_id uuid not null references profiles(id),
  tutor_id uuid not null references tutors(id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);
