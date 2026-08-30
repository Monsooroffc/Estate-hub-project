-- ============================================================================
-- SUPABASE STORAGE SETUP — Estate Hub property media (photos & videos)
-- Run ONCE: Supabase Dashboard -> SQL Editor -> New query -> paste ALL -> Run
--
-- Creates two PUBLIC buckets and the policies that let the app upload
-- directly from the browser using the PUBLISHABLE key only.
-- (No service-role credentials are ever used in the frontend.)
-- ============================================================================

-- 1) BUCKETS -----------------------------------------------------------------
-- property-images : up to 15 MB per photo
-- property-videos : up to 500 MB per video
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'property-images', 'property-images', true, 15728640,
    array[
      'image/jpeg', 'image/jpg', 'image/pjpeg', 'image/png', 'image/webp',
      'image/gif', 'image/heic', 'image/heif', 'image/avif'
    ]::text[]
  ),
  (
    'property-videos', 'property-videos', true, 524288000,
    array[
      'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
      'video/x-matroska', 'video/3gpp', 'video/3gpp2', 'video/x-m4v',
      'video/mpeg', 'video/ogg', 'application/octet-stream'
    ]::text[]
  )
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2) POLICIES — images ---------------------------------------------------------
drop policy if exists "Estate Hub: public read property images" on storage.objects;
create policy "Estate Hub: public read property images"
  on storage.objects for select to public
  using (bucket_id = 'property-images');

drop policy if exists "Estate Hub: public upload property images" on storage.objects;
create policy "Estate Hub: public upload property images"
  on storage.objects for insert to public
  with check (bucket_id = 'property-images');

drop policy if exists "Estate Hub: public update property images" on storage.objects;
create policy "Estate Hub: public update property images"
  on storage.objects for update to public
  using (bucket_id = 'property-images')
  with check (bucket_id = 'property-images');

drop policy if exists "Estate Hub: public delete property images" on storage.objects;
create policy "Estate Hub: public delete property images"
  on storage.objects for delete to public
  using (bucket_id = 'property-images');

-- 3) POLICIES — videos ---------------------------------------------------------
drop policy if exists "Estate Hub: public read property videos" on storage.objects;
create policy "Estate Hub: public read property videos"
  on storage.objects for select to public
  using (bucket_id = 'property-videos');

drop policy if exists "Estate Hub: public upload property videos" on storage.objects;
create policy "Estate Hub: public upload property videos"
  on storage.objects for insert to public
  with check (bucket_id = 'property-videos');

drop policy if exists "Estate Hub: public update property videos" on storage.objects;
create policy "Estate Hub: public update property videos"
  on storage.objects for update to public
  using (bucket_id = 'property-videos')
  with check (bucket_id = 'property-videos');

drop policy if exists "Estate Hub: public delete property videos" on storage.objects;
create policy "Estate Hub: public delete property videos"
  on storage.objects for delete to public
  using (bucket_id = 'property-videos');
