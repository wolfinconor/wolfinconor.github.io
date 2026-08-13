import { cookies } from "next/headers";
import { getIronSession, type SessionOptions } from "iron-session";

export type SessionData = {
  isAdmin?: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "bld-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  },
};

export async function getSession() {
  return getIronSession<SessionData>(cookies(), sessionOptions);
}
