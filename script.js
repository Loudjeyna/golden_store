/* ═══ الاتصال ═══ */
const SUPABASE_URL = 'https://cqkbqcvjjrirbrkyodbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vFSo6qX4xD4wLLSPPTJhLA_KSIslSqu';   // ← ★ Publishable key ★
const OWNER_WHATSAPP = '213778663946';
const MESSENGER_LINK = 'https://m.me/TIFALFALE';
let lastOrderMsg = '';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = s => document.querySelector(s);

/* ═══ الترجمة ═══ */
const I18N = {
  ar: {
    dir:'rtl',
    title:'Golden Store',
    heroTitle:'أهلاً بك في Golden Store 💝',
    heroSub:'هدايا وإكسسوارات — أحدث المنتجات بين يديك',
    heroBtn:'تصفح الأقسام',
    heroServicesBtn:'خدماتنا',
    catsTitle:'🗂️ الأقسام',
    recentTitle:'✨ وصل حديثاً',
    allCats:'الكل',
    groupsIn:'مجموعات داخل',
    backToCats:'← كل الأقسام',
    cartTitle:'🛒 سلة المشتريات',
    cartEmpty:'سلتك فارغة — ابدأ التسوق!',
    total:'المجموع',
    checkout:'تأكيد الطلب',
    sending:'جاري الإرسال...',
    fullName:'الاسم الكامل',
    phone:'رقم الهاتف',
    address:'الولاية / العنوان',
    notes:'ملاحظات (اختياري)',
    orderSuccess:'تم استلام طلبك بنجاح!',
    willCall:'سنتصل بك قريباً لتأكيد التفاصيل.',
    orderArrived:'وصل طلبك إلى المتجر ✓',
    addedCart:'تمت الإضافة إلى السلة ✓',
    addToCart:'أضف إلى السلة',
    soldOut:'نفدت الكمية 😔',
    outBadge:'نفدت الكمية',
    newBadge:'جديد ✨',
    onlyLeft:'⚡ بقي',
    only:' فقط!',
    choose:'اختر الخيار:',
    qty:'الكمية:',
    noDesc:'لا يوجد وصف لهذا المنتج بعد.',
    noProducts:'لا توجد منتجات بعد 🌱',
    noProductsCat:'لا توجد منتجات في هذا القسم بعد 🌱',
    footer:'Golden Store © — جميع الحقوق محفوظة',
    currency:' دج',
    from:'من ',
    sendFail:'تعذر الإرسال، حاول مجدداً',
    loadFail:'تعذر تحميل المنتجات',
    home:'العودة إلى الصفحة الرئيسية'
  },
  en: {
    dir:'ltr',
    title:'Golden Store',
    heroTitle:'Welcome to Golden Store 💝',
    heroSub:'Gifts & accessories — the latest products at your fingertips',
    heroBtn:'Browse Categories',
    heroServicesBtn:'Our Services',
    catsTitle:'🗂️ Categories',
    recentTitle:'✨ New Arrivals',
    allCats:'All',
    groupsIn:'Groups in',
    backToCats:'← All Categories',
    cartTitle:'🛒 Shopping Cart',
    cartEmpty:'Your cart is empty — start shopping!',
    total:'Total',
    checkout:'Place Order',
    sending:'Sending...',
    fullName:'Full name',
    phone:'Phone number',
    address:'State / Address',
    notes:'Notes (optional)',
    orderSuccess:'Your order has been received!',
    willCall:'We will call you soon to confirm the details.',
    orderArrived:'Your order reached the store ✓',
    addedCart:'Added to cart ✓',
    addToCart:'Add to cart',
    soldOut:'Out of stock 😔',
    outBadge:'Out of stock',
    newBadge:'New ✨',
    onlyLeft:'⚡ Only',
    only:' left!',
    choose:'Choose an option:',
    qty:'Quantity:',
    noDesc:'No description for this product yet.',
    noProducts:'No products yet 🌱',
    noProductsCat:'No products in this category yet 🌱',
    footer:'Golden Store © — All rights reserved',
    currency:' DZD',
    from:'from ',
    sendFail:'Failed to send, please try again',
    loadFail:'Failed to load products',
    home:'Back to home page'
  }
};

