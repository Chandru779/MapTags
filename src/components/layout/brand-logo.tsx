import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: {
    icon: 32,
    word: "text-[15px]",
    tagline: "text-[11px]",
    gap: "gap-2",
  },
  md: {
    icon: 40,
    word: "text-[1.125rem]",
    tagline: "text-[13px]",
    gap: "gap-2.5",
  },
  lg: {
    icon: 48,
    word: "text-2xl",
    tagline: "text-sm",
    gap: "gap-3",
  },
};

export function BrandLogo({
  size = "md",
  showTagline = false,
  className,
}: BrandLogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <Image
        src="/brand-icon.png"
        alt="mapTag"
        width={s.icon}
        height={s.icon}
        className="shrink-0 rounded-[22%] shadow-sm shadow-primary/10"
        priority
      />

      <div className="min-w-0 leading-none">
        <span
          className={cn(
            "inline-flex items-baseline font-bold tracking-tight",
            s.word
          )}
        >
          <span className="font-semibold text-foreground/90">map</span>
          <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text font-extrabold text-transparent">
            Tag
          </span>
        </span>
        {showTagline && (
          <p
            className={cn(
              "mt-1 font-medium tracking-wide text-muted-foreground/80",
              s.tagline
            )}
          >
            Your journey, mapped
          </p>
        )}
      </div>
    </div>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-baseline font-bold tracking-tight", className)}>
      <span className="font-semibold text-foreground/90">map</span>
      <span className="bg-gradient-to-r from-primary to-violet-400 bg-clip-text font-extrabold text-transparent">
        Tag
      </span>
    </span>
  );
}
