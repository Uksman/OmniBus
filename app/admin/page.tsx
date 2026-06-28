'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

interface Booking {
  id: string;
  payment_reference: string;
  amount: number;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface HireRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  bus_type: string;
  destination: string;
  departure_date: string;
  passengers: number;
  created_at: string;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hireRequests, setHireRequests] = useState<HireRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showAddTrip, setShowAddTrip] = useState(false);
  const [addingTrip, setAddingTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({
    company: 'Velocity Tours',
    type: 'Luxury Coach',
    departure: '',
    arrival: '',
    duration: '',
    route: '',
    price: '',
    seats: '50',
    amenities: 'AC, WiFi, Power Outlets'
  });

  const fetchAdminData = async () => {
    // 1. Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setNeedsLogin(true);
      setLoading(false);
      return;
    }
    
    // Check if they are the admin
    if (session.user.email !== 'uksman1998@gmail.com') {
      alert('Access Denied: You do not have admin privileges.');
      window.location.href = '/';
      return;
    }

    setNeedsLogin(false);

    // 2. Fetch all bookings and hire requests
    const [bookingsRes, hireRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('hire_requests').select('*').order('created_at', { ascending: false })
    ]);

    if (bookingsRes.data) setBookings(bookingsRes.data);
    if (hireRes.data) setHireRequests(hireRes.data);
    
    setLoading(false);
  };

  useEffect(() => {
    const initializeAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      if (session.user.email !== 'uksman1998@gmail.com') {
        alert('Access Denied: You do not have admin privileges.');
        window.location.href = '/';
        return;
      }
      setNeedsLogin(false);
      const [bookingsRes, hireRes] = await Promise.all([
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('hire_requests').select('*').order('created_at', { ascending: false })
      ]);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (hireRes.data) setHireRequests(hireRes.data);
      setLoading(false);
    };
    
    initializeAdmin();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoginLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed')) {
        alert('Your email is not confirmed yet. Please check your inbox for the verification link!');
      } else {
        alert(error.message);
      }
    } else {
      if (data.session.user.email !== 'uksman1998@gmail.com') {
        alert('Access Denied: You do not have admin privileges.');
        await supabase.auth.signOut();
        return;
      }
      alert('Admin Login Successful!');
      setLoading(true);
      fetchAdminData(); // Refresh the page state to show the dashboard
    }
  };

  const handleAddTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingTrip(true);
    
    const { error } = await supabase.from('buses').insert([{
      company: newTrip.company,
      type: newTrip.type,
      departure: newTrip.departure,
      arrival: newTrip.arrival,
      duration: newTrip.duration,
      route: newTrip.route,
      price: parseInt(newTrip.price),
      seats: parseInt(newTrip.seats),
      amenities: newTrip.amenities.split(',').map(a => a.trim())
    }]);

    setAddingTrip(false);

    if (error) {
      alert('Error scheduling trip: ' + error.message);
    } else {
      alert('Trip scheduled successfully!');
      setShowAddTrip(false);
      setNewTrip({ ...newTrip, departure: '', arrival: '', duration: '', route: '', price: '' }); // reset some fields
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);

  if (needsLogin) {
    return (
      <main className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="bus-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
          <h1 className="summary-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Admin Portal</h1>
          <p className="summary-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Log in to access the dashboard.</p>
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Log In'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading Admin Dashboard...</p>
      </main>
    );
  }

  return (
    <main className="results-page">
      <nav className="navbar" style={{ position: 'sticky' }}>
        <Link href="/" className="nav-brand">OmiBus Admin</Link>
        <div className="nav-actions">
          <Link href="/account" className="btn-outline">User Dashboard</Link>
        </div>
      </nav>

      <div className="results-container" style={{ maxWidth: '1200px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="summary-title" style={{ margin: 0 }}>Admin Overview</h1>
          <button onClick={() => setShowAddTrip(!showAddTrip)} className="btn-primary">
            {showAddTrip ? 'Cancel' : '+ Schedule New Trip'}
          </button>
        </div>

        {/* Add Trip Form */}
        {showAddTrip && (
          <div className="bus-card" style={{ padding: '2rem', marginBottom: '3rem', border: '2px solid var(--primary)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Schedule a New Trip</h2>
            <form onSubmit={handleAddTrip} className="admin-grid-form">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Route (e.g. Lagos → Abuja)</label>
                <input type="text" required className="form-input" value={newTrip.route} onChange={(e) => setNewTrip({...newTrip, route: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Price (₦)</label>
                <input type="number" required className="form-input" value={newTrip.price} onChange={(e) => setNewTrip({...newTrip, price: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Departure Time (e.g. 08:00 AM)</label>
                <input type="text" required className="form-input" value={newTrip.departure} onChange={(e) => setNewTrip({...newTrip, departure: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Arrival Time (e.g. 02:00 PM)</label>
                <input type="text" required className="form-input" value={newTrip.arrival} onChange={(e) => setNewTrip({...newTrip, arrival: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Duration (e.g. 6h 00m)</label>
                <input type="text" required className="form-input" value={newTrip.duration} onChange={(e) => setNewTrip({...newTrip, duration: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Total Seats</label>
                <input type="number" required className="form-input" value={newTrip.seats} onChange={(e) => setNewTrip({...newTrip, seats: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Company Name</label>
                <input type="text" required className="form-input" value={newTrip.company} onChange={(e) => setNewTrip({...newTrip, company: e.target.value})} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Bus Type</label>
                <input type="text" required className="form-input" value={newTrip.type} onChange={(e) => setNewTrip({...newTrip, type: e.target.value})} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Amenities (comma separated)</label>
                <input type="text" required className="form-input" value={newTrip.amenities} onChange={(e) => setNewTrip({...newTrip, amenities: e.target.value})} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="btn-primary" disabled={addingTrip} style={{ width: '100%' }}>
                  {addingTrip ? 'Saving...' : 'Save & Publish Trip'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="bus-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Revenue</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bus-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>Total Tickets Sold</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{bookings.length}</p>
          </div>
          <div className="bus-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>Hire Requests</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{hireRequests.length}</p>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Recent Bookings</h2>
        <div className="bus-card" style={{ padding: '0', overflowX: 'auto', marginBottom: '3rem' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--accent)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Passenger</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Contact</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Reference</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Amount</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No bookings found</td></tr>
              ) : bookings.map((b) => (
                <tr key={b.id} style={{ transition: 'background 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: '600' }}>{b.full_name}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '0.85rem' }}>{b.email}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{b.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <span className="amenity-badge">{b.payment_reference}</span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', color: 'var(--primary)', fontWeight: 'bold' }}>
                    ₦{b.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hire Requests Table */}
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Charter / Hire Requests</h2>
        <div className="bus-card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'var(--accent)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Client</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Trip Details</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Bus Type</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Departure Date</th>
              </tr>
            </thead>
            <tbody>
              {hireRequests.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>No hire requests found</td></tr>
              ) : hireRequests.map((req) => (
                <tr key={req.id} style={{ transition: 'background 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '600' }}>{req.full_name}</div>
                    <div style={{ fontSize: '0.85rem' }}>{req.email}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{req.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: '600' }}>To {req.destination}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{req.passengers} passengers</div>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <span className="amenity-badge">{req.bus_type}</span>
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                    {new Date(req.departure_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
