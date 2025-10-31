"use client";

import { cancelOrder, getOrders } from "@/services/apiService";
import { Order } from "@/types/order";
import { PaginatedResponse } from "@/types/pagination";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface OrderContextType {
  orders: PaginatedResponse<Order>;
  fetchOrders: (page?: number) => void;
  postCancelOrder: (orderId: number) => void;
  loading: boolean;
  actionLoader: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<PaginatedResponse<Order>>({
    data: [],
    meta: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoader, setActionLoader] = useState<boolean>(false);

  const fetchOrders = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const res = await getOrders(page);
      setOrders(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  const postCancelOrder = async (orderId: number) => {
    setActionLoader(true);
    try {
      await cancelOrder(orderId);
      setOrders((prev) => ({
        ...prev,
        data: prev.data.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: "cancelled",
            };
          }
          return order;
        }),
      }));
    } catch (error) {
      throw error;
    } finally {
      setActionLoader(false);
    }
  };

  return (
    <OrderContext.Provider
      value={{ orders, fetchOrders, loading, postCancelOrder, actionLoader }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
