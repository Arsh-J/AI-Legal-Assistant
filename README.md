<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>LexAI — AI Legal Assistant for India</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
<style>
  :root {
    --ink: #080B12;
    --slate: #0E1218;
    --card: #121820;
    --border: rgba(255,255,255,0.07);
    --amber: #E8A838;
    --amber-dim: rgba(232,168,56,0.12);
    --amber-glow: rgba(232,168,56,0.25);
    --cyan: #38BDF8;
    --green: #4ADE80;
    --red: #F87171;
    --text: #C8D0DC;
    --muted: #6B7A8D;
    --dim: #3A4452;
    --bright: #F0F4FA;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: var(--ink);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Animated background grid */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(232,168,56,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,168,56,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 0;
    pointer-events: none;
  }

  /* Top ambient glow */
  body::after {
    content: '';
    position: fixed;
    top: -200px; left: 50%;
    transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(232,168,56,0.08) 0%, transparent 70%);
    z-index: 0;
    pointer-events: none;
  }

  canvas#bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    opacity: 0.4;
  }

  .wrap {
    position: relative;
    z-index: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 28px 120px;
  }

  /* ── HERO ── */
  .hero {
    padding: 100px 0 70px;
    text-align: center;
    position: relative;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--amber-dim);
    border: 1px solid rgba(232,168,56,0.3);
    border-radius: 30px;
    padding: 6px 16px;
    font-size: 11px;
    font-weight: 600;
    color: var(--amber);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 28px;
    animation: fadeDown 0.6s ease both;
  }

  .badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 8px var(--green);
    animation: pulse 2s ease infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }

  .hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(44px, 7vw, 80px);
    font-weight: 900;
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 6px;
    animation: fadeDown 0.7s 0.1s ease both;
  }

  .hero-title .lex { color: var(--bright); }
  .hero-title .ai {
    color: var(--amber);
    text-shadow: 0 0 40px rgba(232,168,56,0.5);
  }

  .hero-sub {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--muted);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 24px;
    animation: fadeDown 0.7s 0.15s ease both;
  }

  .hero-desc {
    font-size: 17px;
    color: var(--muted);
    line-height: 1.8;
    max-width: 600px;
    margin: 0 auto 44px;
    animation: fadeDown 0.7s 0.2s ease both;
  }

  .hero-desc strong { color: var(--text); font-weight: 500; }

  .hero-badges {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 52px;
    animation: fadeDown 0.7s 0.25s ease both;
  }

  .pill {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 6px 14px;
    font-size: 12px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    transition: all 0.2s;
  }
  .pill:hover {
    border-color: rgba(232,168,56,0.3);
    color: var(--amber);
    background: var(--amber-dim);
  }

  /* Scales animation */
  .scales-wrap {
    position: relative;
    width: 160px;
    height: 160px;
    margin: 0 auto 52px;
    animation: fadeDown 0.7s 0.05s ease both;
  }

  .scales-svg { width: 100%; height: 100%; filter: drop-shadow(0 0 20px rgba(232,168,56,0.4)); }

  .scale-left { animation: scaleLeft 3s ease-in-out infinite; transform-origin: center top; }
  .scale-right { animation: scaleRight 3s ease-in-out infinite; transform-origin: center top; }

  @keyframes scaleLeft {
    0%,100%{ transform: rotate(-8deg) translateY(0); }
    50%{ transform: rotate(8deg) translateY(6px); }
  }
  @keyframes scaleRight {
    0%,100%{ transform: rotate(8deg) translateY(6px); }
    50%{ transform: rotate(-8deg) translateY(0); }
  }

  /* Scan line on orb */
  .orb-scan {
    animation: scan 2s linear infinite;
  }
  @keyframes scan {
    from { stroke-dashoffset: 200; }
    to { stroke-dashoffset: -200; }
  }

  /* ── SECTION ── */
  section { margin-bottom: 72px; animation: fadeUp 0.6s ease both; }

  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: var(--amber);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(232,168,56,0.3), transparent);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 4vw, 38px);
    font-weight: 700;
    color: var(--bright);
    letter-spacing: -1px;
    margin-bottom: 24px;
    line-height: 1.2;
  }

  /* ── FEATURE GRID ── */
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }

  .feat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
  }

  .feat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(232,168,56,0.4), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .feat-card:hover {
    border-color: rgba(232,168,56,0.25);
    background: #151C26;
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  .feat-card:hover::before { opacity: 1; }

  .feat-icon {
    font-size: 28px;
    margin-bottom: 14px;
    display: block;
  }

  .feat-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--bright);
    margin-bottom: 8px;
    letter-spacing: -0.2px;
  }

  .feat-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
  }

  /* ── TECH STACK TABLE ── */
  .tech-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  .tech-table thead tr {
    background: rgba(232,168,56,0.08);
    border-bottom: 1px solid rgba(232,168,56,0.2);
  }

  .tech-table th {
    padding: 12px 18px;
    text-align: left;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--amber);
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .tech-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }

  .tech-table tbody tr:last-child { border-bottom: none; }
  .tech-table tbody tr:hover { background: rgba(255,255,255,0.02); }

  .tech-table td {
    padding: 13px 18px;
    color: var(--text);
    vertical-align: middle;
  }

  .tech-table td:first-child {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--muted);
    width: 140px;
  }

  .tech-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .chip {
    background: var(--slate);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 12px;
    font-family: 'DM Mono', monospace;
    color: var(--cyan);
    transition: all 0.2s;
  }

  .chip:hover {
    border-color: rgba(56,189,248,0.3);
    background: rgba(56,189,248,0.05);
  }

  /* ── AGENTS ── */
  .agents { display: flex; flex-direction: column; gap: 12px; }

  .agent-row {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px 22px;
    display: grid;
    grid-template-columns: 52px 1fr;
    gap: 18px;
    align-items: start;
    transition: all 0.25s;
    cursor: default;
  }

  .agent-row:hover {
    border-color: rgba(232,168,56,0.22);
    background: #151C26;
  }

  .agent-num {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: var(--amber-dim);
    border: 1px solid rgba(232,168,56,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: var(--amber);
    flex-shrink: 0;
  }

  .agent-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--bright);
    margin-bottom: 5px;
  }

  .agent-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.65;
  }

  .agent-tag {
    display: inline-block;
    margin-top: 8px;
    background: rgba(74,222,128,0.07);
    border: 1px solid rgba(74,222,128,0.18);
    border-radius: 20px;
    padding: 2px 10px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: var(--green);
  }

  /* ── SETUP STEPS ── */
  .steps { display: flex; flex-direction: column; gap: 16px; }

  .step {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    transition: border-color 0.25s;
  }

  .step:hover { border-color: rgba(232,168,56,0.2); }

  .step-header {
    padding: 16px 22px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    user-select: none;
  }

  .step-n {
    width: 30px; height: 30px;
    border-radius: 8px;
    background: var(--amber);
    color: #080B12;
    font-weight: 800;
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-family: 'DM Mono', monospace;
  }

  .step-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--bright);
    flex: 1;
  }

  .step-toggle {
    color: var(--muted);
    font-size: 16px;
    transition: transform 0.3s;
  }

  .step.open .step-toggle { transform: rotate(180deg); }

  .step-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.35s ease;
  }

  .step.open .step-body { max-height: 400px; }

  .code-block {
    margin: 0;
    padding: 18px 22px;
    background: #090C12;
    border-top: 1px solid var(--border);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 1.8;
    color: var(--green);
    overflow-x: auto;
  }

  .code-block .comment { color: var(--dim); }
  .code-block .cmd { color: var(--cyan); }
  .code-block .path { color: var(--amber); }

  /* ── STRUCTURE ── */
  .file-tree {
    background: #090C12;
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 24px 28px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    line-height: 2;
    overflow-x: auto;
  }

  .ft-dir { color: var(--amber); font-weight: 500; }
  .ft-file { color: var(--cyan); }
  .ft-comment { color: var(--dim); font-size: 11px; }
  .ft-line { color: var(--dim); }

  /* ── STAT BAR ── */
  .stat-bar {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 18px;
    overflow: hidden;
    margin-bottom: 52px;
  }

  .stat {
    padding: 26px 20px;
    text-align: center;
    border-right: 1px solid var(--border);
    transition: background 0.2s;
  }

  .stat:last-child { border-right: none; }
  .stat:hover { background: rgba(232,168,56,0.03); }

  .stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 900;
    color: var(--bright);
    letter-spacing: -1px;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-val span { color: var(--amber); }

  .stat-label {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.5px;
    font-family: 'DM Mono', monospace;
  }

  /* ── DEPLOY TABLE ── */
  .deploy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .deploy-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 22px 20px;
    text-align: center;
    transition: all 0.25s;
  }

  .deploy-card:hover {
    border-color: rgba(232,168,56,0.25);
    transform: translateY(-2px);
  }

  .deploy-icon { font-size: 28px; margin-bottom: 10px; }

  .deploy-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--bright);
    margin-bottom: 4px;
  }

  .deploy-role {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .deploy-badge {
    display: inline-block;
    background: rgba(74,222,128,0.08);
    border: 1px solid rgba(74,222,128,0.2);
    border-radius: 20px;
    padding: 3px 12px;
    font-size: 11px;
    color: var(--green);
    font-family: 'DM Mono', monospace;
  }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding: 40px 28px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  footer .logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 900;
    color: var(--amber);
    margin-bottom: 10px;
  }

  footer p {
    font-size: 13px;
    color: var(--dim);
    line-height: 1.7;
  }

  /* ── ANIMATIONS ── */
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Scroll reveal */
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }

  /* ── NAV ── */
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(8,11,18,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 28px;
  }

  .nav-inner {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
  }

  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 900;
    color: var(--amber);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .nav-links {
    display: flex;
    gap: 4px;
  }

  .nav-links a {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 13px;
    color: var(--muted);
    text-decoration: none;
    transition: all 0.2s;
    font-weight: 500;
  }

  .nav-links a:hover {
    color: var(--amber);
    background: var(--amber-dim);
  }

  /* ── DISCLAIMER ── */
  .disclaimer {
    background: rgba(232,168,56,0.05);
    border: 1px solid rgba(232,168,56,0.15);
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.65;
  }

  .disclaimer strong { color: var(--amber); }

  /* ── COPY BTN ── */
  .copy-btn {
    position: absolute;
    top: 12px; right: 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    color: var(--muted);
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    transition: all 0.2s;
  }

  .copy-btn:hover { color: var(--amber); border-color: rgba(232,168,56,0.3); }

  .code-wrap { position: relative; }

  @media (max-width: 600px) {
    .nav-links { display: none; }
    .stat-bar { grid-template-columns: 1fr 1fr; }
    .stat:nth-child(2) { border-right: none; }
    .stat:nth-child(3) { border-top: 1px solid var(--border); }
  }
