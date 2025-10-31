"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  RefObject,
  useCallback,
} from "react";
import {
  addCartProduct,
  fetchTaxesData,
  getCartCount,
  getCartData,
  getDeliveryAddresses,
  postOrder,
  removeCartProduct,
} from "@/services/apiService";
import { ProductWithId, Taxes } from "@/types/product";
import { DeliveryAddress } from "@/types/delivery_address";

type LoadingState = {
  [key: number]: boolean;
  type: "add" | "remove" | "dec" | "api" | "order";
  isFetching?: boolean;
};

type CartContextType = {
  cartIconRef: RefObject<HTMLDivElement | null>;
  cartItems: ProductWithId[];
  fetchCart: () => Promise<void>;
  removeCartItem: (id: number) => Promise<void>;
  addProductToCart: ({
    productId,
    update,
    quantity,
    isBox,
  }: {
    productId: number;
    update?: boolean;
    quantity?: number;
    isBox?: boolean;
  }) => Promise<void>;
  loading: LoadingState;
  fetchCartCount: () => Promise<void>;
  fetchTaxes: () => Promise<void>;
  placeOrder: (method: "card" | "wallet", addressId: string) => Promise<void>;
  cartCount: number;
  taxes: Taxes[];
  deliveryAddress: DeliveryAddress[];
  deliveryAddressLoader: boolean;
  fetchDeliveryAddress: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const cartIconRef = useRef<HTMLDivElement | null>(null);
  const [cartItems, setItems] = useState<ProductWithId[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [taxes, setTaxes] = useState<Taxes[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    type: "api",
    isFetching: false,
  });
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress[]>([]);
  const [deliveryAddressLoader, setDeliveryAddressLoader] =
    useState<boolean>(false);

  const setLoadingState = useCallback(
    (productId: number, value: boolean, type: LoadingState["type"] = "api") => {
      setLoading((prev) => ({
        ...prev,
        [productId]: value,
        type,
        isFetching: value,
      }));
    },
    []
  );

  const fetchTaxes = useCallback(async () => {
    setLoadingState(-1, true, "api");
    try {
      const res = await fetchTaxesData();
      setTaxes(res);
    } catch (error) {
      console.error("Failed to fetch taxes:", error);
    } finally {
      setLoadingState(-1, false, "api");
    }
  }, [setLoadingState]);

  const fetchCartCount = useCallback(async () => {
    setLoadingState(-2, true, "api");
    try {
      const res = await getCartCount();
      setCartCount(res.cart_count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    } finally {
      setLoadingState(-2, false, "api");
    }
  }, [setLoadingState]);

  const fetchCart = useCallback(async () => {
    setLoadingState(-3, true, "api");
    try {
      const res = await getCartData();
      setItems(res);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setLoadingState(-3, false, "api");
    }
  }, [setLoadingState]);

  const addProductToCart = useCallback(
    async ({
      productId,
      update,
      quantity,
      isBox = false,
    }: {
      productId: number;
      update?: boolean;
      quantity?: number;
      isBox?: boolean;
    }) => {
      setLoadingState(productId, true, quantity && update ? "dec" : "add");

      try {
        await addCartProduct({
          productId,
          ...(quantity && { quantity }),
          isBox,
        });
        await fetchCartCount();

        if (update) {
          setItems((prev) =>
            prev.map((item) =>
              item.product.id === productId
                ? {
                    ...item,
                    is_box: isBox ? "1" : "0",
                    quantity: quantity
                      ? quantity.toString()
                      : (item.quantity
                          ? Number(item.quantity) + 1
                          : 1
                        ).toString(),
                  }
                : item
            )
          );
        }
        window.dispatchEvent(new CustomEvent("productAdded"));
      } catch (error) {
        console.error("Failed to add product to cart:", error);
      } finally {
        setLoadingState(productId, false, quantity && update ? "dec" : "add");
      }
    },
    [fetchCartCount, setLoadingState]
  );

  const removeCartItem = useCallback(
    async (id: number) => {
      setLoadingState(id, true, "remove");
      try {
        await removeCartProduct(id);
        await fetchCartCount();

        setItems((prev) => prev.filter((i) => i.id !== id));
      } catch (error) {
        console.error("Failed to remove cart item:", error);
      } finally {
        setLoadingState(id, false, "remove");
      }
    },
    [fetchCartCount, setLoadingState]
  );

  const placeOrder = useCallback(
    async (method: "card" | "wallet", addressId: string) => {
      const id = Math.random();
      setLoadingState(id, true, "order");
      try {
        const res = await postOrder(method, addressId);
        if (res.data?.redirect_url) {
          window.location.href = res.data.redirect_url;
        } else {
          setCartCount(0);
          setItems([]);
          window.location.href = `/${locale}/profile?tab=orders`;
        }
      } catch (error) {
        console.error("Failed to place order:", error);
        setLoadingState(id, false, "order");
      }
    },
    [locale, setLoadingState]
  );

  const fetchDeliveryAddress = useCallback(async () => {
    setDeliveryAddressLoader(true);
    try {
      const res = await getDeliveryAddresses();
      setDeliveryAddress(res);
    } catch (_) {
    } finally {
      setDeliveryAddressLoader(false);
    }
  }, [setLoadingState]);

  return (
    <CartContext.Provider
      value={{
        cartIconRef,
        fetchCart,
        addProductToCart,
        cartItems,
        removeCartItem,
        loading,
        fetchCartCount,
        cartCount,
        fetchTaxes,
        taxes,
        placeOrder,
        deliveryAddress,
        deliveryAddressLoader,
        fetchDeliveryAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
