import { Suspense } from "react";
import ErrorClient from "./ErrorClient";

export const dynamic = "force-dynamic";

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-carbon text-cream flex items-center justify-center">
          Cargando...
        </div>
      }
    >
      <ErrorClient />
    </Suspense>
  );
}