/* ═══ أيقونات SVG ═══ */
const S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  'هدايا': `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="8" width="18" height="4" rx="1.2"/><path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12"/><path d="M12 8v13"/><path d="M12 8s-1.6-4.2-4.2-4.2a2.1 2.1 0 0 0 0 4.2"/><path d="M12 8s1.6-4.2 4.2-4.2a2.1 2.1 0 0 1 0 4.2"/></svg>`,
  'إكسسوارات الهاتف': `<svg viewBox="0 0 24 24" ${S}><rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>`,
  'كفرات': `<svg viewBox="0 0 24 24" ${S}><rect x="7" y="2.5" width="10" height="19" rx="3"/><circle cx="12" cy="6" r="1.3"/><path d="M10.5 18.5h3"/></svg>`,
  'شواحن وكوابل': `<svg viewBox="0 0 24 24" ${S}><path d="M9 2.5V8M15 2.5V8"/><path d="M7 8h10v2.8a5 5 0 0 1-10 0z"/><path d="M12 15.8V21"/></svg>`,
  'سماعات': `<svg viewBox="0 0 24 24" ${S}><path d="M4 17.5V13a8 8 0 0 1 16 0v4.5"/><rect x="3" y="14" width="4.5" height="7" rx="2"/><rect x="16.5" y="14" width="4.5" height="7" rx="2"/></svg>`,
  'إكسسوارات بنات': `<svg viewBox="0 0 24 24" ${S}><path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/><path d="M6 17l.7 1.6 1.6.7-1.6.7L6 21.6l-.7-1.6-1.6-.7 1.6-.7z"/></svg>`,
  'مجوهرات': `<svg viewBox="0 0 24 24" ${S}><path d="M7 3.5h10l4 5.5-9 12-9-12z"/><path d="M3 9h18M9.5 3.5 12 9l2.5-5.5M12 21 9.5 9M12 21l2.5-12"/></svg>`,
  'إكسسوارات شعر': `<svg viewBox="0 0 24 24" ${S}><path d="M12 12 5.8 8.4C4.2 7.5 4.4 5 6.4 4.9 9.3 4.7 11.2 8.2 12 12z"/><path d="M12 12l6.2-3.6c1.6-.9 1.4-3.4-.6-3.5C14.7 4.7 12.8 8.2 12 12z"/><circle cx="12" cy="12" r="1.7"/><path d="M10.6 14.2c-1.3 2-2 3.9-1.6 6.3M13.4 14.2c1.3 2 2 3.9 1.6 6.3"/></svg>`,
  'ساعات رجالية': `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="5.3"/><path d="M9.2 7l.6-4.2h4.4L14.8 7M9.2 17l.6 4.2h4.4l.6-4.2"/><path d="M12 9.6V12l1.7 1.1"/></svg>`,
  'ساعات نسائية': `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="12" r="5.3"/><path d="M9.2 7l.6-4.2h4.4L14.8 7M9.2 17l.6 4.2h4.4l.6-4.2"/><path d="M12 9.6V12l1.7 1.1"/></svg>`,
  'أساور': `<svg viewBox="0 0 24 24" ${S}><rect x="2.8" y="14.2" width="8.6" height="5.6" rx="2.8" transform="rotate(-45 7.1 17)"/><rect x="12.6" y="4.2" width="8.6" height="5.6" rx="2.8" transform="rotate(-45 16.9 7)"/><path d="M9.5 14.5l5-5"/></svg>`,
  'سلاسل': `<svg viewBox="0 0 24 24" ${S}><path d="M4.5 3c0 7.2 3.4 11.5 7.5 11.5s7.5-4.3 7.5-11.5"/><path d="M12 14.5v2.3"/><path d="m12 21-2.1-2.9L12 15l2.1 3.1z"/></svg>`,
  'عطور': `<svg viewBox="0 0 24 24" ${S}><rect x="6" y="9.5" width="12" height="11" rx="2.5"/><path d="M10 9.5V7a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 7v2.5"/><path d="M12 2.5v3"/><circle cx="18" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="21" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`,
  'عطور نسائية': `<svg viewBox="0 0 24 24" ${S}><rect x="6" y="9.5" width="12" height="11" rx="2.5"/><path d="M10 9.5V7a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 7v2.5"/><path d="M12 2.5v3"/><circle cx="18" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="21" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`,
  'عطور رجالية': `<svg viewBox="0 0 24 24" ${S}><rect x="6" y="9.5" width="12" height="11" rx="2.5"/><path d="M10 9.5V7a1.5 1.5 0 0 1 1.5-1.5h1A1.5 1.5 0 0 1 14 7v2.5"/><path d="M12 2.5v3"/><circle cx="18" cy="3.5" r="1" fill="currentColor" stroke="none"/><circle cx="21" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`,
  'أغراض رجالية': `<svg viewBox="0 0 24 24" ${S}><circle cx="6.5" cy="14" r="3.3"/><circle cx="17.5" cy="14" r="3.3"/><path d="M9.8 14h4.4"/><path d="M3.2 14 4.3 8h4M20.8 14 19.7 8h-4"/></svg>`,
  'نظارات': `<svg viewBox="0 0 24 24" ${S}><circle cx="6.5" cy="14" r="3.3"/><circle cx="17.5" cy="14" r="3.3"/><path d="M9.8 14h4.4"/><path d="M3.2 14 4.3 8h4M20.8 14 19.7 8h-4"/></svg>`,
  'حقائب': `<svg viewBox="0 0 24 24" ${S}><rect x="3" y="7.5" width="18" height="13" rx="2.5"/><path d="M9 7.5v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>`,
  'علب وتغليف': `<svg viewBox="0 0 24 24" ${S}><path d="M21 15.5V8.4a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4a2 2 0 0 0-1 1.7v7.1a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7z"/><path d="M3.3 7.2 12 12l8.7-4.8M12 21.5V12"/></svg>`,
  'دباديب': `<svg viewBox="0 0 24 24" ${S}><circle cx="12" cy="13.5" r="5.8"/><circle cx="6" cy="8" r="2.1"/><circle cx="18" cy="8" r="2.1"/><circle cx="10" cy="12.6" r=".7" fill="currentColor" stroke="none"/><circle cx="14" cy="12.6" r=".7" fill="currentColor" stroke="none"/><ellipse cx="12" cy="15" rx="1.1" ry=".9" fill="currentColor" stroke="none"/><path d="M12 16v1.6M10.6 18.4c.5.6 2.3.6 2.8 0"/></svg>`,
  'الكل': `<svg viewBox="0 0 24 24" ${S}><path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z"/><path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>`,
  'default': `<svg viewBox="0 0 24 24" ${S}><path d="M6.2 7.5h11.6l1.1 12a1.8 1.8 0 0 1-1.8 2H6.9a1.8 1.8 0 0 1-1.8-2z"/><path d="M9 10.5V6a3 3 0 0 1 6 0v4.5"/></svg>`
};
const icon = n => ICONS[n] || ICONS['default'];

