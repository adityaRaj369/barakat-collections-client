import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
});

export const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  line1: z.string().trim().min(3, "Address is required").max(160),
  line2: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^[0-9]{4,10}$/, "Enter a valid pincode"),
});

export const checkoutItemSchema = z.object({
  id: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

export const checkoutSchema = z.object({
  address: addressSchema,
  items: z.array(checkoutItemSchema).min(1, "Your cart is empty"),
});

// ---------- Admin ----------
const optionalStr = z.string().trim().max(200).optional().or(z.literal(""));

export const categoryInput = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  slug: z.string().trim().max(100).optional().or(z.literal("")),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  image: z.string().trim().url("Enter a valid image URL").optional().or(z.literal("")),
});

export const productInput = z.object({
  name: z.string().trim().min(2, "Name is required").max(140),
  slug: z.string().trim().max(160).optional().or(z.literal("")),
  description: z.string().trim().min(5, "Add a description"),
  priceRupees: z.coerce.number().nonnegative("Price must be ≥ 0"),
  compareAtRupees: z.coerce.number().nonnegative().optional().nullable(),
  images: z.array(z.string().url()).default([]),
  material: optionalStr,
  artisan: optionalStr,
  origin: optionalStr,
  stock: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).default(4.7),
  categoryId: z.string().trim().optional().or(z.literal("")),
});

export const orderStatusInput = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED"]),
});
