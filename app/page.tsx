'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./components/ThemeToggle";
import { supabase } from "../lib/supabase";
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <main>
      <nav className="navbar">
        <div className="nav-brand">
           OmiBus
        </div>
        <div className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/destinations" className="nav-link">Destinations</Link>
          <Link href="/account" className="nav-link">Bookings</Link>
          {user && <Link href="/account" className="nav-link">My Account</Link>}
          <div className="mobile-nav-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {!user ? (
              <>
                <Link href="/login" style={{ width: '100%' }}>
                  <button className="btn-outline" style={{ width: '100%' }}>Log in</button>
                </Link>
                <Link href="/signup" style={{ width: '100%' }}>
                  <button className="btn-primary" style={{ width: '100%' }}>Get started</button>
                </Link>
              </>
            ) : (
              <Link href="/account" style={{ width: '100%' }}>
                <button className="btn-primary" style={{ width: '100%' }}>Dashboard</button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">The Best Booking Experience</span>
          <h1 className="hero-title">
            Book Your <br/><span>Destination</span> <br/>For Tours
          </h1>
          <p className="hero-subtitle">
            Premium luxury travel across Nigeria. Book comfortable seats, enjoy real-time tracking, and travel in style with OmiBus.
          </p>

          <div className="search-box">
            <div className="search-field">
              <span className="search-label">From</span>
              <input type="text" className="search-input" placeholder="Enter your departure" />
            </div>
            
            <div className="search-field">
              <span className="search-label">To</span>
              <input type="text" className="search-input" placeholder="Enter your destination" />
            </div>

            <div className="search-field">
              <span className="search-label">Date</span>
              <input type="date" className="search-input" />
            </div>

            <div className="search-buttons">
              <Link href="/hire" style={{ width: '100%' }}>
                <button className="btn-outline" style={{ width: '100%', padding: '1rem' }}>Hire a Bus</button>
              </Link>
              <Link href="/results" style={{ width: '100%' }}>
                <button className="btn-primary" style={{ width: '100%', padding: '1rem' }}>Search Buses</button>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-blob"></div>
          <img src="/red-bus.png" alt="Luxury Red Bus" className="hero-bus" />
        </div>
      </section>

      <section className="destinations">
        <h2 className="section-title">Find The Perfect<br/>Destinations to travel</h2>
        <div className="dest-grid">
          <div className="dest-card">
            <img src="/abuja.png" alt="Abuja" />
            <div className="dest-info">
              <h3 className="dest-name">Abuja City Tour</h3>
              <span className="dest-price">From ₦15,000</span>
            </div>
          </div>
          <div className="dest-card">
            <img src="/lagos.png" alt="Lagos" />
            <div className="dest-info">
              <h3 className="dest-name">Lagos Mainland</h3>
              <span className="dest-price">From ₦12,000</span>
            </div>
          </div>
          <div className="dest-card">
            <img src="/calabar.png" alt="Calabar" />
            <div className="dest-info">
              <h3 className="dest-name">Calabar Carnival</h3>
              <span className="dest-price">From ₦25,000</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
