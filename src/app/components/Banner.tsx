"use client";

import { useSidebar } from "@/components/ui/sidebar";
import Image, { StaticImageData } from "next/image";

const Banner = ({ image }: { image: string | StaticImageData }) => {
  const { isMobile } = useSidebar();

  return (
    <div className="relative rounded-lg  overflow-hidden">
      <Image
        src={image}
        alt="default banner"
        width={1500}
        style={{ width: "100%", height: isMobile ? 300 : 500 }}
        priority
      />
    </div>
  );
};

export default Banner;
