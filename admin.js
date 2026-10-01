/* ═══ الاتصال ═══ */
const SUPABASE_URL = 'https://cqkbqcvjjrirbrkyodbv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_vFSo6qX4xD4wLLSPPTJhLA_KSIslSqu';

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = s => document.querySelector(s);
const money = n => Number(n).toLocaleString('en-US') + ' دج';

let cats = [];

/* ═══ الجلسة ═══ */
window.addEventListener('DOMContentLoaded', async () => {
  const { data } = await db.auth.getSession();
  if (data.session) await enterPanel();
  else showLogin();

  $('#login-form').addEventListener('submit', onLogin);
  $('#logout-btn').addEventListener('click', logout);
  document.querySelectorAll('.tab').forEach(t =>
    t.addEventListener('click', () => switchTab(t.dataset.tab)));
});

function showLogin(){ $('#login-screen').style.display='grid'; $('#panel').style.display='none'; }

let ordersChannel = null;
let svcChannel = null;

async function enterPanel(){
  $('#login-screen').style.display='none';
  $('#panel').style.display='block';
  await loadCats();
  renderProducts();
  renderOrders();
  loadOrdersCache();
  startOrdersChannel();
  renderServiceRequests();       // ★ طلبات الخدمات فور الدخول
  startServiceRequestsChannel(); // ★ بث حي لطلبات الخدمات
}

async function onLogin(e){
  e.preventDefault();
  const fd = new FormData(e.target);
  const btn = e.target.querySelector('button');
  btn.disabled = true; btn.textContent = 'جاري الدخول...';
  const { error } = await db.auth.signInWithPassword({
    email: fd.get('email'), password: fd.get('password')
  });
  btn.disabled = false; btn.textContent = 'تسجيل الدخول';
  if (error) { $('#login-error').textContent = 'البريد أو كلمة السر غير صحيحة'; return; }
  $('#login-error').textContent = '';
  await enterPanel();
}

async function logout(){ await db.auth.signOut(); location.reload(); }

function switchTab(name){
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-content').forEach(c =>
    c.style.display = c.id === 'tab-' + name ? 'block' : 'none');
  if (name === 'products')      renderProducts();
  if (name === 'orders')        renderOrders();
  if (name === 'svc-requests')  renderServiceRequests();
  if (name === 'services') $('#tab-services').innerHTML = '<div class="a-card">🛎️ إدارة الخدمات — مرحلة قادمة (التعديل حالياً من قاعدة البيانات مباشرة)</div>';
}

/* ═══ الأقسام ═══ */
async function loadCats(){
  const { data } = await db.from('categories').select('*').order('sort_order');
  cats = data || [];
}
const mainCats = () => cats.filter(c => !c.parent_id);
const subsOf   = id => cats.filter(c => c.parent_id === id);

