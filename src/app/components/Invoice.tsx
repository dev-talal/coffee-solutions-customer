"use client";

import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Order } from "@/types/order";
import { formatCurrency, formatStringToDateTime } from "@/helpers/dataFormat";
import { useAuthCheck } from "@/hooks/auth-check";
import { DynamicIcon } from "lucide-react/dynamic";

const Invoice = ({ data }: { data: Order | null }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthCheck();
  const [loading, setLoading] = useState<boolean>(false);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: `Sun Cafe Invoice #${data?.id}`,
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 5mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        html, body {
            height: 100%;
        }
        #invoice-container {
            min-height: 100vh !important;
            display: flex;
            flex-direction: column;
        }
        .invoice-footer {
            margin-top: auto;
        }
      }

    `,
    onBeforePrint: async () => setLoading(true),
    onAfterPrint: () => setLoading(false),
  });

  return (
    <>
      <div className="mb-4 text-center">
        <Button
          onClick={reactToPrintFn}
          disabled={loading}
          className="bg-coffee-brown cursor-pointer"
        >
          Print Invoice
          {loading && (
            <DynamicIcon name="loader" className="w-6 h-6 animate-spin" />
          )}
        </Button>
      </div>
      <div className="bg-white mx-auto" style={{ width: "210mm" }}>
        <div
          ref={contentRef}
          id="invoice-container"
          style={{
            minHeight: "87vh",
            margin: "0 auto",
            padding: "5mm",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* ---------- Header ---------- */}
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      verticalAlign: "top",
                      padding: "10px",
                      textAlign: "left",
                    }}
                  >
                    <h2
                      style={{
                        color: "#d32f2f",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Sun Cafe For Trading Company Ltd
                    </h2>
                    <p style={{ fontSize: "11px", margin: 0 }}>
                      Kingdom of Saudi Arabia P.O.Box 4 Riyadh 11342
                    </p>
                    <p style={{ fontSize: "11px", margin: 0 }}>
                      Tel:+966920002017-C.R 1010217032
                    </p>
                    {/* <p style={{ fontSize: "11px", margin: 0 }}>
                      Vat:&nbsp;{formatCurrency(Number(data?.tax_amount))}
                    </p> */}
                  </td>
                  <td
                    style={{
                      verticalAlign: "top",
                      padding: "10px",
                      textAlign: "right",
                    }}
                  >
                    <h2
                      style={{
                        color: "#d32f2f",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      شركة صن كافيه للتجارة المحدودة
                    </h2>
                    <p style={{ fontSize: "11px", margin: 0 }}>
                      المملكة العربية السعودية ص.ب 4 الرياض 11342
                    </p>
                    <p style={{ fontSize: "11px", margin: 0 }}>
                      966920002017+ - س.ت 1010217032
                    </p>
                    <p style={{ fontSize: "11px", margin: 0 }}>
                      الرقم الضريبي: 300276168200003
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ---------- Logo + Center Title ---------- */}
          <div style={{ padding: "0 10px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td style={{ width: "33%", textAlign: "left" }}>
                    <div
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "#ccc",
                      }}
                    ></div>
                  </td>

                  <td style={{ width: "34%", textAlign: "center" }}>
                    <div>
                      <div
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "#d32f2f",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        LOGO
                      </div>
                      <p style={{ color: "#d32f2f", fontWeight: 700 }}>
                        Sun Cafe
                      </p>
                      <div
                        style={{
                          border: "1px solid black",
                          display: "inline-block",
                          padding: "2px 10px",
                          fontSize: "12px",
                          fontWeight: 600,
                        }}
                      >
                        فاتورة ضريبية
                      </div>
                    </div>
                  </td>

                  <td style={{ width: "33%", textAlign: "right" }}>
                    <p style={{ fontSize: "11px", margin: 0 }}>
                      الرقم الضريبي: 300276168200003
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ---------- Invoice Info ---------- */}
          <div style={{ marginTop: "20px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    Invoice No:
                  </td>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    12345
                  </td>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    Date:
                  </td>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    {formatStringToDateTime(data?.created_at as string)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    Customer:
                  </td>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    {user?.first_name} {user?.last_name}
                  </td>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    Email:
                  </td>
                  <td style={{ border: "1px solid black", padding: "4px" }}>
                    {user?.email}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{ flex: 1 }}>
            {/* ---------- Items Table ---------- */}
            <div style={{ marginTop: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      #
                    </th>
                    <th
                      className="text-start"
                      style={{ border: "1px solid black", padding: "6px" }}
                    >
                      Product Name
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Qty
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Price
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((item) => (
                    <tr key={`product-${item.id}`}>
                      <td
                        className="text-center"
                        style={{ border: "1px solid black", padding: "6px" }}
                      >
                        {item.id}
                      </td>
                      <td style={{ border: "1px solid black", padding: "6px" }}>
                        {item.product_name} (
                        {item.is_box === "1"
                          ? `${item.uom_unit} x ${item.product_pieces_per_box} ${item.unit}`
                          : item.unit}
                        )
                      </td>
                      <td
                        className="text-center"
                        style={{ border: "1px solid black", padding: "6px" }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        className="text-center"
                        style={{ border: "1px solid black", padding: "6px" }}
                      >
                        {item.price}
                      </td>
                      <td
                        className="text-center"
                        style={{ border: "1px solid black", padding: "6px" }}
                      >
                        {item.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ---------- Totals ---------- */}
            <div
              style={{ marginBlock: "20px", marginLeft: "auto", width: "50%" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid black", padding: "6px" }}>
                      Subtotal
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "6px" }}
                      className="text-end"
                    >
                      {formatCurrency(Number(data?.sub_total))}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid black", padding: "6px" }}>
                      Tax
                    </td>
                    <td
                      style={{ border: "1px solid black", padding: "6px" }}
                      className="text-end"
                    >
                      {formatCurrency(Number(data?.tax_amount))}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: "6px",
                        fontWeight: 700,
                      }}
                    >
                      Total
                    </td>
                    <td
                      className="text-end"
                      style={{
                        border: "1px solid black",
                        padding: "6px",
                        fontWeight: 700,
                      }}
                    >
                      {formatCurrency(Number(data?.total_amount))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {/* ---------- Footer ---------- */}
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              marginTop: "auto",
              width: "100%",
            }}
            className="invoice-footer"
          >
            <p style={{ margin: 0 }}>Thank you for your business!</p>
            <p style={{ margin: 0 }}>شكراً لتعاملكم معنا</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
