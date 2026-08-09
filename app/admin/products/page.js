import ProductManager from "@/components/admin/ProductManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Products · Admin", robots: { index: false } };

export default function AdminProductsPage() {
  return <ProductManager />;
}
