(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // Theme toggle
  var themeBtn = document.getElementById('themeBtn');
  try { var saved = localStorage.getItem('ssb-theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  themeBtn && themeBtn.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    var next = cur === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ssb-theme', next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = document.getElementById('menuBtn'), links = document.getElementById('navLinks');
  menuBtn && menuBtn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links && links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  });

  // Typed roles
  var roles = ['IT Cell Manager', 'Website Manager', 'Social Media Manager', 'Video Editor', 'Graphic Designer', 'WordPress Developer'];
  var typed = document.getElementById('typed');
  if (typed && !reduce) {
    var ri = 0, ci = roles[0].length, del = true;
    setTimeout(function tick() {
      var word = roles[ri];
      if (del) { ci--; if (ci <= 0) { del = false; ri = (ri + 1) % roles.length; } }
      else { ci++; if (ci >= roles[ri].length) { del = true; typed.textContent = roles[ri]; return setTimeout(tick, 1800); } }
      typed.textContent = roles[ri].slice(0, Math.max(ci, 0)) || '​';
      setTimeout(tick, del ? 38 : 70);
    }, 2200);
  }

  // Nav border + active link + timeline progress
  var nav = document.getElementById('nav');
  var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));
  var navAs = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  var tl = document.getElementById('timeline'), tlp = document.getElementById('tlProgress');
  function onScroll() {
    var y = window.scrollY;
    nav && nav.classList.toggle('scrolled', y > 10);
    var cur = '';
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * 0.35) cur = s.id; });
    navAs.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
    if (tl && tlp) {
      var r = tl.getBoundingClientRect(), h = r.height - 16;
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / h));
      tlp.style.height = (p * h) + 'px';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Counters
  function countUp(el) {
    var target = +el.getAttribute('data-count'), start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min(1, (t - start) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reveal on scroll: only elements below the first screen are pre-hidden.
  if ('IntersectionObserver' in window && !reduce) {
    document.body.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.remove('pending');
        el.querySelectorAll && el.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    var vh = window.innerHeight;
    document.querySelectorAll('.reveal').forEach(function (el, i) {
      if (el.getBoundingClientRect().top > vh) {
        el.classList.add('pending');
        var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
        el.style.transitionDelay = (Math.min(sib, 5) * 70) + 'ms';
        io.observe(el);
      }
    });
  }

  // Copy buttons
  var toast = document.getElementById('toast'), tt;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      var done = function () { showToast('Copied ' + v); };
      var fallback = function () {
        var s = b.parentElement.querySelector('.val');
        var rg = document.createRange(); rg.selectNodeContents(s);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(rg);
        showToast('Selected. Press Ctrl+C to copy');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, fallback);
      else fallback();
    });
  });

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
