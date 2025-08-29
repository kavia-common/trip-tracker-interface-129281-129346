import React, { useMemo, useState } from 'react';
import './App.css';

/**
 * Trip Tracker - modern travel expense tracker UI
 * - Hero with bold "Trip Tracker" and icon
 * - Floating search card with filters
 * - Rounded cards with soft shadows in a grid
 * - Interactive budget tracking with daily budget clicker
 */

// Helper: currency formatter
const formatCurrency = (value) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
    isNaN(value) ? 0 : value
  );

// PUBLIC_INTERFACE
export default function App() {
  /** State for filters */
  const [filters, setFilters] = useState({
    q: '',
    totalBudget: 2500,
    dailyBudget: 150,
    start: '',
    end: '',
  });

  /** Demo trips/expenses to populate grid */
  const [trips] = useState([
    {
      id: 1,
      name: 'Kyoto & Tokyo',
      location: 'Japan',
      start: '2025-09-05',
      end: '2025-09-14',
      totalBudget: 3200,
      spent: 1680,
      color: 'accent-yellow',
    },
    {
      id: 2,
      name: 'Amalfi Escape',
      location: 'Italy',
      start: '2025-06-01',
      end: '2025-06-07',
      totalBudget: 2200,
      spent: 940,
      color: 'accent-pink',
    },
    {
      id: 3,
      name: 'Iceland Loop',
      location: 'Iceland',
      start: '2025-12-10',
      end: '2025-12-17',
      totalBudget: 2800,
      spent: 450,
      color: 'accent-blue',
    },
    {
      id: 4,
      name: 'Patagonia Trek',
      location: 'Argentina & Chile',
      start: '2026-01-10',
      end: '2026-01-24',
      totalBudget: 4100,
      spent: 600,
      color: 'accent-green',
    },
  ]);

  /** Derived filtered trips */
  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      const matchesQ =
        !filters.q ||
        t.name.toLowerCase().includes(filters.q.toLowerCase()) ||
        t.location.toLowerCase().includes(filters.q.toLowerCase());
      const matchesTotal = !filters.totalBudget || t.totalBudget <= Number(filters.totalBudget);
      const matchesStart = !filters.start || new Date(t.start) >= new Date(filters.start);
      const matchesEnd = !filters.end || new Date(t.end) <= new Date(filters.end);
      return matchesQ && matchesTotal && matchesStart && matchesEnd;
    });
  }, [trips, filters]);

  /** Icon path - copied to public during build via attachment copy step; we reference direct absolute path fallback */
  const iconSrc =
    process.env.PUBLIC_URL + '/assets/trip-icon.png';

  /** UI Handlers */
  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const incDaily = () => setFilter('dailyBudget', Math.min(filters.dailyBudget + 10, 1000));
  const decDaily = () => setFilter('dailyBudget', Math.max(filters.dailyBudget - 10, 0));

  return (
    <div className="tt-app">
      {/* Hero Section */}
      <section className="tt-hero">
        <div className="tt-hero-overlay" />
        <div className="tt-hero-inner container">
          <div className="tt-brand">
            <img src={iconSrc} alt="Trip Tracker icon" className="tt-brand-icon" />
            <h1 className="tt-brand-title">Trip Tracker</h1>
          </div>
          <p className="tt-hero-sub">
            Plan smarter, spend better. A clean, modern way to track every trip and every dollar.
          </p>
        </div>

        {/* Floating Search Card */}
        <div className="tt-search-card container">
          <div className="tt-field">
            <label>Trip name</label>
            <input
              type="text"
              placeholder="Search destinations or trip titles"
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
            />
          </div>
          <div className="tt-field">
            <label>Total budget (max)</label>
            <div className="tt-number-field">
              <span className="tt-number-prefix">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={filters.totalBudget}
                onChange={(e) => setFilter('totalBudget', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="tt-field">
            <label>Daily budget</label>
            <div className="tt-stepper">
              <button onClick={decDaily} aria-label="Decrease daily budget" className="tt-stepper-btn">−</button>
              <div className="tt-stepper-value">{formatCurrency(filters.dailyBudget)}</div>
              <button onClick={incDaily} aria-label="Increase daily budget" className="tt-stepper-btn">+</button>
            </div>
          </div>

          <div className="tt-field">
            <label>Start date</label>
            <input
              type="date"
              value={filters.start}
              onChange={(e) => setFilter('start', e.target.value)}
            />
          </div>
          <div className="tt-field">
            <label>End date</label>
            <input
              type="date"
              value={filters.end}
              onChange={(e) => setFilter('end', e.target.value)}
            />
          </div>

          <div className="tt-actions">
            <button className="tt-btn tt-btn-primary">Search</button>
            <button
              className="tt-btn tt-btn-ghost"
              onClick={() =>
                setFilters({ q: '', totalBudget: 2500, dailyBudget: 150, start: '', end: '' })
              }
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="tt-results container">
        <div className="tt-section-head">
          <h2 className="tt-section-title">Upcoming & Planned</h2>
          <div className="tt-badges">
            <span className="tt-badge accent-yellow">Budget</span>
            <span className="tt-badge accent-green">Savings</span>
            <span className="tt-badge accent-pink">Flights</span>
            <span className="tt-badge accent-blue">Stays</span>
          </div>
        </div>

        <div className="tt-grid">
          {filteredTrips.map((t) => {
            const pct = Math.min(100, Math.round((t.spent / t.totalBudget) * 100));
            return (
              <article className="tt-card" key={t.id}>
                <div className={`tt-card-accent ${t.color}`} />
                <div className="tt-card-body">
                  <h3 className="tt-card-title">{t.name}</h3>
                  <div className="tt-card-sub">{t.location}</div>
                  <div className="tt-dates">
                    <span>{new Date(t.start).toLocaleDateString()}</span>
                    <span className="dot">•</span>
                    <span>{new Date(t.end).toLocaleDateString()}</span>
                  </div>

                  <div className="tt-progress">
                    <div className="tt-progress-track">
                      <div className="tt-progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="tt-progress-legend">
                      <span>Spent {formatCurrency(t.spent)}</span>
                      <span>of {formatCurrency(t.totalBudget)}</span>
                    </div>
                  </div>

                  <div className="tt-card-footer">
                    <button className="tt-btn tt-btn-light">View details</button>
                    <button className="tt-btn tt-btn-ghost">Edit</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="tt-footer">
        <div className="container tt-footer-inner">
          <div className="tt-footer-left">© {new Date().getFullYear()} Trip Tracker</div>
          <div className="tt-footer-right">
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#help">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
