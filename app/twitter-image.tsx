import { SITE } from "@/lib/constants";
import OpenGraphImage from "./opengraph-image";

/** The same card for X. The route config has to be declared, not re-exported. */
export const alt = `${SITE.name} — a software studio in ${SITE.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpenGraphImage;
