/* ═══════════════════════════════════════════
   GOLD DUST — الغبار الذهبي العائم
   خلفية جزيئات فاخرة تليق بهوية Golden Store
   ● تركيب تلقائي: يُنشئ الكانفس بنفسه — لا تعدل HTML
   ● يحترم تقليل الحركة + يتلوّن حسب الوضع (داكن/فاتح)
   ● يتوقف عند إخفاء التبويب — حفاظاً على البطارية
═══════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── الإعدادات — عدّل بحرية ── */
  const COUNT_DESKTOP = 100;   // عدد الجزيئات للشاشات الكبيرة
  const COUNT_MOBILE  = 26;   // على الموبايل
  const BOKEH_CHANCE  = 0.18; // نسبة الجزيئات الكبيرة الضبابية
  const DRIFT_MIN     = 0.08; // أبطأ صعود
  const DRIFT_MAX     = 0.20; // أسرع صعود (لا يزال فاخراً 😌)

  /* احترام إعدادات تقليل الحركة — لا أنيميشن إطلاقاً */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const isMobile = () => innerWidth < 680;
  const isLight  = () => document.body.classList.contains('light-mode');

  /* التهيئة بعد جاهزية الصفحة (يعمل من أي مكان تضعه فيه) */
  const boot = () => {

    /* الكانفس — خلف كل المحتوى، ولا يحجب أي نقر */
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'fixed', inset: '0', width: '100vw', height: '100vh',
      zIndex: '-1', pointerEvents: 'none', display: 'block'
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    /* سبرايت التوهج — يُرسم مرة واحدة ثم يُنسخ (أداء ممتاز) */
    const sprite = document.createElement('canvas');
    function paintSprite() {
      const s = 64;
      sprite.width = sprite.height = s;
      const c = sprite.getContext('2d');
      const g = c.createRadialGradient(s/2, s/2, 0, s/2, s/2, s/2);
      if (isLight()) {
        /* الوضع الفاتح: ذهب أعمق ليظهر على العاجي */
        g.addColorStop(0,   'rgba(143,110,36,.9)');
        g.addColorStop(.45, 'rgba(143,110,36,.32)');
        g.addColorStop(1,   'rgba(143,110,36,0)');
      } else {
        /* الوضع الداكن: شامبانيا متوهجة على الفحمي */
        g.addColorStop(0,   'rgba(246,231,191,.95)');
        g.addColorStop(.4,  'rgba(227,194,124,.4)');
        g.addColorStop(1,   'rgba(227,194,124,0)');
      }
      c.fillStyle = g;
      c.fillRect(0, 0, s, s);
    }

    let W = 0, H = 0, parts = [], raf = null, last = 0;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      const n = isMobile() ? COUNT_MOBILE : COUNT_DESKTOP;
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() < BOKEH_CHANCE
              ? 5 + Math.random() * 6        /* بوكه كبير ضبابي */
              : 2 + Math.random() * 2.6,     /* غبار ناعم */
        vy: -(DRIFT_MIN + Math.random() * (DRIFT_MAX - DRIFT_MIN)),
        swayAmp: 6 + Math.random() * 16,
        swaySpd: 0.0004 + Math.random() * 0.001,
        phase: Math.random() * Math.PI * 2,
        alpha: (Math.random() < BOKEH_CHANCE ? 0.16 : 0.3) + Math.random() * 0.4,
        twSpd: 0.0012 + Math.random() * 0.002,
        twPhase: Math.random() * Math.PI * 2
      }));
    }

    /* حلقة الرسم — صعود بطيء + تمايل + وميض */
    function tick(t) {
      const dt = Math.min(t - last, 50) || 16; last = t;
      ctx.clearRect(0, 0, W, H);

      for (const p of parts) {
        p.y += p.vy * (dt / 16);
        if (p.y < -12) { p.y = H + 12; p.x = Math.random() * W; }

        const x = p.x + Math.sin(t * p.swaySpd + p.phase) * p.swayAmp;
        const tw = 0.6 + 0.4 * Math.sin(t * p.twSpd + p.twPhase);

        ctx.globalAlpha = p.alpha * tw;
        const d = p.size * 2;
        ctx.drawImage(sprite, x - d/2, p.y - d/2, d, d);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
    function stop()  { if (raf)  { cancelAnimationFrame(raf); raf = null; } }

    /* إيقاف عند إخفاء التبويب */
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());

    /* تبديل الثيم = إعادة تلوين الجزيئات فوراً */
    new MutationObserver(paintSprite)
      .observe(document.body, { attributes: true, attributeFilter: ['class'] });

    /* تجاهل ظهور/اختفاء شريط المتصفح في الموبايل — لا إعادة توزيع */
    let rz;
    addEventListener('resize', () => {
      clearTimeout(rz);
      rz = setTimeout(() => {
        const changed = Math.abs(innerWidth - W) > 60;
        resize();
        if (changed) spawn();
      }, 150);
    });

    /* انطلاق ✨ */
    paintSprite(); resize(); spawn(); start();
  };

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();