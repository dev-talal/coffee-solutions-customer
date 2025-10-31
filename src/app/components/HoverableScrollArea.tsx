import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { useEffect } from "react";

const HoverableScrollArea = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    import("overlayscrollbars/overlayscrollbars.css");
  }, []);

  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll", autoHideDelay: 300 } }}
      defer
      className="flex-1"
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};

export default HoverableScrollArea;
