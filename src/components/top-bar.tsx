import { cn } from "@/lib/utils";
import { ProgressiveBlur } from "./progressive-blur";
import { LogoScramble } from "./logo-scramble";

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
        <div className="flex items-center justify-between mx-auto w-full px-4">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 329 268"
              className="size-6"
            >
              <g fill="currentColor" clipPath="url(#a)">
                <path d="M246.938 11.6563c6.157-2.90751 4.487-4.20181 7.998 3.3599 9.262 20.0278-5.46 64.0905-9.124 85.4078l73.929 55.704c5.553 4.325 5.589 27.836-1.971 28.26-28.026-14.899-53.604-34.576-79.661-52.764l-23.466 72.245c-8.956 14.65-14.374-4.134-14.744-13.743-.462-12.347 11.696-72.74 10.002-76.184-16.598-13.541-36.309-27.3385-51.329-42.4611-4.184-4.221-17.191-16.0219-5.205-19.1157 11.987-3.0939 50.764 25.0111 62.501 30.6542 3.142-.9944 9.04-56.8273 17.739-66.0308 1.952-2.0595 3.344-10.69313 11.604-5.3323h1.727ZM100.401 60.169c6.157-2.9075 13.797-6.2932 17.308 1.2685 9.262 20.0277-13.043 62.8435-16.707 84.1605l73.928 55.704c5.554 4.325 5.59 27.836-1.97 28.261-28.026-14.899-53.604-34.577-79.6609-52.765l-23.466 72.245c-8.9567 14.65-14.3741-4.134-14.7443-13.743-.4623-12.346 11.6956-72.74 10.0019-76.184-16.5984-13.54-36.3094-27.338-51.329-42.461-4.18385-4.221-17.19137-16.022-5.20455-19.1157C20.544 94.4454 59.3209 122.55 71.0578 128.193c3.1419-.994 12.4261-53.0843 21.1254-62.2878 1.9516-2.0595 5.6286-4.4872 8.2068-5.7137l.011-.0225Z" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="currentColor" d="M0 0h328.917v267.234H0z" />
                </clipPath>
              </defs>
            </svg>
            <LogoScramble />
            <span className="text-sm text-muted-foreground"> *</span>
          </div>
        </div>
      </div>
    </>
  );
}