/* ═══ المنتجات ═══ */
async function renderProducts(){
  const { data: products } = await db.from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending:false });
  const list = products || [];

  const mainOpts = mainCats().map(c => {
    const subs = subsOf(c.id);
    if (!subs.length) return `<option value="${c.id}">${c.icon} ${c.name}</option>`;
    return `<optgroup label="${c.name}">${subs.map(s =>
      `<option value="${s.id}">${s.icon} ${s.name}</option>`).join('')}</optgroup>`;
  }).join('');

  $('#tab-products').innerHTML = `
    <div class="a-card">
      <h3>➕ منتج جديد</h3>
      <form id="add-form" onsubmit="addProduct(event)">
        <input name="name" placeholder="اسم المنتج" required>
        <textarea name="description" rows="2" placeholder="الوصف (اختياري)"></textarea>
        <select name="subcategory_id" required><option value="">— اختر القسم —</option>${mainOpts}</select>
        <div class="row2">
          <input name="price" type="number" min="0" step="1" placeholder="السعر (دج)" required>
          <input name="stock" type="number" min="0" step="1" placeholder="الكمية" required>
        </div>
        <input name="old_price" type="number" min="0" step="1" placeholder="السعر قبل الخصم (اختياري)">
        <input name="vlabel" placeholder="اسم الخيار — مثلاً: لون أحمر (اختياري)">
        <label class="file-label">📷 صورة المنتج — اضغط للاختيار
          <input type="file" name="image" accept="image/*" onchange="previewImg(this)">
        </label>
        <img id="img-preview" class="preview" style="display:none">
        <button class="cta">حفظ ونشر</button>
      </form>
    </div>
    <div class="a-card">
      <h3>📦 المنتجات الحالية (${list.length})</h3>
      <div id="prod-list">
        ${list.length ? list.map(p => {
          const v = (p.product_variants||[])[0];
          const img = p.images?.[0];
          return `
          <div class="p-row ${p.is_active?'':'inactive'}">
            ${img ? `<img src="${img}" alt="">` : `<img src="" alt="" style="visibility:hidden">`}
            <div class="p-info">
              <b>${p.name}</b>
              <span>${money(v?.price||0)} • مخزون: ${v?.stock??0} • ${p.is_active?'ظاهر':'مخفي'}</span>
            </div>
            <div class="p-actions">
              <button onclick="toggleActive(${p.id}, ${!p.is_active})">${p.is_active?'إخفاء':'إظهار'}</button>
              <button class="del" onclick="delProduct(${p.id})">🗑 حذف</button>
            </div>
          </div>`;
        }).join('') : '<p style="color:var(--muted)">لا منتجات بعد</p>'}
      </div>
    </div>`;
}

function previewImg(input){
  const f = input.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = e => { $('#img-preview').src = e.target.result; $('#img-preview').style.display='block'; };
  r.readAsDataURL(f);
}

async function addProduct(e){
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const btn = form.querySelector('.cta');
  btn.disabled = true; btn.textContent = 'جاري الحفظ...';

  try {
    const file = fd.get('image');
    let images = [];
    if (file && file.size) {
      const ext = file.name.split('.').pop();
      const path = `products/${Date.now()}.${ext}`;
      const { error: upErr } = await db.storage
        .from('product-images').upload(path, file);
      if (upErr) throw new Error('فشل رفع الصورة: ' + upErr.message);
      const { data } = db.storage.from('product-images').getPublicUrl(path);
      images.push(data.publicUrl);
    }

    const subId = +fd.get('subcategory_id');
    const sub = cats.find(c => c.id === subId);
    const { data: prod, error: pErr } = await db.from('products').insert({
      name: fd.get('name'),
      description: fd.get('description') || null,
      subcategory_id: subId,
      category_id: sub?.parent_id || null,
      images,
      old_price: fd.get('old_price') ? +fd.get('old_price') : null
    }).select().single();
    if (pErr) throw new Error('فشل حفظ المنتج: ' + pErr.message);

    const { error: vErr } = await db.from('product_variants').insert({
      product_id: prod.id,
      label: fd.get('vlabel') || 'قطعة',
      price: +fd.get('price'),
      stock: +fd.get('stock')
    });
    if (vErr) throw new Error('فشل حفظ الخيار: ' + vErr.message);

    toast('تم حفظ المنتج ونشره في المتجر ✓');
    renderProducts();

  } catch (err) {
    console.error(err);
    toast(err.message, true);
    btn.disabled = false; btn.textContent = 'حفظ ونشر';
  }
}

async function toggleActive(id, val){
  const { error } = await db.from('products').update({ is_active: val }).eq('id', id);
  if (error) return toast('تعذر التعديل', true);
  toast(val ? 'المنتج ظاهر في المتجر ✓' : 'تم إخفاء المنتج من المتجر ✓');
  renderProducts();
}

async function delProduct(id){
  if (!confirm('حذف المنتج نهائياً؟ (سيحذف خياراته أيضاً)')) return;
  const { error } = await db.from('products').delete().eq('id', id);
  if (error) return toast('تعذر الحذف: ' + error.message, true);
  toast('تم حذف المنتج');
  renderProducts();
}

