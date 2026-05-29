// src/app/showcase/page.tsx

import Image from "next/image"
import Link from "next/link"

const improvements = [
  {
    title: "Hero Section Redesign",
    description:
      "Premium app mockup, floating trust cards, soft gradients, and responsive layout for stronger first impressions.",
    tag: "Hero",
  },
  {
    title: "Premium Global Styling",
    description:
      "New shadow utilities, glass cards, glow effects, smooth animations, and improved typography.",
    tag: "Design System",
  },
  {
    title: "Header Refinement",
    description:
      "Cleaner glass navigation, better language switcher, refined dropdowns, and stronger mobile usability.",
    tag: "Navigation",
  },
  {
    title: "Footer Redesign",
    description:
      "App Store badges, social links, stronger waitlist CTA, and improved brand messaging.",
    tag: "Footer",
  },
  {
    title: "Stats Section Upgrade",
    description:
      "Icon containers, better hierarchy, responsive grids, and clearer trust-building numbers.",
    tag: "Trust",
  },
  {
    title: "Service Cards Improvement",
    description:
      "Smoother hover states, better image zoom, refined borders, and marketplace-style presentation.",
    tag: "Marketplace",
  },
]

const stats = [
  { value: "ES / EN", label: "Language support" },
  { value: "100%", label: "Brand consistency" },
  { value: "Mobile", label: "Responsive ready" },
  { value: "Vercel", label: "Deployment ready" },
]

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#f5f2ed] text-[#080e0a]">
      <section className="relative overflow-hidden px-6 py-20 md:px-12 lg:px-20">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-[#c9735a]/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-72 w-72 rounded-full bg-[#b7baad]/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-[#c9735a]/30 bg-white/60 px-4 py-2 text-sm font-medium text-[#c9735a] shadow-sm backdrop-blur">
              Eyooly UI Enhancement Showcase
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight md:text-6xl">
              A premium marketplace experience for Equatorial Guinea.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#0f1110]/70">
              Explore the upgraded Eyooly landing page experience: modern visuals,
              glass effects, stronger trust signals, improved responsiveness, and
              a polished brand system ready for launch.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-full bg-[#c9735a] px-6 py-3 font-semibold text-white shadow-lg shadow-[#c9735a]/25 transition hover:scale-105"
              >
                View Landing Page
              </Link>

              <Link
                href="#improvements"
                className="rounded-full border border-[#080e0a]/10 bg-white/70 px-6 py-3 font-semibold text-[#080e0a] backdrop-blur transition hover:bg-white"
              >
                See Improvements
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -left-8 top-10 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl backdrop-blur">
              <p className="text-sm font-semibold">📍 Malabo</p>
              <p className="text-xs text-[#0f1110]/60">Local marketplace focus</p>
            </div>

            <div className="absolute -right-8 bottom-20 rounded-2xl border border-white/50 bg-white/70 p-4 shadow-xl backdrop-blur">
              <p className="text-sm font-semibold">✅ Verified Sellers</p>
              <p className="text-xs text-[#0f1110]/60">Trust-first experience</p>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/50 p-4 shadow-2xl backdrop-blur">
              <div className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#080e0a] via-[#0f1110] to-[#c9735a] p-6 text-white">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-white/70">Eyooly App Preview</p>
                  <h2 className="mt-2 text-2xl font-bold">Find local services faster.</h2>
                </div>

                <div className="mt-8 grid gap-4">
                  {["Food delivery", "Local sellers", "Home services"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white/15 p-4 text-sm font-medium backdrop-blur"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#080e0a]/10 bg-white/60 px-6 py-10 backdrop-blur md:px-12 lg:px-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-[#c9735a]">{stat.value}</p>
              <p className="mt-1 text-sm text-[#0f1110]/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="improvements" className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-semibold text-[#c9735a]">Design improvements</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">
              Built to feel modern, local, and trustworthy.
            </h2>
            <p className="mt-4 text-[#0f1110]/70">
              Each upgrade keeps the Eyooly identity intact while improving polish,
              usability, and marketplace credibility.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {improvements.map((item) => (
              <article
                key={item.title}
                className="group rounded-3xl border border-[#080e0a]/10 bg-white/70 p-6 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="rounded-full bg-[#b7baad]/30 px-3 py-1 text-xs font-semibold text-[#080e0a]">
                  {item.tag}
                </span>

                <h3 className="mt-5 text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#0f1110]/70">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-[#080e0a] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="font-semibold text-[#c9735a]">Deployment ready</p>
              <h2 className="mt-3 text-3xl font-bold">
                Ready to present, test, and launch.
              </h2>
              <p className="mt-4 text-white/70">
                This showcase can be used for investor previews, stakeholder demos,
                internal design reviews, or public product storytelling.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-white/60">Recommended next steps</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>✅ Add real App Store and Google Play links</li>
                <li>✅ Replace mock app preview with final screenshots</li>
                <li>✅ Add conversion tracking to waitlist CTA</li>
                <li>✅ Deploy preview branch to Vercel</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}