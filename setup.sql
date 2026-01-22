-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS Table
create table users (
  id text primary key, -- Clerk ID
  email text unique not null,
  name text,
  image_url text,
  role text default 'STUDENT' check (role in ('STUDENT', 'CONSULTANT', 'ADMIN')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. CONSULTANT_PROFILES Table
create table consultant_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id text unique references users(id) on delete cascade,
  bio text,
  university text,
  graduation_year text,
  major text,
  hourly_rate numeric default 0.0,
  rating numeric default 0.0,
  review_count integer default 0,
  is_verified boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. BOOKINGS Table
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  student_id text references users(id),
  consultant_id text references users(id),
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  call_url text,
  call_id text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. AVAILABILITY Table
create table availability (
  id uuid default uuid_generate_v4() primary key,
  consultant_profile_id uuid references consultant_profiles(id) on delete cascade,
  day_of_week integer not null, -- 0=Sun, 1=Mon...
  start_time text not null, -- "09:00"
  end_time text not null,   -- "17:00"
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5. REVIEWS Table
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid unique references bookings(id),
  author_id text references users(id),
  target_id text references users(id),
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);
