-- Create profiles table (extend users)
create table profiles (
  id uuid primary key references auth.users(id),
  username varchar(32) unique,
  avatar_url text,
  created_at timestamp default now()
);

-- Restaurants
create table restaurants (
  id serial primary key,
  name varchar(100) not null,
  description text,
  address text,
  phone varchar(20),
  latitude float,
  longitude float,
  image_url text,
  cuisine_type varchar(32),
  district varchar(32),
  rating float default 0,
  price_range varchar(10) default '$',
  website text,
  features text[],
  avg_rating float default 0,
  review_count int default 0,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Reviews / Comments
create table reviews (
  id serial primary key,
  user_id uuid references profiles(id),
  restaurant_id int references restaurants(id) on delete cascade,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamp default now()
);

-- Favorites
create table favorites (
  id serial primary key,
  user_id uuid references profiles(id),
  restaurant_id int references restaurants(id) on delete cascade,
  created_at timestamp default now(),
  unique (user_id, restaurant_id)
);

-- Blog Posts
create table blog_posts (
  id serial primary key,
  title varchar(150),
  content text,
  excerpt text,
  image_url text,
  category varchar(32),
  author_id uuid references profiles(id),
  published boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Blog Comments
create table blog_comments (
  id serial primary key,
  post_id int references blog_posts(id) on delete cascade,
  user_id uuid references profiles(id),
  comment text,
  created_at timestamp default now()
);

-- Admin roles (optional, use policies for more control)
create table admins (
  id uuid primary key references profiles(id)
);

-- Indexes
create index idx_restaurants_cuisine on restaurants(cuisine_type);
create index idx_restaurants_district on restaurants(district);
create index idx_reviews_restaurant on reviews(restaurant_id);