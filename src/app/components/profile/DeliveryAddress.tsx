import React, { useState, useEffect, useCallback } from "react";
import { FormInput } from "../common/FormInput";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/providers/TranslationProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DynamicIcon } from "lucide-react/dynamic";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addressSchema,
  DeliveryAddressFormData,
} from "@/lib/validations/profile";
import {
  getDeliveryAddresses,
  postCreateDeliveryAddress,
  deleteDeliveryAddress,
  updateDeliveryAddress,
} from "@/services/apiService";
import type { DeliveryAddress } from "@/types/delivery_address";
import { addressFields } from "@/app/utils/constants";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function DeliveryAddress() {
  const t = useTranslation();
  const deliveryOptions = [
    { id: 1, label: t("locationLink") },
    { id: 0, label: t("addressDetails") },
  ];

  const [showForm, setShowForm] = useState<boolean>(false);
  const [userAddresses, setUserAddresses] = useState<Array<DeliveryAddress>>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoader, setActionLoader] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const methods = useForm<DeliveryAddressFormData>({
    defaultValues: { is_link: 1 },
    resolver: zodResolver(addressSchema(t)),
  });

  const radioValue = methods.watch("is_link");

  const handleAddAddress = () => {
    setShowForm(true);
    setEditId(null);
    methods.reset({ is_link: 1 });
  };

  const getAllDeliveryAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDeliveryAddresses();
      setUserAddresses(res);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit: SubmitHandler<DeliveryAddressFormData> = async (data) => {
    setActionLoader(true);
    try {
      if (editId !== null) {
        const res = await updateDeliveryAddress(editId, data);
        setUserAddresses((prev) =>
          prev.map((address) => (address.id === editId ? res.data : address))
        );
      } else {
        const res = await postCreateDeliveryAddress(data);
        setUserAddresses((prev) => [...prev, res.data]);
      }
      setShowForm(false);
      setEditId(null);
      methods.reset();
    } catch (_) {
    } finally {
      setActionLoader(false);
    }
  };

  useEffect(() => {
    getAllDeliveryAddresses();
  }, [getAllDeliveryAddresses]);

  const onEdit = (id: number) => {
    const address = userAddresses.find((a) => a.id === id);
    if (!address) return;

    setEditId(id);
    setShowForm(true);

    if (address.is_link === "1") {
      methods.reset({
        is_link: 1,
        address_link: address.address_link,
      });
    } else {
      methods.reset({ ...address, is_link: 0 });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDeleteDialog = (id: number) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteDeliveryAddress(deleteId);
      getAllDeliveryAddresses();
    } catch (_) {
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-center">
          {t("deliveryAddress")}
        </h3>
        <Button
          onClick={handleAddAddress}
          variant="outline"
          className="bg-coffee-brown hover:bg-amber-500 text-white hover:text-white cursor-pointer rounded-full"
        >
          {t("addAddress")}
        </Button>
      </div>

      {showForm && (
        <Card className="space-y-4 max-w-5xl mx-auto p-6">
          <div className="space-y-2">
            <Label className="font-semibold text-xl">
              {editId ? t("editDeliveryAddress") : t("addNewDeliveryAddress")}
            </Label>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <div className="flex items-center space-x-4">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 my-4"
                    >
                      <Checkbox
                        id={`check-${option.id}`}
                        checked={radioValue === option.id}
                        onCheckedChange={() =>
                          methods.setValue("is_link", option.id as 0 | 1)
                        }
                        className="rounded-full"
                      />
                      <Label htmlFor={`check-${option.id}`}>
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>

                {radioValue === 1 && (
                  <div className="space-y-4">
                    <Label>{t("locationLink")}</Label>
                    <FormInput
                      icon="map-pin"
                      placeholder={t("enter") + " " + t("locationLink")}
                      className="pl-8 rounded-full"
                      name="address_link"
                    />
                  </div>
                )}

                {radioValue === 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-4">
                      {addressFields.slice(0, 2).map((field, idx) => (
                        <div key={idx} className="space-y-2">
                          <Label>{t(field.label)}</Label>
                          <FormInput
                            name={field.name}
                            placeholder={`${t("enter")} ${t(
                              field.placeholder
                            )}`}
                            className="rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {addressFields.slice(2).map((field, idx) => (
                        <div key={idx} className="space-y-2">
                          <Label>{t(field.label)}</Label>
                          <FormInput
                            name={field.name}
                            placeholder={`${t("enter")} ${t(
                              field.placeholder
                            )}`}
                            className="rounded-full"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex justify-end mt-6 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="rounded-full bg-transparent cursor-pointer"
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-coffee-brown cursor-pointer hover:bg-amber-400 text-white rounded-full px-4"
                    disabled={actionLoader}
                  >
                    {actionLoader && (
                      <DynamicIcon
                        name="loader"
                        className="w-6 h-6 animate-spin mr-2"
                      />
                    )}
                    {editId ? t("update") : t("save")}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-8">
          <DynamicIcon name="loader" className="w-8 h-8 animate-spin" />
        </div>
      ) : !showForm && userAddresses.length > 0 ? (
        <div className="max-w-5xl mx-auto mt-8 space-y-4">
          {userAddresses.map((address) => (
            <Card
              key={address.id}
              className="border rounded-lg p-4 flex flex-row justify-between items-center shadow-md gap-4"
            >
              <div className="flex items-start space-x-4">
                <Card className="flex items-center p-4">
                  <DynamicIcon
                    name="map-pin-house"
                    className="w-5 h-5 text-black dark:text-white"
                  />
                </Card>
                <div className="text-start flex flex-col items-start w-fit">
                  {address.is_link.toString() === "1" ? (
                    <div>
                      <h4 className="text-sm font-semibold">
                        {t("locationLink")}
                      </h4>
                      <p className="text-xs break-all">
                        {address.address_link}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-sm font-semibold">
                        {t("deliveryAddress")}
                      </h3>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">
                          {t("shortAddress")} :
                        </p>
                        <p className="text-xs">{address.short_address}</p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">
                          {t("buildingNumber")} :
                        </p>
                        <p className="text-xs">{address.building_number}</p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">
                          {t("secondaryNumber")} :
                        </p>
                        <p className="text-xs">{address.secondary_number}</p>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">{t("city")} :</p>
                        <p className="text-xs">{address.city}</p>
                      </div>

                      <div className="flex space-x-2 items-center">
                        <p className="text-xs font-semibold">
                          {t("postalCode")} :
                        </p>
                        <p className="text-xs">{address.postal_code}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => onEdit(address.id)}
                  className="bg-transparent cursor-pointer"
                >
                  <DynamicIcon name="pencil" className="w-4 h-4" />
                </Button>
                <Dialog
                  open={isDeleteDialogOpen && deleteId === address.id}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => openDeleteDialog(address.id)}
                      className="bg-transparent cursor-pointer"
                    >
                      <DynamicIcon name="trash-2" className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card">
                    <DialogHeader className="flex justify-center items-center gap-2 py-6">
                      <DialogTitle className="flex flex-col items-center gap-2">
                        <div className="p-4 border rounded-md">
                          <DynamicIcon
                            name="trash-2"
                            className="w-6 h-6 text-red-400"
                          />
                        </div>
                      </DialogTitle>
                      <DialogDescription className="text-lg text-black">
                        {t("areYouSureDelete")}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="bg-transparent rounded-full cursor-pointer"
                        >
                          {t("cancel")}
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={onDeleteConfirm}
                        className="bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-full"
                        disabled={actionLoader}
                      >
                        {actionLoader && (
                          <DynamicIcon
                            name="loader"
                            className="w-6 h-6 animate-spin mr-2"
                          />
                        )}
                        {t("delete")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <Card className="p-8 flex justify-center items-center max-w-4xl mx-auto mt-8 space-y-4">
            <p>{t("noAddressFound")}</p>
          </Card>
        )
      )}
    </div>
  );
}

export default DeliveryAddress;
