(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const isDark = () =>
    root.dataset.theme
      ? root.dataset.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };

  toggle.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    toggle.classList.add('spin');
    setTimeout(() => toggle.classList.remove('spin'), 600);

    if (reduceMotion.matches) { setTheme(next); return; }

    // Modern browsers: the new theme spreads out in a circle from the button
    if (document.startViewTransition) {
      const r = toggle.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      const transition = document.startViewTransition(() => setTheme(next));
      transition.ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 600, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      });
      return;
    }

    // Older browsers: a smooth color fade instead
    root.classList.add('theme-fade');
    setTheme(next);
    setTimeout(() => root.classList.remove('theme-fade'), 450);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
