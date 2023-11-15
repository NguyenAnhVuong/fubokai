alter table "public"."order" alter column "quantity" drop not null;
alter table "public"."order" add column "quantity" int4;
