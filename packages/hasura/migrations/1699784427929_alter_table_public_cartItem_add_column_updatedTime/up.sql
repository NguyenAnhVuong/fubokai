alter table "public"."cartItem" add column "updatedTime" timestamptz
 null default now();
