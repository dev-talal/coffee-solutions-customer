"use client";

import {
  createContext,
  useContext,
  useRef,
  RefObject,
  useState,
  ReactNode,
  useCallback,
} from "react";

import {
  getWishlistsData,
  postAddWishlist,
  removeWishlist,
} from "@/services/apiService";
import { ProductWithId } from "@/types/product";

type WishlistContextType = {
  wishlistIconRef: RefObject<HTMLDivElement | null>;
  loading: { [key: number]: boolean };
  toggleWishlist: (productId: number, isLiked: boolean) => Promise<void>;
  getWishlists: () => Promise<void>;
  wishlists: ProductWithId[];
  apiLoading: boolean;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const wishlistIconRef = useRef<HTMLDivElement | null>(null);
  const [wishlists, setWishlists] = useState<ProductWithId[]>([]);
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [apiLoading, setApiLoading] = useState(true);
  const setLoadingState = useCallback((productId: number, value: boolean) => {
    setLoading((prev) => ({
      ...prev,
      [productId]: value,
    }));
  }, []);

  const ItemInWishlist = useCallback(
    (productId: number) => {
      return wishlists.findIndex((item) => item.product.id === productId) > -1;
    },
    [wishlists]
  );

  const toggleWishlist = useCallback(
    async (productId: number, isLiked: boolean) => {
      setLoadingState(productId, true);
      try {
        if (isLiked) {
          const res = await postAddWishlist(productId);
          if (!ItemInWishlist(productId)) {
            setWishlists([...wishlists, res.data]);
          }
        } else {
          await removeWishlist(productId);
          setWishlists(
            wishlists.filter((item) => item.product.id !== productId)
          );
        }
      } catch (error) {
        throw error;
      } finally {
        setLoadingState(productId, false);
      }
    },
    [wishlists, setWishlists, setLoadingState, ItemInWishlist]
  );

  const getWishlists = useCallback(async () => {
    setApiLoading(true);
    try {
      const res = await getWishlistsData();
      setWishlists(res);
    } catch (error) {
      throw error;
    } finally {
      setApiLoading(false);
    }
  }, [setWishlists, setApiLoading]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIconRef,
        loading,
        toggleWishlist,
        getWishlists,
        wishlists,
        apiLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
