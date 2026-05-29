import { PrismaClient, ListingStatus, ListingType } from "@prisma/client";

const prisma = new PrismaClient();

function makeSlug(title: string, id: number): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    id
  );
}

async function main() {
  console.log("🌱 Seeding Eyooly database (MVP v0.1)...");

  // ── Categories ────────────────────────────────────────────────────────────
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: "electronica" }, update: {}, create: { name: "Electrónica", nameEs: "Electrónica", nameEn: "Electronics", nameFr: "Électronique", slug: "electronica", icon: "📱", color: "#3b82f6", order: 1 } }),
    prisma.category.upsert({ where: { slug: "moda" }, update: {}, create: { name: "Moda", nameEs: "Moda y Ropa", nameEn: "Fashion", nameFr: "Mode", slug: "moda", icon: "👗", color: "#ec4899", order: 2 } }),
    prisma.category.upsert({ where: { slug: "hogar" }, update: {}, create: { name: "Hogar", nameEs: "Hogar y Jardín", nameEn: "Home & Garden", nameFr: "Maison", slug: "hogar", icon: "🏠", color: "#10b981", order: 3 } }),
    prisma.category.upsert({ where: { slug: "vehiculos" }, update: {}, create: { name: "Vehículos", nameEs: "Vehículos", nameEn: "Vehicles", nameFr: "Véhicules", slug: "vehiculos", icon: "🚗", color: "#f59e0b", order: 4 } }),
    prisma.category.upsert({ where: { slug: "inmuebles" }, update: {}, create: { name: "Inmuebles", nameEs: "Inmuebles", nameEn: "Real Estate", nameFr: "Immobilier", slug: "inmuebles", icon: "🏢", color: "#8b5cf6", order: 5 } }),
    prisma.category.upsert({ where: { slug: "servicios" }, update: {}, create: { name: "Servicios", nameEs: "Servicios", nameEn: "Services", nameFr: "Services", slug: "servicios", icon: "🔧", color: "#c9735a", order: 6 } }),
    prisma.category.upsert({ where: { slug: "alimentacion" }, update: {}, create: { name: "Alimentación", nameEs: "Alimentación", nameEn: "Food", nameFr: "Alimentation", slug: "alimentacion", icon: "🍎", color: "#ef4444", order: 7 } }),
    prisma.category.upsert({ where: { slug: "deportes" }, update: {}, create: { name: "Deportes", nameEs: "Deportes", nameEn: "Sports", nameFr: "Sports", slug: "deportes", icon: "⚽", color: "#06b6d4", order: 8 } }),
  ]);
  console.log(`✅ ${cats.length} categories seeded`);

  // ── Sample listings ───────────────────────────────────────────────────────
  const listingData = [
    {
      id: 1,
      title: "iPhone 14 Pro — Como nuevo",
      description: "iPhone 14 Pro 256GB en perfecto estado. Incluye cargador original y funda. Batería al 98%. Desbloqueado para cualquier operador.",
      price: 850000,
      city: "Malabo",
      listingType: ListingType.PRODUCT,
      status: ListingStatus.APPROVED,
      featured: true,
      categoryId: cats[0].id,
      imageUrl: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&q=80",
      sellerName: "Carlos Mba",
      sellerWhatsapp: "+240222111001",
    },
    {
      id: 2,
      title: "Laptop Dell XPS 13 — Excelente estado",
      description: "Dell XPS 13 Intel i7, 16GB RAM, 512GB SSD. Perfecta para trabajo y estudios. Incluye bolsa original.",
      price: 1200000,
      city: "Bata",
      listingType: ListingType.PRODUCT,
      status: ListingStatus.APPROVED,
      featured: false,
      categoryId: cats[0].id,
      imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
      sellerName: "Amelia Nguema",
      sellerWhatsapp: "+240222111002",
    },
    {
      id: 3,
      title: "Vestido de fiesta elegante",
      description: "Vestido largo de fiesta, talla M. Color negro con detalles dorados. Solo usado una vez para evento especial.",
      price: 45000,
      city: "Malabo",
      listingType: ListingType.PRODUCT,
      status: ListingStatus.APPROVED,
      featured: false,
      categoryId: cats[1].id,
      imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
      sellerName: "María Obiang",
      sellerWhatsapp: "+240222111003",
    },
    {
      id: 4,
      title: "Sofá 3 plazas — Cuero marrón",
      description: "Sofá de cuero genuino, 3 plazas. En muy buen estado. Medidas: 220x90cm. Entrega disponible en Malabo.",
      price: 320000,
      city: "Malabo",
      listingType: ListingType.PRODUCT,
      status: ListingStatus.APPROVED,
      featured: true,
      categoryId: cats[2].id,
      imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
      sellerName: "Pedro Esono",
      sellerWhatsapp: "+240222111004",
    },
    {
      id: 5,
      title: "Toyota Corolla 2019 — Impecable",
      description: "Toyota Corolla 2019, automático, 45.000 km. Revisión al día. Color blanco perla. Documentación completa.",
      price: 12500000,
      city: "Malabo",
      listingType: ListingType.PRODUCT,
      status: ListingStatus.APPROVED,
      featured: true,
      categoryId: cats[3].id,
      imageUrl: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80",
      sellerName: "Juan Ndong",
      sellerWhatsapp: "+240222111005",
    },
    {
      id: 6,
      title: "Apartamento 2 habitaciones — Centro Malabo",
      description: "Apartamento moderno de 2 habitaciones en el centro de Malabo. Cocina equipada, agua y luz incluidos. Disponible inmediatamente.",
      price: 250000,
      city: "Malabo",
      listingType: ListingType.CLASSIFIED,
      status: ListingStatus.APPROVED,
      featured: false,
      categoryId: cats[4].id,
      imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
      sellerName: "Rosa Abeso",
      sellerWhatsapp: "+240222111006",
    },
    {
      id: 7,
      title: "Servicio de fontanería profesional",
      description: "Fontanero profesional con 10 años de experiencia en Guinea Ecuatorial. Reparaciones, instalaciones y mantenimiento. Disponible 24h.",
      price: 15000,
      city: "Bata",
      listingType: ListingType.SERVICE,
      status: ListingStatus.APPROVED,
      featured: false,
      categoryId: cats[5].id,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      sellerName: "Marcos Ela",
      sellerWhatsapp: "+240222111007",
    },
    {
      id: 8,
      title: "Cesta de frutas tropicales — Entrega a domicilio",
      description: "Cesta con frutas frescas de temporada: mango, papaya, piña, plátano. Entrega en Malabo mismo día.",
      price: 8500,
      city: "Malabo",
      listingType: ListingType.FOOD,
      status: ListingStatus.APPROVED,
      featured: false,
      categoryId: cats[6].id,
      imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
      sellerName: "Lucia Maye",
      sellerWhatsapp: "+240222111008",
    },
    {
      id: 9,
      title: "Samsung Galaxy S23 — Nuevo en caja",
      description: "Samsung Galaxy S23 256GB, color negro. Completamente nuevo, sin abrir. Garantía de 1 año incluida.",
      price: 720000,
      city: "Malabo",
      listingType: ListingType.PRODUCT,
      status: ListingStatus.PENDING,
      featured: false,
      categoryId: cats[0].id,
      imageUrl: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&q=80",
      sellerName: "Tomás Nchama",
      sellerWhatsapp: "+240222111009",
    },
    {
      id: 10,
      title: "Clases de inglés — Nivel básico y avanzado",
      description: "Profesor nativo con certificación TEFL. Clases individuales o en grupo. Horarios flexibles. Presencial en Malabo o por videollamada.",
      price: 20000,
      city: "Malabo",
      listingType: ListingType.SERVICE,
      status: ListingStatus.APPROVED,
      featured: false,
      categoryId: cats[5].id,
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
      sellerName: "David Owono",
      sellerWhatsapp: "+240222111010",
    },
  ];

  let seeded = 0;
  for (const data of listingData) {
    const slug = makeSlug(data.title, data.id);
    await prisma.listing.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: data.title,
        description: data.description,
        price: data.price,
        currency: "XAF",
        city: data.city,
        listingType: data.listingType,
        status: data.status,
        featured: data.featured,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl,
        sellerName: data.sellerName,
        sellerWhatsapp: data.sellerWhatsapp,
      },
    });
    seeded++;
  }
  console.log(`✅ ${seeded} listings seeded`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
