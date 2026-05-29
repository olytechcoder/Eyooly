import PublicLayout from "@/components/layout/PublicLayout";

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="bg-carbon pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-cream mb-2">Términos de Servicio</h1>
          <p className="text-cream/50 text-sm">Última actualización: Mayo 2025</p>
        </div>
      </div>
      <div className="bg-cream section-py">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-carbon/8 p-8 space-y-6 text-carbon/80 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">1. Aceptación de los términos</h2>
              <p>Al acceder y utilizar Eyooly, usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no utilice nuestra plataforma.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">2. Uso de la plataforma</h2>
              <p>Eyooly es una plataforma de marketplace local para Guinea Ecuatorial. Los usuarios pueden publicar anuncios de productos y servicios, solicitar entregas y viajes, y contactar con otros usuarios. Usted es responsable de la veracidad de la información que publica.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">3. Contenido prohibido</h2>
              <p>Está prohibido publicar contenido ilegal, fraudulento, engañoso, difamatorio, obsceno o que viole los derechos de terceros. Eyooly se reserva el derecho de eliminar cualquier contenido que viole estas normas.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">4. Responsabilidad</h2>
              <p>Eyooly actúa como intermediario entre compradores y vendedores. No somos responsables de las transacciones entre usuarios, la calidad de los productos o servicios, ni de los daños derivados del uso de la plataforma.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">5. Modificaciones</h2>
              <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">6. Ley aplicable</h2>
              <p>Estos términos se rigen por las leyes de la República de Guinea Ecuatorial. Cualquier disputa se resolverá en los tribunales competentes de Malabo.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-carbon mb-3">7. Contacto</h2>
              <p>Para preguntas sobre estos términos: <a href="mailto:legal@eyooly.com" className="text-terracotta hover:underline">legal@eyooly.com</a></p>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
