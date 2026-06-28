'use client';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { ThemeToggle } from '../components/ThemeToggle';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert('Success! Please check your email to verify your account before logging in.');
      window.location.href = '/login';
    }
  };

  return (
    <main className="results-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <nav className="navbar" style={{ position: 'absolute', top: 0 }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        {/* <ThemeToggle /> */}
      </nav>

      <div className="bus-card" style={{ width: '100%', maxWidth: '400px', padding: '3rem 2rem' }}>
        <h1 className="summary-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Account</h1>
        <p className="summary-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>Join OmiBus today.</p>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="form-input" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--muted)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log in</Link>
        </p>
      </div>
    </main>
  );
}
