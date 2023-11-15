import { GetCartsQuery } from "pages/carts/queries";
import { IndexGetCategoriesAndMenusQuery, IndexGetMenuByCategoryIdAndKeywordQuery } from "pages/index/queries";

export type Category = IndexGetCategoriesAndMenusQuery["category"][number];

export type Menu = IndexGetCategoriesAndMenusQuery["menu"][number];

export type FilteredMenu = IndexGetMenuByCategoryIdAndKeywordQuery["menu"][number];

export type Cart = GetCartsQuery["cart"][number];