/* ═══════════ الطلبات ═══════════ */

const STATUS_FLOW = {
  'جديد':  ['مؤكد', 'ملغي'],
  'مؤكد':  ['منجز', 'ملغي'],
  'منجز':  [],
  'ملغي':  []
};

async function renderOrders(){
  const { data, error } = await db.from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending:false });
  if (error) { console.error(error); return toast('تعذر تحميل الطلبات', true); }
  const list = data || [];
  updateOrdersBadge(list);

  if (!list.length) {
    $('#tab-orders').innerHTML = '<div class="a-card"><h3>🧾 الطلبات</h3><p style="color:var(--muted)">لا توجد طلبات بعد — ستظهر هنا فور وصول أول طلب من الموقع ✓</p></div>';
    return;
  }
  $('#tab-orders').innerHTML = list.map(orderHTML).join('');
}

function updateOrdersBadge(list){
  const n = list.filter(o => o.status === 'جديد').length;
  const b = $('#orders-badge');
  b.textContent = n;
  b.style.display = n ? 'inline-grid' : 'none';
}

function orderHTML(o){
  const items = (o.order_items || []).map(i =>
    `<div class="o-item"><span>${i.product_name}${i.variant_label ? ' — '+i.variant_label : ''} ×${i.quantity}</span><b>${money(i.unit_price * i.quantity)}</b></div>`
  ).join('');

  const waPhone = o.phone.replace(/^0/, '213');
  const actions = STATUS_FLOW[o.status] || [];
  const btnLabel = s => s === 'مؤكد' ? '✓ تأكيد الطلب' : s === 'منجز' ? '✓ تم التسليم' : '✕ إلغاء';

  return `
  <div class="a-card order-card">
    <div class="o-head">
      <span class="s-badge" data-s="${o.status}">${o.status}</span>
      <span class="o-date">${new Date(o.created_at).toLocaleString('ar-DZ')}</span>
    </div>
    <div class="o-cust">
      <b>${o.customer_name}</b>
      <a href="tel:${o.phone}">📞 ${o.phone}</a>
      <a href="https://wa.me/${waPhone}" target="_blank" class="wa-link">واتساب 💬</a>
    </div>
    <div class="o-addr">📍 ${o.address}${o.notes ? ' — 📝 ' + o.notes : ''}</div>
    <div class="o-items">${items}</div>
    <div class="o-total"><span>المجموع</span><b>${money(o.total)}</b></div>
    ${actions.length ? `
    <div class="o-actions">
      ${actions.map(s => `<button class="o-btn ${s==='ملغي'?'danger':''}" onclick="setStatus('${o.id}','${s}')">${btnLabel(s)}</button>`).join('')}
    </div>` : ''}
  </div>`;
}

async function setStatus(id, status){
  const { error } = await db.from('orders').update({ status }).eq('id', id);
  if (error) return toast('تعذر التحديث: ' + error.message, true);
  toast('حالة الطلب أصبحت: ' + status);
  renderOrders();
}

function startOrdersChannel(){
  if (ordersChannel) return;
  ordersChannel = db.channel('admin-orders')
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'orders' },
      async () => {
        toast('🔔 وصل طلب جديد!');
        loadOrdersCache();
        if (document.querySelector('.tab[data-tab="orders"]')?.classList.contains('active')) {
          await renderOrders();
        } else {
          const { data } = await db.from('orders').select('status');
          updateOrdersBadge(data || []);
        }
      })
    .subscribe(status => console.log('🔌 بث الطلبات:', status));
}

let ordersCache = [];
async function loadOrdersCache(){
  const { data } = await db.from('orders').select('*, order_items(*)').order('created_at', {ascending:false}).limit(50);
  ordersCache = data || [];
}

/* ═══════════ طلبات الخدمات ═══════════ */