</style>
</head>
<body>

<canvas id="bg"></canvas>

<!-- NAV -->
<nav>
  <div class="nav-inner">
    <div class="nav-logo">⚖️ LexAI</div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#agents">AI Pipeline</a>
      <a href="#stack">Tech Stack</a>
      <a href="#setup">Setup</a>
      <a href="#structure">Structure</a>
      <a href="#deploy">Deploy</a>
    </div>
  </div>
</nav>

<div class="wrap">

  <!-- HERO -->
  <div class="hero">
    <div class="badge">
      <span class="badge-dot"></span>
      India · Indian Penal Code · Google Gemini AI
    </div>

    <!-- Animated Scales SVG -->
    <div class="scales-wrap">
      <svg class="scales-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Glow filter -->
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <radialGradient id="orbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#E8A838" stop-opacity="0.15"/>
            <stop offset="100%" stop-color="#E8A838" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Outer ring -->
        <circle cx="80" cy="80" r="72" stroke="#E8A838" stroke-width="0.5" stroke-opacity="0.2"/>
        <circle cx="80" cy="80" r="58" stroke="#E8A838" stroke-width="0.5" stroke-opacity="0.1"/>

        <!-- Scanning circle -->
        <circle cx="80" cy="80" r="65" stroke="#E8A838" stroke-width="1.5"
          stroke-dasharray="20 200" stroke-opacity="0.6"
          class="orb-scan" filter="url(#glow)"/>

        <!-- Center orb background -->
        <circle cx="80" cy="80" r="45" fill="url(#orbGrad)"/>
        <circle cx="80" cy="80" r="45" stroke="#E8A838" stroke-width="1" stroke-opacity="0.3"/>

        <!-- The beam / staff -->
        <line x1="80" y1="52" x2="80" y2="125" stroke="#E8A838" stroke-width="2" filter="url(#glow)" stroke-opacity="0.9"/>
        <!-- Top pivot -->
        <circle cx="80" cy="52" r="4" fill="#E8A838" filter="url(#glow2)"/>
        <!-- Bottom base -->
        <rect x="66" y="122" width="28" height="3" rx="1.5" fill="#E8A838" fill-opacity="0.6"/>
        <rect x="72" y="125" width="16" height="2" rx="1" fill="#E8A838" fill-opacity="0.3"/>

        <!-- Left arm -->
        <line x1="80" y1="52" x2="44" y2="66" stroke="#E8A838" stroke-width="1.5" stroke-opacity="0.7"/>
        <!-- Right arm -->
        <line x1="80" y1="52" x2="116" y2="66" stroke="#E8A838" stroke-width="1.5" stroke-opacity="0.7"/>

        <!-- Left pan -->
        <g class="scale-left">
          <line x1="44" y1="66" x2="34" y2="82" stroke="#E8A838" stroke-width="1" stroke-opacity="0.5"/>
          <line x1="44" y1="66" x2="54" y2="82" stroke="#E8A838" stroke-width="1" stroke-opacity="0.5"/>
          <path d="M30 82 Q44 88 58 82" stroke="#E8A838" stroke-width="1.5" fill="rgba(232,168,56,0.08)" stroke-opacity="0.8" filter="url(#glow)"/>
        </g>

        <!-- Right pan -->
        <g class="scale-right">
          <line x1="116" y1="66" x2="106" y2="82" stroke="#E8A838" stroke-width="1" stroke-opacity="0.5"/>
          <line x1="116" y1="66" x2="126" y2="82" stroke="#E8A838" stroke-width="1" stroke-opacity="0.5"/>
          <path d="M102 82 Q116 88 130 82" stroke="#E8A838" stroke-width="1.5" fill="rgba(232,168,56,0.08)" stroke-opacity="0.8" filter="url(#glow)"/>
        </g>

        <!-- Network nodes inside orb -->
        <circle cx="80" cy="68" r="2.5" fill="#E8A838" filter="url(#glow)"/>
        <circle cx="66" cy="76" r="2" fill="#E8A838" fill-opacity="0.7"/>
        <circle cx="94" cy="76" r="2" fill="#E8A838" fill-opacity="0.7"/>
        <circle cx="72" cy="90" r="2" fill="#38BDF8" filter="url(#glow)"/>
        <circle cx="88" cy="90" r="2" fill="#38BDF8" filter="url(#glow)"/>
        <circle cx="80" cy="80" r="3" fill="#E8A838" filter="url(#glow2)"/>

        <!-- Network lines inside orb -->
        <line x1="80" y1="68" x2="66" y2="76" stroke="#E8A838" stroke-width="0.8" stroke-opacity="0.4"/>
        <line x1="80" y1="68" x2="94" y2="76" stroke="#E8A838" stroke-width="0.8" stroke-opacity="0.4"/>
        <line x1="66" y1="76" x2="80" y2="80" stroke="#E8A838" stroke-width="0.8" stroke-opacity="0.3"/>
        <line x1="94" y1="76" x2="80" y2="80" stroke="#E8A838" stroke-width="0.8" stroke-opacity="0.3"/>
        <line x1="80" y1="80" x2="72" y2="90" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
        <line x1="80" y1="80" x2="88" y2="90" stroke="#38BDF8" stroke-width="0.8" stroke-opacity="0.4"/>
      </svg>
    </div>

    <h1 class="hero-title">
      <span class="lex">Lex</span><span class="ai">AI</span>
    </h1>
    <p class="hero-sub">AI Legal Assistant for India</p>

    <p class="hero-desc">
      Describe your legal situation in <strong>plain language</strong>. Five specialized AI agents powered by
      <strong>Google Gemini</strong> identify relevant <strong>IPC sections</strong>, predict outcomes,
      advise precautions, and generate a downloadable legal report — in seconds.
    </p>

    <div class="hero-badges">
      <span class="pill">Next.js 14</span>
      <span class="pill">FastAPI</span>
      <span class="pill">Gemini 1.5 Flash</span>
      <span class="pill">SQLite</span>
      <span class="pill">JWT Auth</span>
      <span class="pill">PDF + DOCX Reports</span>
      <span class="pill">Voice Input</span>
    </div>
  </div>

  <!-- STAT BAR -->
  <div class="stat-bar reveal">
    <div class="stat">
      <div class="stat-val">5<span>00+</span></div>
      <div class="stat-label">IPC Sections</div>
    </div>
    <div class="stat">
      <div class="stat-val"><span>5</span></div>
      <div class="stat-label">AI Agents</div>
    </div>
    <div class="stat">
      <div class="stat-val">&lt;<span>15</span>s</div>
      <div class="stat-label">Analysis Time</div>
    </div>
    <div class="stat">
      <div class="stat-val"><span>2</span></div>
      <div class="stat-label">Report Formats</div>
    </div>
  </div>

  <!-- FEATURES -->
  <section id="features" class="reveal">
    <div class="section-label">What It Does</div>
    <h2 class="section-title">Everything You Need,<br/>Explained Simply</h2>
    <div class="feature-grid">
      <div class="feat-card">
        <span class="feat-icon">⚖️</span>
        <div class="feat-title">Legal Case Analysis</div>
        <div class="feat-desc">Describe your situation in plain English or speak it aloud. Five AI agents process it sequentially and return a full structured legal breakdown.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">📜</span>
        <div class="feat-title">IPC Section Identification</div>
        <div class="feat-desc">Retrieves the most relevant Indian Penal Code sections with descriptions, punishments, fines, and direct Indian Kanoon reference links.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🔮</span>
        <div class="feat-title">Outcome Prediction</div>
        <div class="feat-desc">Lists realistic possible legal outcomes — arrest, bail conditions, trial timeline, fines, and imprisonment — based on applicable sections.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🛡️</span>
        <div class="feat-title">Precaution Advice</div>
        <div class="feat-desc">Tells you exactly what to do and not do right now to protect your legal position before consulting an advocate.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">✅</span>
        <div class="feat-title">Recommended Actions</div>
        <div class="feat-desc">Step-by-step guidance on concrete next steps — filing FIR, sending legal notice, approaching consumer forum, and more.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🕒</span>
        <div class="feat-title">Case History</div>
        <div class="feat-desc">Every analysis saved to your account. Delete individual cases or clear all history. Access any past report anytime.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">📄</span>
        <div class="feat-title">Report Downloads</div>
        <div class="feat-desc">Download your full analysis as a professionally formatted PDF or DOCX file — ready to share with your lawyer.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🎙️</span>
        <div class="feat-title">Voice Input</div>
        <div class="feat-desc">Speak your case description directly into the microphone. Text is transcribed in real time using the Web Speech API.</div>
      </div>
      <div class="feat-card">
        <span class="feat-icon">🔐</span>
        <div class="feat-title">Secure User Accounts</div>
        <div class="feat-desc">Signup, login, persistent JWT sessions (1-year validity). bcrypt password hashing. Stay logged in until you sign out.</div>
      </div>
    </div>
  </section>

  <!-- AI PIPELINE -->
  <section id="agents" class="reveal">
    <div class="section-label">How the AI Works</div>
    <h2 class="section-title">The 5-Agent<br/>AI Pipeline</h2>
    <div class="agents">
      <div class="agent-row">
        <div class="agent-num">01</div>
        <div>
          <div class="agent-name">🧠 Case Understanding Agent</div>
          <div class="agent-desc">Classifies the legal domain (Criminal Fraud, Labour Law, Cyber Crime, Property Law, etc.), extracts key legal terms, and assesses severity. Sets the context for all subsequent agents.</div>
          <span class="agent-tag">→ legal_category + keywords + severity</span>
        </div>
      </div>
      <div class="agent-row">
        <div class="agent-num">02</div>
        <div>
          <div class="agent-name">📚 Legal Retrieval Agent</div>
          <div class="agent-desc">Identifies 3–4 most relevant IPC sections or legal provisions. Returns section number, title, description, punishment, fine amount, and Indian Kanoon reference link for each.</div>
          <span class="agent-tag">→ IPC sections array with full details</span>
        </div>
      </div>
      <div class="agent-row">
        <div class="agent-num">03</div>
        <div>
          <div class="agent-name">⚖️ Outcome Prediction Agent</div>
          <div class="agent-desc">Based on the applicable sections, predicts 4–5 realistic legal outcomes including FIR filing, arrest likelihood, bail conditions, trial timeline, and possible sentencing.</div>
          <span class="agent-tag">→ possible_outcomes list</span>
        </div>
      </div>
      <div class="agent-row">
        <div class="agent-num">04</div>
        <div>
          <div class="agent-name">🛡️ Precaution Advisor Agent</div>
          <div class="agent-desc">Advises on immediate precautions (what to preserve, what not to do) and recommended concrete next steps tailored to the specific legal situation and jurisdiction.</div>
          <span class="agent-tag">→ precautions + recommended_actions</span>
        </div>
      </div>
      <div class="agent-row">
        <div class="agent-num">05</div>
        <div>
          <div class="agent-name">✍️ Case Summarizer Agent</div>
          <div class="agent-desc">Synthesizes everything into a 3-sentence plain English summary — no legal jargon — that any citizen can read and immediately understand what applies to their situation.</div>
          <span class="agent-tag">→ plain English summary</span>
        </div>
      </div>
    </div>
    <br/>
    <div class="disclaimer">
      <strong>Fallback System:</strong> Every agent has intelligent mock responses using keyword detection. If Gemini API is unavailable or no key is configured, the app returns appropriate IPC sections based on query keywords — it never crashes.
    </div>
  </section>

  <!-- TECH STACK -->
  <section id="stack" class="reveal">
    <div class="section-label">Built With</div>
    <h2 class="section-title">Technology Stack</h2>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;overflow:hidden;">
      <table class="tech-table">
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technologies</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frontend</td>
            <td><div class="tech-chips">
              <span class="chip">Next.js 14</span>
              <span class="chip">React 18</span>
              <span class="chip">TypeScript</span>
              <span class="chip">Tailwind CSS</span>
            </div></td>
          </tr>
          <tr>
            <td>Backend</td>
            <td><div class="tech-chips">
              <span class="chip">FastAPI</span>
              <span class="chip">Python 3.11</span>
              <span class="chip">SQLAlchemy</span>
              <span class="chip">Pydantic v2</span>
            </div></td>
          </tr>
          <tr>
            <td>Database</td>
            <td><div class="tech-chips">
              <span class="chip">SQLite (dev)</span>
              <span class="chip">PostgreSQL (prod)</span>
            </div></td>
          </tr>
          <tr>
            <td>AI</td>
            <td><div class="tech-chips">
              <span class="chip">Google Gemini 1.5 Flash</span>
              <span class="chip">5-Agent Pipeline</span>
              <span class="chip">Mock Fallbacks</span>
            </div></td>
          </tr>
          <tr>
            <td>Auth</td>
            <td><div class="tech-chips">
              <span class="chip">JWT (python-jose)</span>
              <span class="chip">bcrypt</span>
              <span class="chip">1-year sessions</span>
            </div></td>
          </tr>
          <tr>
            <td>Reports</td>
            <td><div class="tech-chips">
              <span class="chip">ReportLab (PDF)</span>
              <span class="chip">python-docx (DOCX)</span>
            </div></td>
          </tr>
          <tr>
            <td>Voice</td>
            <td><div class="tech-chips">
              <span class="chip">Web Speech API</span>
              <span class="chip">Real-time Transcription</span>
            </div></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- PROJECT STRUCTURE -->
  <section id="structure" class="reveal">
    <div class="section-label">Codebase</div>
    <h2 class="section-title">Project Structure</h2>
    <div class="code-wrap">
      <button class="copy-btn" onclick="copyTree()">copy</button>
      <div class="file-tree" id="tree-block">
