'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Login Successful!');
      window.location.href = '/account';
    }
  };

  return (
    <main className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <nav className="navbar" style={{ position: 'absolute', top: 0 }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        {/* <ThemeToggle /> */}
      </nav>

      <div className="bus-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <h1 className="summary-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Welcome Back</h1>
        <p className="summary-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Log in to manage bookings.</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="email" 
            placeholder="Email Address" 
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
          
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--muted)' }}>
          Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up</Link>
        </p>
      </div>
    </main>
  );
}
