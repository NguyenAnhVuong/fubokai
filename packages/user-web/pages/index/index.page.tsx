import { useAuth } from "hooks/useAuth";
import { useCartItems } from "hooks/useCartItems";
import Head from "next/head";
import { AppBar } from "pages/index/AppBar";
import { Fab } from "pages/index/Fab";
import { Header } from "pages/index/Header";
import { MenuList } from "pages/index/MenuList";
import {
  useAddMenuIntoCartMutation,
  useIndexGetCategoriesAndMenusQuery,
  useIndexGetMenuByCategoryIdAndKeywordQuery,
  useRemoveMenuFromCartMutation,
} from "pages/index/queries";
import { useCallback, useState } from "react";

const Index = () => {
  const { data: categoriesAndMenusData } = useIndexGetCategoriesAndMenusQuery();
  const categories = categoriesAndMenusData?.category ?? [];
  const menus = categoriesAndMenusData?.menu ?? [];
  const [keyWord, setKeyWord] = useState<string>("");
  const { usingCartId } = useAuth();

  const { cartItems } = useCartItems(usingCartId);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  if (categories.length > 0 && selectedCategoryId === null) {
    setSelectedCategoryId(categories[0].id);
  }

  const { data: filteredMenu, error } = useIndexGetMenuByCategoryIdAndKeywordQuery({
    variables: { keyword: `%${keyWord}%`, categoryId: selectedCategoryId },
    skip: !selectedCategoryId,
  });

  const [addMenuIntoCart] = useAddMenuIntoCartMutation();

  const [removeMenuFromCart] = useRemoveMenuFromCartMutation();

  const onAdd = useCallback(
    (menuId: string) => {
      if (usingCartId) {
        addMenuIntoCart({ variables: { input: { menuId, quantity: 1, cartId: usingCartId } } });
      }
    },
    [addMenuIntoCart, usingCartId],
  );

  const onRemove = useCallback(
    (menuId: string) => {
      if (usingCartId) {
        removeMenuFromCart({ variables: { input: { menuId, quantity: 1, cartId: usingCartId } } });
      }
    },
    [removeMenuFromCart, usingCartId],
  );

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
      {filteredMenu && filteredMenu.menu.length > 0 && (
        <MenuList menus={filteredMenu.menu} cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} />
      )}
      <Fab cartItems={cartItems} />
    </>
  );
};

export default Index;
