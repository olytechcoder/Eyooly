"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
  const { locale: language } = useLanguage();
  const isSpanish = language === "es";

  return (
    <PublicLayout>
      <div className="bg-carbon pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-cream mb-2">
            {isSpanish ? "Política de Privacidad" : "Privacy Policy"}
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
                  <h2 className="text-lg font-bold text-carbon mb-3">1. Información que recopilamos</h2>
                  <p>Recopilamos información que proporcionas directamente: Nombre completo, correo electrónico y número de WhatsApp al registrarte. Información de perfil (ciudad, tipo de cuenta, fotografía). Listados que publiques (título, descripción, imágenes, precio). Solicitudes de entregas, viajes y comida. Mensajes y comunicaciones a través de la plataforma. Información de contacto de compradores, vendedores, repartidores y conductores.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">2. Cómo usamos la información</h2>
                  <p>Utilizamos tu información para: Crear y mantener tu cuenta. Facilitar transacciones y conexiones entre usuarios. Enviar notificaciones y actualizaciones. Mejorar la seguridad y prevenir fraude. Responder a tus consultas y solicitudes de soporte. Cumplir con requisitos legales.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">3. Cuentas y autenticación</h2>
                  <p>Usamos autenticación sin contraseña mediante enlaces mágicos enviados a tu correo. No almacenamos contraseñas. Tu correo electrónico se utiliza únicamente para verificar tu identidad y enviarte actualizaciones importantes.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">4. Marketplace, entregas y viajes</h2>
                  <p>Para compradores y vendedores: Almacenamos listados, búsquedas y datos de transacciones. Para repartidores y conductores: Almacenamos ubicación, disponibilidad y datos de contacto. Esta información se comparte entre usuarios para facilitar servicios. Los datos de ubicación en tiempo real se usarán cuando el seguimiento en vivo esté disponible.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">5. Imágenes y contenido</h2>
                  <p>Las imágenes que subes se almacenan en servidores seguros (Vercel Blob). Pueden ser visibles públicamente en el marketplace. No modificamos ni redistribuimos tus imágenes sin consentimiento.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">6. Comunicaciones</h2>
                  <p>Usamos tu correo y WhatsApp para: Enlaces de inicio de sesión. Notificaciones de actividad. Actualizaciones de pedidos. Mensajes de soporte. Información importante sobre cambios. Puedes desuscribirse de notificaciones no esenciales en cualquier momento.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">7. Pagos (en desarrollo)</h2>
                  <p>Las funciones de pago están en desarrollo. Cuando estén disponibles, no almacenaremos detalles de tarjetas directamente. Los pagos se procesarán a través de proveedores seguros de terceros. Almacenaremos registros de transacciones para contabilidad y soporte.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">8. Seguridad</h2>
                  <p>Implementamos encriptación de datos, validación de usuarios, monitoreo de actividad sospechosa y análisis para prevenir fraude. Compartimos información solo entre usuarios para facilitar transacciones, con proveedores de servicios, cuando lo requiere la ley, o para proteger derechos y seguridad.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">9. Tus derechos</h2>
                  <p>Tienes derecho a: Acceder a tus datos personales. Corregir información inexacta. Solicitar la eliminación de tus datos. Exportar tus datos. Revocar consentimientos. Contacta a ayud@eyooly.com para ejercer estos derechos.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">10. Contacto</h2>
                  <p>Para preguntas sobre privacidad, contacta: WhatsApp: +240 555 271 524 | Email: hola@eyooly.com | Soporte: ayud@eyooly.com</p>
                </section>
              </>
            ) : (
              <>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">1. Information We Collect</h2>
                  <p>We collect information you provide directly: Full name, email, and WhatsApp number when you register. Profile information (city, account type, photo). Listings you publish (title, description, images, price). Delivery, ride, and food requests. Messages and communications on the platform. Contact information of buyers, sellers, riders, and drivers.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">2. How We Use Your Information</h2>
                  <p>We use your information to: Create and maintain your account. Facilitate transactions and connections between users. Send notifications and updates. Improve security and prevent fraud. Respond to your inquiries and support requests. Comply with legal requirements.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">3. Accounts and Authentication</h2>
                  <p>We use passwordless authentication via magic links sent to your email. We do not store passwords. Your email is used only to verify your identity and send you important updates.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">4. Marketplace, Deliveries, and Rides</h2>
                  <p>For buyers and sellers: We store listings, searches, and transaction data. For riders and drivers: We store location, availability, and contact data. This information is shared between users to facilitate services. Real-time location data will be used when live tracking is available.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">5. Images and Content</h2>
                  <p>Images you upload are stored on secure servers (Vercel Blob). They may be visible publicly on the marketplace. We do not modify or redistribute your images without consent.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">6. Communications</h2>
                  <p>We use your email and WhatsApp for: Sign-in links. Activity notifications. Order updates. Support messages. Important information about changes. You can unsubscribe from non-essential notifications at any time.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">7. Payments (In Development)</h2>
                  <p>Payment features are in development. When available, we will not directly store card details. Payments will be processed through secure third-party providers. We will store transaction records for accounting and support purposes.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">8. Security</h2>
                  <p>We implement data encryption, user validation, suspicious activity monitoring, and fraud prevention analysis. We share information only between users to facilitate transactions, with service providers, when required by law, or to protect rights and security.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">9. Your Rights</h2>
                  <p>You have the right to: Access your personal data. Correct inaccurate information. Request data deletion. Export your data. Revoke consents. Contact ayud@eyooly.com to exercise these rights.</p>
                </section>
                <section>
                  <h2 className="text-lg font-bold text-carbon mb-3">10. Contact</h2>
                  <p>For privacy questions, contact: WhatsApp: +240 555 271 524 | Email: hola@eyooly.com | Support: ayud@eyooly.com</p>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
