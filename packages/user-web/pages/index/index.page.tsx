import { useCartItems } from "hooks/useCartItems";
import Head from "next/head";
import { AppBar } from "pages/index/AppBar";
import { Fab } from "pages/index/Fab";
import { Header } from "pages/index/Header";
import { MenuList } from "pages/index/MenuList";
import {
  useIndexAddMenuIntoCartMutation,
  useIndexGetCategoriesAndMenusQuery,
  useIndexGetMenuByCategoryIdAndKeywordQuery,
  useIndexRemoveMenuFromCartMutation,
} from "pages/index/queries";
import { useCallback, useState } from "react";

const Index = () => {
  const { data: categoriesAndMenusData } = useIndexGetCategoriesAndMenusQuery();
  const categories = categoriesAndMenusData?.category ?? [];
  const menus = categoriesAndMenusData?.menu ?? [];
  const [keyWord, setKeyWord] = useState<string>("");

  const { cartItems } = useCartItems();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  if (categories.length > 0 && selectedCategoryId === null) {
    setSelectedCategoryId(categories[0].id);
  }

  const { data: filteredMenu, error } = useIndexGetMenuByCategoryIdAndKeywordQuery({
    variables: { keyword: `%${keyWord}%`, categoryId: selectedCategoryId },
    skip: !selectedCategoryId,
  });

  const [addMenuIntoCart] = useIndexAddMenuIntoCartMutation();

  const [removeMenuFromCart] = useIndexRemoveMenuFromCartMutation();

  const onAdd = useCallback((menuId: string) => addMenuIntoCart({ variables: { input: { menuId, quantity: 1 } } }), [addMenuIntoCart]);

  const onRemove = useCallback((menuId: string) => removeMenuFromCart({ variables: { input: { menuId, quantity: 1 } } }), [removeMenuFromCart]);

  if (error) {
    return <div>error</div>;
  }

  return (
    <>
      <Head>
        <title>MO App</title>
      </Head>
      <Header setKeyWord={setKeyWord} />
      <AppBar categories={categories} onChange={setSelectedCategoryId} />
      {filteredMenu && filteredMenu.menu.length > 0 && <MenuList menus={filteredMenu.menu} cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} />}
      <Fab cartItems={cartItems} />
    </>
  );
};

export default Index;
