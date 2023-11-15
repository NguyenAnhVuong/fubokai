alter table "public"."order" alter column "menuId" drop not null;
alter table "public"."order" add column "menuId" uuid;
