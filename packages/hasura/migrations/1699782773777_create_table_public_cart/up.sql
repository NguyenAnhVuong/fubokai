CREATE TABLE "public"."cart" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "creatorId" text NOT NULL, PRIMARY KEY ("id") , FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"), UNIQUE ("name"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
