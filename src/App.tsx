import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
// import RegionsMap from './components/RegionsMap' // hidden for now
import About from './components/About'
import Format from './components/Format'
import Eligibility from './components/Eligibility'
import Learn from './components/Learn'
import Timeline from './components/Timeline'
import Organizers from './components/Organizers'
import Footer from './components/Footer'
import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'

export default function App() {
  // Arriving from another page (the navbar's links on the daily-lessons page):
  // the router neither scrolls to a section hash (/#timeline) nor resets the
  // scroll position the previous page was left at.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Gallery />
        {/* <RegionsMap /> hidden for now */}
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
