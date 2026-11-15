/* ChessBreakthrough intro animation.
   Plays once per visit (per browser tab session), about 2.7 seconds, click or any key to skip.
   Add to a page as the first line inside <body>:  <script src="intro.js"></script>
   Add ?intro=1 to any page URL to see it again; ?intro=loop plays it and holds the last frame. */
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

  var NAVY = '#1F3C93', CREAM = '#F2E6C9';
  var css = '' +
    '#cb-intro{position:fixed;inset:0;z-index:99999;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;animation:cbOut .45s ease-in 2.25s forwards}' +
    '#cb-intro svg{width:min(70vw,52vh,340px);height:auto;overflow:visible}' +
    '#cb-intro .sq{transform-box:fill-box;transform-origin:50% 50%;opacity:0;animation:cbSq .32s cubic-bezier(.2,1.3,.4,1) forwards}' +
    '#cb-intro .p{fill:#fff;transform-box:fill-box;transform-origin:50% 100%;opacity:0;animation:cbRise .5s cubic-bezier(.2,.9,.3,1.15) .45s forwards}' +
    '#cb-intro .b{fill:#FF6B00;transform-box:fill-box;transform-origin:50% 100%;opacity:0;transform:scale(0);animation:cbBurst .45s cubic-bezier(.2,1.6,.4,1) .85s forwards}' +
    '#cb-intro .t{margin-top:22px;font:800 clamp(20px,5.2vw,40px)/1.1 Montserrat,"Segoe UI",Arial,sans-serif;color:' + CREAM + ';letter-spacing:.5px;white-space:nowrap}' +
    '#cb-intro .t span{display:inline-block;opacity:0}' +
    /* Chess slides in from the right, .com from the left, Breakthrough fades up from below */
    '#cb-intro .w1{animation:cbFromR .55s cubic-bezier(.2,.9,.3,1) 1.2s forwards}' +
    '#cb-intro .w2{color:#FF6B00;animation:cbUp .5s ease-out 1.1s forwards}' +
    '#cb-intro .w3{animation:cbFromL .55s cubic-bezier(.2,.9,.3,1) 1.2s forwards}' +
    '@keyframes cbFromR{from{opacity:0;transform:translateX(45vw)}to{opacity:1;transform:translateX(0)}}' +
    '@keyframes cbFromL{from{opacity:0;transform:translateX(-45vw)}to{opacity:1;transform:translateX(0)}}' +
    '@keyframes cbUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}' +
    '#cb-intro .s{position:absolute;bottom:22px;right:26px;font:600 13px Montserrat,"Segoe UI",Arial,sans-serif;color:rgba(242,230,201,.6)}' +
    '@keyframes cbSq{from{opacity:0;transform:scale(.2)}to{opacity:1;transform:scale(1)}}' +
    '@keyframes cbRise{from{opacity:0;transform:translateY(45%)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes cbBurst{0%{opacity:0;transform:scale(0) rotate(-25deg)}70%{opacity:1;transform:scale(1.2) rotate(4deg)}100%{opacity:1;transform:scale(1) rotate(0)}}' +
    '@keyframes cbOut{to{opacity:0;visibility:hidden}}';
  if (loop) css = css.replace('animation:cbOut .45s ease-in 2.25s forwards', '').replace('cursor:pointer', 'cursor:default');

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* 3x3 board like the logo: navy corners and center, cream edges. Squares pop in from the center outward. */
  var order = [[1,1],[0,1],[1,0],[1,2],[2,1],[0,0],[0,2],[2,0],[2,2]];
  var squares = '';
  order.forEach(function (rc, i) {
    var r = rc[0], c = rc[1];
    var fill = ((r + c) % 2 === 0) ? NAVY : CREAM;
    squares += '<rect class="sq" x="' + (c * 100) + '" y="' + (r * 100) + '" width="100.5" height="100.5" fill="' + fill + '" style="animation-delay:' + (i * 0.04).toFixed(2) + 's"/>';
  });

  var o = document.createElement('div');
  o.id = 'cb-intro';
  o.setAttribute('aria-hidden', 'true');
  o.innerHTML =
    '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">' +
      squares +
      /* burst sits in the top-middle square */
      '<polygon class="b" points="116.2,95.1 100,79.2 117.9,78.1 102.3,49.7 134.7,65.3 135.8,13.3 153.5,59.3 186.1,22.9 170.8,65.3 200,54.6 178,79.2 200,83.5 177.2,98 183.8,89.3 162.7,87.9 171.4,74 160.7,74.6 163.3,61 152.3,71.4 142.8,57.2 139.6,76.3 121.4,68.5 128.3,83 113.6,84.1"/>' +
      /* white pawn stands in the center square */
      '<g transform="translate(103 75.7) scale(.47)"><g class="p">' +
        '<circle cx="100" cy="112" r="40"/>' +
        '<rect x="54" y="146" width="92" height="13" rx="6.5"/>' +
        '<polygon points="76,158 124,158 136,214 64,214"/>' +
        '<rect x="56" y="208" width="88" height="12" rx="6"/>' +
        '<rect x="48" y="218" width="104" height="22" rx="5"/>' +
        '<rect x="40" y="238" width="120" height="18" rx="5"/>' +
      '</g></g>' +
    '</svg>' +
    '<div class="t"><span class="w1">Chess</span><span class="w2">Breakthrough</span><span class="w3">.com</span></div>' +
    (loop ? '' : '<div class="s">Click to skip</div>');

  function done() { if (o.parentNode) o.parentNode.removeChild(o); }
  function skip() { o.style.animation = 'cbOut .2s ease-in forwards'; setTimeout(done, 220); }
  if (!loop) {
    o.addEventListener('click', skip);
    document.addEventListener('keydown', skip, { once: true });
    o.addEventListener('animationend', function (e) { if (e.animationName === 'cbOut') done(); });
    setTimeout(done, 4000); /* safety net */
  }
  (document.body || document.documentElement).appendChild(o);
})();
