import { IconRulerMeasure2 } from "@tabler/icons-react";
import type { SVGProps } from "react";

/**
 * Tape measure icon — sourced from Tabler Icons (ruler-measure-2).
 *
 * This is the only icon from a proper icon library (Tabler, same
 * outline style as Lucide: 24×24 grid, 2px stroke, round caps)
 * that represents a measurement tool. Lucide has no tape measure.
 *
 * Re-exported under a stable name so swapping the source later
 * (e.g. if Lucide adds IconTapeMeasure) only changes this file.
 */
export function TapeMeasureIcon(
 props: SVGProps<SVGSVGElement> & { size?: number | string },
) {
 return <IconRulerMeasure2 size={props.size ?? 15} {...props} />;
}
