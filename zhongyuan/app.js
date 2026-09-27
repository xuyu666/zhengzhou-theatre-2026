(() => {
  'use strict';
  const controls = document.querySelector('.view-controls');
  const buttons = [...document.querySelectorAll('[data-mode]')];
  const note = document.querySelector('#storage-note');
  const prefix = 'zhongyuan-theatre-2026:';
  if (note) note.textContent = '勾选状态保存在当前浏览器，仅用于这份长卷行程。';
  const storageUnavailable = () => {
    if (note) note.textContent = '当前浏览器无法保存勾选；本次页面内仍可使用待办。';
  };
  function setMode(mode) {
    document.body.dataset.mode = mode;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
  }
  if (controls && buttons.length) {
    setMode('brief');
    controls.hidden = false;
    buttons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode === 'detail' ? 'detail' : 'brief')));
  }
  document.querySelectorAll('[data-check]').forEach(input => {
    const key = prefix + input.dataset.check;
    try { input.checked = localStorage.getItem(key) === '1'; }
    catch { storageUnavailable(); }
    input.addEventListener('change', () => {
      try { localStorage.setItem(key, input.checked ? '1' : '0'); }
      catch { storageUnavailable(); }
    });
  });
  const navLinks = [...document.querySelectorAll('.date-nav a')];
  document.querySelectorAll('a[href="#sources"]').forEach(link => {
    link.addEventListener('click', () => {
      const sources = document.querySelector('#sources');
      if (sources) sources.open = true;
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-20% 0px -55% 0px' });
    navLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) observer.observe(section); });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reveal = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('reveal-enter');
          reveal.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.chapter-heading,.hero-copy').forEach(element => reveal.observe(element));
      document.addEventListener('keydown', event => {
        if (event.key === 'Tab') {
          reveal.disconnect();
          document.querySelectorAll('.reveal-enter').forEach(element => element.classList.remove('reveal-enter'));
        }
      });
    }
  }
})();
