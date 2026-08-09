import Razorpay from "razorpay";

// Payments are OPTIONAL. With no keys set, the app runs in DEMO mode:
// orders are created and marked paid without any real charge — perfect for
// showing the client. Add the keys in .env to switch on real Razorpay.
export const razorpayEnabled =
  !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

let instance = null;

export function getRazorpay() {
  if (!razorpayEnabled) return null;
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return instance;
}
