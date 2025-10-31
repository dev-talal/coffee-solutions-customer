import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming Button is imported from a UI library
import { useTranslation } from "@/providers/TranslationProvider";
import { cn } from "@/lib/utils";

const ViewAllButton = ({
  link,
  className,
}: {
  link: string;
  className?: string;
}) => {
  const t = useTranslation();
  return (
    <div
      className={cn("flex items-center justify-center space-x-4 ", className)}
    >
      <Link href={link}>
        <Button className="p-5 text-white bg-coffee-brown hover:bg-amber-400">
          {t("view_all")}
        </Button>
      </Link>
    </div>
  );
};

export default ViewAllButton;
