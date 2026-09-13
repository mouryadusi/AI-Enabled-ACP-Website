import type { PropsWithChildren } from "react";
import { cx } from "@/lib/utils";

interface GlassPanelProps extends PropsWithChildren {
  className?: string;
  as?: "div" | "section" | "article";
  "data-cursor"?: string;
}

/** Reusable frosted-glass surface used across data panels and cards. */
export function GlassPanel({ children, className, as = "div", ...rest }: GlassPanelProps) {
  const Tag = as;
  return (
    <Tag className={cx("glass rounded-2xl", className)} {...rest}>
      {children}
    </Tag>
  );
}
