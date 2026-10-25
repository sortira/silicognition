// Run before paint; a blocked storage API must never prevent reading the site.
(() => {
  let saved;
  try { saved = localStorage.getItem('theme'); } catch (_) { /* Private browsing. */ }
  const dark = saved === 'dark' || (saved !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
})();
