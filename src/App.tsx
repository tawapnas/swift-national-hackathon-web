import ScrollEmojis from './components/ScrollEmojis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import About from './components/About'
import Format from './components/Format'
import Eligibility from './components/Eligibility'
import Learn from './components/Learn'
import Timeline from './components/Timeline'
import Organizers from './components/Organizers'
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
        <Learn />
        <Organizers />
      </main>
      <Footer />
    </>
  )
}