<span class="ft-dir">ai-legal-assistant/</span>
<span class="ft-line">├── </span><span class="ft-dir">backend/</span>
<span class="ft-line">│   ├── </span><span class="ft-file">main.py</span>              <span class="ft-comment">← FastAPI app, CORS, router registration</span>
<span class="ft-line">│   ├── </span><span class="ft-file">auth_utils.py</span>        <span class="ft-comment">← JWT creation/validation, bcrypt hashing</span>
<span class="ft-line">│   ├── </span><span class="ft-file">models.py</span>            <span class="ft-comment">← SQLAlchemy ORM: User, UserQuery, IPCSection</span>
<span class="ft-line">│   ├── </span><span class="ft-file">schemas.py</span>           <span class="ft-comment">← Pydantic request/response schemas</span>
<span class="ft-line">│   ├── </span><span class="ft-file">database.py</span>          <span class="ft-comment">← SQLite engine, session factory</span>
<span class="ft-line">│   ├── </span><span class="ft-file">requirements.txt</span>
<span class="ft-line">│   ├── </span><span class="ft-file">.env.example</span>
<span class="ft-line">│   ├── </span><span class="ft-dir">routers/</span>
<span class="ft-line">│   │   ├── </span><span class="ft-file">auth.py</span>          <span class="ft-comment">← POST /signup, /login, GET /me</span>
<span class="ft-line">│   │   ├── </span><span class="ft-file">query.py</span>         <span class="ft-comment">← POST /analyze, GET /history, GET /:id</span>
<span class="ft-line">│   │   └── </span><span class="ft-file">report.py</span>        <span class="ft-comment">← GET /download/:id/pdf and /docx</span>
<span class="ft-line">│   └── </span><span class="ft-dir">agents/</span>
<span class="ft-line">│       └── </span><span class="ft-file">orchestrator.py</span>  <span class="ft-comment">← 5 AI agents + mock fallbacks</span>
<span class="ft-line">│</span>
<span class="ft-line">└── </span><span class="ft-dir">frontend/</span>
<span class="ft-line">    └── </span><span class="ft-dir">src/app/</span>
<span class="ft-line">        ├── </span><span class="ft-file">page.tsx</span>             <span class="ft-comment">← Landing page + canvas animation</span>
<span class="ft-line">        ├── </span><span class="ft-file">layout.tsx</span>           <span class="ft-comment">← Root layout, fonts, toaster</span>
<span class="ft-line">        ├── </span><span class="ft-dir">login/</span><span class="ft-file">page.tsx</span>      <span class="ft-comment">← Split-panel login</span>
<span class="ft-line">        ├── </span><span class="ft-dir">signup/</span><span class="ft-file">page.tsx</span>     <span class="ft-comment">← Signup + password strength meter</span>
<span class="ft-line">        ├── </span><span class="ft-dir">dashboard/</span><span class="ft-file">page.tsx</span>  <span class="ft-comment">← Query form + case history sidebar</span>
<span class="ft-line">        ├── </span><span class="ft-dir">case/[id]/</span><span class="ft-file">page.tsx</span>  <span class="ft-comment">← Analysis result + PDF/DOCX download</span>
<span class="ft-line">        └── </span><span class="ft-dir">lib/</span><span class="ft-file">api.ts</span>         <span class="ft-comment">← Axios instance, token helpers, all API calls</span>
      </div>
    </div>
  </section>

  <!-- SETUP -->
  <section id="setup" class="reveal">
    <div class="section-label">Getting Started</div>
    <h2 class="section-title">Local Setup<br/>in 3 Steps</h2>
    <div class="steps">

      <div class="step open" onclick="toggleStep(this)">
        <div class="step-header">
          <div class="step-n">1</div>
          <div class="step-title">Create Backend .env File (one time only)</div>
          <div class="step-toggle">▾</div>
        </div>
        <div class="step-body">
          <pre class="code-block"><span class="comment"># Windows</span>
