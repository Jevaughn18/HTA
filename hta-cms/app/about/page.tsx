import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main>
        <section style={{minHeight: '100vh', paddingTop: '100px', textAlign: 'center'}}>
          <h1>About Page</h1>
          <p>Content from Sanity CMS will go here</p>
        </section>
      </main>
      <Footer />
    </>
  )
}
