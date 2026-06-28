'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./components/ThemeToggle";
import { ShieldCheck, Clock, CreditCard, MapPin, Star } from 'lucide-react';
import { supabase } from "../lib/supabase";
import { User } from '@supabase/supabase-js';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

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
              <input type="text" className="search-input" placeholder="Enter your departure" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            
            <div className="search-field">
              <span className="search-label">To</span>
              <input type="text" className="search-input" placeholder="Enter your destination" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            <div className="search-field">
              <span className="search-label">Date</span>
              <input type="date" className="search-input" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            <div className="search-buttons">
              <Link href="/hire" style={{ width: '100%' }}>
                <button className="btn-outline" style={{ width: '100%', padding: '1rem' }}>Hire a Bus</button>
              </Link>
              <button 
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem' }}
                onClick={() => {
                  const query = new URLSearchParams();
                  if (from) query.set('from', from);
                  if (to) query.set('to', to);
                  if (date) query.set('date', date);
                  router.push(`/results?${query.toString()}`);
                }}
              >
                Search Buses
              </button>
            </div>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-blob"></div>
          <Image src="/red-bus.png" alt="Luxury Red Bus" className="hero-bus" width={900} height={500} priority />
        </div>
      </section>

      <section className="destinations">
        <h2 className="section-title">Find The Perfect<br/>Destinations to travel</h2>
        <div className="dest-grid">
          <Link href="/results?to=Abuja" className="dest-card" style={{ display: 'block', textDecoration: 'none' }}>
            <Image src="/abuja.png" alt="Abuja" fill style={{ objectFit: 'cover' }} />
            <div className="dest-info">
              <h3 className="dest-name">Abuja City Tour</h3>
              <span className="dest-price">From ₦15,000</span>
            </div>
          </Link>
          <Link href="/results?to=Lagos" className="dest-card" style={{ display: 'block', textDecoration: 'none' }}>
            <Image src="/lagos.png" alt="Lagos" fill style={{ objectFit: 'cover' }} />
            <div className="dest-info">
              <h3 className="dest-name">Lagos Mainland</h3>
              <span className="dest-price">From ₦12,000</span>
            </div>
          </Link>
          <Link href="/results?to=Calabar" className="dest-card" style={{ display: 'block', textDecoration: 'none' }}>
            <Image src="/calabar.png" alt="Calabar" fill style={{ objectFit: 'cover' }} />
            <div className="dest-info">
              <h3 className="dest-name">Calabar Carnival</h3>
              <span className="dest-price">From ₦25,000</span>
            </div>
          </Link>
          <Link href="/results?to=Port%20Harcourt" className="dest-card" style={{ display: 'block', textDecoration: 'none' }}>
            <Image src="/port-harcourt.png" alt="Port Harcourt" fill style={{ objectFit: 'cover' }} />
            <div className="dest-info">
              <h3 className="dest-name">Port Harcourt City</h3>
              <span className="dest-price">From ₦18,000</span>
            </div>
          </Link>
          <Link href="/results?to=Enugu" className="dest-card" style={{ display: 'block', textDecoration: 'none' }}>
            <Image src="/enugu.png" alt="Enugu" fill style={{ objectFit: 'cover' }} />
            <div className="dest-info">
              <h3 className="dest-name">Enugu Rolling Hills</h3>
              <span className="dest-price">From ₦14,000</span>
            </div>
          </Link>
          <Link href="/results?to=Kano" className="dest-card" style={{ display: 'block', textDecoration: 'none' }}>
            <Image src="/kano.png" alt="Kano" fill style={{ objectFit: 'cover' }} />
            <div className="dest-info">
              <h3 className="dest-name">Kano Ancient Gates</h3>
              <span className="dest-price">From ₦16,000</span>
            </div>
          </Link>
        </div>
      </section>

      <section className="features-section">
        <div className="features-header">
          <span className="hero-badge">Why Choose Us</span>
          <h2 className="section-title">We Provide The Best<br/>Travel Experience</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={28} /></div>
            <h3 className="feature-title">Safe & Secure</h3>
            <p className="feature-desc">Your safety is our top priority. All our buses are regularly inspected and tracked.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Clock size={28} /></div>
            <h3 className="feature-title">On-Time Departure</h3>
            <p className="feature-desc">We respect your time. Our schedules are strictly maintained for prompt departures.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><CreditCard size={28} /></div>
            <h3 className="feature-title">Easy Payment</h3>
            <p className="feature-desc">Seamless and secure booking process with multiple payment options available.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MapPin size={28} /></div>
            <h3 className="feature-title">Wide Coverage</h3>
            <p className="feature-desc">We connect major cities across Nigeria, ensuring you can reach your destination.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-header">
          <span className="hero-badge">Testimonials</span>
          <h2 className="section-title">What They Say About Us</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
            </div>
            <p className="testimonial-text">"OmiBus completely changed how I travel to Abuja. The buses are extremely comfortable, and we left exactly on time. Highly recommended!"</p>
            <div className="testimonial-author">
              <div className="author-avatar">OA</div>
              <div className="author-info">
                <h4>Olamide Adebayo</h4>
                <span>Frequent Traveler</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
            </div>
            <p className="testimonial-text">"The booking process was so smooth and the easy payment system is top-notch. I love being able to select my seat in advance."</p>
            <div className="testimonial-author">
              <div className="author-avatar bg-alt">CN</div>
              <div className="author-info">
                <h4>Chidi Nnamdi</h4>
                <span>Business Executive</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="stars">
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star fill="#F59E0B" color="#F59E0B" size={20} />
              <Star color="#F59E0B" size={20} />
            </div>
            <p className="testimonial-text">"I hired a bus for my family event, and the driver was professional and courteous. The air conditioning was a lifesaver!"</p>
            <div className="testimonial-author">
              <div className="author-avatar bg-primary">FT</div>
              <div className="author-info">
                <h4>Fatima Tariq</h4>
                <span>Event Organizer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="nav-brand">OmiBus</div>
            <p className="footer-desc">Premium luxury travel across Nigeria. Experience comfort, safety, and reliability on every journey.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Company</h4>
              <Link href="/">About Us</Link>
              <Link href="/">Careers</Link>
              <Link href="/">Press</Link>
            </div>
            <div className="link-group">
              <h4>Support</h4>
              <Link href="/">Help Center</Link>
              <Link href="/">Terms of Service</Link>
              <Link href="/">Privacy Policy</Link>
            </div>
            <div className="link-group">
              <h4>Contact</h4>
              <Link href="/">info@omibus.com</Link>
              <Link href="/">+234 800 OMIBUS</Link>
              <Link href="/">Lagos, Nigeria</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} OmiBus Travel. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
