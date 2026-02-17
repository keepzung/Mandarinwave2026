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
      <Courses />
      <WhyWaveMandarin />
      <Reviews />
      <CTA />
      <Footer />
    </main>
  )
}
