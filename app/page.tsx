import { Hero } from "@/components/hero"
import { Mission } from "@/components/mission"
import { Courses } from "@/components/courses"
import { WhyWaveMandarin } from "@/components/why-wave-mandarin"
import { Reviews } from "@/components/reviews"
import { CTA } from "@/components/cta"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Mission />
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <img
            src="/images/certificate.png"
            alt="Certificate"
            className="w-full h-auto max-w-xl mx-auto rounded-xl shadow-lg"
            loading="lazy"
          />
        </div>
      </section>
      <Courses />
      <WhyWaveMandarin />
      <Reviews />
      <CTA />
      <Footer />
    </main>
  )
}
