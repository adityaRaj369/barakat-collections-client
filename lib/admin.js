import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(session) {
  return session?.user?.role === "admin";
}

// Returns the session only if the user is an admin, else null.
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  return isAdmin(session) ? session : null;
}
