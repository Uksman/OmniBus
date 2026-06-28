'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';

export default function HireBus() {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });
  }, []);

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Save to Supabase (hire_requests table)
    const { error } = await supabase
      .from('hire_requests')
      .insert([
        { 
          pickup_location: pickup, 
          destination, 
          date_time: date, 
          passengers, 
          bus_type: 'Not Specified', // Default for now
          full_name: name, 
          phone_number: phone 
        }
      ]);

    setLoading(false);

    if (error) {
      alert('Failed to submit request: ' + error.message);
    } else {
      alert('Success! Your hire request has been sent. We will contact you shortly.');
      window.location.href = '/';
    }
  };

  return (
    <main className="results-page">
      <nav className="navbar" style={{ position: 'sticky' }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        {/* <ThemeToggle /> */}
      </nav>

      <div className="results-container" style={{ maxWidth: '600px' }}>
        <h1 className="summary-title" style={{ marginBottom: '0.5rem' }}>Hire a Bus</h1>
        <p className="summary-subtitle" style={{ marginBottom: '2rem' }}>Request a private charter bus for your group.</p>

        <div className="bus-card">
          <form onSubmit={handleHireSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Trip Details</h2>
            <input 
              type="text" 
              placeholder="Pickup Location" 
              className="form-input" 
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
            />
            <input 
              type="text" 
              placeholder="Destination" 
              className="form-input" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
            <input 
              type="date" 
              className="form-input" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <input 
              type="number" 
              placeholder="Number of Passengers" 
              className="form-input" 
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              required
            />

            <h2 style={{ fontSize: '1.25rem', marginTop: '1rem', marginBottom: '0.5rem' }}>Contact Info</h2>
            <input 
              type="text" 
              placeholder="Full Name" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="form-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            {isLoggedIn === false ? (
              <button 
                type="button" 
                className="btn-primary" 
                style={{ width: '100%', height: '54px', marginTop: '1.5rem' }}
                onClick={() => window.location.href = '/signup'}
              >
                Create Account to Hire
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', height: '54px', marginTop: '1.5rem' }}
                disabled={loading || isLoggedIn === null}
              >
                {loading || isLoggedIn === null ? 'Checking...' : 'Submit Request'}
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
