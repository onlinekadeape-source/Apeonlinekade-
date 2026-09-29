-- Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12,2) not null default 0,
  category text not null default 'Other',
  description text default '',
  stock integer not null default 0,
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
using (active = true);

drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products"
on public.products for insert to authenticated
with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products"
on public.products for update to authenticated
using (true) with check (true);

drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products"
on public.products for delete to authenticated
using (true);

-- Storage:
-- In Supabase Dashboard > Storage, create a PUBLIC bucket named: products
-- Then add storage policies allowing authenticated users to upload/delete,
-- and public users to read files.