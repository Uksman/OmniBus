'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';
import { ThemeToggle } from '../components/ThemeToggle';

interface Booking {
  id: string;
  payment_reference: string;
  amount: number;
  full_name: string;
  phone: string;
  created_at: string;
}

export default function Account() {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/login';
        return;
      }
      
      setUser(session.user);

      // Fetch bookings for this user's email
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('email', session.user.email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setBookings(data);
      }
      setLoading(false);
    };

    fetchUserAndBookings();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <main className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="results-page">
      <nav className="navbar" style={{ position: 'sticky' }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        <div className="nav-actions">
          {/* <ThemeToggle /> */}
          <button onClick={handleLogout} className="btn-outline">Log Out</button>
        </div>
      </nav>

      <div className="results-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="search-summary" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="summary-title">My Account</h1>
            <p className="summary-subtitle">Welcome back, {user?.email}</p>
          </div>
        </div>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Your Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="bus-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>You haven&apos;t made any bookings yet.</p>
            <Link href="/results" className="btn-primary">Find a Bus</Link>
          </div>
        ) : (
          <div className="results-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="bus-card" style={{ padding: '1.5rem' }}>
                <div className="bus-card-header" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 className="bus-company">Booking Ref: {booking.payment_reference || 'N/A'}</h3>
                    <span className="bus-type">Standard Booking</span>
                  </div>
                  <div className="bus-price-section">
                    <span className="bus-price">₦{(booking.amount / 100).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bus-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p><strong>Passenger:</strong> {booking.full_name}</p>
                  <p><strong>Phone:</strong> {booking.phone}</p>
                  <p><strong>Date Booked:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
