"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import ProfileTabs, {
  profileTabsList,
} from "@/app/components/profile/ProfileTabs";
import ProfileForm from "@/app/components/profile/ProfileForm";
import Password from "@/app/components/profile/ChangePasswordForm";
import OrdersHistory from "@/app/components/profile/OrdersHistory";
import Wallet from "@/app/components/profile/Wallet";
import DeliveryAddress from "@/app/components/profile/DeliveryAddress";
import { OrderProvider } from "@/providers/OrderProvider";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/providers/TranslationProvider";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<string>("");
  const params = useSearchParams();
  const tabLocation = params.get("tab");
  const t = useTranslation();
  const currentTabValue = useMemo(
    () =>
      tabLocation
        ? profileTabsList(t).find((tab) => tab.key === tabLocation)
        : null,
    [tabLocation]
  );
  useEffect(() => {
    setActiveTab(currentTabValue?.key || "profile");
  }, [currentTabValue]);

  return (
    <div className="container mx-auto py-8">
      <OrderProvider>
        <Card className="min-h-fit max-h-[80vh] rounded-md">
          <ProfileTabs active={activeTab} />
          <div>
            {activeTab === "profile" && <ProfileForm />}
            {activeTab === "password" && <Password />}
            {activeTab === "orders" && <OrdersHistory />}
            {activeTab === "wallet" && <Wallet />}
            {activeTab === "delivery" && <DeliveryAddress />}
          </div>
        </Card>
      </OrderProvider>
    </div>
  );
}
