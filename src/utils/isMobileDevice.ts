"use server";

import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

/**
 * Used in SSR components to detect if the user is on a mobile device.
 */
export const isMobileDevice = async () => {
  if (typeof process === "undefined") {
    throw new Error(
      "[Server method] you are importing a server-only module outside of server"
    );
  }

  const { get } = headers();
  const ua = get("user-agent");

  const device = new UAParser(ua || "").getDevice();

  return device.type === "mobile";
};
