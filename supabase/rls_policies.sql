-- Portfolio+ RLS policies
-- Generated from the provided table schema.
-- IMPORTANT: Review against the policies already applied in Supabase before executing
-- this file on an existing database, because CREATE POLICY will fail if a policy
-- with the same name already exists.

begin;

/* =========================================================
   Helper: enable RLS
   ========================================================= */

alter table public.profiles enable row level security;
alter table public.portfolios enable row level security;
alter table public.portfolio_tech_stacks enable row level security;
alter table public.portfolio_likes enable row level security;
alter table public.portfolio_images enable row level security;
alter table public.portfolio_categories enable row level security;
alter table public.portfolio_ai_created enable row level security;
alter table public.messages enable row level security;
alter table public.collections enable row level security;
alter table public.bookmarks enable row level security;
alter table public.ai_action_cooldowns enable row level security;

/* =========================================================
   profiles
   - Public profiles are visible to everyone.
   - Private profiles are visible only to the owner.
   - Only the owner can insert/update/delete their profile.
   ========================================================= */

create policy "profiles_select_public_or_own"
on public.profiles
for select
to anon, authenticated
using (
  is_public = true
  or (select auth.uid()) = user_id
);

create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "profiles_delete_own"
on public.profiles
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

/* =========================================================
   portfolios
   - Public portfolios are visible to everyone.
   - Private portfolios are visible only to the author.
   - Only the author can create/update/delete their portfolios.
   ========================================================= */

create policy "portfolios_select_public_or_own"
on public.portfolios
for select
to anon, authenticated
using (
  is_public = true
  or (select auth.uid()) = author_id
);

create policy "portfolios_insert_own"
on public.portfolios
for insert
to authenticated
with check (
  (select auth.uid()) = author_id
);

create policy "portfolios_update_own"
on public.portfolios
for update
to authenticated
using (
  (select auth.uid()) = author_id
)
with check (
  (select auth.uid()) = author_id
);

create policy "portfolios_delete_own"
on public.portfolios
for delete
to authenticated
using (
  (select auth.uid()) = author_id
);

/* =========================================================
   portfolio_tech_stacks
   - Public for public portfolios; author can always access own.
   - Only the portfolio author can write.
   ========================================================= */

create policy "portfolio_tech_stacks_select_public_or_own"
on public.portfolio_tech_stacks
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_tech_stacks.project_id
      and (
        p.is_public = true
        or p.author_id = (select auth.uid())
      )
  )
);

create policy "portfolio_tech_stacks_insert_author"
on public.portfolio_tech_stacks
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_tech_stacks.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_tech_stacks_update_author"
on public.portfolio_tech_stacks
for update
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_tech_stacks.project_id
      and p.author_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_tech_stacks.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_tech_stacks_delete_author"
on public.portfolio_tech_stacks
for delete
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_tech_stacks.project_id
      and p.author_id = (select auth.uid())
  )
);

/* =========================================================
   portfolio_likes
   - Like rows can be viewed publicly for counts / social proof.
   - A user can create/delete only their own like.
   ========================================================= */

create policy "portfolio_likes_select_public"
on public.portfolio_likes
for select
to anon, authenticated
using (true);

create policy "portfolio_likes_insert_own"
on public.portfolio_likes
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "portfolio_likes_delete_own"
on public.portfolio_likes
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

/* =========================================================
   portfolio_images
   - Images are visible when their portfolio is public, or to the author.
   - Only the portfolio author can write.
   ========================================================= */

create policy "portfolio_images_select_public_or_own"
on public.portfolio_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_images.project_id
      and (
        p.is_public = true
        or p.author_id = (select auth.uid())
      )
  )
);

create policy "portfolio_images_insert_author"
on public.portfolio_images
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_images.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_images_update_author"
on public.portfolio_images
for update
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_images.project_id
      and p.author_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_images.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_images_delete_author"
on public.portfolio_images
for delete
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_images.project_id
      and p.author_id = (select auth.uid())
  )
);

/* =========================================================
   portfolio_categories
   - Same access model as tech stacks.
   ========================================================= */

