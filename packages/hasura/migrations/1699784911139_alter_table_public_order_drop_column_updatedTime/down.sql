alter table "public"."order" alter column "updatedTime" set default now();
alter table "public"."order" alter column "updatedTime" drop not null;
alter table "public"."order" add column "updatedTime" timestamptz;
