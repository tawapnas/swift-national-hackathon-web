import Navbar from './components/Navbar'
import Hero from './components/Hero'
import InvitationQuote from './components/InvitationQuote'
import About from './components/About'
import Format from './components/Format'
import Themes from './components/Themes'
import Criteria from './components/Criteria'
import Timeline from './components/Timeline'
import Benefits from './components/Benefits'
import Organizers from './components/Organizers'
import CTABanner from './components/CTABanner'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <InvitationQuote />
        <About />
        <Format />
        <Themes />
        <Criteria />
        <Timeline />
        <Benefits />
        <Organizers />
        <CTABanner />
      </main>
      <Footer />
    </>
  )
}