<span class="cmd">cd</span> <span class="path">ai-legal-assistant/backend</span>
<span class="cmd">copy</span> .env.example .env

<span class="comment"># Mac / Linux</span>
<span class="cmd">cp</span> .env.example .env

<span class="comment"># Open .env and confirm these 3 lines:</span>
DATABASE_URL=sqlite:///./legal_assistant.db
SECRET_KEY=any-long-random-string-here
GEMINI_API_KEY=your_key_here  <span class="comment"># leave blank for mock mode</span></pre>
        </div>
      </div>

      <div class="step" onclick="toggleStep(this)">
        <div class="step-header">
          <div class="step-n">2</div>
          <div class="step-title">Start Backend — Terminal 1</div>
          <div class="step-toggle">▾</div>
        </div>
        <div class="step-body">
          <pre class="code-block"><span class="cmd">cd</span> <span class="path">ai-legal-assistant/backend</span>
<span class="cmd">python -m venv</span> venv

<span class="comment"># Windows:</span>
venv\Scripts\activate
<span class="comment"># Mac/Linux:</span>
source venv/bin/activate

<span class="cmd">pip install</span> -r requirements.txt
<span class="cmd">uvicorn</span> main:app --reload --port 8000

<span class="comment"># ✅ Should show: Uvicorn running on http://127.0.0.1:8000</span></pre>
        </div>
      </div>

      <div class="step" onclick="toggleStep(this)">
        <div class="step-header">
          <div class="step-n">3</div>
          <div class="step-title">Start Frontend — Terminal 2</div>
          <div class="step-toggle">▾</div>
        </div>
        <div class="step-body">
          <pre class="code-block"><span class="cmd">cd</span> <span class="path">ai-legal-assistant/frontend</span>
