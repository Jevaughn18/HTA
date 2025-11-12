import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'

export default async function HomePage() {
  // Fetch data from Sanity CMS
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{
    heroHeadline,
    heroSubheading,
    sundayServiceTime,
    sundaySchoolTime,
    visionStatement
  }`)

  const locations = await client.fetch(`*[_type == "location"] | order(order asc){
    _id,
    name,
    pastor,
    address,
    city,
    googleMapsLink,
    isHeadquarters
  }`)

  const events = await client.fetch(`*[_type == "event" && isFeatured == true && isUpcoming == true] | order(startDate asc)[0...2]{
    _id,
    title,
    description,
    startDate,
    location,
    "imageUrl": image.asset->url
  }`)

  return (
    <>
      <Navigation />

      <main>
        {/* SECTION 1: Hero Video Section */}
        <section className="hero-video" aria-label="Welcome" style={{ backgroundImage: 'url(/youth.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="hero-video-overlay"></div>
          <div className="hero-video-content">
            <h1>{settings?.heroHeadline || 'Building Legacies of Faith.'}</h1>
            <p>{settings?.heroSubheading || 'Welcome to Harvest Temple Apostolic'}</p>
            <div className="hero-buttons">
              <Link href="/contact" className="btn btn-primary-solid" role="button">Plan A Visit</Link>
              <Link href="/contact" className="btn btn-primary-outline" role="button">Get Connected <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </section>

        {/* Service Times & Locations */}
        <section className="locations-section">
        <div className="container">
          <div className="section-header">
            <h2>Join Us for Worship</h2>
            <p>We have locations across Jamaica to serve you</p>
          </div>

          <div className="service-times">
            <div className="service-time-card">
              <i className="fas fa-church"></i>
              <h3>Sunday Service</h3>
              <p>{settings?.sundayServiceTime || '10:00 AM'}</p>
            </div>
            <div className="service-time-card">
              <i className="fas fa-book-open"></i>
              <h3>Sunday School</h3>
              <p>{settings?.sundaySchoolTime || '9:00 AM'}</p>
            </div>
          </div>

          <div className="locations-grid">
            {locations?.map((location: any) => (
              <div key={location._id} className="location-card">
                {location.isHeadquarters && (
                  <div className="headquarters-badge">Headquarters</div>
                )}
                <h3>{location.name}</h3>
                <p className="pastor-name">
                  <i className="fas fa-user"></i> {location.pastor}
                </p>
                <p className="location-address">
                  <i className="fas fa-map-marker-alt"></i> {location.address}, {location.city}
                </p>
                {location.googleMapsLink && (
                  <a
                    href={location.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-small"
                  >
                    Get Directions
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Statement */}
      <section className="vision-section">
        <div className="container">
          <div className="vision-content">
            <h2>Our Vision</h2>
            {settings?.visionStatement && (
              <p>{settings.visionStatement}</p>
            )}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="next-steps-section">
        <div className="container">
          <div className="section-header">
            <h2>Take Your Next Step</h2>
            <p>Discover ways to connect and grow with us</p>
          </div>

          <div className="cards-grid">
            <div className="feature-card">
              <div className="card-image">
                <Image src="/church.jpeg" alt="Plan a Visit" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3>Plan a Visit</h3>
                <p>Join us for worship this Sunday. We can&apos;t wait to meet you!</p>
                <Link href="/contact" className="btn btn-primary">Learn More</Link>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-image">
                <Image src="/National Youth Department.jpg" alt="Departments" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3>Departments</h3>
                <p>Find your place in our vibrant ministry departments.</p>
                <Link href="/departments" className="btn btn-primary">Explore</Link>
              </div>
            </div>

            <div className="feature-card">
              <div className="card-image">
                <Image src="/Choir.jpg" alt="Serve" width={400} height={250} />
              </div>
              <div className="card-content">
                <h3>Serve</h3>
                <p>Use your gifts to make a difference in our community.</p>
                <Link href="/contact" className="btn btn-primary">Get Involved</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <section className="events-preview-section">
          <div className="container">
            <div className="section-header">
              <h2>Upcoming Events</h2>
              <Link href="/events" className="btn btn-secondary">View All Events</Link>
            </div>

            <div className="events-grid">
              {events.map((event: any) => (
                <div key={event._id} className="event-card-large">
                  {event.imageUrl && (
                    <div className="event-image">
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        width={600}
                        height={400}
                      />
                    </div>
                  )}
                  <div className="event-content">
                    <div className="event-date">
                      {new Date(event.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                    {event.location && (
                      <p className="event-location">
                        <i className="fas fa-map-marker-alt"></i> {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

        {/* Generosity */}
        <section className="generosity-section">
          <div className="generosity-overlay"></div>
          <div className="generosity-content">
            <h2>Thank You For Your Generosity</h2>
            <div className="gold-underline"></div>
            <p>Thank you for your generosity - your support allows Harvest Temple Apostolic to make a meaningful impact in our community, sharing hope and transforming lives every day.</p>
            <div className="generosity-buttons">
              <Link href="/give" className="btn btn-primary-solid">Give Online</Link>
              <Link href="/give" className="btn btn-primary-outline">Ways To Give <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
