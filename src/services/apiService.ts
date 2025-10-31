import { buildQueryParams, getGuestId } from "@/helpers/dataFormat";
import apiService from "@/lib/axios";
import {
  EmailValues,
  ForgotPasswordValues,
  ProfileSchemaType,
  ResetPasswordValues,
} from "@/lib/validations/auth";

import { toFormData } from "axios";
import {
  ApiResponseCollection,
  Product,
  ProductWithId,
  ProductCategory,
  Banner,
} from "@/types/product";
import { Order } from "@/types/order";
import { Transaction } from "@/types/transaction";
import { PaginatedResponse } from "@/types/pagination";
import { DeliveryAddressFormData } from "@/lib/validations/profile";
import { DeliveryAddress } from "@/types/delivery_address";

export const AuthCheck = async () => {
  const res = await apiService.get("/auth/me");
  return res.data.data;
};

export const postLogin = async (email: string, password: string) => {
  return await apiService.post("/login", { email, password });
};

export const postLogout = async () => {
  return await apiService.delete("/auth/logout");
};

export const getHomeDataQuery = async (
  token: string | undefined
): Promise<ApiResponseCollection> => {
  const res = await apiService.get("/customer/home", {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data.data;
};

export const getHomeBannersQuery = async (): Promise<Banner[]> => {
  const res = await apiService.get("/customer/banners?type=all");
  return res.data.data;
};

export const getAllProducts = async (): Promise<Product[]> => {
  const res = await apiService.get("/customer/products?type=all");
  return res.data.data;
};

export const getOtherProducts = async (params: {
  page?: number;
  search?: string;
  min?: number | "";
  max?: number | "";
  sort?: string;
}): Promise<PaginatedResponse<Product>> => {
  const query = buildQueryParams(params);
  const res = await apiService.get(`/customer/products${query}`);
  return res.data;
};

export const getPopularProducts = async (): Promise<Product[]> => {
  const res = await apiService.get("/customer/products?type=all");
  return res.data.data;
};

export const getProductCategories = async (
  token?: string
): Promise<ProductCategory[]> => {
  const res = await apiService.get("/customer/product/categories?type=all", {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data.data;
};

export const getProductsByCategory = async (
  categoryId: number,
  token?: string,
  page: number = 1
): Promise<PaginatedResponse<Product>> => {
  const res = await apiService.get(
    `/customer/products?category_id=${categoryId}&per_page=10&page=${page}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );
  return res.data;
};

export const getProductDetails = async (
  id: number | string,
  token?: string
): Promise<Product> => {
  const res = await apiService.get(`/customer/product/${id}/details`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data.data;
};

export const getWishlistsData = async (): Promise<ProductWithId[]> => {
  const res = await apiService.get(`/customer/wishlist?type=all`);
  return res.data.data;
};

export const postAddWishlist = async (productId: number) => {
  const res = await apiService.post(`/customer/wishlist/add`, {
    product_id: productId,
  });
  return res.data;
};

export const removeWishlist = async (productId: number) => {
  const res = await apiService.delete(`/customer/wishlist/remove/${productId}`);
  return res.data;
};

export const getCartData = async (): Promise<ProductWithId[]> => {
  const guestId = getGuestId();
  const res = await apiService.get(`/customer/cart`, {
    params: guestId ? { guest_id: guestId } : {},
  });
  return res.data.data;
};

export const addCartProduct = async ({
  productId,
  quantity,
  isBox = false,
}: {
  productId: number;
  quantity?: number;
  isBox?: boolean;
}) => {
  const res = await apiService.post(`/customer/cart/add/product`, {
    product_id: productId,
    quantity,
    guest_id: getGuestId(),
    is_box: isBox,
  });
  return res.data;
};

export const removeCartProduct = async (id: number) => {
  const res = await apiService.delete(`/customer/cart/remove/product/${id}`);
  return res.data;
};

export const syncCart = async () => {
  const guestId = getGuestId();
  const res = await apiService.post(`/customer/sync/cart`, {
    guest_id: guestId,
  });
  return res.data;
};

export const fetchTaxesData = async () => {
  const res = await apiService.get("/customer/taxes");
  return res.data.data;
};

export const getCartCount = async () => {
  const guestId = getGuestId();

  const res = await apiService.get("/customer/cart/count", {
    params: guestId ? { guest_id: guestId } : {},
  });

  return res.data.data;
};

export const getSuggestedProducts = async (id: number) => {
  const res = await apiService.get(`/customer/suggested/products/${id}`);
  return res.data.data;
};

export const postForgotPasswordEmail = async (payload: EmailValues) => {
  const res = await apiService.post(`/forgot-password`, payload);
  return res.data;
};

export const postResetPassword = async (data: ForgotPasswordValues) => {
  const res = await apiService.post("/reset-password", data);
  return res.data;
};

export const postChangePassword = async (data: ResetPasswordValues) => {
  const res = await apiService.post("/auth/change-password", data);
  return res.data;
};

export const postOrder = async (data: "card" | "wallet", addressId: string) => {
  const res = await apiService.post("/customer/order/place", {
    payment_method: data,
    address_id: addressId,
  });
  return res.data;
};

export const getOrders = async (
  page: number = 1
): Promise<PaginatedResponse<Order>> => {
  const res = await apiService.get(`customer/order?page=${page}`);
  return res.data;
};

export const postUpdateProfile = async (data: ProfileSchemaType) => {
  const res = await apiService.post(
    "/auth/update-profile",
    toFormData({ ...data, method: "_put" })
  );
  return res.data;
};

export const getTransactions = async (
  page: number
): Promise<PaginatedResponse<Transaction>> => {
  const res = await apiService.get(`/customer/transactions?page=${page}`);
  return res.data;
};

export const getSearchProducts = async (query: string): Promise<Product[]> => {
  const res = await apiService.get(`/customer/search/products?search=${query}`);
  return res.data.data;
};

export const cancelOrder = async (orderId: number) => {
  const res = await apiService.post(`/customer/order/cancel`, {
    order_id: orderId,
  });
  return res.data;
};

export const postCreateDeliveryAddress = async (
  data: DeliveryAddressFormData
) => {
  const res = await apiService.post("/customer/delivery-address", data);
  return res.data;
};

export const getDeliveryAddresses = async (): Promise<DeliveryAddress[]> => {
  const res = await apiService.get("/customer/delivery-address");
  return res.data.data;
};

export const deleteDeliveryAddress = async (id: number) => {
  const res = await apiService.delete(
    `/customer/delivery-address/delete/${id}`
  );
  return res.data;
};

export const updateDeliveryAddress = async (
  id: number,
  data: DeliveryAddressFormData
) => {
  const res = await apiService.post(
    `/customer/delivery-address/update/${id}`,
    data
  );
  return res.data;
};
