alter table "public"."order" add column "updatedTime" timestamptz
 null default now();
