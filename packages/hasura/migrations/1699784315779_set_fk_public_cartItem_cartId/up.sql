alter table "public"."cartItem"
  add constraint "cartItem_cartId_fkey"
  foreign key ("cartId")
  references "public"."cart"
  ("id") on update restrict on delete restrict;
