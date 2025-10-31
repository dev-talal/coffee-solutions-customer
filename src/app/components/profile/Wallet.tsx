import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/providers/TranslationProvider";
import { useAuthCheck } from "@/hooks/auth-check";
import { formatCurrency } from "@/helpers/dataFormat";
import { getTransactions } from "@/services/apiService";
import { Transaction } from "@/types/transaction";
import { PaginatedResponse } from "@/types/pagination";
import CustomPagination from "@/app/components/common/CustomPagination";
import { DynamicIcon } from "lucide-react/dynamic";

const Wallet: React.FC = () => {
  const params = useParams();
  const locale = params.locale || "en";
  const isRtl = locale === "ar";
  const { user } = useAuthCheck();
  const t = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<
    PaginatedResponse<Transaction>
  >({
    data: [],
    meta: {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 0,
    },
  });

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions(page);
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-center">
        <h2 className="text-2xl font-bold text-foreground">{t("wallet")}</h2>
      </div>

      <div className="w-full flex justify-center">
        <div
          className="w-[320px] sm:w-[375px] lg:w-[440px] xl:w-[480px] h-[240px] perspective-1000 cursor-pointer"
          onClick={handleCardClick}
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 via-coffee-brown to-stone-900 text-white rounded-xl dark:hover:shadow-lg dark:shadow-stone-700 p-6 backface-hidden hover:scale-110 transition-transform duration-300">
              <div className="flex flex-row justify-between pb-9">
                <div className="font-semibold text-3xl">
                  {t("coffeeSolutionsCo")}
                </div>
                <div className="w-10 h-7 bg-slate-200 rounded-sm flex justify-around px-2 gap-1">
                  <div className="w-[1px] h-full bg-stone-300 rounded-sm" />
                  <div className="w-[1px] h-full bg-stone-300 rounded-sm" />
                </div>
              </div>

              <div className="mt-12 mb-4 text-lg tracking-widest font-mono">
                **** **** **** ****
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="uppercase text-xs opacity-70">
                    {t("cardHolder")}
                  </p>
                  <p className="font-semibold uppercase">
                    {user?.first_name}&nbsp;{user?.last_name}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="uppercase text-xs opacity-70">
                    {t("totalBalance")}
                  </p>
                  <p className="text-xs ">
                    <span className="font-semibold">{t("sar")}</span>{" "}
                    {formatCurrency(Number(user?.credit ?? 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-coffee-brown to-slate-400 text-white rounded-xl shadow-lg p-6 backface-hidden rotate-y-180">
              <div className="h-full flex flex-col justify-between">
                <div className="w-full h-12 bg-black absolute top-4 left-0 right-0"></div>
                <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-8 bg-gray-600 rounded-sm flex justify-center items-center">
                      <div className="text-xs opacity-70">XXX</div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-xs opacity-70">
                  {t("CustomerService")}: +966-531110324
                </div>
                <div className="flex items-center justify-center">
                  <p>{t("rightsReserved")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-center">
        {t("transactions")}
      </h3>
      <div className=" max-w-4xl mx-auto mt-8 space-y-4">
        {!loading ? (
          <>
            {transactions.data.map((transaction) => {
              const isWallet = transaction.method === "wallet";
              const isPaid = transaction.status === "paid";
              const isDebit = transaction.type === "Debit";
              const amountClass = isDebit ? "text-red-600" : "text-green-600";
              const sign = isWallet ? "trending-down" : "trending-up";
              const iconName = isWallet ? "wallet" : "credit-card";

              return (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 flex justify-between items-center bg-card shadow-md"
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <div className="flex items-center space-x-2 w-[120px]">
                    <DynamicIcon
                      name={iconName}
                      className="w-5 h-5 text-black dark:text-white"
                    />
                    <p className="text-sm font-semibold uppercase">
                      {t(transaction.method)}
                    </p>
                  </div>

                  <div className="text-center flex flex-col items-center w-32">
                    <p
                      className={`text-sm font-semibold ${
                        !isPaid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t(transaction.type)}
                    </p>
                    <p className="text-xs text-black dark:text-white">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    className={`text-sm font-semibold text-end w-24 ${amountClass} flex justify-end items-center gap-1`}
                  >
                    <DynamicIcon name={sign} className="w-3 h-3" />
                    <span className="text-xs opacity-70">
                      {formatCurrency(Number(transaction.amount))}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <DynamicIcon
            name="loader"
            className="w-8 h-8 mx-auto text-coffee-brown animate-spin"
          />
        )}
      </div>
      {transactions.meta.last_page > 1 && !loading && (
        <div className="mt-4">
          <CustomPagination
            currentPage={transactions.meta.current_page}
            totalPages={transactions.meta.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Wallet;
