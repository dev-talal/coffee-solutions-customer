"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "@/providers/TranslationProvider";
import { useParams } from "next/navigation";
import { useOrder } from "@/providers/OrderProvider";
import { formatCurrency } from "@/helpers/dataFormat";
import Image from "next/image";
import { DynamicIcon } from "lucide-react/dynamic";
import CustomPagination from "../common/CustomPagination";
import { cn } from "@/lib/utils";
import { Order, OrderItem } from "@/types/order";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { InvoiceModal } from "../common/modal/InvoiceModal";

const OrdersHistory: React.FC = () => {
  const t = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const locale = useParams().locale || "en";
  const isRtl = locale === "ar";
  const { fetchOrders, orders, loading, postCancelOrder, actionLoader } =
    useOrder();
  const { fetchUser } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      case "in transit":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "unpaid":
        return "bg-[#FFA500]";
      default:
        return "bg-gray-500";
    }
  };

  const onPageChange = (page: number) => {
    fetchOrders(page);
  };

  const onCancelOrder = async (
    e: React.MouseEvent<HTMLDivElement>,
    order: Order
  ) => {
    e.stopPropagation();
    await postCancelOrder(order.id);
    fetchUser();
  };

  const getUnit = (item: OrderItem) => {
    const UnitName = isRtl ? item.ar_unit : item.unit;
    const unitUom = isRtl ? item.ar_uom_unit : item.uom_unit;
    if (item.is_box === "0")
      return `${item.quantity} × ${UnitName || t("piece")}`;
    return `${item.quantity} × ${unitUom || t("box")} (${
      item.product_pieces_per_box
    } ${UnitName || t("piece")})`;
  };

  const handleViewInvoice = (item: Order) => {
    setSelectedOrder(item);
    setIsOpen(true);
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  return (
    <>
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold text-foreground">
            {t("orderHistory")}
          </h2>
        </div>
        {orders.data.length === 0 && !loading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-foreground">{t("noOrders")}</p>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="flex items-center justify-center">
            <DynamicIcon
              name="loader"
              className="w-8 h-8 mx-auto text-coffee-brown animate-spin"
            />
          </div>
        ) : (
          <div className="space-y-3 mt-2" dir={isRtl ? "rtl" : "ltr"}>
            <Accordion
              type="single"
              collapsible
              className="space-y-4"
              disabled={actionLoader}
            >
              {orders.data.map((order) => (
                <AccordionItem
                  key={order.id.toString()}
                  value={order.id.toString()}
                  className="border-none"
                >
                  <Card className="overflow-hidden pt-0 gap-4">
                    <CardHeader className="bg-gray-100 p-0 dark:bg-stone-900">
                      <AccordionTrigger className="w-full px-6 py-4 hover:no-underline">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center space-x-4">
                            <div>
                              <CardTitle className="text-lg font-semibold text-start ">
                                {t("order")} {"#"} {order.id}
                              </CardTitle>
                              <p className="text-sm text-start ">
                                {formatDate(order.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 capitalize">
                            <Badge
                              className={`rounded-full ${getStatusColor(
                                order.payment_status === "paid"
                                  ? order.status
                                  : order.payment_status
                              )} text-white`}
                            >
                              {t(
                                `${
                                  order.payment_status === "paid"
                                    ? order.status
                                    : order.payment_status
                                }`
                              )}
                            </Badge>
                            {order.payment_status === "paid" &&
                              order.status === "pending" && (
                                <div
                                  className={cn(
                                    "py-0 h-[28px] px-4 flex items-center justify-center hover:text-white text-white rounded-full ",
                                    {
                                      "bg-red-400 pointer-events-none cursor-not-allowed":
                                        actionLoader,
                                      "bg-red-500 hover:bg-red-600 cursor-pointer":
                                        !actionLoader,
                                    }
                                  )}
                                  onClick={(e) =>
                                    !actionLoader && onCancelOrder(e, order)
                                  }
                                >
                                  {t("cancel")}
                                </div>
                              )}
                          </div>
                        </div>
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-bold mb-3">
                              {t("orderItems")}
                            </h4>
                            <div className="space-y-1">
                              {order.items.map((item) =>
                                item.product_name ? (
                                  <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2 flex-1"
                                  >
                                    <div className="flex items-center space-x-3">
                                      {item.product_image && (
                                        <Image
                                          src={item.product_image}
                                          width={40}
                                          height={80}
                                          alt={item.product.name}
                                          loading="lazy"
                                        />
                                      )}
                                      <div>
                                        <p className="font-medium">
                                          {isRtl
                                            ? item.product_ar_name
                                            : item.product_name}
                                        </p>
                                        <p className="text-sm">
                                          {t("quantity")}&nbsp;:&nbsp;
                                          {getUnit(item)}
                                        </p>
                                      </div>
                                    </div>
                                    <p className="font-medium">
                                      {t("sar")}{" "}
                                      {formatCurrency(Number(item.total))}
                                    </p>
                                  </div>
                                ) : (
                                  <p
                                    className="text-red-500 text-md font-semibold"
                                    key={item.id}
                                  >
                                    {t("productsNotFound")}
                                  </p>
                                )
                              )}
                            </div>
                          </div>
                          <Separator />
                          <div className="text-start flex flex-col items-start w-fit">
                            {order.is_linked == "1" ? (
                              <div>
                                <h4 className="text-sm font-semibold">
                                  {t("locationLink")}
                                </h4>
                                <p className="text-sm break-all underline">
                                  <a target="_blank" href={order.address_link}>
                                    {order.address_link}
                                  </a>
                                </p>
                              </div>
                            ) : order.is_linked == "0" ? (
                              <>
                                <h3 className="text-sm font-semibold">
                                  {t("deliveryAddress")}
                                </h3>
                                <div className="flex space-x-2 items-center">
                                  <p className="text-sm font-semibold">
                                    {t("shortAddress")} :
                                  </p>
                                  <p className="text-sm">
                                    {isRtl
                                      ? order.ar_short_address
                                      : order.short_address}
                                  </p>
                                </div>
                                <div className="flex space-x-2 items-center">
                                  <p className="text-sm font-semibold">
                                    {t("buildingNumber")} :
                                  </p>
                                  <p className="text-sm">
                                    {isRtl
                                      ? order.ar_building_number
                                      : order.building_number}
                                  </p>
                                </div>
                                <div className="flex space-x-2 items-center">
                                  <p className="text-sm font-semibold">
                                    {t("secondaryNumber")} :
                                  </p>
                                  <p className="text-sm">
                                    {isRtl
                                      ? order.ar_secondary_number
                                      : order.secondary_number}
                                  </p>
                                </div>
                                <div className="flex space-x-2 items-center">
                                  <p className="text-sm font-semibold">
                                    {t("city")} :
                                  </p>
                                  <p className="text-sm">
                                    {isRtl ? order.ar_city : order.city}
                                  </p>
                                </div>

                                <div className="flex space-x-2 items-center">
                                  <p className="text-sm font-semibold">
                                    {t("postalCode")} :
                                  </p>
                                  <p className="text-sm">
                                    {isRtl
                                      ? order.ar_postal_code
                                      : order.postal_code}
                                  </p>
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </CardContent>
                    </AccordionContent>
                    {order.driver && order.status !== "pending" && (
                      <div className="flex items-center justify-between px-6">
                        <p className="text-lg font-semibold">{t("driver")}</p>
                        <div>
                          <p className="text-lg text-gray-500 font-semibold">
                            {order.driver.first_name} {order.driver.last_name}
                          </p>
                          {order.driver.mobile_no && (
                            <a href={`tel:${order.driver.mobile_no}`}>
                              {order.driver.mobile_no}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between  px-6">
                      <p className="text-lg font-semibold">{t("total")}</p>
                      <p className="text-lg font-bold">
                        {t("sar")} {formatCurrency(Number(order.total_amount))}
                      </p>
                    </div>
                    <div className="flex items-center justify-end px-6">
                      <Button
                        variant={"outline"}
                        className="bg-transparent hover:bg-accent dark:text-white cursor-pointer"
                        onClick={() => handleViewInvoice(order)}
                      >
                        {t("viewInvoice")}{" "}
                        <DynamicIcon name="scroll-text" className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
        {orders.meta.last_page > 1 && !loading && (
          <div className="mt-4">
            <CustomPagination
              currentPage={orders.meta.current_page}
              totalPages={orders.meta.last_page}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
      <InvoiceModal
        onClose={() => setIsOpen(false)}
        open={isOpen}
        data={selectedOrder}
      />
    </>
  );
};

export default OrdersHistory;