let lang = localStorage.getItem('store_lang') || 'ar';
const t = k => I18N[lang][k] || k;

function applyLang(){
  const L = I18N[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = L.dir;
  document.title = L.title;
  $('#hero-title').textContent = L.heroTitle;
  $('#hero-sub').textContent   = L.heroSub;
  $('#hero-btn').textContent   = L.heroBtn;
  $('#hero-services-btn').textContent = L.heroServicesBtn;
  $('#cats-title').textContent = L.catsTitle;
  $('#footer-txt').textContent = L.footer;
  $('#cart-title').textContent = L.cartTitle;
  $('#lang-btn').textContent   = lang === 'ar' ? 'EN' : 'ع';
  document.querySelector('.logo')?.setAttribute('aria-label', L.home);
  if (loaded) renderPage();
}
function toggleLang(){
  lang = lang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('store_lang', lang);
  applyLang();
}

/* ═══ الحالة ═══ */
let products = [], cats = [], loaded = false;
let view = 'home', catId = null, subId = null;
let current = null, selVariant = 0, qty = 1;
let cart = JSON.parse(localStorage.getItem('dz_cart') || '[]');

/* ═══════════════════════════════════════════
   ★ خريطة ربط ألوان/أنواع الخيارات بالصور
═══════════════════════════════════════════ */
const VARIANT_COLOR_IMAGES = {
  'قبعة رجالية': {
    'بيج':        '/images/hat1.jpg',
    'أزرق جينز':  '/images/hat2.jpg',
    'بيج داكن':   '/images/hat3.jpg',
    'رمادي فاتح': '/images/hat4.jpg',
    'أخضر فستقي': '/images/hat5.jpg',
    'رمادي داكن': '/images/hat6.png'
  },
  'حقيبة رجالية صغيرة': {
    'أخضر':       '/images/case1.jpg',
    'رمادي':      '/images/case2.jpg',
    'أخضر داكن':  '/images/case3.jpg',
    'أسود':       '/images/case4.jpg'
  },
  'سماعة خيط': {
    'Hoco':    '/images/earphone-wired-hoco.webp',
    'Samsung': '/images/earphone-wired-sm.webp'
  },
  'كابل شحن': {
    'Type-C':    '/images/cable-typec.jpg',
    'Micro USB': '/images/cable-micro.webp',
    'iPhone':    '/images/cable-iphone.webp'
  },
  'شاحن هاتف': {
    'عادي': '/images/charger-phone.webp',
    'سريع': '/images/charger-fast.webp'
  },
  'نظارة رجالية': {
    'تصميم 1': '/images/glass1.jpg',
    'تصميم 2': '/images/glass2.jpg',
    'تصميم 3': '/images/glass3.jpg',
    'تصميم 4': '/images/glass4.jpg',
    'تصميم 5': '/images/glass5.jpg'
  }
};

const imgURL = u => (u || '').replace(/^\/+/, '');
const catById = id => cats.find(c => c.id === id);
const mainCats = () => cats.filter(c => !c.parent_id).sort((a,b)=>a.sort_order-b.sort_order);
const subsOf = id => cats.filter(c => c.parent_id === id).sort((a,b)=>a.sort_order-b.sort_order);
const money = n => Number(n).toLocaleString('en-US') + t('currency');
const isNew = p => p.created_at && (Date.now() - new Date(p.created_at)) < 14*864e5;
const soldOut = p => !p.product_variants?.length || p.product_variants.every(v => v.stock <= 0);
const catLabel = p => {
  const c = catById(p.subcategory_id) || catById(p.category_id);
  return c ? `<span class="cat-ic">${icon(c.name)}</span>${c.name}` : `<span class="cat-ic">${icon('default')}</span>`;
};

/* ═══ التحميل ═══ */
async function loadAll(){
  const [cRes, pRes] = await Promise.all([
    db.from('categories').select('*').order('sort_order'),
    db.from('products').select('*, product_variants(*)').eq('is_active', true).order('created_at', { ascending:false })
  ]);
  if (cRes.error) console.error(cRes.error);
  if (pRes.error) console.error(pRes.error);
  cats = cRes.data || [];
  products = pRes.data || [];
  loaded = true;
  renderPage();
}

function renderPage(){ renderCatGrid(); renderSubArea(); renderShop(); renderCartBadge(); }

function renderCatGrid(){
  const cards = mainCats().map(c => `
    <div class="cat-card ${view==='cat' && catId===c.id ? 'active':''}" onclick="openCat(${c.id})">
      ${c.image_url
        ? `<img src="${imgURL(c.image_url)}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'"><div class="ph" style="display:none">${icon(c.name)}</div>`
        : `<div class="ph">${icon(c.name)}</div>`}
      <div class="ov"><b>${c.name}</b></div>
    </div>`).join('');
  $('#cat-grid').innerHTML = `
    <div class="cat-strip">
      <div class="cat-track">${cards}${cards}</div>
    </div>`;
}

function renderSubArea(){
  const area = $('#sub-area');
  if (view !== 'cat' || !catId) { area.innerHTML = ''; return; }
  const subs = subsOf(catId);
  if (!subs.length) { area.innerHTML = ''; return; }
  area.innerHTML = `
    <div class="sub-title">${t('groupsIn')} «${catById(catId).name}»:</div>
    <div class="sub-strip">
      <button class="sub-card ${!subId?'active':''}" onclick="openSub(null)">
        <div class="sq">${icon('الكل')}</div><span>${t('allCats')}</span>
      </button>
      ${subs.map(s => `
      <button class="sub-card ${subId===s.id?'active':''}" onclick="openSub(${s.id})">
        <div class="sq">${s.image_url
          ? `<img src="${imgURL(s.image_url)}" alt="${s.name}" loading="lazy" onerror="this.remove()">`
          : icon(s.name)}</div><span>${s.name}</span>
      </button>`).join('')}
    </div>`;
}

function renderShop(){
  const head = $('#shop-head'), grid = $('#grid');
  if (view === 'home') {
    head.innerHTML = `<div class="sec-head"><h2>${t('recentTitle')}</h2></div>`;
    const list = products.slice(0, 8);
    grid.innerHTML = list.length ? list.map(cardHTML).join('')
      : `<div class="empty">${t('noProducts')}</div>`;
    return;
  }
  const main = catById(catId), sub = subId ? catById(subId) : null;
  head.innerHTML = `
    <div class="crumb">
      <button onclick="goHome()">${t('backToCats')}</button>
      <span class="cur"><span class="cat-ic">${icon(main.name)}</span>${main.name}${sub ? ' / '+sub.name : ''}</span>
    </div>`;
  const subsIds = subsOf(catId).map(s => s.id);
  const list = products.filter(p =>
    subId ? p.subcategory_id === subId
          : (p.category_id === catId || subsIds.includes(p.subcategory_id)));
  grid.innerHTML = list.length ? list.map(cardHTML).join('')
    : `<div class="empty">${t('noProductsCat')}</div>`;
}

function openCat(id){
  if (view==='cat' && catId===id) { goHome(); return; }
  view='cat'; catId=id; subId=null;
  renderPage();
  document.getElementById('sub-area').scrollIntoView({behavior:'smooth', block:'center'});
}
function openSub(id){ subId=id; renderPage(); }
function goHome(){
  view='home'; catId=null; subId=null;
  closeModal(); toggleCart(false);
  renderPage();
  window.scrollTo({top:0, behavior:'smooth'});
}

/* ═══ بطاقة المنتج ═══ */
function cardHTML(p) {
  const vs = p.product_variants || [];
  const prices = vs.map(v => +v.price);
  const min = prices.length ? Math.min(...prices) : 0;
  const out = soldOut(p);
  const badges = [];
  if (out) badges.push(`<span class="badge out">${t('outBadge')}</span>`);
  else if (isNew(p)) badges.push(`<span class="badge new">${t('newBadge')}</span>`);
  if (p.old_price && min > 0 && min < +p.old_price)
    badges.push('<span class="badge off">-' + Math.round((1 - min/+p.old_price)*100) + '%</span>');
  const img = p.images?.[0];
  return `
  <article class="card" onclick="openModal(${p.id})">
    <div class="card-img">
      ${img
        ? `<img src="${imgURL(img)}" alt="${p.name}" loading="lazy" onerror="this.nextElementSibling.style.display='grid';this.remove()">
           <div class="ph" style="display:none">${icon('default')}</div>`
        : `<div class="ph">${icon('default')}</div>`}
      <div class="badges">${badges.join('')}</div>
    </div>
    <div class="card-body">
      <span class="card-cat">${catLabel(p)}</span>
      <h3>${p.name}</h3>
      <div class="card-price">
        ${p.old_price ? `<del>${money(p.old_price)}</del>` : ''}
        <b>${prices.length ? (min===Math.max(...prices) ? money(min) : t('from')+money(min)) : ''}</b>
      </div>
    </div>
  </article>`;
}

/* ═══ نافذة المنتج — الصورة تذوب في خلفيتها ═══ */
function openModal(id) {
  current = products.find(p => p.id === id);
  selVariant = 0; qty = 1;
  renderModal();
  $('#overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ $('#overlay').classList.remove('open'); document.body.style.overflow = ''; }

function renderModal() {
  const p = current, vs = p.product_variants || [], v = vs[selVariant];
  let img = p.images?.[0], out = soldOut(p);

  /* ★ لو الخيار المختار (لون/نوع) له صورة خاصة — استخدمها */
  const colorMap = VARIANT_COLOR_IMAGES[p.name];
  if (colorMap && v && colorMap[v.label]) {
    img = colorMap[v.label];
  }

<<<<<<< HEAD
=======
  /* ★ نظام الذوبان: نسخة مموهة من نفس الصورة كخلفية + الصورة حادة فوقها */
>>>>>>> cd1092375e152d29d31d987dae81f11a431efef2
  const imgBlock = img
    ? `<div class="backdrop" style="background-image:url('${imgURL(img)}')"></div>
       <img class="front" src="${imgURL(img)}" alt="${p.name}" onerror="this.style.display='none'">`
    : `<div class="ph">${icon('default')}</div>`;

  $('#modal-body').innerHTML = `
    <button class="m-close" onclick="closeModal()">✕</button>
    <div class="m-img">
      ${imgBlock}
    </div>
    <div class="m-info">
      <span class="card-cat">${catLabel(p)}</span>
      <h2>${p.name}</h2>
      <p class="m-desc">${p.description || t('noDesc')}</p>
      ${p.old_price ? `<div class="card-price" style="margin-bottom:12px"><del>${money(p.old_price)}</del></div>` : ''}
      ${vs.length ? `
        <div class="m-label">${t('choose')}</div>
        <div class="chips">
          ${vs.map((x,i)=>`<button class="chip ${i===selVariant?'active':''}" ${x.stock<=0?'disabled':''} onclick="pickV(${i})">${x.label} — ${money(x.price)}</button>`).join('')}
        </div>
        ${v && v.stock > 0 && v.stock <= 2 ? `<div class="low">${t('onlyLeft')} ${v.stock}${t('only')}</div>` : ''}
        ${!out ? `
          <div class="qty-row">
            <span>${t('qty')}</span>
            <div class="stepper">
              <button onclick="setQty(1)">+</button><b id="qty-val">${qty}</b><button onclick="setQty(-1)">−</button>
            </div>
          </div>
          <button class="cta" onclick="addCart()">${t('addToCart')} — <span id="cta-price">${money(v.price*qty)}</span></button>`
        : `<button class="cta" disabled>${t('soldOut')}</button>`}`
      : ''}
    </div>`;
}

function pickV(i){ selVariant = i; qty = 1; renderModal(); }
function setQty(d){
  const v = current.product_variants[selVariant];
  qty = Math.min(Math.max(1, qty + d), v.stock);
  $('#qty-val').textContent = qty;
  $('#cta-price').textContent = money(v.price * qty);
}

/* ═══ السلة ═══ */
function addCart(){
  const v = current.product_variants[selVariant];
  const exist = cart.find(i => i.vid === v.id);
  if (exist) exist.qty = Math.min(exist.qty + qty, v.stock);
  else cart.push({ vid:v.id, name:current.name, label:v.label, price:+v.price, stock:v.stock, qty, cat:catLabel(current) });
  saveCart(); closeModal(); showToast(t('addedCart'));
}
function saveCart(){ localStorage.setItem('dz_cart', JSON.stringify(cart)); renderCartBadge(); }
function renderCartBadge(){
  const n = cart.reduce((s,i)=>s+i.qty,0);
  $('#cart-count').textContent = n;
  $('#cart-count').style.display = n ? 'grid' : 'none';
}
function toggleCart(open){
  $('#drawer').classList.toggle('open', open);
  $('#scrim').classList.toggle('show', open);
  if (open) renderCart();
  document.body.style.overflow = open ? 'hidden' : '';
}
function cQty(ix,d){
  cart[ix].qty = Math.min(cart[ix].qty + d, cart[ix].stock);
  if (cart[ix].qty <= 0) cart.splice(ix,1);
  saveCart(); renderCart();
}
function cDel(ix){ cart.splice(ix,1); saveCart(); renderCart(); }

/* ═══ رسالة الطلب — فاتورة منسقة ═══ */
function buildOrderMessage(orderId, customer){
  const L = lang === 'ar';
  const sep = '━━━━━━━━━━━━━━━';
  const items = cart.map(i =>
    L
    ? `▪️ *${i.name}*${i.label ? ' — ' + i.label : ''}\n      الكمية: ${i.qty}  •  ${money(i.price * i.qty)}`
    : `▪️ *${i.name}*${i.label ? ' — ' + i.label : ''}\n      Qty: ${i.qty}  •  ${money(i.price * i.qty)}`
  ).join('\n\n');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const notes = customer.notes ? `\n📝 ${customer.notes}` : '';
  return L
    ? `🛍️ *طلب جديد — Golden Store*\n${sep}\n\n🧾 رقم الطلب: *${orderId.slice(0,8)}*\n\n👤 ${customer.customer_name}\n📞 ${customer.phone}\n📍 ${customer.address}${notes}\n\n${sep}\n🛒 *المنتجات:*\n\n${items}\n\n${sep}\n💰 *المجموع: ${money(total)}*`
    : `🛍️ *New order — Golden Store*\n${sep}\n\n🧾 Order #: *${orderId.slice(0,8)}*\n\n👤 ${customer.customer_name}\n📞 ${customer.phone}\n📍 ${customer.address}${notes}\n\n${sep}\n🛒 *Products:*\n\n${items}\n\n${sep}\n💰 *Total: ${money(total)}*`;
}

function renderCart(){
  if (!cart.length) { $('#drawer-body').innerHTML = `<div class="empty-cart"><div>🛒</div>${t('cartEmpty')}</div>`; return; }
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  $('#drawer-body').innerHTML = `
    ${cart.map((i,ix)=>`
    <div class="c-item">
      <div class="c-emoji">🛍️</div>
      <div class="c-info"><b>${i.name}</b><span>${i.label}</span><b class="c-price">${money(i.price*i.qty)}</b></div>
      <div class="c-qty">
        <button onclick="cQty(${ix},1)">+</button><span>${i.qty}</span><button onclick="cQty(${ix},-1)">−</button>
        <button class="c-del" onclick="cDel(${ix})">🗑</button>
      </div>
    </div>`).join('')}
    <div class="c-total"><span>${t('total')}</span><b>${money(total)}</b></div>
    <form onsubmit="checkout(event)">
      <input name="name" placeholder="${t('fullName')}" required>
      <input name="phone" type="tel" placeholder="${t('phone')}" required>
      <input name="address" placeholder="${t('address')}" required>
      <textarea name="notes" rows="2" placeholder="${t('notes')}"></textarea>
      <button id="checkout-btn" class="cta">${t('checkout')}</button>
    </form>`;
}

/* ═══ إرسال الطلب ═══ */
async function checkout(e){
  e.preventDefault();
  if (!cart.length) return;
  const btn = $('#checkout-btn'); btn.disabled = true; btn.textContent = t('sending');
  const fd = new FormData(e.target);

  const customer = {
    customer_name: fd.get('name'),
    phone:         fd.get('phone'),
    address:       fd.get('address'),
    notes:         fd.get('notes') || null
  };

  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const orderId = crypto.randomUUID();

  const { error } = await db.from('orders').insert({
    id: orderId, ...customer, total
  });

  if (error) {
    console.error('خطأ حفظ الطلب:', error);
    showToast(t('sendFail'),'err');
    btn.disabled=false; btn.textContent=t('checkout');
    return;
  }

  await db.from('order_items').insert(
    cart.map(i => ({ order_id: orderId, product_name: i.name, variant_label: i.label, unit_price: i.price, quantity: i.qty }))
  );

  const msg = buildOrderMessage(orderId, customer);
  lastOrderMsg = msg;
  cart = []; saveCart();

  $('#drawer-body').innerHTML = `
    <div class="success">
      <div class="success-emoji">🎉</div>
      <h3>${t('orderSuccess')}</h3>
      <p>${t('willCall')}</p>
      <div class="order-ref">
        🧾 ${lang==='ar' ? 'رقم طلبك' : 'Your order #'}: <b>${orderId.slice(0,8)}</b>
      </div>
      <div class="success-actions">
        <a class="wa-big" href="https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}"
           target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          ${lang==='ar' ? 'أكمل عبر واتساب' : 'Continue on WhatsApp'}
        </a>
        <button class="msgr-big" onclick="openMessenger()">
          <svg viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652V24l4.086-2.242c1.09.301 2.246.464 3.442.464 6.627 0 12-4.974 12-11.111C24 4.975 18.627 0 12 0zm1.193 14.963l-3.056-3.259-5.963 3.259L10.733 8.1l3.13 3.259 5.889-3.259-6.559 6.863z"/></svg>
          ${lang==='ar' ? 'أو أكمل عبر Messenger' : 'Or continue on Messenger'}
        </button>
        <button class="done-btn" onclick="closeOrderDone()">
          ${lang==='ar' ? '✓ تم — سنتصل بك' : '✓ Done — we will call you'}
        </button>
      </div>
    </div>`;
  showToast(t('orderArrived'));
}

async function openMessenger(){
  if (!lastOrderMsg) return;
  try {
    await navigator.clipboard.writeText(lastOrderMsg);
    showToast(lang==='ar' ? '📋 تم نسخ تفاصيل طلبك — الصقيها في المحادثة' : '📋 Order copied — paste it in the chat');
  } catch {
    showToast(lang==='ar' ? 'انسخ التفاصيل يدوياً وأرسلها في المحادثة' : 'Copy the details and send them in the chat');
  }
  window.open(MESSENGER_LINK, '_blank');
}

function closeOrderDone(){
  toggleCart(false);
  renderCart();
}

/* ═══ Esc يغلق النوافذ والسلة ═══ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    toggleCart(false);
  }
});

/* ═══ إشعارات ═══ */
let toastT;
function showToast(msg, type=''){
  const tt = $('#toast'); tt.textContent = msg; tt.className = 'toast show ' + type;
  clearTimeout(toastT); toastT = setTimeout(()=>tt.classList.remove('show'), 2500);
}

/* ═══ التشغيل + البث الحيّ ═══ */
applyLang();
loadAll();
db.channel('store')
  .on('postgres_changes', { event:'*', schema:'public', table:'products' }, loadAll)
  .on('postgres_changes', { event:'*', schema:'public', table:'product_variants' }, loadAll)
  .on('postgres_changes', { event:'*', schema:'public', table:'categories' }, loadAll)
  .subscribe(status => console.log('🔌 حالة البث:', status));
setInterval(loadAll, 30000);