<span class="cmd">npm install</span>
<span class="cmd">npm run dev</span>

<span class="comment"># ✅ Open: http://localhost:3000
# ✅ API Docs: http://localhost:8000/docs</span></pre>
        </div>
      </div>

    </div>
  </section>

  <!-- DEPLOY -->
  <section id="deploy" class="reveal">
    <div class="section-label">Deployment</div>
    <h2 class="section-title">Deploy for Free</h2>
    <div class="deploy-grid">
      <div class="deploy-card">
        <div class="deploy-icon">▲</div>
        <div class="deploy-name">Vercel</div>
        <div class="deploy-role">Frontend · Next.js</div>
        <div class="deploy-badge">Free Forever</div>
      </div>
      <div class="deploy-card">
        <div class="deploy-icon">🌐</div>
        <div class="deploy-name">Render</div>
        <div class="deploy-role">Backend · FastAPI</div>
        <div class="deploy-badge">Free Tier</div>
      </div>
      <div class="deploy-card">
        <div class="deploy-icon">🐘</div>
        <div class="deploy-name">Supabase</div>
        <div class="deploy-role">Database · PostgreSQL</div>
        <div class="deploy-badge">500MB Free</div>
      </div>
      <div class="deploy-card">
        <div class="deploy-icon">🤖</div>
        <div class="deploy-name">Google AI Studio</div>
        <div class="deploy-role">Gemini API Key</div>
        <div class="deploy-badge">Free Tier</div>
      </div>
    </div>
  </section>

  <!-- DISCLAIMER -->
  <section class="reveal">
    <div class="disclaimer">
      ⚠️ <strong>Legal Disclaimer:</strong> LexAI provides general legal information only and does not constitute legal advice. The analysis is AI-generated and may not reflect current law or all applicable regulations. For serious legal matters, always consult a qualified advocate or legal professional licensed in your jurisdiction.
    </div>
  </section>

