(() => {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const preference = matchMedia('(prefers-color-scheme: dark)');
  let manual = false;
  try { manual = ['light', 'dark'].includes(localStorage.getItem('theme')); } catch (_) {}

  function applyTheme(theme) {
    root.dataset.theme = theme;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    button.querySelector('.theme-label').textContent = theme === 'dark' ? 'Light' : 'Dark';
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame) frame.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app');
  }
  applyTheme(root.dataset.theme);
  button.hidden = false;
  button.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    manual = true;
    applyTheme(theme);
    try { localStorage.setItem('theme', theme); } catch (_) {}
  });
  preference.addEventListener('change', event => {
    if (!manual) applyTheme(event.matches ? 'dark' : 'light');
  });

  // Keep third-party comments off the initial reading path.
  const comments = document.getElementById('giscus-container');
  function loadComments() {
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    const settings = {
      repo: 'sortira/silicognition', 'repo-id': 'R_kgDORMWBIQ',
      category: 'General', 'category-id': 'DIC_kwDORMWBIc4C37E9',
      mapping: 'pathname', strict: '0', 'reactions-enabled': '1',
      'emit-metadata': '0', 'input-position': 'bottom',
      theme: root.dataset.theme, lang: 'en'
    };
    Object.entries(settings).forEach(([key, value]) => script.setAttribute('data-' + key, value));
    script.crossOrigin = 'anonymous';
    script.async = true;
    comments.appendChild(script);
  }
  if (comments) {
    if ('IntersectionObserver' in window) {
      const commentObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          commentObserver.disconnect();
          loadComments();
        }
      }, { rootMargin: '600px' });
      commentObserver.observe(comments);
    } else loadComments();
  }

  // The contents remain ordinary anchor links when JavaScript is unavailable.
  const links = [...document.querySelectorAll('.table-of-contents a[href^="#"]')];
  if (links.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-8% 0px -65% 0px' });
    links.forEach(link => {
      const section = document.getElementById(link.hash.slice(1));
      if (section) observer.observe(section);
    });
  }
})();
