import { useState, useEffect, useRef, useCallback } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #C9A84C; --gold-light: #E8C97A; --gold-dim: #8B6E2F;
    --bg: #080808; --bg2: #0E0E0E; --bg3: #141414; --bg4: #1A1A1A;
    --surface: #111111; --border: rgba(201,168,76,0.18);
    --text: #F5F0E8; --text2: #A89880; --text3: #6B5F4E;
    --red: #C0392B; --green: #27AE60;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-weight: 300; overflow-x: hidden; cursor: none; }
  .cursor { position: fixed; top: 0; left: 0; width: 12px; height: 12px; background: var(--gold); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); transition: width 0.2s, height 0.2s; mix-blend-mode: difference; }
  .cursor-ring { position: fixed; top: 0; left: 0; width: 36px; height: 36px; border: 1px solid rgba(201,168,76,0.5); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: width 0.3s, height 0.3s; }
  .cursor.hover { width: 20px; height: 20px; }
  .cursor-ring.hover { width: 56px; height: 56px; border-color: var(--gold); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold-dim); border-radius: 2px; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 1000; display: flex; align-items: center; justify-content: space-between; padding: 24px 60px; backdrop-filter: blur(20px); background: rgba(8,8,8,0.85); border-bottom: 1px solid var(--border); transition: padding 0.3s ease; }
  .nav.scrolled { padding: 16px 60px; }
  .nav-logo { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--gold); letter-spacing: 2px; text-decoration: none; }
  .nav-logo span { color: var(--text); font-weight: 400; }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a { text-decoration: none; color: var(--text2); font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 400; transition: color 0.3s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--gold); transition: width 0.3s; }
  .nav-links a:hover { color: var(--gold); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta { padding: 10px 28px; background: transparent; border: 1px solid var(--gold); color: var(--gold); font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: none; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
  .nav-cta:hover { background: var(--gold); color: var(--bg); }
  .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 120px 60px 80px; }
  .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(201,168,76,0.06) 0%, transparent 70%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(201,168,76,0.03) 0%, transparent 60%); }
  .hero-grid { position: absolute; inset: 0; opacity: 0.04; background-image: linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px); background-size: 80px 80px; }
  .hero-content { position: relative; z-index: 2; max-width: 700px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 10px; border: 1px solid var(--border); padding: 8px 20px; margin-bottom: 40px; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold); animation: fadeUp 0.8s ease forwards; }
  .hero-badge::before { content: ''; width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(52px, 7vw, 90px); line-height: 1.0; font-weight: 900; margin-bottom: 30px; animation: fadeUp 0.8s 0.2s ease both; }
  .hero-title em { font-style: italic; color: var(--gold); display: block; }
  .hero-sub { font-size: 16px; color: var(--text2); line-height: 1.8; max-width: 500px; margin-bottom: 50px; font-weight: 300; animation: fadeUp 0.8s 0.4s ease both; }
  .hero-actions { display: flex; gap: 20px; animation: fadeUp 0.8s 0.6s ease both; }
  .btn-primary { padding: 16px 44px; background: var(--gold); color: var(--bg); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; cursor: none; border: none; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: all 0.3s; position: relative; overflow: hidden; }
  .btn-primary::before { content: ''; position: absolute; inset: 0; background: var(--gold-light); transform: translateX(-100%); transition: transform 0.3s; }
  .btn-primary:hover::before { transform: translateX(0); }
  .btn-primary span { position: relative; z-index: 1; }
  .btn-ghost { padding: 16px 44px; background: transparent; color: var(--text); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; cursor: none; border: 1px solid var(--border); font-family: 'DM Sans', sans-serif; font-weight: 400; transition: all 0.3s; }
  .btn-ghost:hover { border-color: var(--gold); color: var(--gold); }
  .hero-stats { position: absolute; right: 60px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 40px; animation: fadeUp 0.8s 0.8s ease both; }
  .stat-card { border: 1px solid var(--border); padding: 30px 40px; background: rgba(14,14,14,0.8); backdrop-filter: blur(10px); text-align: center; position: relative; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; color: var(--gold); display: block; }
  .stat-label { font-size: 11px; letter-spacing: 2px; color: var(--text3); text-transform: uppercase; margin-top: 6px; }
  .marquee-wrap { border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); overflow: hidden; padding: 18px 0; background: var(--bg2); }
  .marquee { display: flex; gap: 80px; width: max-content; animation: marquee 25s linear infinite; }
  .marquee-item { display: flex; align-items: center; gap: 16px; font-size: 12px; letter-spacing: 3px; color: var(--text3); text-transform: uppercase; white-space: nowrap; }
  .marquee-dot { width: 4px; height: 4px; background: var(--gold); border-radius: 50%; }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  section { padding: 120px 60px; }
  .section-label { font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; gap: 16px; }
  .section-label::before { content: ''; width: 40px; height: 1px; background: var(--gold); }
  .section-title { font-family: 'Playfair Display', serif; font-size: clamp(36px, 4vw, 56px); font-weight: 700; line-height: 1.15; margin-bottom: 20px; }
  .section-sub { color: var(--text2); font-size: 16px; line-height: 1.8; max-width: 500px; }
  .search-section { background: var(--bg2); padding: 60px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .search-tabs { display: flex; gap: 0; margin-bottom: 30px; }
  .search-tab { padding: 12px 30px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: none; border: 1px solid var(--border); background: transparent; color: var(--text2); transition: all 0.3s; font-family: 'DM Sans', sans-serif; margin-right: -1px; }
  .search-tab.active { background: var(--gold); color: var(--bg); border-color: var(--gold); z-index: 1; }
  .search-bar { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr auto; gap: 0; border: 1px solid var(--border); }
  .search-field { padding: 20px 24px; background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 6px; }
  .search-field label { font-size: 10px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; }
  .search-field input, .search-field select { background: transparent; border: none; outline: none; color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif; cursor: none; }
  .search-field select option { background: var(--bg3); }
  .search-btn { padding: 20px 40px; background: var(--gold); color: var(--bg); border: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: none; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: background 0.3s; }
  .search-btn:hover { background: var(--gold-light); }
  .properties-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 70px; }
  .prop-card { background: var(--bg2); position: relative; overflow: hidden; transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94); cursor: none; }
  .prop-card:hover { transform: translateY(-8px); z-index: 2; }
  .prop-img { height: 260px; position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg3), var(--bg4)); }
  .prop-img-inner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 80px; transition: transform 0.5s ease; }
  .prop-card:hover .prop-img-inner { transform: scale(1.1); }
  .prop-badge { position: absolute; top: 16px; left: 16px; padding: 6px 14px; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500; }
  .badge-sale { background: var(--gold); color: var(--bg); }
  .badge-rent { background: #1A3A5C; color: #4A9EDF; border: 1px solid #2A5A8C; }
  .badge-new { background: #1A3A1A; color: #4ADF6A; border: 1px solid #2A6A2A; }
  .prop-verified { position: absolute; top: 16px; right: 16px; padding: 6px 14px; background: rgba(8,8,8,0.8); border: 1px solid var(--green); color: var(--green); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
  .prop-verified::before { content: '✓'; font-weight: bold; }
  .prop-body { padding: 28px; }
  .prop-price { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; color: var(--gold); margin-bottom: 8px; }
  .prop-name { font-size: 16px; font-weight: 500; margin-bottom: 6px; }
  .prop-loc { font-size: 13px; color: var(--text3); margin-bottom: 20px; display: flex; align-items: center; gap: 6px; }
  .prop-specs { display: flex; gap: 0; border-top: 1px solid var(--border); }
  .prop-spec { flex: 1; padding: 16px 0; text-align: center; border-right: 1px solid var(--border); font-size: 12px; color: var(--text2); }
  .prop-spec:last-child { border-right: none; }
  .prop-spec strong { display: block; color: var(--text); font-size: 16px; font-weight: 500; margin-bottom: 2px; }
  .prop-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 28px; border-top: 1px solid var(--border); }
  .prop-rera { font-size: 10px; color: var(--text3); letter-spacing: 1px; }
  .prop-rera span { color: var(--gold); }
  .btn-view { padding: 8px 20px; background: transparent; border: 1px solid var(--border); color: var(--text2); font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; cursor: none; transition: all 0.3s; font-family: 'DM Sans', sans-serif; }
  .btn-view:hover { border-color: var(--gold); color: var(--gold); }
  .features { background: var(--bg2); }
  .features-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 70px; }
  .feat-card { padding: 48px 36px; background: var(--surface); position: relative; overflow: hidden; transition: all 0.4s; cursor: none; }
  .feat-card::before { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--gold), transparent); transform: scaleX(0); transition: transform 0.4s; }
  .feat-card:hover::before { transform: scaleX(1); }
  .feat-card:hover { background: var(--bg3); }
  .feat-icon { font-size: 44px; margin-bottom: 28px; display: block; transition: transform 0.3s; }
  .feat-card:hover .feat-icon { transform: scale(1.1) rotate(-5deg); }
  .feat-num { position: absolute; top: 24px; right: 24px; font-family: 'Playfair Display', serif; font-size: 60px; color: rgba(201,168,76,0.06); font-weight: 900; line-height: 1; }
  .feat-title { font-size: 18px; font-weight: 500; margin-bottom: 12px; }
  .feat-desc { font-size: 14px; color: var(--text2); line-height: 1.7; }
  .cities-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 70px; }
  .city-card { position: relative; height: 300px; overflow: hidden; background: var(--bg2); display: flex; align-items: flex-end; cursor: none; transition: all 0.4s; }
  .city-card:first-child { grid-column: span 2; height: 380px; }
  .city-bg { position: absolute; inset: 0; font-size: 100px; display: flex; align-items: center; justify-content: center; filter: grayscale(0.5); transition: transform 0.5s, filter 0.5s; }
  .city-card:hover .city-bg { transform: scale(1.08); filter: grayscale(0); }
  .city-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%); }
  .city-body { position: relative; padding: 28px; width: 100%; }
  .city-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; margin-bottom: 6px; }
  .city-count { font-size: 12px; color: var(--gold); letter-spacing: 2px; }
  .city-badge { position: absolute; top: 16px; right: 16px; padding: 6px 14px; background: var(--gold); color: var(--bg); font-size: 10px; letter-spacing: 1px; }
  .process { background: var(--bg2); }
  .process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 70px; position: relative; }
  .process-steps::before { content: ''; position: absolute; top: 28px; left: 60px; right: 60px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); z-index: 0; }
  .step { padding: 0 28px; text-align: center; position: relative; z-index: 1; }
  .step-num { width: 56px; height: 56px; border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; font-family: 'Playfair Display', serif; font-size: 22px; color: var(--gold); background: var(--bg2); }
  .step-title { font-size: 16px; font-weight: 500; margin-bottom: 10px; }
  .step-desc { font-size: 13px; color: var(--text2); line-height: 1.7; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 70px; }
  .testi-card { padding: 44px; background: var(--bg2); position: relative; border-top: 2px solid transparent; transition: border-color 0.3s; }
  .testi-card:hover { border-top-color: var(--gold); }
  .testi-quote { font-family: 'Playfair Display', serif; font-size: 80px; color: var(--gold); line-height: 0.6; margin-bottom: 20px; opacity: 0.3; }
  .testi-text { font-size: 18px; color: var(--text2); line-height: 1.8; margin-bottom: 30px; font-style: italic; font-family: 'Cormorant Garamond', serif; }
  .testi-stars { color: var(--gold); font-size: 14px; margin-bottom: 20px; }
  .testi-author { display: flex; align-items: center; gap: 16px; }
  .testi-avatar { width: 48px; height: 48px; border-radius: 50%; background: var(--bg3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .testi-name { font-size: 14px; font-weight: 500; }
  .testi-role { font-size: 12px; color: var(--text3); letter-spacing: 1px; }
  .app-section { background: var(--bg2); display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .app-features { display: flex; flex-direction: column; gap: 24px; margin-top: 40px; }
  .app-feat { display: flex; gap: 20px; align-items: flex-start; }
  .app-feat-icon { width: 44px; height: 44px; background: var(--bg3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .app-feat-text h4 { font-size: 15px; font-weight: 500; margin-bottom: 4px; }
  .app-feat-text p { font-size: 13px; color: var(--text2); line-height: 1.6; }
  .phone-mockup { width: 280px; height: 560px; border: 2px solid var(--border); border-radius: 36px; background: var(--surface); margin: 0 auto; position: relative; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1); }
  .phone-screen { padding: 24px 16px; height: 100%; display: flex; flex-direction: column; gap: 12px; }
  .phone-header { background: var(--bg3); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 10px; }
  .phone-logo { font-family: 'Playfair Display', serif; color: var(--gold); font-size: 14px; }
  .phone-card { background: var(--bg3); border-radius: 12px; padding: 14px; border: 1px solid var(--border); flex-shrink: 0; }
  .phone-card-title { font-size: 12px; color: var(--gold); margin-bottom: 4px; }
  .phone-card-price { font-size: 18px; font-weight: 700; font-family: 'Playfair Display', serif; }
  .phone-card-loc { font-size: 10px; color: var(--text3); margin-top: 2px; }
  .phone-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 28px; background: var(--bg); border-radius: 0 0 20px 20px; }
  .stats-banner { background: var(--gold); padding: 60px; display: grid; grid-template-columns: repeat(4, 1fr); }
  .stat-b { text-align: center; border-right: 1px solid rgba(8,8,8,0.15); }
  .stat-b:last-child { border-right: none; }
  .stat-b-num { font-family: 'Playfair Display', serif; font-size: 52px; font-weight: 900; color: var(--bg); display: block; }
  .stat-b-label { font-size: 12px; letter-spacing: 2px; color: rgba(8,8,8,0.7); text-transform: uppercase; margin-top: 6px; }
  .rera-section { background: var(--bg2); }
  .rera-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 60px; }
  .rera-card { padding: 36px; background: var(--surface); border: 1px solid var(--border); }
  .rera-state { font-size: 22px; font-weight: 500; margin-bottom: 8px; }
  .rera-link { font-size: 12px; color: var(--gold); letter-spacing: 1px; text-decoration: none; }
  .rera-icon { font-size: 32px; margin-bottom: 16px; display: block; }
  .rera-note { font-size: 12px; color: var(--text3); margin-top: 10px; line-height: 1.6; }
  .contact { background: var(--bg); display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
  .contact-form { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-size: 11px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; }
  .form-group input, .form-group select, .form-group textarea { background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 14px 18px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.3s; cursor: none; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--gold); }
  .form-group textarea { resize: vertical; min-height: 120px; }
  .form-group select option { background: var(--bg3); }
  .contact-info { display: flex; flex-direction: column; gap: 28px; margin-top: 40px; }
  .contact-item { display: flex; gap: 20px; align-items: flex-start; }
  .contact-icon { width: 48px; height: 48px; background: transparent; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
  .contact-label { font-size: 11px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 6px; }
  .contact-val { font-size: 15px; color: var(--text2); }
  footer { background: var(--bg2); padding: 80px 60px 40px; border-top: 1px solid var(--border); }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
  .footer-logo { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: var(--gold); margin-bottom: 16px; display: block; }
  .footer-desc { font-size: 14px; color: var(--text3); line-height: 1.8; max-width: 300px; margin-bottom: 28px; }
  .footer-socials { display: flex; gap: 12px; }
  .social-btn { width: 40px; height: 40px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: none; transition: all 0.3s; }
  .social-btn:hover { border-color: var(--gold); background: rgba(201,168,76,0.1); }
  .footer-col h4 { font-size: 12px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 24px; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .footer-links a { text-decoration: none; color: var(--text3); font-size: 14px; transition: color 0.3s; }
  .footer-links a:hover { color: var(--gold); }
  .footer-bottom { border-top: 1px solid var(--border); padding-top: 32px; display: flex; justify-content: space-between; align-items: center; }
  .footer-copy { font-size: 12px; color: var(--text3); letter-spacing: 1px; }
  .footer-badges { display: flex; gap: 16px; }
  .footer-badge { padding: 6px 16px; border: 1px solid var(--border); font-size: 10px; letter-spacing: 2px; color: var(--text3); text-transform: uppercase; }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); padding: 40px; animation: fadeIn 0.3s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background: var(--bg2); border: 1px solid var(--border); width: 100%; max-width: 700px; max-height: 85vh; overflow-y: auto; animation: slideUp 0.3s ease; position: relative; }
  @keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
  .modal-header { padding: 36px 44px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; }
  .modal-close { width: 44px; height: 44px; border: 1px solid var(--border); background: transparent; color: var(--text2); font-size: 20px; cursor: none; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
  .modal-close:hover { border-color: var(--gold); color: var(--gold); }
  .modal-body { padding: 44px; }
  .modal-prop-img { height: 200px; background: var(--bg3); display: flex; align-items: center; justify-content: center; font-size: 80px; margin-bottom: 28px; border: 1px solid var(--border); }
  .modal-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .modal-detail { padding: 18px; background: var(--surface); border: 1px solid var(--border); }
  .modal-detail label { font-size: 10px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; display: block; margin-bottom: 6px; }
  .modal-amenities { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
  .amenity { padding: 8px 16px; border: 1px solid var(--border); font-size: 12px; color: var(--text2); }
  .modal-footer { padding: 28px 44px; border-top: 1px solid var(--border); display: flex; gap: 16px; }
  .calculator { background: var(--surface); border: 1px solid var(--border); padding: 44px; margin-top: 60px; }
  .calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
  .calc-group { display: flex; flex-direction: column; gap: 10px; }
  .calc-group label { font-size: 11px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; }
  .calc-group input[type=range] { -webkit-appearance: none; height: 2px; background: var(--border); outline: none; }
  .calc-group input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: var(--gold); border-radius: 50%; cursor: none; }
  .calc-val { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--gold); }
  .calc-result { margin-top: 30px; padding: 28px; background: var(--bg3); border: 1px solid var(--gold); display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; }
  .calc-res-item { text-align: center; border-right: 1px solid var(--border); padding: 16px 0; }
  .calc-res-item:last-child { border-right: none; }
  .calc-res-num { font-family: 'Playfair Display', serif; font-size: 28px; color: var(--gold); display: block; }
  .calc-res-label { font-size: 11px; color: var(--text3); letter-spacing: 1.5px; text-transform: uppercase; margin-top: 6px; }
  .awards { background: var(--bg); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .awards-row { display: flex; gap: 0; margin-top: 60px; }
  .award-item { flex: 1; padding: 36px 28px; border-right: 1px solid var(--border); text-align: center; transition: background 0.3s; cursor: none; }
  .award-item:last-child { border-right: none; }
  .award-item:hover { background: var(--bg2); }
  .award-icon { font-size: 40px; display: block; margin-bottom: 16px; }
  .award-year { font-size: 11px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 8px; }
  .award-name { font-size: 15px; font-weight: 500; margin-bottom: 6px; }
  .award-by { font-size: 12px; color: var(--text3); }
  .agents-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 70px; }
  .agent-card { background: var(--bg2); padding: 36px 28px; text-align: center; border: 1px solid var(--border); transition: all 0.4s; cursor: none; position: relative; overflow: hidden; }
  .agent-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--gold-dim), var(--gold), var(--gold-dim)); transform: scaleX(0); transition: transform 0.4s; }
  .agent-card:hover::before { transform: scaleX(1); }
  .agent-card:hover { background: var(--bg3); }
  .agent-avatar { width: 80px; height: 80px; border-radius: 50%; background: var(--bg3); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 0 auto 20px; }
  .agent-name { font-size: 17px; font-weight: 500; margin-bottom: 4px; }
  .agent-role { font-size: 11px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 16px; }
  .agent-stats { display: flex; justify-content: center; gap: 24px; margin-bottom: 20px; }
  .agent-stat span { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--gold); display: block; }
  .agent-stat label { font-size: 10px; color: var(--text3); letter-spacing: 1px; }
  .agent-langs { display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; margin-bottom: 20px; }
  .lang-tag { padding: 4px 10px; border: 1px solid var(--border); font-size: 10px; color: var(--text3); letter-spacing: 1px; }
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 70px; }
  .blog-card { background: var(--bg3); cursor: none; transition: all 0.4s; }
  .blog-card:hover { background: var(--bg4); }
  .blog-img { height: 180px; background: var(--bg2); display: flex; align-items: center; justify-content: center; font-size: 60px; position: relative; }
  .blog-cat { position: absolute; bottom: 16px; left: 16px; padding: 5px 14px; background: var(--gold); color: var(--bg); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; }
  .blog-body { padding: 28px; }
  .blog-date { font-size: 11px; color: var(--text3); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; }
  .blog-title { font-size: 17px; font-weight: 500; margin-bottom: 12px; line-height: 1.5; }
  .blog-excerpt { font-size: 13px; color: var(--text2); line-height: 1.7; margin-bottom: 20px; }
  .blog-read { font-size: 12px; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }
  .newsletter { background: linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(8,8,8,0) 60%); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 80px 60px; text-align: center; position: relative; overflow: hidden; }
  .newsletter::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 100% at 50% 100%, rgba(201,168,76,0.05) 0%, transparent 70%); }
  .newsletter-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 700; margin-bottom: 16px; position: relative; }
  .newsletter-sub { color: var(--text2); font-size: 15px; margin-bottom: 40px; position: relative; }
  .newsletter-form { display: flex; max-width: 540px; margin: 0 auto; gap: 0; position: relative; }
  .newsletter-form input { flex: 1; padding: 18px 24px; background: var(--surface); border: 1px solid var(--border); border-right: none; color: var(--text); font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.3s; cursor: none; }
  .newsletter-form input:focus { border-color: var(--gold); }
  .newsletter-form button { padding: 18px 36px; background: var(--gold); color: var(--bg); border: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; cursor: none; font-family: 'DM Sans', sans-serif; font-weight: 500; transition: background 0.3s; white-space: nowrap; }
  .newsletter-form button:hover { background: var(--gold-light); }
  .newsletter-note { font-size: 11px; color: var(--text3); margin-top: 16px; letter-spacing: 1px; position: relative; }
  .toast { position: fixed; bottom: 40px; right: 40px; z-index: 3000; background: var(--bg2); border: 1px solid var(--gold); padding: 18px 28px; display: flex; align-items: center; gap: 16px; animation: toastIn 0.4s ease; }
  @keyframes toastIn { from{transform:translateX(100px);opacity:0} to{transform:translateX(0);opacity:1} }
  .toast-icon { font-size: 22px; }
  .toast-msg { font-size: 14px; }
  .toast-close { background: none; border: none; color: var(--text3); cursor: none; font-size: 18px; margin-left: 12px; }
  .faq-item { border: 1px solid var(--border); background: var(--bg2); transition: all 0.3s; cursor: none; }
  .faq-item.open { background: var(--bg3); border-color: var(--gold-dim); }
  .faq-q { padding: 22px 28px; display: flex; justify-content: space-between; align-items: center; gap: 20px; cursor: none; }
  .faq-q-text { font-size: 15px; font-weight: 500; line-height: 1.5; }
  .faq-icon { width: 32px; height: 32px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; color: var(--gold); font-size: 18px; flex-shrink: 0; transition: transform 0.3s; }
  .faq-item.open .faq-icon { transform: rotate(45deg); border-color: var(--gold); }
  .faq-a { padding: 0 28px 22px; font-size: 14px; color: var(--text2); line-height: 1.8; display: none; }
  .faq-item.open .faq-a { display: block; }

  /* ========== AI CHAT WIDGET ========== */
  .ai-chat-btn { position: fixed; bottom: 40px; left: 40px; z-index: 2500; width: 64px; height: 64px; background: var(--gold); border: none; border-radius: 50%; cursor: none; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 8px 32px rgba(201,168,76,0.4); transition: transform 0.3s, box-shadow 0.3s; }
  .ai-chat-btn:hover { transform: scale(1.1); box-shadow: 0 12px 40px rgba(201,168,76,0.6); }
  .ai-chat-btn .ai-badge { position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: var(--green); border-radius: 50%; border: 2px solid var(--bg); display: flex; align-items: center; justify-content: center; font-size: 8px; color: white; font-weight: bold; }
  .ai-chat-panel { position: fixed; bottom: 120px; left: 40px; z-index: 2500; width: 400px; background: var(--bg2); border: 1px solid var(--border); animation: slideUp 0.3s ease; display: flex; flex-direction: column; box-shadow: 0 24px 80px rgba(0,0,0,0.8); max-height: 600px; }
  .ai-chat-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--bg3); }
  .ai-chat-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--gold); }
  .ai-chat-subtitle { font-size: 11px; color: var(--text3); margin-top: 2px; letter-spacing: 1px; }
  .ai-status { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--green); }
  .ai-status::before { content: ''; width: 6px; height: 6px; background: var(--green); border-radius: 50%; animation: pulse 2s infinite; }
  .ai-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; min-height: 300px; max-height: 400px; }
  .ai-msg { max-width: 85%; }
  .ai-msg.user { align-self: flex-end; }
  .ai-msg.bot { align-self: flex-start; }
  .ai-msg-bubble { padding: 12px 16px; font-size: 13px; line-height: 1.6; }
  .ai-msg.user .ai-msg-bubble { background: var(--gold); color: var(--bg); }
  .ai-msg.bot .ai-msg-bubble { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); }
  .ai-msg-time { font-size: 10px; color: var(--text3); margin-top: 4px; letter-spacing: 1px; }
  .ai-msg.user .ai-msg-time { text-align: right; }
  .ai-typing { align-self: flex-start; padding: 12px 16px; background: var(--bg3); border: 1px solid var(--border); font-size: 13px; color: var(--text3); display: flex; gap: 4px; align-items: center; }
  .typing-dot { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: typingBounce 1.4s infinite; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
  .ai-input-area { padding: 16px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
  .ai-input { flex: 1; background: var(--surface); border: 1px solid var(--border); color: var(--text); padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color 0.3s; cursor: none; }
  .ai-input:focus { border-color: var(--gold); }
  .ai-send { width: 40px; height: 40px; background: var(--gold); border: none; cursor: none; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: background 0.3s; flex-shrink: 0; }
  .ai-send:hover { background: var(--gold-light); }
  .ai-suggestions { padding: 0 20px 12px; display: flex; flex-wrap: wrap; gap: 6px; }
  .ai-suggestion { padding: 6px 12px; border: 1px solid var(--border); background: transparent; color: var(--text3); font-size: 11px; letter-spacing: 1px; cursor: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .ai-suggestion:hover { border-color: var(--gold); color: var(--gold); }

  /* ========== WISHLIST PANEL ========== */
  .wishlist-btn { position: fixed; top: 50%; right: 0; transform: translateY(-50%); z-index: 1500; background: var(--bg2); border: 1px solid var(--border); border-right: none; padding: 14px 10px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: none; transition: all 0.3s; }
  .wishlist-btn:hover { background: var(--bg3); border-color: var(--gold); }
  .wishlist-count { width: 22px; height: 22px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--bg); font-weight: 700; }
  .wishlist-label { font-size: 10px; color: var(--text3); letter-spacing: 1px; writing-mode: vertical-rl; text-transform: uppercase; }
  .wishlist-panel { position: fixed; top: 0; right: 0; bottom: 0; width: 380px; background: var(--bg2); border-left: 1px solid var(--border); z-index: 2000; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94); overflow-y: auto; }
  .wishlist-panel.open { transform: translateX(0); }
  .wishlist-header { padding: 30px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: var(--bg2); z-index: 1; }
  .wishlist-title { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--gold); }
  .wishlist-items { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
  .wishlist-item { background: var(--surface); border: 1px solid var(--border); padding: 16px; display: flex; gap: 14px; align-items: center; position: relative; }
  .wishlist-item-emoji { font-size: 32px; flex-shrink: 0; }
  .wishlist-item-name { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
  .wishlist-item-loc { font-size: 11px; color: var(--text3); }
  .wishlist-item-price { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--gold); margin-top: 4px; }
  .wishlist-remove { position: absolute; top: 10px; right: 10px; background: none; border: none; color: var(--text3); cursor: none; font-size: 16px; transition: color 0.2s; }
  .wishlist-remove:hover { color: var(--red); }
  .wishlist-empty { padding: 60px 28px; text-align: center; color: var(--text3); font-size: 14px; line-height: 1.8; }

  /* ========== AI SEARCH RESULTS ========== */
  .ai-search-results { background: var(--bg3); border: 1px solid var(--gold-dim); padding: 24px; margin-top: 20px; }
  .ai-search-label { font-size: 11px; letter-spacing: 3px; color: var(--gold); text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .ai-search-text { font-size: 14px; color: var(--text2); line-height: 1.7; }
  .ai-loading-dots { display: inline-flex; gap: 4px; }
  .ai-loading-dot { width: 5px; height: 5px; background: var(--gold); border-radius: 50%; animation: typingBounce 1.4s infinite; }
  .ai-loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .ai-loading-dot:nth-child(3) { animation-delay: 0.4s; }
`;

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

async function askClaude(messages, systemPrompt) {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text || "Sorry, I couldn't process your request.";
}

const SYSTEM_PROMPT = `You are SmartEstate AI — a premium real estate assistant for India's top property platform. You help users find properties, understand RERA regulations, calculate home loans, and make smart investment decisions.

You have expertise in:
- Indian real estate markets: Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Chennai
- RERA compliance and verification
- Home loan advice (SBI, HDFC, ICICI, Axis, Kotak)
- Property types: apartments, villas, plots, commercial
- NRI investment guidance

Our platform has 50,000+ RERA-verified properties across 100+ cities, zero brokerage, AI matching.

Be concise, helpful, and professional. Use ₹ for amounts. Reply in 2-4 short paragraphs max. If asked about specific listings, mention our featured properties: Prestige Golf Shire (₹2.85 Cr, Bengaluru), Lodha World One (₹8.50 Cr, Mumbai), Godrej Reserve (₹3.40 Cr, Mumbai), DLF Magnolias (₹1.20L/mo, Gurugram).`;

const properties = [
  { id: 1, type: "sale", name: "Prestige Golf Shire", loc: "Whitefield, Bengaluru", price: "₹2.85 Cr", beds: 4, baths: 4, area: "3200", emoji: "🏰", verified: true, new: false, rera: "PRM/KA/RERA/1234", builder: "Prestige Group", possession: "Dec 2025", amenities: ["Swimming Pool", "Gym", "Club House", "Parking", "Power Backup", "Security", "Garden", "Lift"] },
  { id: 2, type: "rent", name: "DLF Magnolias", loc: "Sector 42, Gurugram", price: "₹1.20 L/mo", beds: 3, baths: 3, area: "2800", emoji: "🏯", verified: true, new: true, rera: "GGM/401/2023", builder: "DLF Limited", possession: "Ready", amenities: ["Pool", "Tennis Court", "Concierge", "Spa", "Valet", "Helipad", "Smart Home", "Theatre"] },
  { id: 3, type: "sale", name: "Lodha World One", loc: "Lower Parel, Mumbai", price: "₹8.50 Cr", beds: 4, baths: 5, area: "4200", emoji: "🗼", verified: true, new: false, rera: "P51800015193", builder: "Lodha Group", possession: "Jun 2024", amenities: ["Sky Lounge", "Infinity Pool", "Private Elevator", "Wine Cellar", "Gym", "Spa", "Theatre", "Concierge"] },
  { id: 4, type: "sale", name: "Godrej Reserve", loc: "Kandivali E, Mumbai", price: "₹3.40 Cr", beds: 3, baths: 3, area: "1850", emoji: "🌿", verified: true, new: true, rera: "P51800047832", builder: "Godrej Properties", possession: "Mar 2026", amenities: ["Forest Trail", "Amphitheatre", "Kids Zone", "Yoga Deck", "Pool", "Gym", "Shopping", "Cafe"] },
  { id: 5, type: "rent", name: "Emaar Palm Hills", loc: "Sector 77, Mohali", price: "₹85K/mo", beds: 5, baths: 4, area: "5500", emoji: "🌴", verified: false, new: false, rera: "PBRERA-SAS77-PRJ-0893", builder: "Emaar India", possession: "Ready", amenities: ["Golf Course", "Club House", "Pool", "Tennis", "Gym", "Security", "Parking", "Garden"] },
  { id: 6, type: "sale", name: "Phoenix One Bangalore West", loc: "Rajajinagar, Bengaluru", price: "₹1.95 Cr", beds: 3, baths: 3, area: "1650", emoji: "🔥", verified: true, new: true, rera: "PRM/KA/RERA/5678", builder: "Phoenix Mills", possession: "Sep 2025", amenities: ["Rooftop Pool", "Gym", "Clubhouse", "Terrace Garden", "EV Charging", "Smart Security", "Co-working", "Kids Play"] },
];

const cities = [
  { name: "Mumbai", count: "2,840+", emoji: "🏙️", hot: true },
  { name: "Bengaluru", count: "3,120+", emoji: "🌆", hot: false },
  { name: "Delhi NCR", count: "4,200+", emoji: "🕌", hot: true },
  { name: "Hyderabad", count: "1,960+", emoji: "🏛️", hot: false },
  { name: "Pune", count: "1,540+", emoji: "🌇", hot: false },
];

const testimonials = [
  { text: "The platform is extraordinary. Found our dream villa in Goa within 48 hours. The RERA verification gave us complete peace of mind. Truly world-class service.", name: "Arjun Khanna", role: "Entrepreneur, Mumbai", emoji: "👨‍💼", stars: 5 },
  { text: "As a NRI investor, I was skeptical about remote property buying. SmartEstate's verified listings and virtual tours changed everything. Invested ₹4.2 Cr seamlessly.", name: "Priya Menon", role: "NRI Investor, Dubai", emoji: "👩‍💻", stars: 5 },
  { text: "Listed my luxury apartment and received genuine inquiries within hours. No brokers, full control, and the loan calculator helped my buyers finalize instantly.", name: "Rohit Sharma", role: "Property Developer, Pune", emoji: "👨‍🏫", stars: 5 },
];

const features = [
  { icon: "🔐", title: "RERA Verified", desc: "Every property checked against official RERA databases across all Indian states. Zero fraud, guaranteed authenticity.", num: "01" },
  { icon: "🤖", title: "AI-Powered Matching", desc: "Smart algorithms analyze 50+ parameters to suggest properties that precisely match your lifestyle and investment goals.", num: "02" },
  { icon: "🎥", title: "Virtual 3D Tours", desc: "Immersive 360° virtual tours with AR furniture placement. Experience properties from anywhere in India or abroad.", num: "03" },
  { icon: "📊", title: "Market Intelligence", desc: "Real-time price trends, rental yields, and appreciation data for 100+ Indian cities powered by live market feeds.", num: "04" },
  { icon: "⚡", title: "Instant Home Loans", desc: "Pre-approved loans from 25+ banks including SBI, HDFC, ICICI. Get approval within 24 hours at best rates.", num: "05" },
  { icon: "💬", title: "Direct Connect", desc: "Encrypted WhatsApp-style chat with verified sellers and builders. No middlemen, no broker fees ever.", num: "06" },
  { icon: "📋", title: "Legal Due Diligence", desc: "Automated encumbrance, title, and document verification. Our expert lawyers review all paperwork for free.", num: "07" },
  { icon: "🌐", title: "NRI Special Zone", desc: "Dedicated portal for NRI investments with FEMA compliance, repatriation support, and power of attorney services.", num: "08" },
];

const reraStates = [
  { state: "Maharashtra", icon: "🏛️", note: "MahaRERA — Most active registry with 42,000+ projects registered" },
  { state: "Karnataka", icon: "🌆", note: "K-RERA — Covers Bengaluru, Mysuru & all urban development areas" },
  { state: "Delhi NCR", icon: "🕌", note: "HRERA / UP RERA — Joint jurisdiction for NCR properties" },
  { state: "Tamil Nadu", icon: "🌊", note: "TNRERA — Chennai, Coimbatore & all urban local body areas" },
  { state: "Telangana", icon: "💎", note: "TSRERA — Hyderabad metro and all HMDA jurisdiction areas" },
  { state: "Gujarat", icon: "🏗️", note: "GujRERA — Ahmedabad, Surat, Vadodara & all municipal areas" },
];

function formatCurrency(val) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)} L`;
  return `₹${val.toLocaleString()}`;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`} onClick={() => setOpen(o => !o)}>
      <div className="faq-q">
        <div className="faq-q-text">{q}</div>
        <div className="faq-icon">+</div>
      </div>
      <div className="faq-a">{a}</div>
    </div>
  );
}

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Namaste! 🙏 Main SmartEstate AI hun. Aap mujhse koi bhi property, RERA, home loan ya investment ke baare mein puch sakte hain!", time: "Now" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const suggestions = ["3 BHK under ₹2Cr Mumbai", "NRI investment guide", "RERA kya hota hai?", "Best home loan rates"];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text: userText, time: now }]);
    setLoading(true);
    try {
      const history = messages.filter(m => m.role !== "bot" || messages.indexOf(m) > 0).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text
      }));
      history.push({ role: "user", content: userText });
      const reply = await askClaude(history, SYSTEM_PROMPT);
      setMessages(prev => [...prev, { role: "bot", text: reply, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Network error. Please try again.", time: "" }]);
    }
    setLoading(false);
  };

  return (
    <>
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div>
              <div className="ai-chat-title">SmartEstate AI</div>
              <div className="ai-chat-subtitle">POWERED BY CLAUDE AI</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <div className="ai-status">Live</div>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "none", fontSize: 18 }}>✕</button>
            </div>
          </div>
          <div className="ai-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                <div className="ai-msg-bubble">{m.text}</div>
                {m.time && <div className="ai-msg-time">{m.time}</div>}
              </div>
            ))}
            {loading && (
              <div className="ai-typing">
                <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="ai-suggestions">
            {suggestions.map(s => (
              <button key={s} className="ai-suggestion" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
          <div className="ai-input-area">
            <input
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Property ke baare mein puchein..."
            />
            <button className="ai-send" onClick={() => send()}>→</button>
          </div>
        </div>
      )}
      <button className="ai-chat-btn" onClick={() => setOpen(o => !o)}>
        🤖
        <span className="ai-badge">AI</span>
      </button>
    </>
  );
}

function WishlistPanel({ wishlist, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="wishlist-btn" onClick={() => setOpen(true)}>
        <div className="wishlist-count">{wishlist.length}</div>
        <span style={{ fontSize: 18 }}>❤️</span>
        <span className="wishlist-label">Wishlist</span>
      </div>
      <div className={`wishlist-panel ${open ? "open" : ""}`}>
        <div className="wishlist-header">
          <div>
            <div className="wishlist-title">My Wishlist</div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{wishlist.length} properties saved</div>
          </div>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "none", fontSize: 20 }}>✕</button>
        </div>
        {wishlist.length === 0 ? (
          <div className="wishlist-empty">
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
            <div>Koi property save nahi ki abhi</div>
            <div style={{ marginTop: 8 }}>Properties browse karein aur ❤️ karein</div>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlist.map(p => (
              <div key={p.id} className="wishlist-item">
                <div className="wishlist-item-emoji">{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="wishlist-item-name">{p.name}</div>
                  <div className="wishlist-item-loc">📍 {p.loc}</div>
                  <div className="wishlist-item-price">{p.price}</div>
                </div>
                <button className="wishlist-remove" onClick={() => onRemove(p.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
        {wishlist.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => {}}>
              <span>Compare All ({wishlist.length})</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedProp, setSelectedProp] = useState(null);
  const [toast, setToast] = useState(null);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [cursorHover, setCursorHover] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", city: "", budget: "", message: "" });
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSearchResult, setAiSearchResult] = useState(null);
  const [aiSearchLoading, setAiSearchLoading] = useState(false);
  const [contactCount, setContactCount] = useState(0);
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);

  // Load wishlist from storage
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const result = await window.storage.get("wishlist");
        if (result?.value) setWishlist(JSON.parse(result.value));
      } catch {}
    };
    loadWishlist();
  }, []);

  // Load contact count from storage
  useEffect(() => {
    const loadCount = async () => {
      try {
        const result = await window.storage.get("contact_count");
        if (result?.value) setContactCount(parseInt(result.value));
      } catch {}
    };
    loadCount();
  }, []);

  // Save wishlist to storage whenever it changes
  const saveWishlist = useCallback(async (newWishlist) => {
    try {
      await window.storage.set("wishlist", JSON.stringify(newWishlist));
    } catch {}
  }, []);

  const addToWishlist = (prop) => {
    if (wishlist.find(p => p.id === prop.id)) {
      showToast("Pehle se wishlist mein hai!", "❤️");
      return;
    }
    const newWishlist = [...wishlist, prop];
    setWishlist(newWishlist);
    saveWishlist(newWishlist);
    showToast(`${prop.name} wishlist mein add ho gaya!`, "❤️");
  };

  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter(p => p.id !== id);
    setWishlist(newWishlist);
    saveWishlist(newWishlist);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const move = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
      setTimeout(() => { if (cursorRingRef.current) { cursorRingRef.current.style.left = e.clientX + "px"; cursorRingRef.current.style.top = e.clientY + "px"; } }, 80);
    };
    const hover = (e) => { if (e.target.closest("button,a,.prop-card,.city-card,.feat-card,.testi-card")) setCursorHover(true); };
    const leave = () => setCursorHover(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", hover);
    window.addEventListener("mouseout", leave);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", hover); window.removeEventListener("mouseout", leave); };
  }, []);

  const emi = (() => {
    const r = loanRate / 12 / 100;
    const n = loanTenure * 12;
    if (r === 0) return loanAmount / n;
    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  })();
  const totalPayment = emi * loanTenure * 12;
  const totalInterest = totalPayment - loanAmount;

  const showToast = (msg, icon = "✅") => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3500);
  };

  const handleContact = async (e) => {
    e.preventDefault();
    try {
      const submissions = [];
      try {
        const existing = await window.storage.get("contact_submissions");
        if (existing?.value) submissions.push(...JSON.parse(existing.value));
      } catch {}
      submissions.push({ ...contactForm, timestamp: new Date().toISOString(), id: Date.now() });
      await window.storage.set("contact_submissions", JSON.stringify(submissions));
      const newCount = contactCount + 1;
      setContactCount(newCount);
      await window.storage.set("contact_count", String(newCount));
    } catch {}
    showToast("Request submit ho gayi! 2 ghante mein call milegi.", "🏆");
    setContactForm({ name: "", email: "", phone: "", city: "", budget: "", message: "" });
  };

  const handleAISearch = async () => {
    const query = searchQuery.trim() || "best properties in India";
    setAiSearchLoading(true);
    setAiSearchResult(null);
    try {
      const prompt = `User is searching for: "${query}" on SmartEstate India property platform. Give a helpful 3-4 line response about what properties they might find, which cities to look in, approximate price range, and what to consider. Be specific to Indian real estate.`;
      const result = await askClaude([{ role: "user", content: prompt }], SYSTEM_PROMPT);
      setAiSearchResult(result);
    } catch {
      setAiSearchResult("Search results load nahi ho sake. Dobara try karein.");
    }
    setAiSearchLoading(false);
  };

  const marqueeItems = ["Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Goa", "Chandigarh", "Kochi", "Coimbatore", "Lucknow", "Surat"];

  return (
    <>
      <style>{style}</style>
      <div ref={cursorRef} className={`cursor ${cursorHover ? "hover" : ""}`} />
      <div ref={cursorRingRef} className={`cursor-ring ${cursorHover ? "hover" : ""}`} />

      {/* AI Chat Widget */}
      <AIChatWidget />

      {/* Wishlist Panel */}
      <WishlistPanel wishlist={wishlist} onRemove={removeFromWishlist} />

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span className="toast-icon">{toast.icon}</span>
          <span className="toast-msg">{toast.msg}</span>
          <button className="toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* MODAL */}
      {selectedProp && (
        <div className="modal-overlay" onClick={() => setSelectedProp(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{selectedProp.name}</div>
                <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>{selectedProp.loc}</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedProp(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-prop-img">{selectedProp.emoji}</div>
              <div className="modal-details">
                <div className="modal-detail"><label>Price</label><div style={{ color: "var(--gold)", fontFamily: "Playfair Display", fontSize: 22 }}>{selectedProp.price}</div></div>
                <div className="modal-detail"><label>Builder</label><div>{selectedProp.builder}</div></div>
                <div className="modal-detail"><label>Area</label><div>{selectedProp.area} sq.ft</div></div>
                <div className="modal-detail"><label>Possession</label><div>{selectedProp.possession}</div></div>
                <div className="modal-detail"><label>Bedrooms</label><div>{selectedProp.beds} BHK</div></div>
                <div className="modal-detail"><label>RERA ID</label><div style={{ color: "var(--gold)", fontSize: 13 }}>{selectedProp.rera}</div></div>
              </div>
              <div style={{ marginBottom: 16, fontSize: 12, letterSpacing: 2, color: "var(--gold)", textTransform: "uppercase" }}>Amenities</div>
              <div className="modal-amenities">
                {selectedProp.amenities.map(a => <span key={a} className="amenity">{a}</span>)}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setSelectedProp(null); showToast("Visit booking ho gayi! Agent call karega.", "📅"); }}><span>Book a Visit</span></button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { addToWishlist(selectedProp); setSelectedProp(null); }}>❤️ Wishlist</button>
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a href="#" className="nav-logo">Smart<span>Estate</span></a>
        <ul className="nav-links">
          <li><a href="#properties">Properties</a></li>
          <li><a href="#cities">Cities</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#rera">RERA</a></li>
          <li><a href="#calculator">Loans</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="nav-cta" onClick={() => showToast("App download link phone pe bheja!", "📱")}>Download App</button>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-badge">India's Premium Real Estate Platform</div>
          <h1 className="hero-title">Find Your<br /><em>Perfect</em>Home</h1>
          <p className="hero-sub">Discover 50,000+ RERA-verified properties across 100+ Indian cities. Buy, sell, or rent with zero brokerage, complete transparency, and AI-powered intelligence.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => document.getElementById("properties").scrollIntoView({ behavior: "smooth" })}><span>Explore Properties</span></button>
            <button className="btn-ghost" onClick={() => showToast("App download ho raha hai!", "📱")}>Download App</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card"><span className="stat-num">50K+</span><div className="stat-label">Live Listings</div></div>
          <div className="stat-card"><span className="stat-num">₹0</span><div className="stat-label">Brokerage</div></div>
          <div className="stat-card"><span className="stat-num">100%</span><div className="stat-label">RERA Verified</div></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="marquee-item"><span className="marquee-dot" />{item}</div>
          ))}
        </div>
      </div>

      {/* SEARCH with AI */}
      <div className="search-section">
        <div className="search-tabs">
          {["buy", "rent", "plot", "commercial", "new projects"].map(tab => (
            <button key={tab} className={`search-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab.toUpperCase()}</button>
          ))}
        </div>
        <div className="search-bar">
          <div className="search-field">
            <label>AI Search</label>
            <input placeholder="e.g. 3 BHK under 2Cr Mumbai near metro..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAISearch()} />
          </div>
          <div className="search-field">
            <label>Property Type</label>
            <select><option>Apartment</option><option>Villa</option><option>Plot</option><option>Commercial</option><option>Studio</option></select>
          </div>
          <div className="search-field">
            <label>Budget</label>
            <select><option>Under ₹50 Lakh</option><option>₹50L – ₹1 Cr</option><option>₹1 Cr – ₹3 Cr</option><option>₹3 Cr – ₹5 Cr</option><option>Above ₹5 Cr</option></select>
          </div>
          <div className="search-field">
            <label>Configuration</label>
            <select><option>1 BHK</option><option>2 BHK</option><option>3 BHK</option><option>4+ BHK</option><option>Villa / Bungalow</option></select>
          </div>
          <button className="search-btn" onClick={handleAISearch}>{aiSearchLoading ? "..." : "AI Search →"}</button>
        </div>
        {(aiSearchLoading || aiSearchResult) && (
          <div className="ai-search-results">
            <div className="ai-search-label">
              🤖 AI Property Advisor
              {aiSearchLoading && <span className="ai-loading-dots"><span className="ai-loading-dot"/><span className="ai-loading-dot"/><span className="ai-loading-dot"/></span>}
            </div>
            {aiSearchResult && <div className="ai-search-text">{aiSearchResult}</div>}
          </div>
        )}
      </div>

      {/* PROPERTIES */}
      <section id="properties" style={{ background: "var(--bg)" }}>
        <div className="section-label">Featured Listings</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">Curated <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Luxury</em><br />Properties</h2>
          <p className="section-sub" style={{ textAlign: "right" }}>Handpicked premium properties from India's most trusted builders, verified and ready for you.</p>
        </div>
        <div className="properties-grid">
          {properties.map(prop => (
            <div key={prop.id} className="prop-card" onClick={() => setSelectedProp(prop)}>
              <div className="prop-img">
                <div className="prop-img-inner">{prop.emoji}</div>
                <div className={`prop-badge ${prop.type === "sale" ? "badge-sale" : "badge-rent"}`}>{prop.type === "sale" ? "For Sale" : "For Rent"}</div>
                {prop.new && <div style={{ position: "absolute", top: 50, left: 16 }} className="prop-badge badge-new">New</div>}
                {prop.verified && <div className="prop-verified">RERA</div>}
              </div>
              <div className="prop-body">
                <div className="prop-price">{prop.price}</div>
                <div className="prop-name">{prop.name}</div>
                <div className="prop-loc">📍 {prop.loc}</div>
                <div className="prop-specs">
                  <div className="prop-spec"><strong>{prop.beds}</strong>BHK</div>
                  <div className="prop-spec"><strong>{prop.baths}</strong>Baths</div>
                  <div className="prop-spec"><strong>{prop.area}</strong>sq.ft</div>
                </div>
              </div>
              <div className="prop-footer">
                <div className="prop-rera">RERA: <span>{prop.rera.slice(0, 12)}...</span></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-view" onClick={e => { e.stopPropagation(); addToWishlist(prop); }}>❤️</button>
                  <button className="btn-view">View →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 60 }}>
          <button className="btn-ghost" style={{ padding: "16px 60px" }} onClick={() => showToast("50,000+ verified properties load ho rahi hain...", "🏘️")}>View All Properties</button>
        </div>
      </section>

      {/* CITIES */}
      <section id="cities" style={{ background: "var(--bg2)" }}>
        <div className="section-label">Top Markets</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">India's <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Hottest</em><br />Real Estate Cities</h2>
          <p className="section-sub" style={{ textAlign: "right" }}>Pan-India presence across metro cities, Tier-2 markets, and emerging real estate destinations.</p>
        </div>
        <div className="cities-grid">
          {cities.map(city => (
            <div key={city.name} className="city-card" onClick={() => showToast(`${city.count} properties explore kar rahe hain ${city.name} mein`, "🏙️")}>
              <div className="city-bg">{city.emoji}</div>
              <div className="city-overlay" />
              <div className="city-body">
                <div className="city-name">{city.name}</div>
                <div className="city-count">{city.count} Properties</div>
              </div>
              {city.hot && <div className="city-badge">🔥 Hot Market</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="section-label">Why SmartEstate</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">Built for the <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Discerning</em><br />Indian Buyer</h2>
          <p className="section-sub" style={{ textAlign: "right" }}>Every feature designed around India's complex real estate ecosystem.</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div key={f.title} className="feat-card">
              <span className="feat-num">{f.num}</span>
              <span className="feat-icon">{f.icon}</span>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS BANNER */}
      <div className="stats-banner">
        <div className="stat-b"><span className="stat-b-num">50K+</span><div className="stat-b-label">Verified Properties</div></div>
        <div className="stat-b"><span className="stat-b-num">2.4L+</span><div className="stat-b-label">Happy Families</div></div>
        <div className="stat-b"><span className="stat-b-num">100+</span><div className="stat-b-label">Indian Cities</div></div>
        <div className="stat-b"><span className="stat-b-num">₹0</span><div className="stat-b-label">Broker Fee</div></div>
      </div>

      {/* HOW IT WORKS */}
      <section id="process" style={{ background: "var(--bg)" }} className="process">
        <div className="section-label">How It Works</div>
        <h2 className="section-title" style={{ textAlign: "center", marginBottom: 0 }}>Find Your Dream Home<br /><em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>In 4 Simple Steps</em></h2>
        <div className="process-steps">
          {[
            { num: "1", title: "Create Profile", desc: "Sign up with your mobile number. Add preferences — city, budget, BHK, and lifestyle needs." },
            { num: "2", title: "Browse & Filter", desc: "AI-powered search suggests best matches. Apply 20+ filters for pinpoint precision." },
            { num: "3", title: "Visit & Verify", desc: "Schedule physical visits or take 3D virtual tours. Verify RERA registration instantly." },
            { num: "4", title: "Close the Deal", desc: "Get home loan approval, legal verification, and registration support — all in one platform." },
          ].map(s => (
            <div key={s.num} className="step">
              <div className="step-num">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "var(--bg2)" }}>
        <div className="section-label">Client Stories</div>
        <h2 className="section-title">What Our <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Clients</em> Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(t => (
            <div key={t.name} className="testi-card">
              <div className="testi-quote">"</div>
              <div className="testi-stars">{"★".repeat(t.stars)}</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.emoji}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* APP SECTION */}
      <section className="app-section" id="app">
        <div>
          <div className="section-label">Mobile Application</div>
          <h2 className="section-title">All of India's<br /><em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Real Estate</em><br />In Your Palm</h2>
          <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8, marginBottom: 40, maxWidth: 440 }}>Our Flutter-powered Android app brings RERA-verified listings, AI matching, 3D tours, home loan calculators, and direct chat — all in one sleek, fast, secure app.</p>
          <div className="app-features">
            {[
              { icon: "📍", title: "Location-Based Discovery", desc: "Find properties within any radius. Commute time calculator to offices and schools." },
              { icon: "🔔", title: "Smart Price Alerts", desc: "Get instant notifications when properties in your wishlist drop in price." },
              { icon: "🔒", title: "Bank-Grade Security", desc: "Firebase Auth with OTP, biometric lock, and end-to-end encrypted conversations." },
              { icon: "🌐", title: "NRI Dashboard", desc: "Dedicated section for NRI buyers with FEMA guidance, currency converter, and POA templates." },
            ].map(f => (
              <div key={f.title} className="app-feat">
                <div className="app-feat-icon">{f.icon}</div>
                <div className="app-feat-text"><h4>{f.title}</h4><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 16 }}>
            <button className="btn-primary" onClick={() => showToast("APK download shuru!", "📱")}><span>Download APK</span></button>
            <button className="btn-ghost" onClick={() => showToast("Play Store listing coming soon!", "🚀")}>Play Store</button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div className="phone-mockup">
            <div className="phone-notch" />
            <div className="phone-screen" style={{ paddingTop: 40 }}>
              <div className="phone-header"><span className="phone-logo">SmartEstate</span><span style={{ marginLeft: "auto", fontSize: 12, color: "var(--gold)" }}>🔔</span></div>
              <div style={{ fontSize: 11, color: "var(--text3)", letterSpacing: 1, paddingLeft: 4 }}>RECOMMENDED FOR YOU</div>
              {[
                { emoji: "🏰", name: "Prestige Lavender", loc: "Whitefield, BLR", price: "₹2.85 Cr" },
                { emoji: "🗼", name: "Lodha Malabar", loc: "Malabar Hill, MUM", price: "₹14.5 Cr" },
                { emoji: "🌿", name: "Godrej Nature", loc: "Mahalunge, PUNE", price: "₹1.2 Cr" },
              ].map(p => (
                <div key={p.name} className="phone-card">
                  <div className="phone-card-title">{p.emoji} {p.name}</div>
                  <div className="phone-card-price">{p.price}</div>
                  <div className="phone-card-loc">📍 {p.loc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RERA */}
      <section id="rera" className="rera-section">
        <div className="section-label">Compliance & Safety</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">RERA Verified<br /><em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Pan India</em></h2>
          <p className="section-sub" style={{ textAlign: "right" }}>We connect directly with RERA portals of every state. Every listing is cross-verified before going live.</p>
        </div>
        <div className="rera-grid">
          {reraStates.map(r => (
            <div key={r.state} className="rera-card">
              <span className="rera-icon">{r.icon}</span>
              <div className="rera-state">{r.state}</div>
              <div className="rera-note">{r.note}</div>
              <div style={{ marginTop: 16 }}>
                <span className="rera-link" style={{ cursor: "pointer" }} onClick={() => showToast(`${r.state} RERA portal khul raha hai...`, "🔗")}>View RERA Portal →</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, padding: "28px 36px", background: "rgba(201,168,76,0.06)", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 24 }}>
          <span style={{ fontSize: 36 }}>⚖️</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Important Disclaimer</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>Under the Real Estate (Regulation and Development) Act, 2016, all projects above 500 sq.m or 8 units must be registered with the respective State RERA. Buyers are advised to verify registration details on the official RERA portal before making any payment.</div>
          </div>
        </div>
      </section>

      {/* LOAN CALCULATOR */}
      <section id="calculator" style={{ background: "var(--bg2)" }}>
        <div className="section-label">Financial Planning</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">Home Loan<br /><em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>EMI Calculator</em></h2>
          <p className="section-sub" style={{ textAlign: "right" }}>Plan your finances with our real-time EMI calculator. Compare rates across SBI, HDFC, ICICI, and 22 more lenders.</p>
        </div>
        <div className="calculator">
          <div className="calc-grid">
            <div className="calc-group">
              <label>Loan Amount</label>
              <div className="calc-val">{formatCurrency(loanAmount)}</div>
              <input type="range" min={500000} max={50000000} step={100000} value={loanAmount} onChange={e => setLoanAmount(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)" }}><span>₹5 Lakh</span><span>₹5 Crore</span></div>
            </div>
            <div className="calc-group">
              <label>Interest Rate (% p.a.)</label>
              <div className="calc-val">{loanRate.toFixed(1)}%</div>
              <input type="range" min={6} max={15} step={0.1} value={loanRate} onChange={e => setLoanRate(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)" }}><span>6%</span><span>15%</span></div>
            </div>
            <div className="calc-group">
              <label>Loan Tenure (Years)</label>
              <div className="calc-val">{loanTenure} Years</div>
              <input type="range" min={5} max={30} step={1} value={loanTenure} onChange={e => setLoanTenure(+e.target.value)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)" }}><span>5 Yrs</span><span>30 Yrs</span></div>
            </div>
            <div className="calc-group" style={{ justifyContent: "flex-end" }}>
              <button className="btn-primary" style={{ width: "100%", marginTop: "auto" }} onClick={() => showToast("25+ lenders se best rates mil rahi hain!", "🏦")}><span>Get Best Loan Offers</span></button>
            </div>
          </div>
          <div className="calc-result">
            <div className="calc-res-item"><span className="calc-res-num">₹{Math.round(emi).toLocaleString()}</span><div className="calc-res-label">Monthly EMI</div></div>
            <div className="calc-res-item"><span className="calc-res-num">{formatCurrency(Math.round(totalInterest))}</span><div className="calc-res-label">Total Interest</div></div>
            <div className="calc-res-item"><span className="calc-res-num">{formatCurrency(Math.round(totalPayment))}</span><div className="calc-res-label">Total Payment</div></div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div>
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title">Talk to Our<br /><em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Property Expert</em></h2>
          <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8, maxWidth: 440, marginBottom: 8 }}>Our certified real estate advisors are available 7 days a week, 9 AM – 9 PM. Total {contactCount} inquiries received.</p>
          <div className="contact-info">
            {[
              { icon: "📞", label: "Call Us", val: "+91 98765 43210  |  Toll Free: 1800-SMART-E" },
              { icon: "✉️", label: "Email", val: "concierge@smartestate.in" },
              { icon: "💬", label: "WhatsApp", val: "+91 98765 43210 (9AM – 9PM, 7 Days)" },
              { icon: "📍", label: "Head Office", val: "Nariman Point, Mumbai, Maharashtra 400021" },
            ].map(c => (
              <div key={c.label} className="contact-item">
                <div className="contact-icon">{c.icon}</div>
                <div>
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-val">{c.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <form className="contact-form" onSubmit={handleContact}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input placeholder="Rahul Sharma" value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input placeholder="+91 98765 43210" value={contactForm.phone} onChange={e => setContactForm(p => ({ ...p, phone: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="rahul@email.com" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Preferred City</label>
                <select value={contactForm.city} onChange={e => setContactForm(p => ({ ...p, city: e.target.value }))}>
                  <option value="">Select City</option>
                  {["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Goa"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Budget Range</label>
                <select value={contactForm.budget} onChange={e => setContactForm(p => ({ ...p, budget: e.target.value }))}>
                  <option value="">Select Budget</option>
                  <option>Under ₹50 Lakh</option><option>₹50L – ₹1 Cr</option>
                  <option>₹1 Cr – ₹3 Cr</option><option>₹3 Cr – ₹5 Cr</option><option>Above ₹5 Cr</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Apni requirements batayein..." value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", padding: "18px" }}><span>Request Expert Callback</span></button>
          </form>
        </div>
      </section>

      {/* AWARDS */}
      <section className="awards">
        <div className="section-label">Recognition</div>
        <h2 className="section-title" style={{ textAlign: "center" }}>Industry <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Awards & Recognition</em></h2>
        <div className="awards-row">
          {[
            { icon: "🏆", year: "2025", name: "Best PropTech Startup", by: "NASSCOM Emerge 50" },
            { icon: "🥇", year: "2025", name: "Most Trusted Platform", by: "National Real Estate Awards" },
            { icon: "⭐", year: "2024", name: "Top Real Estate App", by: "Google Play Best of 2024" },
            { icon: "💎", year: "2024", name: "Excellence in Innovation", by: "CII Real Estate Summit" },
            { icon: "🌟", year: "2024", name: "Best User Experience", by: "India PropTech Forum" },
          ].map(a => (
            <div key={a.name} className="award-item">
              <span className="award-icon">{a.icon}</span>
              <div className="award-year">{a.year}</div>
              <div className="award-name">{a.name}</div>
              <div className="award-by">{a.by}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AGENTS */}
      <section style={{ background: "var(--bg)" }}>
        <div className="section-label">Our Experts</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">Meet Our <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Property Advisors</em></h2>
          <p className="section-sub" style={{ textAlign: "right" }}>Certified RERA agents with 10+ years experience.</p>
        </div>
        <div className="agents-grid">
          {[
            { emoji: "👨‍💼", name: "Rajiv Mehta", role: "Luxury Homes Specialist", deals: "840+", value: "₹420 Cr", exp: "14 Yrs", langs: ["Hindi", "English", "Gujarati"] },
            { emoji: "👩‍💼", name: "Priya Iyer", role: "South India Expert", deals: "620+", value: "₹280 Cr", exp: "11 Yrs", langs: ["Tamil", "English", "Telugu"] },
            { emoji: "👨‍🏫", name: "Arjun Bose", role: "NRI Investment Head", deals: "390+", value: "₹510 Cr", exp: "16 Yrs", langs: ["Bengali", "English", "Hindi"] },
            { emoji: "👩‍🔬", name: "Sneha Kulkarni", role: "Commercial Properties", deals: "510+", value: "₹640 Cr", exp: "13 Yrs", langs: ["Marathi", "Hindi", "English"] },
          ].map(a => (
            <div key={a.name} className="agent-card">
              <div className="agent-avatar">{a.emoji}</div>
              <div className="agent-name">{a.name}</div>
              <div className="agent-role">{a.role}</div>
              <div className="agent-stats">
                <div className="agent-stat"><span>{a.deals}</span><label>Deals</label></div>
                <div className="agent-stat"><span>{a.value}</span><label>Value</label></div>
                <div className="agent-stat"><span>{a.exp}</span><label>Exp</label></div>
              </div>
              <div className="agent-langs">{a.langs.map(l => <span key={l} className="lang-tag">{l}</span>)}</div>
              <button className="btn-view" style={{ width: "100%" }} onClick={() => showToast(`${a.name} se connect ho rahe hain...`, "📞")}>Connect →</button>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section style={{ background: "var(--bg2)" }}>
        <div className="section-label">Knowledge Hub</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <h2 className="section-title">Real Estate <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Insights</em></h2>
          <button className="btn-ghost" style={{ padding: "14px 40px" }} onClick={() => showToast("Knowledge hub khul raha hai...", "📚")}>View All Articles</button>
        </div>
        <div className="blog-grid">
          {[
            { emoji: "📈", cat: "Market", date: "Apr 10, 2026", title: "Mumbai Real Estate 2026: Why Prices Are Surging 18% YoY", excerpt: "Expert analysis of why Mumbai's prime markets continue to defy gravity and what it means for buyers and investors." },
            { emoji: "⚖️", cat: "Legal", date: "Apr 8, 2026", title: "RERA 2026 Amendments: What Every Home Buyer Must Know", excerpt: "The new RERA amendments bring stronger penalties for builders and faster refund timelines." },
            { emoji: "💰", cat: "Finance", date: "Apr 5, 2026", title: "SBI vs HDFC vs ICICI: Best Home Loan Rates in April 2026", excerpt: "A comprehensive comparison of home loan rates, processing fees, and hidden charges across India's top 10 lenders." },
          ].map(b => (
            <div key={b.title} className="blog-card">
              <div className="blog-img">{b.emoji}<div className="blog-cat">{b.cat}</div></div>
              <div className="blog-body">
                <div className="blog-date">{b.date}</div>
                <div className="blog-title">{b.title}</div>
                <div className="blog-excerpt">{b.excerpt}</div>
                <div className="blog-read" onClick={() => showToast("Article khul raha hai...", "📰")}>Read Article →</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--bg)", padding: "120px 60px" }}>
        <div className="section-label">Common Questions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <h2 className="section-title">Frequently Asked <em style={{ fontStyle: "italic", color: "var(--gold)", fontFamily: "Playfair Display" }}>Questions</em></h2>
            <p style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>Everything you need to know about buying, selling, and renting property on SmartEstate.</p>
            <div style={{ marginTop: 40 }}><button className="btn-primary" onClick={() => showToast("Full FAQ page khul rahi hai...", "❓")}><span>View All FAQs</span></button></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { q: "Is SmartEstate completely free to use?", a: "Yes, searching and browsing properties is 100% free. Sellers can list properties for free. We charge a small subscription for premium listing visibility." },
              { q: "How do you verify RERA registration of properties?", a: "We integrate directly with official state RERA APIs. Every property undergoes automated cross-verification against live RERA databases before being listed on our platform." },
              { q: "Can NRIs buy property through SmartEstate?", a: "Absolutely. Our dedicated NRI portal includes FEMA compliance guidance, currency conversion, POA templates, and a network of NRI-specialised legal advisors across all states." },
              { q: "How does the zero brokerage model work?", a: "Buyers and sellers connect directly through our platform. We eliminate middlemen entirely. You pay zero brokerage — both parties save 1–2% of property value." },
              { q: "What home loan support do you provide?", a: "We partner with 25+ lenders including SBI, HDFC, and ICICI. Get pre-approved online in 24 hours, compare rates, and get our advisors to negotiate the best deal for you." },
              { q: "Is my personal data safe on SmartEstate?", a: "We use Firebase Auth with OTP verification, AES-256 encryption, and ISO 27001 certified infrastructure. Your data is never sold to third parties." },
            ].map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <div className="newsletter">
        <h2 className="newsletter-title">Stay Ahead of the <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Market</em></h2>
        <p className="newsletter-sub">Get weekly curated property deals, market reports, and investment insights delivered to your inbox.</p>
        <div className="newsletter-form">
          <input placeholder="Enter your email address" type="email" />
          <button onClick={() => showToast("Subscribed! SmartEstate Insider mein welcome hai.", "💌")}>Subscribe</button>
        </div>
        <p className="newsletter-note">Join 1.2 lakh+ investors & homebuyers. No spam. Unsubscribe anytime.</p>
      </div>

      <footer>
        <div className="footer-grid">
          <div>
            <span className="footer-logo">SmartEstate</span>
            <p className="footer-desc">India's most trusted tech-powered real estate platform. 100% RERA verified, zero brokerage, AI-assisted property discovery across 100+ cities.</p>
            <div className="footer-socials">
              {["📘", "📸", "🐦", "▶️", "💼"].map((s, i) => (
                <div key={i} className="social-btn" onClick={() => showToast("Social media page khul raha hai...", s)}>{s}</div>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <h4>Properties</h4>
            <ul className="footer-links">
              {["Buy Properties", "Rent Properties", "New Projects", "Luxury Homes", "Commercial Spaces", "Plots & Land", "NRI Properties", "Affordable Housing"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Top Cities</h4>
            <ul className="footer-links">
              {["Mumbai", "Bengaluru", "Delhi NCR", "Hyderabad", "Pune", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Goa"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              {["About Us", "Our Team", "Careers", "Press & Media", "Blog", "Privacy Policy", "Terms of Service", "RERA Compliance", "Grievance Redressal"].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 SmartEstate Technologies Pvt. Ltd. | CIN: U72900MH2024PTC000001 | All Rights Reserved</div>
          <div className="footer-badges">
            <div className="footer-badge">RERA Compliant</div>
            <div className="footer-badge">SSL Secured</div>
            <div className="footer-badge">ISO 27001</div>
          </div>
        </div>
      </footer>
    </>
  );
}