"use client";

import assets from "@/assets";
import { Loader } from "lucide-react";
import Image from "next/image";

const Pageloader = () => {
  return (
    <div className="h-full fixed top-0 left-0 z-40 bg-sidebar w-full flex justify-center items-center">
      <div className="text-center space-y-10">
        <Image
          src={assets.img.logoNew}
          width={220}
          height={220}
          alt="Coffee solutions"
          className="invert brightness-0 animate-pulse"
          priority
        />
        <Loader className="w-12 h-12 mx-auto animate-spin text-white" />
      </div>
    </div>
  );
};

export default Pageloader;
