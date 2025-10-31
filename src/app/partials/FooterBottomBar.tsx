"use client";

import assets from "@/assets";
import React from "react";
import { paymentMethodsAssets } from "../utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/providers/TranslationProvider";

const FooterBottomBar = () => {
  const t = useTranslation();
  return (
    <div>
      <div className="bg-coffee-brown">
        <div className="bg-card rounded-t-4xl">
          <div className="container px-4 mx-auto pt-5">
            <div className="flex md:flex-nowrap flex-wrap justify-between border-b pb-5 mb-5">
              <ul className="flex  space-x-3 items-center">
                <li>
                  <Link
                    href="https://apps.apple.com/app/id1641812006"
                    target="_blank"
                  >
                    <Image
                      src={assets.icons.AppStoreIcon}
                      width={150}
                      height={150}
                      alt="App Store"
                    />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.rowaad.coffesolutions"
                    target="_blank"
                  >
                    <Image
                      src={assets.icons.googlePlayIcon}
                      width={150}
                      height={150}
                      alt="App Store"
                    />
                  </Link>
                </li>
              </ul>
              <ul className="flex space-x-3 items-center md:w-auto w-full md:mt-0 mt-3">
                {paymentMethodsAssets.map((asset) => (
                  <li key={asset}>
                    <Link href="#">
                      <Image
                        src={asset}
                        width={40}
                        height={40}
                        className="rounded-sm"
                        alt="Payments"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-coffee-brown rounded-t-4xl py-7 px-6 text-gray-200 ">
              <div className="tems-center flex justify-between mb-2">
                <span className="text-[16px]">{t("rightsReserved")}</span>
                <div className="flex flex-col items-center">
                  <Image
                    src={assets.icons.BusinessCenterIcon}
                    width={30}
                    height={50}
                    alt="Business Center"
                    className="invert brightness-0 mb-1"
                  />
                  <span>1010217032</span>
                </div>
              </div>
              <span className="text-[16px] text-center block">
                {t("developed_and_designed_by")}&nbsp;
                <a
                  className="underline"
                  target="_blank"
                  href="https://thewebjobs.co.uk"
                >
                  THE WEB JOBS
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterBottomBar;
