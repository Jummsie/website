document.addEventListener('DOMContentLoaded', () => {
  // ---------- Confetti ----------
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const colors = ['#2a186e', '#e12c25', '#55429b', '#ffed34'];
  let confetti = Array.from({ length: 160 }).map(() => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 6 + 2,
    c: colors[Math.floor(Math.random() * colors.length)],
    s: Math.random() * 2 + 0.6,
    drift: (Math.random() - 0.5) * 0.8,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.95;
      ctx.fill();
    });
    update();
    requestAnimationFrame(draw);
  }

  function update() {
    confetti.forEach(p => {
      p.y += p.s;
      p.x += p.drift;
      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
    });
  }

  draw();

  // ---------- Live stream detection ----------
  const YOUTUBE_API_KEY = 'AIzaSyBTNb-zdhMqzUYvvZQfU8PhfMjIZ3mFd_g'; // paste your key
  const CHANNEL_ID = 'UCXK6QP3PMm54j2zwuzaPyRw'; // exact ID
  const watchBtn = document.getElementById('watchLiveBtn');
  const modal = document.getElementById('noLiveModal');
  const closeModalBtn = document.getElementById('closeModal');

  async function fetchLive() {
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') return null;
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`;
    try {
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('YouTube API error');
      const data = await res.json();
      if (data.items && data.items.length) return data.items[0].id.videoId;
      return null;
    } catch (err) {
      console.warn('Live check failed', err);
      return null;
    }
  }

  async function onWatchClick(e) {
    e.preventDefault();
    const vid = await fetchLive();
    if (vid) window.open(`https://www.youtube.com/watch?v=${vid}`, '_blank', 'noopener');
    else {
      if (modal) modal.style.display = 'flex';
    }
  }

  if (watchBtn) watchBtn.addEventListener('click', onWatchClick);
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
  window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // smooth scrolling for internal nav links
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      const id = this.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navH - 10;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});
