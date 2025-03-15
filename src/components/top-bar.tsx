import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "./progressive-blur";

export function TopBar() {
  return (
    <>
      <ProgressiveBlur
        className={cn(
          "pointer-events-none fixed left-0 right-0 top-0 z-[9000] h-[120px] w-full transition-all duration-100"
        )}
        blurIntensity={4}
        blurLayers={4}
        direction="top"
      />
      <div
        className={cn(
          "pointer-events-none fixed left-0 right-0 top-0 z-[9200] h-[200px] bg-gradient-to-t from-transparent to-os-background/70 transition-opacity"
        )}
      />
      <div
        className={cn(
          "pointer-events-none fixed left-0 right-0 top-0 z-[9300] h-[50px] bg-gradient-to-t from-transparent to-os-background transition-opacity"
        )}
      />
      <div className="fixed left-0 right-0 top-0 z-[9400] flex items-center h-14">
        <div className="flex items-center justify-between mx-auto w-full md:max-w-md">
          {/* <span className="text-lg font-bold relative">
            FOMO
            <span> *</span>
          </span> */}
        </div>
      </div>
    </>
  );
}
