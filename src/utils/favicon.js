export function setFaviconAccent(accent = 'blue') {
  const colors = {
    blue: ['#38bdf8', '#0ea5e9'],
    green: ['#34d399', '#10b981'],
    purple: ['#a78bfa', '#8b5cf6'],
  };
  const [c1, c2] = colors[accent] || colors.blue;

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#g)"/>
    <path d="M18 42h28M18 22h28M18 32h20" stroke="white" stroke-width="4" stroke-linecap="round"/>
  </svg>`;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  let link = document.querySelector("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = url;
}
