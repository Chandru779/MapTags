import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const sizes = {
  sm: {
    box: "h-8 w-8",
    mark: "h-[18px] w-[18px]",
    word: "text-[15px]",
    tagline: "text-[11px]",
    gap: "gap-2",
  },
  md: {
    box: "h-10 w-10",
    mark: "h-[22px] w-[22px]",
    word: "text-[1.125rem]",
    tagline: "text-[13px]",
    gap: "gap-2.5",
  },
  lg: {
    box: "h-12 w-12",
    mark: "h-[26px] w-[26px]",
    word: "text-2xl",
    tagline: "text-sm",
    gap: "gap-3",
  },
};

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M16 27s8-6.2 8-12.5A8 8 0 1 0 8 14.5C8 20.8 16 27 16 27Z"
        className="fill-primary"
        opacity="0.9"
      />
      <circle cx="16" cy="14.5" r="3.2" className="fill-primary-foreground" />
      <path
        d="M19.5 6.5h7a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-4.5l-2.2-2.2a1 1 0 0 0-.7-.3H19.5a1.5 1.5 0 0 1-1.5-1.5V8a1.5 1.5 0 0 1 1.5-1.5Z"
        className="fill-primary"
      />
      <path
        d="M21.2 9.2h3.6M21.2 11.4h2.4"
        className="stroke-primary-foreground"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BrandLogo({
  size = "md",
  showTagline = false,
  className,
}: BrandLogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/25 shadow-sm shadow-primary/10 transition group-hover:bg-primary/15 group-hover:ring-primary/35",
          s.box
        )}
      >
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent" />
        <BrandMark className={cn("relative", s.mark)} />
      </div>

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
