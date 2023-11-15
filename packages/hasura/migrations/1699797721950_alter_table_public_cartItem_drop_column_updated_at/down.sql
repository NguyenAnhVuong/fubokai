alter table "public"."cartItem" alter column "updated_at" set default now();
alter table "public"."cartItem" alter column "updated_at" drop not null;
alter table "public"."cartItem" add column "updated_at" timestamptz;
