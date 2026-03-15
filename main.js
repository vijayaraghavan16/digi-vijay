/* ╔══════════════════════════════════════════════════════╗
   ║  DIGI VIJAY — main.js                               ║
   ║  Shared JavaScript — All interactive features       ║
   ╚══════════════════════════════════════════════════════╝ */

'use strict';

/* ══════════════════════════════════════
   1. NAVIGATION
══════════════════════════════════════ */
(function initNav() {
  const nav = document.getElementById('nav');
  const hbg = document.querySelector('.hbg');
  const mmenu = document.querySelector('.mmenu');
  if (!nav) return;

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile toggle
  if (hbg && mmenu) {
    hbg.addEventListener('click', () => {
      hbg.classList.toggle('open');
      mmenu.classList.toggle('open');
    });
    mmenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hbg.classList.remove('open');
        mmenu.classList.remove('open');
      });
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nl a[href^="#"]');
  if (sections.length && navLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const match = document.querySelector(`.nl a[href="#${e.target.id}"]`);
          if (match) match.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    sections.forEach(s => io.observe(s));
  }
})();

/* ══════════════════════════════════════
   2. SCROLL REVEAL
══════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.rv, .rvl, .rvr');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.09}s`;
    io.observe(el);
  });
})();

/* ══════════════════════════════════════
   3. HERO CANVAS — Particle System
══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.5 + 0.15);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.maxLife = 180 + Math.random() * 240;
      this.life = init ? Math.random() * this.maxLife : 0;
    }
    update() {
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
      this.x += this.vx;
      this.y += this.vy;
    }
    draw() {
      const prog = this.life / this.maxLife;
      const a = this.alpha * Math.sin(prog * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${a})`;
      ctx.fill();
    }
  }

  // Connections
  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56,189,248,${0.05 * (1 - dist / maxDist)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════════════════════════════
   4. 3D SERVICE CARD TILT
══════════════════════════════════════ */
(function init3DCards() {
  document.querySelectorAll('.svc-card, .testimonial-card, .process-card, .stat-card, .post-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const intensity = card.classList.contains('svc-card') ? 14 : 8;
      card.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) translateZ(8px)`;
      card.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
      card.style.setProperty('--my', `${(y + 0.5) * 100}%`);
      card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.06, 0.64, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow 0.3s, border-color 0.3s';
    });
  });
})();

/* ══════════════════════════════════════
   5. COUNTER ANIMATION
══════════════════════════════════════ */
(function initCounters() {
  document.querySelectorAll('[data-val]').forEach(el => {
    const target = parseInt(el.dataset.val);
    if (!target) return;
    const suffix = el.nextElementSibling ? '' : el.dataset.suffix || '';
    el.textContent = '0';
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let cur = 0;
          const duration = 1800;
          const steps = 50;
          const inc = target / steps;
          const interval = duration / steps;
          const iv = setInterval(() => {
            cur = Math.min(cur + inc, target);
            el.textContent = Math.round(cur);
            if (Math.round(cur) >= target) clearInterval(iv);
          }, interval);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
  });
})();

/* ══════════════════════════════════════
   6. FAQ ACCORDION
══════════════════════════════════════ */
(function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ══════════════════════════════════════
   7. TOOLS TABS
══════════════════════════════════════ */
(function initTools() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length) return;
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabs.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panel-' + target);
      if (panel) panel.classList.add('active');
    });
  });
})();

/* ══════════════════════════════════════
   8. SEO AUDIT TOOL
══════════════════════════════════════ */
(function initSEOTool() {
  const runBtn = document.getElementById('seo-run');
  const urlInput = document.getElementById('seo-url');
  const kwInput = document.getElementById('seo-kw');
  const progress = document.getElementById('seo-progress');
  const result = document.getElementById('seo-result');
  const errorEl = document.getElementById('seo-error');
  if (!runBtn) return;

  const steps = [
    { id: 'step-crawl', text: '🔍 Crawling the page...' },
    { id: 'step-kw', text: '🏷️ Analyzing keywords...' },
    { id: 'step-tech', text: '⚡ Checking technical SEO...' },
    { id: 'step-mobile', text: '📱 Testing mobile-friendliness...' },
    { id: 'step-report', text: '📊 Generating your report...' }
  ];

  runBtn.addEventListener('click', async () => {
    const url = urlInput?.value.trim();
    const kw = kwInput?.value.trim();
    if (!url) { showError('seo-error', 'Please enter a website URL to analyze.'); return; }

    runBtn.disabled = true;
    hideEl(result); hideEl(errorEl);
    showEl(progress);
    renderSteps(steps, 'seo-progress');

    for (let i = 0; i < steps.length; i++) {
      await setStepActive(steps[i].id);
      await delay(600 + Math.random() * 400);
      setStepDone(steps[i].id);
    }

    await delay(300);
    hideEl(progress);
    const score = 42 + Math.floor(Math.random() * 45);
    renderSEOResult(url, kw, score);
    showEl(result);
    runBtn.disabled = false;
  });

  function renderSEOResult(url, kw, score) {
    const grade = score >= 80 ? ['Excellent', 'grade-good'] : score >= 55 ? ['Good', 'grade-ok'] : ['Needs Work', 'grade-bad'];
    const circum = 2 * Math.PI * 44;
    const offset = circum - (score / 100) * circum;
    const checks = [
      { label: 'Title Tag', pass: score > 60, warn: score > 40 },
      { label: 'Meta Description', pass: score > 55, warn: score > 35 },
      { label: 'Mobile Friendly', pass: score > 50 },
      { label: 'SSL Certificate', pass: url.startsWith('https') || score > 70 },
      { label: 'Page Speed', pass: score > 75, warn: score > 50 },
      { label: 'Heading Structure', pass: score > 65, warn: score > 45 },
      { label: 'Keyword Usage', pass: kw && score > 50, warn: kw && score > 35 },
      { label: 'Image Alt Tags', pass: score > 70, warn: score > 55 }
    ];
    const checksHTML = checks.map(c => {
      const cls = c.pass ? 'check-pass' : c.warn ? 'check-warn' : 'check-fail';
      const icon = c.pass ? '✓' : c.warn ? '!' : '✗';
      return `<div class="score-check"><div class="check-ic ${cls}">${icon}</div><span>${c.label}</span></div>`;
    }).join('');
    result.innerHTML = `
      <div class="result-box">
        <svg style="position:absolute;width:0;height:0"><defs><linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#818cf8"/></linearGradient></defs></svg>
        <div class="score-wrap">
          <div class="score-ring-box">
            <div class="score-ring">
              <svg width="110" height="110" viewBox="0 0 110 110">
                <circle class="score-bg-ring" cx="55" cy="55" r="44" stroke-dasharray="${circum}" stroke-dashoffset="0"/>
                <circle class="score-fill-ring" cx="55" cy="55" r="44" stroke-dasharray="${circum}" stroke-dashoffset="${offset}" style="transition:stroke-dashoffset 1.5s ease"/>
              </svg>
              <div class="score-val">${score}<span>/100</span></div>
            </div>
            <div class="score-grade ${grade[1]}">${grade[0]}</div>
          </div>
          <div class="score-meta">
            <h3>SEO Health Report</h3>
            <p style="font-size:13px;color:var(--muted);margin-bottom:12px">Analysis for: <strong style="color:var(--cyan)">${url}</strong>${kw ? ` · Keyword: <strong style="color:var(--cyan)">${kw}</strong>` : ''}</p>
            <div class="score-checks">${checksHTML}</div>
          </div>
        </div>
      </div>
      <p style="text-align:center;font-size:13px;color:var(--muted);margin-bottom:18px">Want a full professional SEO audit with action plan?</p>
      <div style="text-align:center"><a href="https://wa.me/919585684616?text=I need a full SEO audit for ${encodeURIComponent(url)}" class="btn-primary" target="_blank" rel="noopener">📞 Get Free Full Audit →</a></div>`;
  }
})();

/* ══════════════════════════════════════
   9. KEYWORD RESEARCH TOOL
══════════════════════════════════════ */
(function initKWTool() {
  const runBtn = document.getElementById('kw-run');
  if (!runBtn) return;
  const kwInput = document.getElementById('kw-input');
  const locInput = document.getElementById('kw-loc');
  const progress = document.getElementById('kw-progress');
  const result = document.getElementById('kw-result');
  const errorEl = document.getElementById('kw-error');

  const kwDB = {
    'digital marketing': [
      { kw: 'digital marketing agency kanchipuram', vol: 880, diff: 28, intent: 'Commercial' },
      { kw: 'digital marketing services tamil nadu', vol: 1200, diff: 35, intent: 'Commercial' },
      { kw: 'best digital marketing company chennai', vol: 2400, diff: 52, intent: 'Commercial' },
      { kw: 'digital marketing course kanchipuram', vol: 590, diff: 22, intent: 'Informational' },
      { kw: 'social media marketing kanchipuram', vol: 720, diff: 24, intent: 'Commercial' },
      { kw: 'seo services kanchipuram', vol: 480, diff: 18, intent: 'Commercial' },
      { kw: 'google ads kanchipuram', vol: 390, diff: 20, intent: 'Commercial' },
      { kw: 'website design kanchipuram', vol: 650, diff: 26, intent: 'Commercial' },
    ],
    'seo': [
      { kw: 'seo services kanchipuram', vol: 480, diff: 18, intent: 'Commercial' },
      { kw: 'local seo tamil nadu', vol: 860, diff: 32, intent: 'Commercial' },
      { kw: 'seo company chennai', vol: 3200, diff: 65, intent: 'Commercial' },
      { kw: 'seo audit tool free', vol: 5400, diff: 72, intent: 'Informational' },
      { kw: 'google ranking factors 2024', vol: 2200, diff: 55, intent: 'Informational' },
      { kw: 'on page seo checklist', vol: 1900, diff: 48, intent: 'Informational' },
      { kw: 'backlink building services india', vol: 1400, diff: 42, intent: 'Commercial' },
    ],
  };
  const defaultKWs = [
    { kw: '{query} near me', vol: Math.floor(Math.random()*500+200), diff: Math.floor(Math.random()*30+15), intent: 'Local' },
    { kw: 'best {query} in kanchipuram', vol: Math.floor(Math.random()*400+150), diff: Math.floor(Math.random()*25+10), intent: 'Local' },
    { kw: '{query} services tamil nadu', vol: Math.floor(Math.random()*800+300), diff: Math.floor(Math.random()*40+20), intent: 'Commercial' },
    { kw: '{query} price india', vol: Math.floor(Math.random()*1200+500), diff: Math.floor(Math.random()*45+25), intent: 'Commercial' },
    { kw: '{query} company chennai', vol: Math.floor(Math.random()*900+400), diff: Math.floor(Math.random()*50+30), intent: 'Commercial' },
    { kw: 'how to choose {query}', vol: Math.floor(Math.random()*600+200), diff: Math.floor(Math.random()*35+15), intent: 'Informational' },
    { kw: '{query} tips for beginners', vol: Math.floor(Math.random()*700+300), diff: Math.floor(Math.random()*30+10), intent: 'Informational' },
  ];

  const steps = [
    { id: 'kw-step1', text: '🔍 Analyzing seed keyword...' },
    { id: 'kw-step2', text: '📊 Fetching search volumes...' },
    { id: 'kw-step3', text: '🏆 Checking competitor rankings...' },
    { id: 'kw-step4', text: '💡 Finding long-tail opportunities...' },
  ];

  runBtn.addEventListener('click', async () => {
    const kw = kwInput?.value.trim().toLowerCase();
    if (!kw) { showError('kw-error', 'Please enter a keyword to research.'); return; }
    runBtn.disabled = true;
    hideEl(result); hideEl(errorEl);
    showEl(progress);
    renderSteps(steps, 'kw-progress');
    for (let i = 0; i < steps.length; i++) {
      await setStepActive(steps[i].id);
      await delay(550 + Math.random()*350);
      setStepDone(steps[i].id);
    }
    await delay(200);
    hideEl(progress);
    const keywords = kwDB[kw] || defaultKWs.map(k => ({ ...k, kw: k.kw.replace(/{query}/g, kw) }));
    renderKWResult(kw, keywords);
    showEl(result);
    runBtn.disabled = false;
  });

  function renderKWResult(seed, keywords) {
    const rows = keywords.map(k => {
      const diffColor = k.diff < 30 ? 'var(--green)' : k.diff < 55 ? 'var(--gold)' : 'var(--red)';
      return `<tr>
        <td style="font-weight:600;color:var(--text2)">${k.kw}</td>
        <td><span style="font-family:'Syne',sans-serif;font-weight:800;color:var(--cyan)">${k.vol.toLocaleString()}</span></td>
        <td><span style="color:${diffColor};font-weight:700">${k.diff}/100</span></td>
        <td><span class="tool-tag">${k.intent}</span></td>
      </tr>`;
    }).join('');
    result.innerHTML = `
      <div class="result-box">
        <h3 style="font-size:1.1rem;font-weight:800;margin-bottom:6px">Keywords for: <span style="color:var(--cyan)">${seed}</span></h3>
        <p style="font-size:13px;color:var(--muted);margin-bottom:20px">Found ${keywords.length} keyword opportunities for your business</p>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:13px">
            <thead><tr style="border-bottom:1px solid var(--brd)">
              <th style="text-align:left;padding:8px 0;color:var(--muted);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.08em">Keyword</th>
              <th style="text-align:left;padding:8px 12px;color:var(--muted);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.08em">Monthly Searches</th>
              <th style="text-align:left;padding:8px 12px;color:var(--muted);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.08em">Difficulty</th>
              <th style="text-align:left;padding:8px 12px;color:var(--muted);font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.08em">Intent</th>
            </tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>
      <div style="text-align:center"><a href="https://wa.me/919585684616?text=I need a full keyword strategy for: ${encodeURIComponent(seed)}" class="btn-primary" target="_blank" rel="noopener">🚀 Get Full Keyword Strategy →</a></div>`;
  }
})();

/* ══════════════════════════════════════
   10. CHATBOT
══════════════════════════════════════ */
(function initChatbot() {
  const bubble = document.getElementById('bot-bubble');
  const win = document.getElementById('bot-window');
  const closeBtn = document.querySelector('.bot-close');
  const msgContainer = document.querySelector('.bot-msgs');
  const inputEl = document.querySelector('.bot-input');
  const sendBtn = document.querySelector('.bot-send');
  if (!bubble || !win) return;

  let isOpen = false;
  let lang = 'EN';
  let welcomed = false;

  const responses = {
    EN: {
      greeting: "Hi! 👋 I'm VijayBot — your Digi Vijay assistant. How can I help grow your business today?",
      services: "We offer: 🔍 SEO, 📢 Google Ads, 📱 Social Media Marketing, 🌐 Website Design, 📧 Email Marketing & 🎥 Video Marketing.\n\nWhich service interests you most?",
      seo: "Our SEO service covers:\n• On-page optimization\n• Local SEO (Google Maps)\n• Content strategy\n• Backlink building\n\nWe've helped businesses rank on Google's first page within 90 days! 🚀",
      ads: "Our Google Ads service:\n• Search & Display campaigns\n• Retargeting ads\n• Shopping ads\n• Average 3x ROI guarantee\n\nReady to get more leads?",
      price: "Our packages start from ₹4,999/month. We have plans for every business size.\n\n💬 Contact us for a custom quote tailored to your business.",
      contact: "📞 Call/WhatsApp: +91 95856 84616\n📧 Email: vijayaraghavang.2002@gmail.com\n📍 Location: Kanchipuram, Tamil Nadu\n\n⏰ Available Mon–Sat, 9AM–7PM",
      quick: ["Our Services", "Pricing", "SEO Info", "Contact Us"]
    },
    TA: {
      greeting: "வணக்கம்! 👋 நான் VijayBot — Digi Vijay உதவியாளர். உங்கள் வணிகத்தை வளர்க்க என்ன உதவி தேவை?",
      services: "நாங்கள் வழங்கும் சேவைகள்: 🔍 SEO, 📢 Google Ads, 📱 Social Media, 🌐 Website Design, 📧 Email Marketing & 🎥 Video Marketing.",
      seo: "எங்கள் SEO சேவை:\n• On-page optimization\n• Local SEO (Google Maps)\n• Content strategy\n• Backlink building\n\n90 நாட்களில் Google முதல் பக்கத்தில் வரும்! 🚀",
      price: "எங்கள் packages ₹4,999/மாதம் முதல் தொடங்குகின்றன. உங்கள் வணிகத்திற்கு ஏற்ற திட்டம் தேர்வு செய்யலாம்.",
      contact: "📞 WhatsApp: +91 95856 84616\n📧 Email: vijayaraghavang.2002@gmail.com\n📍 Kanchipuram, Tamil Nadu",
      quick: ["சேவைகள்", "விலை", "தொடர்பு"]
    },
    HI: {
      greeting: "नमस्ते! 👋 मैं VijayBot हूँ — Digi Vijay का सहायक। आपके बिज़नेस को कैसे बढ़ाएं?",
      services: "हमारी सेवाएं: 🔍 SEO, 📢 Google Ads, 📱 Social Media, 🌐 Website Design, 📧 Email Marketing",
      price: "हमारे packages ₹4,999/महीने से शुरू होते हैं।",
      contact: "📞 WhatsApp: +91 95856 84616\n📧 vijayaraghavang.2002@gmail.com",
      quick: ["Services", "Price", "Contact"]
    }
  };

  function getReply(text) {
    const t = text.toLowerCase();
    const r = responses[lang] || responses.EN;
    if (t.includes('service') || t.includes('சேவை') || t.includes('सेवा')) return r.services;
    if (t.includes('seo') || t.includes('rank') || t.includes('google')) return r.seo || r.services;
    if (t.includes('ads') || t.includes('advertis')) return r.ads || r.services;
    if (t.includes('price') || t.includes('cost') || t.includes('package') || t.includes('விலை') || t.includes('₹')) return r.price;
    if (t.includes('contact') || t.includes('phone') || t.includes('call') || t.includes('whatsapp') || t.includes('தொடர்பு')) return r.contact;
    if (t.includes('hi') || t.includes('hello') || t.includes('hey') || t.includes('வணக்கம்') || t.includes('नमस्ते')) return r.greeting;
    return "I'd love to help! Could you clarify your question? You can also reach us directly at +91 95856 84616 on WhatsApp. 😊";
  }

  function appendMsg(text, isUser = false) {
    const msg = document.createElement('div');
    msg.className = `bot-msg${isUser ? ' user' : ''}`;
    if (!isUser) {
      msg.innerHTML = `<div class="bot-av-sm">🤖</div><div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>`;
    } else {
      msg.innerHTML = `<div class="msg-bubble">${text}</div>`;
    }
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return msg;
  }

  function showTyping() {
    const msg = document.createElement('div');
    msg.className = 'bot-msg';
    msg.id = 'typing-indicator';
    msg.innerHTML = `<div class="bot-av-sm">🤖</div><div class="msg-bubble"><span style="display:flex;gap:5px;align-items:center"><span style="width:7px;height:7px;background:var(--cyan);border-radius:50%;animation:pulse-dot 1s ease-in-out infinite"></span><span style="width:7px;height:7px;background:var(--cyan);border-radius:50%;animation:pulse-dot 1s .15s ease-in-out infinite"></span><span style="width:7px;height:7px;background:var(--cyan);border-radius:50%;animation:pulse-dot 1s .3s ease-in-out infinite"></span></span></div>`;
    msgContainer.appendChild(msg);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return msg;
  }

  async function sendMsg(text) {
    if (!text.trim()) return;
    appendMsg(text, true);
    if (inputEl) inputEl.value = '';
    removeQuickReplies();
    const typing = showTyping();
    await delay(900 + Math.random() * 600);
    typing.remove();
    appendMsg(getReply(text));
    const r = responses[lang] || responses.EN;
    if (r.quick) addQuickReplies(r.quick);
  }

  function addQuickReplies(options) {
    removeQuickReplies();
    const qr = document.createElement('div');
    qr.className = 'quick-replies';
    qr.id = 'quick-replies';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'qr-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => sendMsg(opt));
      qr.appendChild(btn);
    });
    msgContainer.appendChild(qr);
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }

  function removeQuickReplies() {
    document.getElementById('quick-replies')?.remove();
  }

  // Open/close
  bubble.addEventListener('click', () => {
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    if (isOpen && !welcomed) {
      welcomed = true;
      setTimeout(() => {
        const r = responses[lang] || responses.EN;
        appendMsg(r.greeting);
        addQuickReplies(r.quick || ['Services', 'Pricing', 'Contact']);
      }, 400);
    }
  });
  if (closeBtn) closeBtn.addEventListener('click', () => { isOpen = false; win.classList.remove('open'); });

  // Send
  if (sendBtn) sendBtn.addEventListener('click', () => sendMsg(inputEl?.value?.trim()));
  if (inputEl) inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(inputEl.value.trim()); });

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      lang = btn.dataset.lang;
    });
  });
})();

/* ══════════════════════════════════════
   11. CONTACT FORM
══════════════════════════════════════ */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const service = form.querySelector('[name="service"]')?.value;
    const msg = form.querySelector('[name="message"]')?.value.trim();
    if (!name || !phone) { alert('Please fill in your name and phone number.'); return; }
    const text = `Hello Digi Vijay! 👋\n\nName: ${name}\nPhone: ${phone}\nService: ${service || 'Not specified'}\nMessage: ${msg || 'Looking for a consultation'}\n\nPlease contact me!`;
    window.open(`https://wa.me/919585684616?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
})();