create policy "portfolio_categories_select_public_or_own"
on public.portfolio_categories
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_categories.project_id
      and (
        p.is_public = true
        or p.author_id = (select auth.uid())
      )
  )
);

create policy "portfolio_categories_insert_author"
on public.portfolio_categories
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_categories.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_categories_update_author"
on public.portfolio_categories
for update
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_categories.project_id
      and p.author_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_categories.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_categories_delete_author"
on public.portfolio_categories
for delete
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_categories.project_id
      and p.author_id = (select auth.uid())
  )
);

/* =========================================================
   portfolio_ai_created
   - AI results follow the portfolio visibility.
   - Only the portfolio author can create/update/delete results.
   ========================================================= */

create policy "portfolio_ai_created_select_public_or_own"
on public.portfolio_ai_created
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_ai_created.project_id
      and (
        p.is_public = true
        or p.author_id = (select auth.uid())
      )
  )
);

create policy "portfolio_ai_created_insert_author"
on public.portfolio_ai_created
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_ai_created.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_ai_created_update_author"
on public.portfolio_ai_created
for update
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_ai_created.project_id
      and p.author_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_ai_created.project_id
      and p.author_id = (select auth.uid())
  )
);

create policy "portfolio_ai_created_delete_author"
on public.portfolio_ai_created
for delete
to authenticated
using (
  exists (
    select 1
    from public.portfolios p
    where p.project_id = portfolio_ai_created.project_id
      and p.author_id = (select auth.uid())
  )
);

/* =========================================================
   messages
   - Only sender/receiver can read messages.
   - Sender creates their own message.
   - Sender/receiver can update/delete a message.
   ========================================================= */

create policy "messages_select_participants"
on public.messages
for select
to authenticated
using (
  (select auth.uid()) = sender_id
  or (select auth.uid()) = receiver_id
);

create policy "messages_insert_sender"
on public.messages
for insert
to authenticated
with check (
  (select auth.uid()) = sender_id
);

create policy "messages_update_participants"
on public.messages
for update
to authenticated
using (
  (select auth.uid()) = sender_id
  or (select auth.uid()) = receiver_id
)
with check (
  (select auth.uid()) = sender_id
  or (select auth.uid()) = receiver_id
);

create policy "messages_delete_participants"
on public.messages
for delete
to authenticated
using (
  (select auth.uid()) = sender_id
  or (select auth.uid()) = receiver_id
);

/* =========================================================
   collections
   - Only the owner can CRUD their collections.
   ========================================================= */

create policy "collections_select_own"
on public.collections
for select
to authenticated
using (
  (select auth.uid()) = owner_id
);

create policy "collections_insert_own"
on public.collections
for insert
to authenticated
with check (
  (select auth.uid()) = owner_id
);

create policy "collections_update_own"
on public.collections
for update
to authenticated
using (
  (select auth.uid()) = owner_id
)
with check (
  (select auth.uid()) = owner_id
);

create policy "collections_delete_own"
on public.collections
for delete
to authenticated
using (
  (select auth.uid()) = owner_id
);

/* =========================================================
   bookmarks
   - Only the bookmark owner can CRUD bookmark rows.
   ========================================================= */

create policy "bookmarks_select_own"
on public.bookmarks
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "bookmarks_insert_own"
on public.bookmarks
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "bookmarks_update_own"
on public.bookmarks
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "bookmarks_delete_own"
on public.bookmarks
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

/* =========================================================
   ai_action_cooldowns
   - Users can only read/write their own cooldown rows.
   - Edge Functions using elevated privileges can bypass RLS as configured.
   ========================================================= */

create policy "ai_action_cooldowns_select_own"
on public.ai_action_cooldowns
for select
to authenticated
using (
  (select auth.uid()) = user_id
);

create policy "ai_action_cooldowns_insert_own"
on public.ai_action_cooldowns
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
);

create policy "ai_action_cooldowns_update_own"
on public.ai_action_cooldowns
for update
to authenticated
using (
  (select auth.uid()) = user_id
)
with check (
  (select auth.uid()) = user_id
);

create policy "ai_action_cooldowns_delete_own"
on public.ai_action_cooldowns
for delete
to authenticated
using (
  (select auth.uid()) = user_id
);

commit;
