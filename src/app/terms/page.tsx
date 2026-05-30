"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsPage() {
  const { locale: language } = useLanguage();
  const isSpanish = language === "es";

  return (
    <PublicLayout>
      <div className="bg-carbon pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-cream mb-2">
            {isSpanish ? "Términos de Uso" : "Terms of Use"}
          </h1>
          <p className="text-cream/50 text-sm">
            {isSpanish ? "Última actualización: Mayo 2026" : "Last updated: May 2026"}
          </p>
        </div>
      </div>
      <div className="bg-cream section-py">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-carbon/8 p-8 space-y-6 text-carbon/80 text-sm leading-relaxed">
            {isSpanish ? (
              <>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">1. Aceptación de términos</h2>
                  <p>Al acceder y usar Eyooly, aceptas estar vinculado por estos términos de uso. Si no estás de acuerdo con alguna parte, no debes usar la plataforma.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">2. Elegibilidad</h2>
                  <p>Debes tener al menos 18 años para usar Eyooly. Al registrarte, certificas que cumples con este requisito y que toda la información proporcionada es verdadera y precisa.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">3. Uso permitido</h2>
                  <p>Aceptas usar Eyooly solo para propósitos legales y de acuerdo con estos términos. No debes usar la plataforma para: Actividades ilegales. Fraude o engaño. Acoso o discriminación. Publicación de contenido ofensivo o violento. Violación de derechos de terceros.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">4. Contenido del usuario</h2>
                  <p>Eres responsable de todo el contenido que publiques. Garantizas que tienes derecho a publicar dicho contenido y que no viola derechos de terceros. Eyooly se reserva el derecho de eliminar contenido que viole estos términos.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">5. Transacciones</h2>
                  <p>Eyooly facilita conexiones entre usuarios pero no es responsable de disputas, fraude o incumplimiento de acuerdos entre usuarios. Cada usuario es responsable de verificar la identidad y reputación de otros usuarios.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">6. Limitación de responsabilidad</h2>
                  <p>Eyooly se proporciona "tal cual". No garantizamos que la plataforma sea ininterrumpida o libre de errores. No somos responsables de daños indirectos, incidentales o consecuentes derivados del uso de la plataforma.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">7. Cambios en los términos</h2>
                  <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos se comunicarán por correo. El uso continuado de la plataforma constituye aceptación de los términos modificados.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">8. Contacto</h2>
                  <p>Para preguntas sobre estos términos, contacta: WhatsApp: +240 555 271 524 | Email: hola@eyooly.com | Soporte: ayud@eyooly.com</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">1. Acceptance of Terms</h2>
                  <p>By accessing and using Eyooly, you agree to be bound by these terms of use. If you do not agree with any part, you must not use the platform.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">2. Eligibility</h2>
                  <p>You must be at least 18 years old to use Eyooly. By registering, you certify that you meet this requirement and that all information provided is true and accurate.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">3. Permitted Use</h2>
                  <p>You agree to use Eyooly only for lawful purposes and in accordance with these terms. You must not use the platform for: Illegal activities. Fraud or deception. Harassment or discrimination. Publishing offensive or violent content. Violation of third-party rights.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">4. User Content</h2>
                  <p>You are responsible for all content you publish. You warrant that you have the right to publish such content and that it does not violate third-party rights. Eyooly reserves the right to remove content that violates these terms.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">5. Transactions</h2>
                  <p>Eyooly facilitates connections between users but is not responsible for disputes, fraud, or breach of agreements between users. Each user is responsible for verifying the identity and reputation of other users.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">6. Limitation of Liability</h2>
                  <p>Eyooly is provided "as is". We do not warrant that the platform is uninterrupted or error-free. We are not responsible for indirect, incidental, or consequential damages arising from the use of the platform.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">7. Changes to Terms</h2>
                  <p>We reserve the right to modify these terms at any time. Significant changes will be communicated via email. Continued use of the platform constitutes acceptance of the modified terms.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">8. Contact</h2>
                  <p>For questions about these terms, contact: WhatsApp: +240 555 271 524 | Email: hola@eyooly.com | Support: ayud@eyooly.com</p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
