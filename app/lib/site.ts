export const SITE_NAME = "Penn Rock Industries";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pennrockequipment.com";
export const DEFAULT_OG_IMAGE = "/PRI_logo_fromFacebook.jpg";

export const buildAbsoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();