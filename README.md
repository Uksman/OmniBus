<div align="center">

  <h1>🚌 OmiBus Travel Platform</h1>
  
  <p>
    <strong>A Premium, Full-Stack Luxury Bus Booking & Charter Management System</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Paystack-09A5DB?style=for-the-badge&logo=stripe&logoColor=white" alt="Paystack" />
  </p>

  <h3>
    🌐 <a href="https://omni-bus-2a5a.vercel.app" target="_blank">View Live Demo</a>
  </h3>

  <h4>
    <a href="#-features">Features</a>
    <span> · </span>
    <a href="#-architecture--tech-stack">Architecture</a>
    <span> · </span>
    <a href="#-quick-start">Quick Start</a>
  </h4>
</div>

<br />

> **OmiBus** reimagines the travel experience across Nigeria. By combining dynamic bus scheduling, secure seamless payments, and a highly polished user interface, OmiBus provides travelers with a state-of-the-art booking portal and administrators with a powerful operational dashboard.

## ✨ Features

### 👨‍💻 For Travelers
* **Dynamic Journey Search:** Effortlessly find available buses by entering departure and destination cities.
* **Date-Specific Ticketing:** Intended travel dates are captured and securely bound to the final ticket.
* **Frictionless Checkout:** Native Paystack integration for secure, lightning-fast payments.
* **Customer Dashboard:** A centralized hub to view past bookings and manage profiles.
* **Private Charter Booking:** A dedicated workflow for groups to request exclusive bus hires.
* **PWA Native Feel:** Fully installable as a Progressive Web App for home-screen access and native-like performance.

### 🛡️ For Administrators
* **Secure Command Center:** Protected admin dashboard tracking critical operational metrics.
* **Fleet & Route Management:** Schedule daily recurring routes, configure available seating, and adjust pricing.
* **Financial Analytics:** Real-time visibility into total ticket revenue and sales volume.
* **Charter Desk:** Review, manage, and coordinate incoming private hire requests.

---

## 🏗 Architecture & Tech Stack

OmiBus is built on a modern, scalable architecture designed for high performance and exceptional developer experience.

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14** | Utilizing the App Router for server-side rendering and optimal SEO. |
| **Styling & UI** | **Tailwind CSS** | Utility-first CSS framework delivering a fully responsive, custom design system. |
| **Backend & Auth** | **Supabase** | Open-source Firebase alternative providing secure PostgreSQL databases and user authentication. |
| **Payment Gateway** | **Paystack** | The leading payment provider in Africa for processing highly secure transactions. |
| **Language** | **TypeScript** | Ensuring strict type safety across the entire application lifecycle. |

---

## 🚀 Quick Start

Follow these steps to spin up the OmiBus environment on your local machine.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/omibus.git
cd omibus
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file at the root of the project and populate it with your environment keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

### 4. Launch the Application
```bash
npm run dev
```
Navigate to `http://localhost:3000` to experience the OmiBus platform.

---

## 📂 Codebase Navigation

* `app/page.tsx` — The primary landing page featuring search components and curated destinations.
* `app/results/page.tsx` — Dynamic route filtering and ticket availability engine.
* `app/checkout/CheckoutClient.tsx` — Secure booking summary and Paystack initialization.
* `app/admin/page.tsx` — The protected operational command center.
* `lib/supabase.ts` — Database and authentication client initialization.

---

<div align="center">
  <br />
  <p>Built with ❤️ for a better travel experience.</p>
  <p><b>OmiBus Travel</b> © 2026. All rights reserved.</p>
</div>
