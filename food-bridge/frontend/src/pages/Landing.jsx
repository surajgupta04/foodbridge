import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .nav-link { color: #6b7280; font-size: 14px; text-decoration: none; font-weight: 500; cursor: pointer; transition: color 0.2s; }
        .nav-link:hover { color: #0d0d0d; }
        .btn-ghost { color: #0d0d0d; font-size: 14px; font-weight: 500; padding: 8px 18px; border-radius: 8px; border: 1px solid #e5e7eb; background: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost:hover { background: #f9fafb; }
        .btn-dark { background: #0d0d0d; color: #fff; font-size: 14px; font-weight: 600; padding: 8px 20px; border-radius: 8px; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-dark:hover { background: #1f1f1f; transform: translateY(-1px); }
        .btn-hero { background: #0d0d0d; color: #fff; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-hero:hover { background: #1f1f1f; transform: translateY(-2px); }
        .btn-hero-outline { border: 1.5px solid #e5e7eb; color: #0d0d0d; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; background: #fff; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-hero-outline:hover { border-color: #9ca3af; }
        .feature-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; transition: all 0.2s; }
        .feature-card:hover { border-color: #9ca3af; transform: translateY(-2px); }
        .testi-card { background: #fafaf8; border: 1px solid #e5e7eb; border-radius: 16px; padding: 28px; }
        .logo-pill { background: #fafaf8; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 24px; font-size: 13px; font-weight: 700; color: #9ca3af; letter-spacing: 0.04em; }
        .how-step-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px; }
        .btn-green-cta { background: #16a34a; color: #fff; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-green-cta:hover { background: #15803d; }
        .btn-outline-cta { border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; background: transparent; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .btn-outline-cta:hover { border-color: rgba(255,255,255,0.5); }
      `}</style>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 64px', background: 'rgba(250,250,248,0.85)',
        backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 20, fontWeight: 800, color: '#0d0d0d' }}>
          food<span style={{ color: '#16a34a' }}>bridge</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <span className="nav-link" onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}>Problem</span>
          <span className="nav-link" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>How it works</span>
          <span className="nav-link" onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}>Impact</span>
          <span className="nav-link" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>Contact</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn-ghost" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-dark" onClick={() => navigate('/register')}>Get started →</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '80px 64px 60px', textAlign: 'center', position: 'relative' }}>
        {/* pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#f0fdf4', border: '1px solid #bbf7d0',
          color: '#16a34a', fontSize: 13, fontWeight: 600,
          padding: '6px 16px', borderRadius: 100, marginBottom: 32
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
          Rescue food. Feed communities. Zero waste.
        </div>

        <h1 style={{
          fontFamily: "'Cabinet Grotesk', sans-serif",
          fontSize: 68, fontWeight: 900, lineHeight: 1.05,
          color: '#0d0d0d', marginBottom: 24,
          maxWidth: 780, marginLeft: 'auto', marginRight: 'auto'
        }}>
          Surplus food finds{' '}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#16a34a' }}>
            hungry people
          </em>
          , not landfills.
        </h1>

        <p style={{
          fontSize: 18, color: '#6b7280', lineHeight: 1.7,
          maxWidth: 520, margin: '0 auto 40px', fontWeight: 400
        }}>
          FoodBridge connects restaurants with surplus food to nearby NGOs in real-time — so every meal counts.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 64, flexWrap: 'wrap' }}>
          <button className="btn-hero" onClick={() => navigate('/register')}>Donate surplus food</button>
          <button className="btn-hero-outline" onClick={() => navigate('/register')}>Join as an NGO</button>
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 1, background: '#e5e7eb',
          border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden',
          maxWidth: 700, margin: '0 auto'
        }}>
          {[
            { num: '2,400+', label: 'Meals rescued from waste', tag: 'and counting' },
            { num: '10 km', label: 'Geo-matched radius for instant NGO alerts', tag: 'real-time' },
            { num: '<60s', label: 'Time to post surplus food on the platform', tag: 'effortless' },
          ].map((s) => (
            <div key={s.num} style={{ background: '#fff', padding: '28px 32px', textAlign: 'left' }}>
              <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 36, fontWeight: 900, color: '#0d0d0d' }}>{s.num}</div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4, lineHeight: 1.5 }}>{s.label}</div>
              <span style={{
                display: 'inline-block', marginTop: 8,
                background: '#f0fdf4', color: '#16a34a',
                fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4
              }}>{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LOGOS */}
      <div style={{
        padding: '40px 64px', borderTop: '1px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb', background: '#fff'
      }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 24 }}>
          Trusted by restaurants & NGOs across Vadodara
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {['SPICE GARDEN', 'HOTEL SURYA', 'SEVA NGO', 'CITY FOOD BANK', 'ANNAPURNA TRUST'].map(name => (
            <div key={name} className="logo-pill">{name}</div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section id="problem" style={{ padding: '80px 64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>The problem</div>
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: '#0d0d0d', marginBottom: 20 }}>
            Tonnes of food wasted. Millions go{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#16a34a' }}>hungry.</em>
          </h2>
          <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 32 }}>
            Every night, restaurants throw away perfectly good food. Every night, families go to bed hungry. These two problems exist within kilometres of each other — yet nobody connects them. Until now.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { num: '68M T', text: 'Food wasted annually in India — enough to feed the entire country for months' },
              { num: '200M+', text: 'Citizens face food insecurity daily across India' },
              { num: '40%', text: 'Of all food produced in India is lost or wasted before consumption' },
            ].map(s => (
              <div key={s.num} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 28, fontWeight: 900, color: '#f97316', minWidth: 80 }}>{s.num}</div>
                <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { title: 'No real-time connection', body: 'Restaurants have no easy way to notify NGOs about surplus food. By the time anyone knows, the food has already been thrown away.', color: '#f97316' },
            { title: 'Distance & logistics mismatch', body: 'NGOs far away get notified while closer ones don\'t. Food travels too far and arrives too late — or not at all.', color: '#16a34a' },
            { title: 'Zero accountability', body: 'No way to verify if food was actually collected. No confirmation, no tracking, no proof of impact.', color: '#6366f1' },
          ].map(c => (
            <div key={c.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 28, borderTop: `3px solid ${c.color}` }}>
              <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0d0d0d' }}>{c.title}</h4>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: '#0d0d0d', padding: '80px 64px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>How it works</div>
        <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 48 }}>
          Three steps. One meal saved.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {[
            { step: 'STEP 01', icon: '🍱', title: 'Post surplus food', body: 'Restaurant posts food with photo, quantity, pickup address and expiry time. Live in under 60 seconds. No paperwork, no calls.' },
            { step: 'STEP 02', icon: '📍', title: 'Nearby NGOs get alerted', body: 'Only NGOs within 10km are notified instantly. Geo-matched — so the right people get the right alert at the right time.' },
            { step: 'STEP 03', icon: '✅', title: 'Claim, collect, confirm', body: 'NGO claims the food and gets a unique confirmation code. Restaurant marks it collected after handover. Full accountability.' },
          ].map(s => (
            <div key={s.step} className="how-step-card">
              <div style={{ fontSize: 13, fontWeight: 700, color: '#16a34a', marginBottom: 20, letterSpacing: '0.08em' }}>{s.step}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(22,163,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 20 }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 64px', background: '#fafaf8' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Features</div>
        <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: '#0d0d0d', marginBottom: 48 }}>
          Built for speed, trust, and{' '}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#16a34a' }}>real impact</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { icon: '⚡', bg: '#f0fdf4', title: 'Real-time alerts', body: 'Socket.io powered notifications — NGOs know about available food within seconds of it being posted.' },
            { icon: '📍', bg: '#fff7ed', title: '10km geo-matching', body: 'MongoDB 2dsphere indexing ensures only nearby NGOs are notified. No spam, no irrelevant alerts.' },
            { icon: '⏱', bg: '#fef2f2', title: 'Food expiry timers', body: 'Every post has a countdown timer. Posts auto-expire so NGOs never chase stale or unavailable food.' },
            { icon: '🔐', bg: '#eff6ff', title: 'Confirmation codes', body: 'Every claim generates a unique code. The restaurant verifies it on collection — full chain of custody.' },
            { icon: '👤', bg: '#f5f3ff', title: 'Role-based dashboards', body: 'Separate, purpose-built dashboards for restaurants and NGOs — no clutter, just what you need.' },
            { icon: '🌍', bg: '#f0fdf4', title: 'Free geocoding', body: 'OpenStreetMap Nominatim converts addresses to coordinates at registration — zero API cost.' },
          ].map(f => (
            <div key={f.title} className="feature-card">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 18 }}>{f.icon}</div>
              <h4 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0d0d0d' }}>{f.title}</h4>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section id="impact" style={{ padding: '80px 64px', background: '#f0fdf4', borderTop: '1px solid #bbf7d0', borderBottom: '1px solid #bbf7d0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Our impact</div>
            <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: '#0d0d0d', marginBottom: 20 }}>
              Every number is a{' '}
              <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#16a34a' }}>meal saved</em>
            </h2>
            <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.8, marginBottom: 40 }}>
              We're just getting started in Vadodara — but the numbers are already telling a story worth sharing.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { n: '2,400+', l: 'Meals rescued from waste' },
                { n: '1,200 kg', l: 'Food saved from landfill' },
                { n: '3,000 kg', l: 'CO₂ emissions avoided' },
                { n: '48', l: 'Active restaurants & NGOs' },
              ].map(s => (
                <div key={s.n} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 14, padding: 24 }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 36, fontWeight: 900, color: '#16a34a' }}>{s.n}</div>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6, lineHeight: 1.5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 20, padding: 36 }}>
            <p style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 15, fontWeight: 700, color: '#0d0d0d', marginBottom: 28 }}>Rescue rate by food category</p>
            {[
              { label: 'Cooked meals', pct: 78 },
              { label: 'Packaged food', pct: 62 },
              { label: 'Bread & bakery', pct: 54 },
              { label: 'Raw ingredients', pct: 31 },
            ].map(b => (
              <div key={b.label} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#0d0d0d', fontWeight: 500 }}>{b.label}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{b.pct}%</span>
                </div>
                <div style={{ background: '#f0fdf4', borderRadius: 100, height: 8, overflow: 'hidden' }}>
                  <div style={{ width: `${b.pct}%`, height: '100%', borderRadius: 100, background: '#16a34a' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 64px', background: '#fff' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Stories</div>
        <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 40, fontWeight: 800, color: '#0d0d0d', marginBottom: 48 }}>
          From people making it happen
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { quote: '"We used to throw away 10kg of food every night. Now it reaches families within the hour. This platform changed how we think about our leftovers."', name: 'Raj Mehta', role: 'Spice Garden Restaurant, Alkapuri', color: '#f97316' },
            { quote: '"The geo-matching is brilliant. We only get alerts for food we can actually reach. We\'re serving 200 more meals a week now without extra budget."', name: 'Priya Sharma', role: 'Coordinator, Seva NGO, Fatehgunj', color: '#16a34a' },
            { quote: '"The confirmation code system gives us confidence. We know exactly when food was collected and by whom. It\'s a proper system, not just charity."', name: 'Amit Patel', role: 'Manager, Hotel Surya, Vadodara', color: '#6366f1' },
          ].map(t => (
            <div key={t.name} className="testi-card">
              <div style={{ color: '#f97316', fontSize: 14, marginBottom: 14, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ fontSize: 14, color: '#0d0d0d', lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>{t.quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 14, fontWeight: 800, color: '#fff' }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0d0d0d' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{ padding: '80px 64px', background: '#fafaf8' }}>
        <div style={{
          background: '#0d0d0d', borderRadius: 24, padding: '72px 60px',
          maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', background: 'rgba(22,163,74,0.15)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -80, left: -80, width: 200, height: 200, borderRadius: '50%', background: 'rgba(249,115,22,0.1)', pointerEvents: 'none' }} />
          <h2 style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 16, position: 'relative', zIndex: 1 }}>
            Your leftover food is{' '}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: '#16a34a' }}>someone's dinner.</em>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 40, position: 'relative', zIndex: 1 }}>
            Join 48 restaurants already making a difference. Takes 2 minutes to register.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', position: 'relative', zIndex: 1 }}>
            <button className="btn-green-cta" onClick={() => navigate('/register')}>Register as Restaurant</button>
            <button className="btn-outline-cta" onClick={() => navigate('/register')}>Register as NGO</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0d0d0d', padding: '48px 64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 12 }}>
              food<span style={{ color: '#16a34a' }}>bridge</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
              Connecting surplus food to communities in need — in real-time, within 10km, with full accountability. Built in Vadodara, Gujarat.
            </p>
          </div>
          {[
            { title: 'Product', links: ['How it works', 'Features', 'Impact'] },
            { title: 'Join', links: ['As Restaurant', 'As NGO', 'Login'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy'] },
          ].map(col => (
            <div key={col.title}>
              <h5 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</h5>
              {col.links.map(link => (
                <div key={link} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 10, cursor: 'pointer' }}
                  onClick={() => link === 'Login' ? navigate('/login') : link === 'As Restaurant' || link === 'As NGO' ? navigate('/register') : null}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© 2026 FoodBridge. Built to rescue food, not waste it.</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Made with purpose in Vadodara, Gujarat 🇮🇳</p>
        </div>
      </footer>

    </div>
  );
}