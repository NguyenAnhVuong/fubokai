alter table "public"."order" alter column "created_at" set default now();
alter table "public"."order" alter column "created_at" drop not null;
alter table "public"."order" add column "created_at" timestamptz;
