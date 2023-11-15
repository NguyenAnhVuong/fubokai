alter table "public"."order"
  add constraint "order_menuId_fkey"
  foreign key ("menuId")
  references "public"."menu"
  ("id") on update restrict on delete restrict;
