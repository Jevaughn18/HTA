'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="nav-container" aria-label="Main navigation">
        <div className="logo">
          <Link href="/" aria-label="Harvest Temple Apostolic Home">
            <Image src="/logo.png" alt="HTA Logo" width={80} height={80} priority />
          </Link>
        </div>

        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link href="/" className="active" aria-current="page" onClick={closeMobileMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" onClick={closeMobileMenu}>
              About
            </Link>
          </li>
          <li>
            <Link href="/departments" onClick={closeMobileMenu}>
              Departments
            </Link>
          </li>
          <li>
            <Link href="/media" onClick={closeMobileMenu}>
              Media
            </Link>
          </li>
          <li>
            <Link href="/contact" onClick={closeMobileMenu}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link href="/events" onClick={closeMobileMenu}>
              Events
            </Link>
          </li>
          <li>
            <Link href="/give" onClick={closeMobileMenu}>
              Give
            </Link>
          </li>
          <li>
            <Link href="/contact" className="btn-nav-outline" onClick={closeMobileMenu}>
              New Here?
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
