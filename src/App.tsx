import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import RegionsMap from './components/RegionsMap'
import About from './components/About'
import Format from './components/Format'
import Eligibility from './components/Eligibility'
import Learn from './components/Learn'
import Timeline from './components/Timeline'
import Organizers from './components/Organizers'
import Footer from './components/Footer'
import { Analytics } from '@vercel/analytics/react'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        <RegionsMap />
        <About />
        <Format />
        <Eligibility />
        <Timeline />
        <Learn />
        <Organizers />
      </main>
      <Footer />
      <Analytics />
    </>
  )
}
