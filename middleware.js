export { default } from "next-auth/middleware";

// Require a signed-in session for these routes.
export const config = {
  matcher: ["/account/:path*", "/checkout/:path*"],
};
