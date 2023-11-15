CREATE TABLE "public"."orderItem" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "orderId" uuid NOT NULL, "menuId" uuid NOT NULL, "quantity" integer NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("orderId") REFERENCES "public"."order"("id") ON UPDATE restrict ON DELETE restrict, FOREIGN KEY ("menuId") REFERENCES "public"."menu"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("id"));
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_orderItem_updated_at"
BEFORE UPDATE ON "public"."orderItem"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_orderItem_updated_at" ON "public"."orderItem"
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
