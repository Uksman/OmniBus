'use client';
import { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./components/ThemeToggle";
import { supabase } from "../lib/supabase";
import { User } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

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
        <div className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/destinations" className="nav-link">Destinations</Link>
          <Link href="/account" className="nav-link">Bookings</Link>
          {user && <Link href="/account" className="nav-link">My Account</Link>}
        </div>
        <div className="nav-actions">
          {/* <ThemeToggle /> */}
          {!user ? (
            <>
              <Link href="/login">
                <button className="btn-outline">Log in</button>
              </Link>
              <Link href="/signup">
                <button className="btn-primary">Get started</button>
              </Link>
            </>
          ) : (
            <Link href="/account">
              <button className="btn-primary">Dashboard</button>
            </Link>
          )}
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

            <div style={{ width: '100%', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Link href="/hire">
                <button className="btn-outline">Hire a Bus</button>
              </Link>
              <Link href="/results">
                <button className="btn-primary">Search Buses</button>
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