async function renderServiceRequests(){
  const { data, error } = await db.from('service_requests')
    .select('*')
    .order('created_at', { ascending:false });
  if (error) { console.error(error); return toast('تعذر تحميل طلبات الخدمات', true); }
  const list = data || [];
  updateSvcBadge(list);

  if (!list.length) {
    $('#tab-svc-requests').innerHTML = '<div class="a-card"><h3>📋 طلبات الخدمات</h3><p style="color:var(--muted)">لا توجد طلبات خدمات بعد — ستظهر هنا فور وصول أول طلب (تغليف أو ملء روائح) ✓</p></div>';
    return;
  }
  $('#tab-svc-requests').innerHTML = list.map(svcReqHTML).join('');
}

function updateSvcBadge(list){
  const n = list.filter(r => r.status === 'جديد').length;
  const b = $('#svc-badge');
  b.textContent = n;
  b.style.display = n ? 'inline-grid' : 'none';
}

function svcReqHTML(r){
  /* تفاصيل الحقول الموجودة فقط — كل خدمة تعرض ما يخصها */
  const details = [];
  if (r.gift_type)      details.push(['🎁 نوع الهدية', r.gift_type]);
  if (r.recipient)      details.push(['👥 ممن يُهدى', r.recipient]);
  if (r.packaging_type) details.push(['📦 نوع التغليف', r.packaging_type]);
  if (r.packaging_size) details.push(['📏 حجم التغليف', r.packaging_size]);
  if (r.perfume_type)   details.push(['🌸 نوع العطر', r.perfume_type]);
  if (r.bottle_size)    details.push(['🧴 سعة الزجاجة', r.bottle_size]);

  const detailRows = details.map(([k,v]) =>
    `<div class="o-item"><span>${k}</span><b>${v}</b></div>`).join('');

  const waPhone = r.phone.replace(/^0/, '213');
  const actions = STATUS_FLOW[r.status] || [];
  const btnLabel = s => s === 'مؤكد' ? '✓ تأكيد الطلب' : s === 'منجز' ? '✓ تم التنفيذ' : '✕ إلغاء';

  return `
  <div class="a-card order-card">
    <div class="o-head">
      <span class="s-badge" data-s="${r.status}">${r.status}</span>
      <span class="o-date">${new Date(r.created_at).toLocaleString('ar-DZ')}</span>
    </div>
    <div class="o-cust">
      <b>${r.customer_name}</b>
      <a href="tel:${r.phone}">📞 ${r.phone}</a>
      <a href="https://wa.me/${waPhone}" target="_blank" class="wa-link">واتساب 💬</a>
    </div>
    <div class="o-addr">🛎️ الخدمة المطلوبة: <b>${r.service_name}</b></div>
    ${details.length ? `<div class="o-items">${detailRows}</div>` : ''}
    ${actions.length ? `
    <div class="o-actions">
      ${actions.map(s => `<button class="o-btn ${s==='ملغي'?'danger':''}" onclick="setSvcStatus('${r.id}','${s}')">${btnLabel(s)}</button>`).join('')}
    </div>` : ''}
  </div>`;
}

async function setSvcStatus(id, status){
  const { error } = await db.from('service_requests').update({ status }).eq('id', id);
  if (error) return toast('تعذر التحديث: ' + error.message, true);
  toast('حالة طلب الخدمة أصبحت: ' + status);
  renderServiceRequests();
}

function startServiceRequestsChannel(){
  if (svcChannel) return;
  svcChannel = db.channel('admin-svc')
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'service_requests' },
      async () => {
        toast('🔔 وصل طلب خدمة جديد!');
        if (document.querySelector('.tab[data-tab="svc-requests"]')?.classList.contains('active')) {
          await renderServiceRequests();
        } else {
          const { data } = await db.from('service_requests').select('status');
          updateSvcBadge(data || []);
        }
      })
    .subscribe(status => console.log('🔌 بث طلبات الخدمات:', status));
}

/* ═══ إشعار ═══ */
let toastT;
function toast(msg, err=false){
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show' + (err ? ' err' : '');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}