</div>

<footer>
  <div class="logo">⚖️ LexAI</div>
  <p>AI Legal Assistant for India &nbsp;·&nbsp; Powered by Google Gemini 1.5 Flash<br/>
  Built with Next.js · FastAPI · SQLite · JWT · ReportLab</p>
</footer>

<script>
// ── Particle canvas background ──────────────────────────────────────────────
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * 1920, y: Math.random() * 1080,
    vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 1.5 + 0.5, alpha: Math.random() * 0.35 + 0.05
  });
}

(function draw() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232,168,56,${p.alpha})`;
    ctx.fill();
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 140) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(232,168,56,${0.08 * (1 - d/140)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
})();

// ── Scroll reveal ────────────────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// ── Step accordion ───────────────────────────────────────────────────────────
function toggleStep(el) {
  el.classList.toggle('open');
}

// ── Copy tree ────────────────────────────────────────────────────────────────
function copyTree() {
  const text = document.getElementById('tree-block').innerText;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'copied!';
    btn.style.color = 'var(--green)';
    setTimeout(() => { btn.textContent = 'copy'; btn.style.color = ''; }, 2000);
  });
}

// ── Stagger feature cards ────────────────────────────────────────────────────
document.querySelectorAll('.feat-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.07}s`;
  card.style.opacity = '0';
  card.style.transform = 'translateY(16px)';
  card.style.transition = `opacity 0.5s ${i*0.07}s ease, transform 0.5s ${i*0.07}s ease, border-color 0.25s, background 0.25s, box-shadow 0.25s`;

  const cardObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }
  }, { threshold: 0.1 });
  cardObserver.observe(card);
});

// ── Agent row stagger ────────────────────────────────────────────────────────
document.querySelectorAll('.agent-row').forEach((row, i) => {
  row.style.opacity = '0';
  row.style.transform = 'translateX(-16px)';
  row.style.transition = `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease, border-color 0.25s, background 0.25s`;

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      row.style.opacity = '1';
      row.style.transform = 'translateX(0)';
    }
  }, { threshold: 0.1 });
  obs.observe(row);
});
</script>
</body>
</html>
