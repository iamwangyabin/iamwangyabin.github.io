(() => {
  const ad = document.querySelector('.floating-ad');
  const closeButton = document.querySelector('.floating-close');
  if (!ad || !closeButton) return;

  closeButton.addEventListener('click', () => ad.remove());

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const x = Math.max(12, window.innerWidth - ad.offsetWidth - 12);
    const y = Math.max(12, window.innerHeight - ad.offsetHeight - 12);
    ad.style.transform = `translate(${x}px, ${y}px)`;
    return;
  }

  let x = 26;
  let y = 145;
  let dx = 1.35;
  let dy = 1.05;

  const move = () => {
    const maxX = Math.max(0, window.innerWidth - ad.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - ad.offsetHeight);

    x += dx;
    y += dy;

    if (x <= 0 || x >= maxX) {
      x = Math.min(maxX, Math.max(0, x));
      dx *= -1;
    }
    if (y <= 0 || y >= maxY) {
      y = Math.min(maxY, Math.max(0, y));
      dy *= -1;
    }

    ad.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    window.requestAnimationFrame(move);
  };

  window.requestAnimationFrame(move);
})();
