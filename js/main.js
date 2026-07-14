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

  const active = new Set();
  const trailSymbols = ['★', '✦', '✧', '◆'];
  let lastTrailAt = 0;
  let trailIndex = 0;
  let hue = 0;

  const retire = (node) => {
    active.add(node);
    node.addEventListener('animationend', () => {
      active.delete(node);
      node.remove();
    }, { once: true });
  };

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || Date.now() - lastTrailAt < 45) return;
    lastTrailAt = Date.now();
    hue = (hue + 47) % 360;

    const star = document.createElement('span');
    star.className = 'cursor-star';
    star.textContent = trailSymbols[trailIndex % trailSymbols.length];
    trailIndex += 1;
    star.style.left = `${event.clientX}px`;
    star.style.top = `${event.clientY}px`;
    star.style.setProperty('--trail-color', `hsl(${hue}, 95%, 58%)`);
    document.body.appendChild(star);
    retire(star);
  }, { passive: true });

  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'touch') return;

    for (let index = 0; index < 10; index += 1) {
      const angle = (Math.PI * 2 * index) / 10;
      const distance = 28 + (index % 3) * 9;
      const spark = document.createElement('span');
      spark.className = 'click-spark';
      spark.textContent = index % 2 === 0 ? '✦' : '·';
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--spark-color', `hsl(${(hue + index * 36) % 360}, 100%, 55%)`);
      document.body.appendChild(spark);
      retire(spark);
    }
  }, { passive: true });
})();
