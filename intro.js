/* ChessBreakthrough intro animation.
   Plays once per visit (per browser tab session), about 2.3 seconds, click or any key to skip.
   Add to a page as the first line inside <body>:  <script src="intro.js"></script>
   Add ?intro=1 to any page URL to see it again. */
(function () {
  var force = /[?&]intro=1/.test(location.search);
  var loop = /[?&]intro=loop/.test(location.search);
  try {
    if (!force && !loop && sessionStorage.getItem('cbIntroSeen')) return;
    sessionStorage.setItem('cbIntroSeen', '1');
  } catch (e) {}
  if (!force && !loop && window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (!document.querySelector('link[href*="Montserrat"]')) {
    var f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@800&display=swap';
    document.head.appendChild(f);
  }

  var css = '' +
    '#cb-intro{position:fixed;inset:0;z-index:99999;background:#1F3C93;display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;animation:cbOut .45s ease-in 1.85s forwards}' +
    '#cb-intro svg{width:min(40vw,220px);height:auto;overflow:visible}' +
    '#cb-intro .p{fill:#fff;transform-box:fill-box;transform-origin:50% 100%;opacity:0;animation:cbRise .55s cubic-bezier(.2,.9,.3,1.15) .05s forwards}' +
    '#cb-intro .b{fill:#FF6B00;transform-box:fill-box;transform-origin:50% 100%;opacity:0;transform:scale(0);animation:cbBurst .45s cubic-bezier(.2,1.6,.4,1) .5s forwards}' +
    '#cb-intro .t{margin-top:18px;font:800 clamp(20px,5.2vw,40px)/1.1 Montserrat,"Segoe UI",Arial,sans-serif;color:#F2E6C9;letter-spacing:.5px;opacity:0;transform:translateY(12px);animation:cbText .45s ease-out .85s forwards}' +
    '#cb-intro .t span{color:#FF6B00}' +
    '#cb-intro .s{position:absolute;bottom:22px;right:26px;font:600 13px Montserrat,"Segoe UI",Arial,sans-serif;color:rgba(242,230,201,.7)}' +
    '@keyframes cbRise{from{opacity:0;transform:translateY(60%)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes cbBurst{0%{opacity:0;transform:scale(0) rotate(-25deg)}70%{opacity:1;transform:scale(1.6) rotate(4deg)}100%{opacity:1;transform:scale(1.4) rotate(0)}}' +
    '@keyframes cbText{to{opacity:1;transform:translateY(0)}}' +
    '@keyframes cbOut{to{opacity:0;visibility:hidden}}';
  if (loop) css = css.replace('animation:cbOut .45s ease-in 1.85s forwards', '').replace('cursor:pointer', 'cursor:default');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var o = document.createElement('div');
  o.id = 'cb-intro';
  o.setAttribute('aria-hidden', 'true');
  o.innerHTML =
    '<svg viewBox="0 -24 200 284" xmlns="http://www.w3.org/2000/svg">' +
      '<polygon class="b" points="100,-14 111.9,19.9 134,-5.6 123.8,25 154.4,14.8 130.6,36.9 159.5,42 127.2,47.1 137.4,60.7 106.8,47.1 100,64.1 93.2,47.1 62.6,60.7 72.8,47.1 40.5,42 69.4,36.9 45.6,14.8 76.2,25 66,-5.6 88.1,19.9"/>' +
      '<g class="p">' +
        '<circle cx="100" cy="112" r="40"/>' +
        '<rect x="54" y="146" width="92" height="13" rx="6.5"/>' +
        '<polygon points="76,158 124,158 136,214 64,214"/>' +
        '<rect x="56" y="208" width="88" height="12" rx="6"/>' +
        '<rect x="48" y="218" width="104" height="22" rx="5"/>' +
        '<rect x="40" y="238" width="120" height="18" rx="5"/>' +
      '</g>' +
    '</svg>' +
    '<div class="t">Chess<span>Breakthrough</span>.com</div>' +
    (loop ? '' : '<div class="s">Click to skip</div>');

  function done() { if (o.parentNode) o.parentNode.removeChild(o); }
  function skip() { o.style.animation = 'cbOut .2s ease-in forwards'; setTimeout(done, 220); }
  if (!loop) {
    o.addEventListener('click', skip);
    document.addEventListener('keydown', skip, { once: true });
    o.addEventListener('animationend', function (e) { if (e.animationName === 'cbOut') done(); });
    setTimeout(done, 3500); /* safety net */
  }
  (document.body || document.documentElement).appendChild(o);
})();
