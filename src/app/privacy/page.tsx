import PublicLayout from "@/components/layout/PublicLayout";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="bg-carbon pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-cream mb-2">Política de Privacidad</h1>
          <p className="text-cream/50 text-sm">Última actualización: Mayo 2025</p>
        </div>
      </div>
      <div className="bg-cream section-py">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-carbon max-w-none">
          <div className="bg-white rounded-2xl border border-carbon/8 p-8 space-y-6 text-carbon/80 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">1. Información que recopilamos</h2>
              <p>Eyooly recopila información que usted nos proporciona directamente, como su nombre, dirección de correo electrónico, número de teléfono y contenido de anuncios. También recopilamos automáticamente información sobre su uso de la plataforma.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">2. Uso de la información</h2>
              <p>Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, enviar notificaciones técnicas y de soporte, y responder a sus comentarios y preguntas.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">3. Compartir información</h2>
              <p>No vendemos, intercambiamos ni transferimos su información personal a terceros sin su consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios o cuando lo exija la ley.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">4. Seguridad de datos</h2>
              <p>Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">5. Sus derechos</h2>
              <p>Tiene derecho a acceder, corregir o eliminar su información personal. Para ejercer estos derechos, contáctenos en privacidad@eyooly.com.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">6. Contacto</h2>
              <p>Si tiene preguntas sobre esta política de privacidad, contáctenos en: <a href="mailto:privacidad@eyooly.com" className="text-terracotta hover:underline">privacidad@eyooly.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
