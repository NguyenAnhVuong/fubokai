alter table "public"."user"
  add constraint "user_usingCartId_fkey"
  foreign key ("usingCartId")
  references "public"."cart"
  ("id") on update restrict on delete restrict;
