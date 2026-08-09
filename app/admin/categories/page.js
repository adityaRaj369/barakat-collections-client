import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories · Admin", robots: { index: false } };

export default function AdminCategoriesPage() {
  return <CategoryManager />;
}
