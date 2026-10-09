const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.desktop-nav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.section-heading,.service-row,.industry-card,.approach-head,.approach-layout,.principle,.play-grid img,.contact-top').forEach(el=>{el.classList.add('reveal');observer.observe(el)});
/* Subtle parallax: decorative hero artwork and the about image move at different speeds. */
(() => {
  const layers = Array.from(document.querySelectorAll('[data-parallax]'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!layers.length || reduceMotion.matches) return;
  let ticking = false;
  const updateParallax = () => {
    const viewportHeight = window.innerHeight || 1;
    layers.forEach(layer => {
      const speed = Number(layer.dataset.parallax || 0.08);
      const rect = layer.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportHeight / 2) * -speed;
      layer.style.transform = `translate3d(0, ${Math.max(-32, Math.min(32, offset))}px, 0)`;
    });
    ticking = false;
  };
  const requestUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateParallax();
})();

/* Floating accessibility options */
const accessibilityTrigger = document.getElementById('accessibility-trigger');
const accessibilityPanel = document.getElementById('accessibility-panel');
const accessibilityClose = document.getElementById('accessibility-close');
function setAccessibilityPanel(open) {
  if (!accessibilityPanel || !accessibilityTrigger) return;
  accessibilityPanel.hidden = !open;
  accessibilityTrigger.setAttribute('aria-expanded', String(open));
  if (open) accessibilityClose?.focus();
}
accessibilityTrigger?.addEventListener('click', () => setAccessibilityPanel(accessibilityPanel.hidden));
accessibilityClose?.addEventListener('click', () => {
  setAccessibilityPanel(false);
  accessibilityTrigger?.focus();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && accessibilityPanel && !accessibilityPanel.hidden) {
    setAccessibilityPanel(false);
    accessibilityTrigger?.focus();
  }
});
const accessibilityClasses = {
  'larger-text': 'accessibility-large',
  'smaller-text': 'accessibility-small',
  'contrast': 'accessibility-high-contrast',
  'links': 'accessibility-underline',
  'motion': 'accessibility-reduced-motion'
};
document.querySelectorAll('[data-accessibility]').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.accessibility;
    if (action === 'reset') {
      Object.values(accessibilityClasses).forEach(name => document.body.classList.remove(name));
      document.querySelectorAll('[data-accessibility]').forEach(item => item.setAttribute('aria-pressed', 'false'));
      return;
    }
    const className = accessibilityClasses[action];
    if (!className) return;
    if (action === 'larger-text' || action === 'smaller-text') {
      document.body.classList.remove(accessibilityClasses[action === 'larger-text' ? 'smaller-text' : 'larger-text']);
    }
    const active = document.body.classList.toggle(className);
    button.setAttribute('aria-pressed', String(active));
  });
});

/* Header search: searches the page's section headings and copy without a backend. */
(() => {
  const toggle = document.querySelector('.search-toggle');
  const panel = document.getElementById('site-search');
  const form = document.querySelector('.site-search-form');
  const input = document.getElementById('site-search-input');
  const close = document.querySelector('.site-search-close');
  const results = document.querySelector('.site-search-results');
  if (!toggle || !panel || !form || !input || !results) return;
  const searchable = Array.from(document.querySelectorAll('main section')).map(section => ({
    section,
    title: section.querySelector('h1,h2,h3')?.innerText.trim() || section.id || 'Page content',
    text: section.innerText.replace(/\\s+/g, ' ').trim(),
    id: section.id || 'top'
  }));
  const setOpen = open => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
  };
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close?.addEventListener('click', () => { setOpen(false); toggle.focus(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) { setOpen(false); toggle.focus(); }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setOpen(true); }
  });
  const renderResults = query => {
    results.replaceChildren();
    const q = query.trim().toLowerCase();
    if (!q) return;
    const matches = searchable.filter(item => (item.title + ' ' + item.text).toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) {
      const empty = document.createElement('p'); empty.className = 'search-empty'; empty.textContent = 'No matches found. Try “funding”, “security”, or “research”.'; results.append(empty); return;
    }
    matches.forEach(item => {
      const link = document.createElement('a'); link.className = 'search-result'; link.href = '#' + item.id;
      const title = document.createElement('strong'); title.textContent = item.title;
      const hint = document.createElement('span'); hint.textContent = 'View section ↗';
      link.append(title, hint); link.addEventListener('click', () => setOpen(false)); results.append(link);
    });
  };
  input.addEventListener('input', () => renderResults(input.value));
  form.addEventListener('submit', event => { event.preventDefault(); renderResults(input.value); });
})();
