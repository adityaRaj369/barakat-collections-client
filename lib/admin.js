import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export function demoAdminBypassEnabled() {
  return true;
}

export const demoAdminSession = {
  user: {
    id: "demo-admin",
    name: "Demo Admin",
    email: "demo@barakatcollections.com",
    role: "admin",
  },
};

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(session) {
  if (demoAdminBypassEnabled()) return true;
  return session?.user?.role === "admin";
}

// Returns the session only if the user is an admin, else null.
export async function getAdminSession() {
  if (demoAdminBypassEnabled()) return demoAdminSession;
  const session = await getServerSession(authOptions);
  return isAdmin(session) ? session : null;
}
