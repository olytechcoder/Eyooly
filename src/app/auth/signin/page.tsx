import { Suspense } from "react";
import SignInClient from "./SignInClient";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-carbon text-cream flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}
