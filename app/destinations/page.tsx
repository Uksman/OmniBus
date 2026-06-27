import Link from "next/link";
import { ThemeToggle } from "../components/ThemeToggle";

export default function Destinations() {
  return (
    <main className="results-page">
      <nav className="navbar" style={{ position: 'sticky' }}>
        <Link href="/" className="nav-brand">OmiBus</Link>
        <div className="nav-actions">
          {/* <ThemeToggle /> */}
          <Link href="/account">
            <button className="btn-primary">Dashboard</button>
          </Link>
        </div>
      </nav>

      <section className="destinations" style={{ paddingTop: '2rem' }}>
        <h1 className="summary-title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Explore Our Top Destinations</h1>
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
        
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/hire">
             <button className="btn-outline" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>Charter a Bus for a Custom Tour</button>
          </Link>
        </div>
      </section>
    </main>
  );
}
