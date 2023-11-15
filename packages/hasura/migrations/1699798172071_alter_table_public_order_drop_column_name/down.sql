alter table "public"."order" alter column "name" drop not null;
alter table "public"."order" add column "name" text;
