import ScrollEmojis from './components/ScrollEmojis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import About from './components/About'
import Format from './components/Format'
import Eligibility from './components/Eligibility'
import Timeline from './components/Timeline'
import Organizers from './components/Organizers'
import CTABanner from './components/CTABanner'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <ScrollEmojis />
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Format />
        <Eligibility />
        <Timeline />
        <Organizers />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
