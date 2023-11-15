alter table "public"."order" rename column "createdTime" to "orderedAt";
ALTER TABLE "public"."order" ALTER COLUMN "orderedAt" TYPE timestamp without time zone;
