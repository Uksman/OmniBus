'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { usePaystackPayment } from 'react-paystack';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Checkout() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const busId = searchParams.get('id');
  const dateParam = searchParams.get('date');
  
  let formattedDate = 'Not specified';
  if (dateParam) {
    try {
      const d = new Date(dateParam);
      if (!isNaN(d.getTime())) {
         formattedDate = d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch(e) {}
  }

  const [amount, setAmount] = useState(0);
  const [seatsLeft, setSeatsLeft] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Fetch real bus details based on ID
  useEffect(() => {
    if (busId) {
      supabase.from('buses').select('price, seats').eq('id', busId).single().then(({ data }) => {
        if (data) {
          setAmount(data.price);
          setSeatsLeft(data.seats);
        }
      });
    }
  }, [busId]);

  // Auto-fill email if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setEmail(session.user.email);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

  const config = {
    reference: (new Date()).getTime().toString(),
    email: email || 'test@omibus.com',
    amount: amount * 100, // Paystack expects kobo
    publicKey: publicKey,
  };

  const initializePayment = usePaystackPayment(config);

  const handleCheckout = async () => {
    if (!name || !email || !phone) {
      alert("Please fill in all details");
      return;
    }

    initializePayment({
      onSuccess: async (reference) => {
        setLoading(true);
        // Save to Supabase
        const { error } = await supabase
          .from('bookings')
          .insert([
            { full_name: name, email, phone, amount, payment_reference: `${reference.reference} | Date: ${formattedDate}` }
          ]);
          
        if (!error && busId && seatsLeft !== null) {
          // Decrement seat count (Option A)
          await supabase.from('buses').update({ seats: seatsLeft - 1 }).eq('id', busId);
        }
        
        setLoading(false);
        
        if (error) {
          alert('Payment successful, but failed to save booking: ' + error.message);
        } else {
          alert('Payment Successful! Your seat is booked.');
          window.location.href = '/account';
        }
      },
      onClose: () => {
        alert("Payment was canceled.");
      }
    });
  };

  return (
    <main className="results-page">
      <nav className="navbar" style={{ position: 'sticky' }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        {/* <ThemeToggle /> */}
      </nav>

      <div className="results-container" style={{ maxWidth: '600px' }}>
        <h1 className="summary-title" style={{ marginBottom: '2rem' }}>Complete Booking</h1>

        <div className="bus-card">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Passenger Details</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              placeholder="Full Name" 
              className="form-input" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="tel" 
              placeholder="Phone Number" 
              className="form-input" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>Travel Date</span>
              <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{formattedDate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>Ticket Price</span>
              <span style={{ fontWeight: '600' }}>₦{amount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'var(--muted)' }}>Taxes & Fees</span>
              <span style={{ fontWeight: '600' }}>₦500</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>Total</span>
              <span style={{ fontWeight: '800', fontSize: '1.5rem', color: 'var(--primary)' }}>₦{(amount + 500).toLocaleString()}</span>
            </div>
          </div>

          {isLoggedIn === false ? (
            <button 
              className="btn-primary" 
              style={{ width: '100%', height: '54px' }}
              onClick={() => window.location.href = '/signup'}
            >
              Create Account to Book
            </button>
          ) : seatsLeft === 0 ? (
            <button className="btn-primary" style={{ width: '100%', height: '54px', background: 'var(--muted)', cursor: 'not-allowed' }} disabled>
              Sold Out
            </button>
          ) : (
            <button 
              className="btn-primary" 
              style={{ width: '100%', height: '54px' }}
              onClick={handleCheckout}
              disabled={loading || amount === 0 || isLoggedIn === null}
            >
              {loading || isLoggedIn === null ? 'Processing...' : 'Pay with Paystack'}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
