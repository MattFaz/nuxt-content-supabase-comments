# Nuxt Content Supabase Comments

This project is to demonstrate how [Supabase](xxx) can be used as a comments system on a static [Nuxt3](xxx) website.

The primay purpose of this is to enable comments on a SSG blog. As such it includes several useful modules:

- [Nuxt Content](https://content.nuxtjs.org/)
- [Nuxt Supabase](https://supabase.nuxtjs.org/)
- [Nuxt Tailwind](https://tailwindcss.nuxtjs.org/)

## TODO:

- [ ] Allow users to submit comments
- [ ] Determine why comments are only loading locally
- [ ] Nested comments

## Notes

## Setup

Clone and install dependencies (_using yarn_):

```bash
git clone git@github.com:MattFaz/nuxt-content-supabase-comments.git blog
cd blog
yarn install
```

Rename `.env.example` file to `.env` and add your credentials:

```bash
mv .env.example .env
```

Start the development server:

```bash
yarn dev
```

Generate static site:

```bash
npx nuxi generate
```

## Supabase Setup

Create Tables:

```sql
-- Create a table for Public Profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique
  constraint username_length check (char_length(username) >= 3)
);

-- Create a table for Comments
create table if not exists public.comments (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default(now()),
  parent_comment_id int,
  text text not null,
  updated_at timestamp with time zone,
  profile_id uuid references public.profiles not null,
  post_uuid uuid not null
)
```

Enable Row Level Security on Profiles table:

```sql
--- Enable Row Level Security for Profiles table
alter table public.profiles
  enable row level security;
```

Create Policies on tables:

```sql
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

create policy "Comments are viewable by everyone."
  on public.comments for select
  using ( true );

create policy "Users can create Comments."
  on public.comments for insert
  with check (auth.role() = 'authenticated');

create policy "Users can update own Comments."
  on public.comments for update
  using ( auth.uid() = profile_id );
```

Create Function & Trigger to create Profile on User Signup:

```sql
-- function to insert a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data ->> 'username');
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
