import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="main-footer" aria-label="Footer">
      <div className="footer-top">
        <div className="footer-col">
          <i className="fas fa-envelope fa-2x"></i>
          <h3>Email</h3>
          <a href="mailto:info@harvesttempleapostolic.org">info@harvesttempleapostolic.org</a>
        </div>
        <div className="footer-col">
          <i className="fas fa-map-marker-alt fa-2x"></i>
          <h3>Find Us</h3>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
            822A Southern Parade<br />Waterford P.O, Jamaica
          </a>
        </div>
        <div className="footer-col">
          <i className="fas fa-credit-card fa-2x"></i>
          <h3>Give</h3>
          <Link href="/give">Give Online</Link>
        </div>
      </div>

      <div className="footer-social">
        <a href="https://www.facebook.com/profile.php?id=100069664802993" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://www.youtube.com/@harvesttempleapostolicchurch" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-youtube"></i>
        </a>
      </div>

      <nav className="footer-nav">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/departments">Departments</Link>
        <Link href="/contact">Contact Us</Link>
        <Link href="/events">Events</Link>
        <Link href="/give">Give</Link>
        <Link href="/contact">New Here?</Link>
      </nav>

      <div className="footer-bottom">
        <p>&copy; 2025 Harvest Temple Apostolic. All rights reserved.</p>
      </div>
    </footer>
  )
}
