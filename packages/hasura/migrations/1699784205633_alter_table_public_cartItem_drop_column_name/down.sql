alter table "public"."cartItem" alter column "name" drop not null;
alter table "public"."cartItem" add column "name" text;
