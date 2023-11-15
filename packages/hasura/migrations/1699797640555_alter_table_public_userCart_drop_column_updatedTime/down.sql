alter table "public"."userCart" alter column "updatedTime" set default now();
alter table "public"."userCart" alter column "updatedTime" drop not null;
alter table "public"."userCart" add column "updatedTime" timestamptz;
