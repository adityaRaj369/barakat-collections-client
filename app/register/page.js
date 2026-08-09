import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Create Account",
  robots: { index: false, follow: true },
};

export default function RegisterPage() {
  return (
    <div className="container-x py-16 md:py-24">
      <RegisterForm />
    </div>
  );
}
