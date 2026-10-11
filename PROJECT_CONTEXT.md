OVERVIEW
E-commerce store: gifts & accessories (Algeria 🇩🇿, currency: DZD "دج")
Vanilla HTML/CSS/JS — NO framework
Backend: Supabase (Postgres + Auth + Storage + Realtime)
Arabic RTL (default) + English LTR toggle | Dark (default) + Light themes
Font: Cairo (Google Fonts)
FILES (8)
index.html — storefront: hero, category marquee, product grid, cart drawer, modal, toast, footer
script.js — engine: i18n (I18N obj), cart, checkout → orders table → WhatsApp/Messenger invoice, realtime + 30s poll, theme
style.css — design system: champagne gold/dark + ivory/light, responsive (680/760px), touch + reduced-motion support
services.html — services page (gift wrapping + perfume filling). ⚠️ SELF-CONTAINED: has its own copy of Supabase config + OWNER_WHATSAPP
services.css — wave banner cards (hover: wave rises to 82%), pink tint for women's perfume
admin.html — admin panel shell: login screen + 4 tabs
admin.css — admin styling (separate light palette)
admin.js — Supabase Auth (email login), product CRUD + image upload, order/service-request management, status flow, realtime badges
SUPABASE CONFIG (publishable key — safe for client-side)
URL: https://cqkbqcvjjrirbrkyodbv.supabase.co
KEY: sb_publishable_vFSo6qX4xD4wLLSPPTJhLA_KSIslSqu
Storage bucket: "product-images" (path: products/.)
Realtime on: products, product_variants, categories (store) + orders, service_requests (admin)
TABLES (7) & KEY FIELDS
categories: id, name, icon, parent_id (null = main cat), sort_order, image_url
products: id, name, description, category_id, subcategory_id, images[], old_price, is_active, created_at
product_variants: id, product_id, label, price, stock
orders: id (uuid), customer_name, phone, address, notes, total, status, created_at
order_items: order_id, product_name, variant_label, unit_price, quantity
services: id, name, description, price, is_active
service_requests: id, service_id, service_name, customer_name, phone, gift_type, recipient, packaging_type, packaging_size, perfume_type, bottle_size, status, created_at
OWNER CONTACT INFO
WhatsApp: 213672072270 → lives in 3 PLACES:
script.js → const OWNER_WHATSAPP
services.html → const OWNER_WHATSAPP
index.html → footer link https://wa.me/213672072270
Messenger: https://m.me/TIFALFALE | Facebook: facebook.com/TIFALFALE
localStorage KEYS
store_lang (ar/en) | store_theme (dark/light) | dz_cart (cart JSON)
KEY CONVENTIONS & SYSTEMS
money(n) = Number.toLocaleString('en-US') + ' دج'
imgURL() strips leading slashes from image paths
Order ID = crypto.randomUUID(), shown as first 8 chars
Checkout flow: save order to DB FIRST → then show WhatsApp (prefilled msg) / Messenger (copies to clipboard, no prefill API) buttons
VARIANT_COLOR_IMAGES (script.js): maps product name + variant label → specific image
SVC_IMAGES / WRAP_OPTIONS / PERFUME_OPTIONS: hardcoded in services.html
Admin order status flow: جديد → مؤكد → منجز | ملغي
Admin customer WA links: phone.replace(/^0/,'213') — hardcoded DZ prefix
Icons: ICONS map in script.js, keyed by Arabic category names
⭐ PENDING TASKS
CHANGE WHATSAPP NUMBER (original request — new number not yet provided!) — must edit all 3 locations above
Proposal: create config.js to centralize OWNER_WHATSAPP + Supabase URL/KEY (kills the services.html duplication)
Check: services.css file might contain content duplicated (paste artifact suspected)
Admin "Services" tab = placeholder (managed via DB directly for now)
admin.js waPhone: breaks for non-Algerian customer numbers (future concern)
DESIGN TOKENS
Dark: bg #0B0B0E, surface #15151B, text #F3F0E9, gold #E3C27C
Gold gradient: 135deg #F6E7BF → #E3C27C → #C6A053
Light: bg #FAF8F2, gold #8F6E24, text #27221A
