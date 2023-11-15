ALTER TABLE "public"."order" ALTER COLUMN "orderedAt" TYPE timestamptz;
alter table "public"."order" rename column "orderedAt" to "createdTime";