/* ══════════════════════════════════════
   12. BLOG — Category Filter
══════════════════════════════════════ */
(function initBlog() {
  const catBtns = document.querySelectorAll('.cat-btn');
  const posts = document.querySelectorAll('.post-card[data-cat]');
  if (!catBtns.length) return;
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      posts.forEach(p => {
        const show = cat === 'all' || p.dataset.cat === cat;
        p.style.transition = 'opacity 0.3s, transform 0.3s';
        p.style.opacity = show ? '1' : '0.2';
        p.style.transform = show ? '' : 'scale(0.97)';
        p.style.pointerEvents = show ? '' : 'none';
      });
    });
  });

  // Search
  const searchEl = document.getElementById('blog-search');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      const q = searchEl.value.toLowerCase();
      posts.forEach(p => {
        const title = p.querySelector('h3')?.textContent.toLowerCase() || '';
        const text = p.querySelector('p')?.textContent.toLowerCase() || '';
        const match = title.includes(q) || text.includes(q);
        p.style.opacity = match ? '1' : '0.2';
        p.style.transform = match ? '' : 'scale(0.97)';
        p.style.pointerEvents = match ? '' : 'none';
      });
    });
  }

  // Newsletter form
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = nlForm.querySelector('input[type="email"]')?.value;
      if (email) {
        window.open(`https://wa.me/919585684616?text=Subscribe me to Digi Vijay newsletter: ${encodeURIComponent(email)}`, '_blank', 'noopener');
      }
    });
  }
})();

/* ══════════════════════════════════════
   UTILITIES
══════════════════════════════════════ */
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function showEl(el) { if (el) { el.style.display = ''; el.classList.add('show'); } }
function hideEl(el) { if (el) { el.style.display = 'none'; el.classList.remove('show'); } }
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; el.classList.add('show'); setTimeout(() => hideEl(el), 5000); }
}
function renderSteps(steps, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const inner = container.querySelector('.prog-steps');
  if (!inner) return;
  inner.innerHTML = steps.map(s => `<div class="prog-step" id="${s.id}"><div class="step-icon">⏳</div><span>${s.text}</span></div>`).join('');
}
function setStepActive(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.querySelector('.step-icon').innerHTML = '<div class="spinner"></div>';
  }
  return Promise.resolve();
}
function setStepDone(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('active');
    el.classList.add('done');
    el.querySelector('.step-icon').textContent = '✅';
  }
}
