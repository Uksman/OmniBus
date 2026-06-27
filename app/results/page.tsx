'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

interface Bus {
  id: number;
  company: string;
  type: string;
  departure: string;
  arrival: string;
  duration: string;
  route: string;
  price: number;
  seats: number;
  amenities: string[];
}

export default function Results() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) {
        setBuses(data);
      }
      setLoading(false);
    };

    fetchBuses();
  }, []);

  if (loading) {
    return (
      <main className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading available buses...</p>
      </main>
    );
  }

  return (
    <main className="results-page">
      {/* Navbar Minimal */}
      <nav className="navbar" style={{ position: 'sticky' }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        <div className="nav-actions">
          {/* <ThemeToggle /> */}
          <div className="user-avatar" style={{ width: '40px', height: '40px', background: 'var(--card)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--muted)' }}>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </nav>

      <div className="results-container">
        {/* Search Summary Header */}
        <div className="search-summary">
          <div>
            <h1 className="summary-title">Lagos, NG <span style={{color: 'var(--primary)'}}>→</span> Abuja, NG</h1>
            <p className="summary-subtitle">Mon, 14 Aug • {buses.length} Buses Found</p>
          </div>
          <Link href="/" className="btn-outline">Modify Search</Link>
        </div>

        {/* Results Grid */}
        <div className="results-list">
          {buses.length === 0 ? (
            <div className="bus-card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>No buses available right now.</p>
            </div>
          ) : (
            buses.map((bus) => (
              <div key={bus.id} className="bus-card">
                <div className="bus-card-header">
                  <div>
                    <h3 className="bus-company">{bus.company}</h3>
                    <span className="bus-type">{bus.type}</span>
                  </div>
                  <div className="bus-price-section">
                    <span className="bus-price">₦{bus.price.toLocaleString()}</span>
                    <span className="bus-seats">{bus.seats} seats left</span>
                  </div>
                </div>

              <div className="bus-card-body">
                <div className="route-timeline">
                  <div className="time-block">
                    <span className="time">{bus.departure}</span>
                    <span className="location">{bus.route.split('→')[0].trim()}</span>
                  </div>
                  
                  <div className="duration-block">
                    <span className="duration-line"></span>
                    <span className="duration-text">{bus.duration}</span>
                    <span className="duration-line"></span>
                  </div>

                  <div className="time-block text-right">
                    <span className="time">{bus.arrival}</span>
                    <span className="location">{bus.route.split('→')[1].trim()}</span>
                  </div>
                </div>
              </div>

              <div className="bus-card-footer">
                <div className="amenities-list">
                  {bus.amenities.map(amenity => (
                    <span key={amenity} className="amenity-badge">{amenity}</span>
                  ))}
                </div>
                <Link href={`/checkout?id=${bus.id}`} className="btn-primary" style={{ padding: '0.75rem 2rem', height: 'auto' }}>
                  Select Seat
                </Link>
              </div>
            </div>
          )))}
        </div>
      </div>
    </main>
  );
}
