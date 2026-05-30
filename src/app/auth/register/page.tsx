import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-carbon text-cream flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
