import { useState, useEffect } from "react";
import { supabase } from './supabase';

// ═══════════════════════════════════════════════════
// TACTICAL PRINTING — 3D Printed Firearm Accessories
// ═══════════════════════════════════════════════════

const C = {
  bg: "#0c0c0c", bgAlt: "#141414", card: "#1a1a1a", cardHover: "#222",
  surface: "#1e1e1e", border: "#2a2a2a", borderLight: "#333",
  od: "#4a5a2a", odLight: "#6a7a3a", odDark: "#3a4a1a",
  fde: "#b8a47a", fdeDark: "#9a8860", fdeLight: "#d0c098",
  accent: "#c8a84a", accentDark: "#a88830",
  red: "#8a2020", redLight: "#b83030",
  text: "#e0ddd5", textMuted: "#888580", textDim: "#555",
  white: "#f0ede5",
};

const FONT = {
  display: "'Oswald', 'Impact', sans-serif",
  body: "'Barlow', 'Segoe UI', sans-serif",
  mono: "'Share Tech Mono', monospace",
};

// ═══════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════
const Ic = ({ n, s = 18, c = "currentColor", st = {} }) => {
  const p = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: c, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, ...st } };
  const ic = {
    cart: <svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    search: <svg {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
    x: <svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    minus: <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    plus: <svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    check: <svg {...p}><polyline points="20,6 9,17 4,12"/></svg>,
    star: <svg {...p} fill={c} stroke="none"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    starO: <svg {...p}><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>,
    truck: <svg {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16,8 20,8 23,11 23,16 16,16 16,8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    shield: <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    flag: <svg {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,
    credit: <svg {...p}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    mail: <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    menu: <svg {...p}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    user: <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    arrow: <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
    grid: <svg {...p}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    pkg: <svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    left: <svg {...p}><polyline points="15,18 9,12 15,6"/></svg>,
    right: <svg {...p}><polyline points="9,18 15,12 9,6"/></svg>,
  };
  return ic[n] || null;
};

// ═══════════════════════════════════════════════════
// PRODUCT DATA
// ═══════════════════════════════════════════════════
const CATEGORIES = [
  { id: "magwells", name: "Magwells", desc: "Flared friction-fit magwells" },
  { id: "mounts", name: "Mounts / Stands", desc: "Display and storage mounts" },
  { id: "couplers", name: "Mag Couplers", desc: "Magazine coupling systems" },
  { id: "risers", name: "Risers", desc: "Cheek risers and spacers" },
  { id: "optic", name: "ARDs / Lens Covers", desc: "Anti-reflection devices" },
  { id: "org", name: "Organization", desc: "Mag holders and storage" },
  { id: "misc", name: "Misc", desc: "Other accessories" },
];

const COLORS = [
  { id: "black", name: "PETG-CF Black", hex: "#1a1a1a" },
  { id: "fde", name: "PETG-CF FDE", hex: "#b8a47a" },
  { id: "odg", name: "PETG-CF OD Green", hex: "#4a5a2a" },
  { id: "gray", name: "PETG-CF Gray", hex: "#6a6a6a" },
  { id: "red", name: "PETG-CF Red", hex: "#8a2020" },
  { id: "brown", name: "PETG-CF Earth Brown", hex: "#6a4a2a" },
];

const PRODUCTS = [
  { id: "p1", name: "AR15 Friction-Fit Flared Magwell", cat: "magwells", price: 25, rating: 4.9, reviews: 115, sold: 2500, badge: "BEST SELLER",
    desc: "The wide flare increases the area the mag can be pushed into the magwell significantly. Designed to precisely align with the existing magwell for seamless magazine insertion.",
    features: ["Easier mag insertion with wide flare", "Friction-fit design - no tools or adhesive needed", "Tested with M2 Pmag, M3 Pmag, D60, Lancer, USGI metal mags", "PETG-CF material for higher temp resistance"],
    variants: ["Milspec AR15", "Aero M4E1", "Aero M5", "BCM / BCM4", "Radian ADAC", "LMT MARS-L", "LMT MARS-H", "HK 416 / MR556", "LWRC IC", "PSA PA-10", "Sig MCX / Spear LT", "ADM UIC / ADM4", "Griffin MK2", "Aero EPC-9"],
    images: ["magwell_1", "magwell_2", "magwell_3", "magwell_4"] },
  { id: "p2", name: "AR15 Mag Coupler", cat: "couplers", price: 12, rating: 4.8, reviews: 89, sold: 1800,
    desc: "Couples two AR15 Pmag magazines together for faster reloads. Works with the flared magwell or standalone. Rock-solid lock-up with quick-release tab.",
    features: ["Works with M2 and M3 Pmag magazines", "Quick-release tab for easy separation", "Compatible with flared magwell", "Slim profile - no snag points"],
    variants: ["M2 Pmag", "M3 Pmag", "M3 Pmag - Slim"],
    images: ["coupler_1", "coupler_2", "coupler_3"] },
  { id: "p3", name: "Pistol Wall Mount", cat: "mounts", price: 15, rating: 4.7, reviews: 67, sold: 1200,
    desc: "Low-profile wall mount for pistols. Displays your handgun securely on any wall or inside a safe. Barrel-down orientation for safe storage.",
    features: ["Fits most full-size and compact pistols", "Barrel-down safe orientation", "Includes mounting hardware", "Foam-lined contact points"],
    variants: ["Universal Fit", "1911 Specific", "Glock Specific"],
    images: ["mount_1", "mount_2"] },
  { id: "p4", name: "6-Mag Pmag Holder", cat: "org", price: 20, rating: 5.0, reviews: 43, sold: 650, badge: "NEW",
    desc: "Holds 6 AR15 Pmag magazines in a compact, stackable design. Perfect for the range bag, safe, or workbench.",
    features: ["Holds 6 standard AR15 Pmag mags", "Stackable design", "Non-slip rubber feet", "Works with M2 and M3 Pmags"],
    variants: ["AR15 Pmag", "AR10 Pmag", "AK Pmag"],
    images: ["holder_1", "holder_2", "holder_3"] },
  { id: "p5", name: "Optic ARD / Kill Flash", cat: "optic", price: 10, rating: 4.8, reviews: 52, sold: 900,
    desc: "Anti-reflection device that reduces glare and signature from optic lenses. Friction-fit design for quick install and removal.",
    features: ["Reduces lens glare and signature", "Friction-fit - no tools needed", "Does not affect sight picture", "Honeycomb pattern"],
    variants: ["Aimpoint T2/CompM5", "Aimpoint PRO", "EOTech EXPS", "Holosun 510C", "Holosun ARO", "Vortex UH-1", "Sig Romeo 4/5"],
    images: ["ard_1", "ard_2"] },
  { id: "p6", name: "Adjustable Cheek Riser", cat: "risers", price: 18, rating: 4.6, reviews: 38, sold: 420,
    desc: "Adjustable cheek riser for proper eye alignment with optics. Three height settings. Clamps securely to standard mil-spec and commercial stocks.",
    features: ["3 height adjustment settings", "Fits mil-spec and commercial stocks", "No-slip textured surface", "Quick install/remove"],
    variants: ["Mil-Spec Stock", "Magpul MOE", "Magpul CTR/STR", "B5 SOPMOD"],
    images: ["riser_1", "riser_2"] },
  { id: "p7", name: "Vertical Grip Plug", cat: "misc", price: 8, rating: 4.9, reviews: 29, sold: 560,
    desc: "Storage plug for BCM and Magpul vertical grips. Keeps batteries, small tools, or spare parts secured inside your grip.",
    features: ["Waterproof seal", "Fits BCM and Magpul grips", "Textured pull tab", "Battery storage compatible"],
    variants: ["BCM Mod 3", "Magpul MVG", "Magpul RVG"],
    images: ["plug_1", "plug_2"] },
  { id: "p8", name: "Suppressor Mount Stand", cat: "mounts", price: 22, rating: 4.8, reviews: 34, sold: 380, badge: "NEW",
    desc: "Display and storage stand for rifle suppressors. Keeps your can upright and secure on the bench or in the safe.",
    features: ["Fits 1.5\" to 2\" diameter cans", "Weighted non-tip base", "Foam-lined cradle", "Works with most rifle suppressors"],
    variants: ["1.5\" Diameter", "1.75\" Diameter", "2.0\" Diameter"],
    images: ["supp_1", "supp_2"] },
];

const MOCK_REVIEWS = [
  { name: "Mike T.", rating: 5, text: "Quality product, excellent fit. Makes reloads way faster and the rifle looks more complete.", verified: true, date: "May 2026" },
  { name: "Sarah K.", rating: 5, text: "Couldn't believe the price. Shipping was fast, product is solid. Already ordered more for my other builds.", verified: true, date: "Apr 2026" },
  { name: "Jake R.", rating: 5, text: "Perfect friction fit on my Aero M4E1. No slop, no wobble. Looks factory.", verified: true, date: "Apr 2026" },
  { name: "Chris D.", rating: 4, text: "Great product for the price. Took a little extra push to get it seated but once on it's rock solid.", verified: true, date: "Mar 2026" },
  { name: "Brandon W.", rating: 5, text: "10/10. Already recommended to everyone in my shooting group. The OD Green color is spot on.", verified: true, date: "Mar 2026" },
];

// ═══════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════

const Btn = ({ children, v = "primary", onClick, st = {}, disabled = false, full = false }) => {
  const [h, setH] = useState(false);
  const base = { padding: "12px 28px", borderRadius: 4, fontFamily: FONT.display, fontWeight: 500, fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase", cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.2s", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: disabled ? 0.4 : 1, width: full ? "100%" : "auto" };
  const vars = {
    primary: { background: h ? C.accentDark : C.accent, color: C.bg },
    secondary: { background: h ? C.borderLight : C.surface, color: C.text, border: `1px solid ${C.border}` },
    danger: { background: h ? C.redLight : C.red, color: "#fff" },
    ghost: { background: "transparent", color: h ? C.text : C.textMuted },
  };
  return <button style={{ ...base, ...vars[v], ...st }} onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>{children}</button>;
};

const Stars = ({ r, s = 14, count }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
    {[1,2,3,4,5].map(i => <Ic key={i} n={i <= Math.round(r) ? "star" : "starO"} s={s} c={i <= Math.round(r) ? C.accent : C.textDim} />)}
    {count !== undefined && <span style={{ marginLeft: 6, fontFamily: FONT.body, fontSize: s - 2, color: C.textMuted }}>({count})</span>}
  </span>
);

const Badge = ({ children, color = C.accent }) => (
  <span style={{ padding: "3px 10px", borderRadius: 2, fontSize: 10, fontFamily: FONT.display, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase", background: `${color}22`, color, border: `1px solid ${color}44` }}>{children}</span>
);

const ColorSwatch = ({ color, active, onClick }) => (
  <button onClick={onClick} title={color.name} style={{
    width: 36, height: 36, borderRadius: 4, background: color.hex, cursor: "pointer",
    border: `2px solid ${active ? C.accent : "transparent"}`, outline: active ? `2px solid ${C.accent}44` : "none",
    transition: "all 0.15s",
  }} />
);

// fake product image placeholder with geometric pattern
const ProductImage = ({ product, variant, color, size = 400 }) => {
  const colorHex = COLORS.find(c => c.id === color)?.hex || "#1a1a1a";
  const catIcons = { magwells: "M", couplers: "C", mounts: "MT", org: "ORG", optic: "ARD", risers: "R", misc: "ACC" };
  return (
    <div style={{
      width: "100%", height: size, background: `linear-gradient(145deg, ${C.bgAlt}, ${C.card})`,
      borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, ${C.text} 20px, ${C.text} 21px)` }} />
      <div style={{ width: 80, height: 80, borderRadius: 8, background: colorHex, display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${C.border}`, marginBottom: 12, boxShadow: `0 4px 20px rgba(0,0,0,0.4)` }}>
        <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: colorHex === "#1a1a1a" ? C.textMuted : "#fff", letterSpacing: 2, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{catIcons[product.cat] || "TP"}</span>
      </div>
      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.textDim, letterSpacing: 1 }}>PRODUCT IMAGE</span>
      <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.textDim, marginTop: 2 }}>{COLORS.find(c => c.id === color)?.name || ""}</span>
    </div>
  );
};

// ═══════════════════════════════════════════════════
// PRODUCT DETAIL PAGE
// ═══════════════════════════════════════════════════

function ProductDetail({ product, onBack, onAddToCart }) {
  const [selColor, setSelColor] = useState("black");
  const [selVariant, setSelVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const handleAdd = () => {
    onAddToCart({ ...product, selectedColor: selColor, selectedVariant: selVariant, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: C.accent, fontFamily: FONT.body, fontSize: 13, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 4 }}>
        <Ic n="left" s={16} c={C.accent} /> Back to shop
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        {/* Image Gallery */}
        <div>
          <ProductImage product={product} color={selColor} size={450} />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {product.images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} style={{
                width: 72, height: 72, borderRadius: 4, background: C.card, border: `2px solid ${activeImg === i ? C.accent : C.border}`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT.mono, fontSize: 9, color: C.textDim,
              }}>{i + 1}</button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          {product.badge && <Badge>{product.badge}</Badge>}
          <h1 style={{ fontFamily: FONT.display, fontSize: 32, fontWeight: 700, color: C.white, margin: "8px 0 6px", letterSpacing: 1, lineHeight: 1.2 }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <Stars r={product.rating} count={product.reviews} />
            <span style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 12 }}>{product.sold.toLocaleString()}+ sold</span>
          </div>

          <div style={{ fontFamily: FONT.display, fontSize: 36, fontWeight: 700, color: C.accent, letterSpacing: 1, marginBottom: 20 }}>
            ${product.price.toFixed(2)} <span style={{ fontSize: 14, color: C.textMuted, fontWeight: 400 }}>USD</span>
          </div>

          <p style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>{product.desc}</p>

          {/* Color Selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: FONT.display, fontSize: 12, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Color: <span style={{ color: C.text }}>{COLORS.find(c => c.id === selColor)?.name}</span>
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              {COLORS.map(c => <ColorSwatch key={c.id} color={c} active={selColor === c.id} onClick={() => setSelColor(c.id)} />)}
            </div>
          </div>

          {/* Variant Selection */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: FONT.display, fontSize: 12, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Style / Model
            </label>
            <select value={selVariant} onChange={e => setSelVariant(e.target.value)} style={{
              width: "100%", padding: "12px 14px", borderRadius: 4, background: C.surface, color: C.text,
              border: `1px solid ${C.border}`, fontFamily: FONT.body, fontSize: 14, cursor: "pointer", outline: "none",
            }}>
              {product.variants.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontFamily: FONT.display, fontSize: 12, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Quantity</label>
            <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: 44, borderRadius: "4px 0 0 4px", border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="minus" s={16} /></button>
              <div style={{ width: 60, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.card, fontFamily: FONT.mono, color: C.text, fontSize: 16 }}>{qty}</div>
              <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: 44, borderRadius: "0 4px 4px 0", border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n="plus" s={16} /></button>
            </div>
          </div>

          {/* Add to Cart */}
          <Btn full onClick={handleAdd} v={added ? "secondary" : "primary"} st={{ padding: "16px 0", fontSize: 15 }}>
            {added ? <><Ic n="check" s={18} c={C.accent} /> Added to Cart</> : <><Ic n="cart" s={18} c={C.bg} /> Add to Cart</>}
          </Btn>

          {/* Shipping Info */}
          <div style={{ display: "flex", gap: 20, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {[
              { icon: "truck", text: "$5 flat rate shipping. Free over $50." },
              { icon: "shield", text: "Lifetime warranty on all products." },
              { icon: "flag", text: "Made in USA. Ships in 1-4 days." },
            ].map(i => (
              <div key={i.icon} style={{ display: "flex", alignItems: "start", gap: 8, flex: 1 }}>
                <Ic n={i.icon} s={18} c={C.od} st={{ marginTop: 2 }} />
                <span style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 12, lineHeight: 1.4 }}>{i.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
        <h3 style={{ fontFamily: FONT.display, fontSize: 20, color: C.white, letterSpacing: 1, marginBottom: 16 }}>FEATURES</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {product.features.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "start", gap: 10, padding: 14, background: C.card, borderRadius: 4, border: `1px solid ${C.border}` }}>
              <Ic n="check" s={16} c={C.od} st={{ marginTop: 2 }} />
              <span style={{ fontFamily: FONT.body, color: C.text, fontSize: 14, lineHeight: 1.4 }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Material & Warranty */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginTop: 24 }}>
        {[
          { title: "MATERIAL", body: "FDM 3D-Printed with PETG-CF filament. Higher temperature resistance and strength than standard PLA+." },
          { title: "SHIPPING", body: "$5 flat rate USPS shipping. Orders over $50 ship free. Most items ship within 1-4 business days." },
          { title: "WARRANTY", body: "If an item breaks, reach out with your order number and photos. Replacement or refund sent ASAP. No questions asked." },
        ].map(s => (
          <div key={s.title} style={{ padding: 20, background: C.card, borderRadius: 4, border: `1px solid ${C.border}` }}>
            <h4 style={{ fontFamily: FONT.display, fontSize: 13, color: C.accent, letterSpacing: 1.5, margin: "0 0 8px" }}>{s.title}</h4>
            <p style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 13, lineHeight: 1.5, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div style={{ marginTop: 40, paddingTop: 32, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: FONT.display, fontSize: 20, color: C.white, letterSpacing: 1, margin: 0 }}>CUSTOMER REVIEWS</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Stars r={product.rating} s={16} /><span style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 14 }}>Based on {product.reviews} reviews</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {MOCK_REVIEWS.map((r, i) => (
            <div key={i} style={{ padding: 18, background: C.card, borderRadius: 4, border: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT.display, fontSize: 14, color: C.textMuted }}>{r.name[0]}</div>
                  <div><div style={{ fontFamily: FONT.body, fontWeight: 600, color: C.text, fontSize: 14 }}>{r.name} {r.verified && <Badge color={C.od}>Verified</Badge>}</div></div>
                </div>
                <span style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 12 }}>{r.date}</span>
              </div>
              <Stars r={r.rating} s={12} />
              <p style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 14, lineHeight: 1.5, margin: "8px 0 0" }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// CART DRAWER
// ═══════════════════════════════════════════════════

function CartDrawer({ cart, setCart, open, onClose }) {
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [card, setCard] = useState({ num: "", exp: "", cvc: "", name: "", email: "" });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total >= 50 ? 0 : 5;

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)" }} />
      <div style={{ width: 440, maxWidth: "90vw", background: C.bg, borderLeft: `1px solid ${C.border}`, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "18px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: FONT.display, fontSize: 18, color: C.white, letterSpacing: 1.5, margin: 0 }}>
            {orderDone ? "ORDER CONFIRMED" : checkingOut ? "CHECKOUT" : `CART (${cart.reduce((s, i) => s + i.qty, 0)})`}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic n="x" s={22} c={C.textMuted} /></button>
        </div>

        <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          {orderDone ? (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.od + "22", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Ic n="check" s={32} c={C.od} /></div>
              <h3 style={{ fontFamily: FONT.display, color: C.white, fontSize: 22, letterSpacing: 1 }}>ORDER PLACED</h3>
              <p style={{ fontFamily: FONT.body, color: C.textMuted, lineHeight: 1.5 }}>Your order of ${(total + shipping).toFixed(2)} has been confirmed. You'll receive a shipping confirmation email within 1-4 business days.</p>
              <Btn st={{ marginTop: 20 }} onClick={() => { setCart([]); setOrderDone(false); setCheckingOut(false); onClose(); }}>Continue Shopping</Btn>
            </div>
          ) : checkingOut ? (
            <div>
              <div style={{ marginBottom: 20 }}>
                {cart.map(i => (
                  <div key={i.id + i.selectedVariant + i.selectedColor} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontFamily: FONT.body, fontSize: 13, color: C.text, borderBottom: `1px solid ${C.border}` }}>
                    <span>{i.name} x{i.qty}<br/><span style={{ fontSize: 11, color: C.textDim }}>{i.selectedVariant} / {COLORS.find(c => c.id === i.selectedColor)?.name}</span></span>
                    <span style={{ fontFamily: FONT.mono, color: C.accent }}>${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontFamily: FONT.body, fontSize: 13, color: C.textMuted }}><span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontFamily: FONT.display, fontSize: 18, color: C.white, borderTop: `1px solid ${C.border}` }}>
                  <span>TOTAL</span><span style={{ color: C.accent }}>${(total + shipping).toFixed(2)}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { ph: "Email", k: "email" },
                  { ph: "Name on card", k: "name" },
                  { ph: "Card number", k: "num" },
                ].map(f => (
                  <input key={f.k} placeholder={f.ph} value={card[f.k]} onChange={e => setCard(p => ({ ...p, [f.k]: e.target.value }))} style={{ padding: "12px 14px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT.body, fontSize: 14, outline: "none" }} />
                ))}
                <div style={{ display: "flex", gap: 10 }}>
                  <input placeholder="MM/YY" value={card.exp} onChange={e => setCard(p => ({ ...p, exp: e.target.value }))} style={{ flex: 1, padding: "12px 14px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT.body, fontSize: 14, outline: "none" }} />
                  <input placeholder="CVC" value={card.cvc} onChange={e => setCard(p => ({ ...p, cvc: e.target.value }))} style={{ flex: 1, padding: "12px 14px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT.body, fontSize: 14, outline: "none" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: 10, background: C.od + "10", borderRadius: 4 }}>
                  <Ic n="shield" s={14} c={C.od} /><span style={{ fontFamily: FONT.body, fontSize: 11, color: C.od }}>Secured by Stripe. Card info never stored.</span>
                </div>
              </div>
              <Btn full onClick={() => setOrderDone(true)} st={{ marginTop: 16, padding: "14px 0" }} disabled={!card.email || !card.num}>
                <Ic n="credit" s={16} c={C.bg} /> PAY ${(total + shipping).toFixed(2)}
              </Btn>
              <button onClick={() => setCheckingOut(false)} style={{ width: "100%", marginTop: 8, padding: 10, background: "none", border: "none", color: C.textMuted, fontFamily: FONT.body, fontSize: 13, cursor: "pointer" }}>Back to cart</button>
            </div>
          ) : cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <Ic n="cart" s={48} c={C.textDim} />
              <p style={{ fontFamily: FONT.body, color: C.textMuted, marginTop: 16 }}>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ width: 64, height: 64, borderRadius: 4, background: C.card, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 4, background: COLORS.find(c => c.id === item.selectedColor)?.hex || C.surface }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT.body, fontWeight: 600, color: C.text, fontSize: 13, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                    <div style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 11, marginBottom: 6 }}>{item.selectedVariant} / {COLORS.find(c => c.id === item.selectedColor)?.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button onClick={() => setCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: Math.max(1, c.qty - 1) } : c))} style={{ width: 26, height: 26, borderRadius: 3, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>-</button>
                      <span style={{ fontFamily: FONT.mono, color: C.text, width: 20, textAlign: "center", fontSize: 13 }}>{item.qty}</span>
                      <button onClick={() => setCart(prev => prev.map((c, i) => i === idx ? { ...c, qty: c.qty + 1 } : c))} style={{ width: 26, height: 26, borderRadius: 3, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>+</button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: FONT.mono, color: C.accent, fontWeight: 600, fontSize: 14 }}>${(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic n="x" s={14} c={C.textDim} /></button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {!checkingOut && !orderDone && cart.length > 0 && (
          <div style={{ padding: 20, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontFamily: FONT.body, fontSize: 13, color: C.textMuted }}>
              <span>Subtotal</span><span>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontFamily: FONT.body, fontSize: 13, color: C.textMuted }}>
              <span>Shipping</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontFamily: FONT.display, fontSize: 20, color: C.white }}>
              <span>TOTAL</span><span style={{ color: C.accent }}>${(total + shipping).toFixed(2)}</span>
            </div>
            <Btn full onClick={() => setCheckingOut(true)} st={{ padding: "14px 0" }}>CHECKOUT</Btn>
            {total < 50 && <p style={{ fontFamily: FONT.body, fontSize: 11, color: C.textDim, textAlign: "center", marginTop: 8 }}>Add ${(50 - total).toFixed(2)} more for free shipping</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════

export default function TacticalPrinting() {
  const [page, setPage] = useState("home"); // home | category | product
  const [selCat, setSelCat] = useState(null);
  const [selProduct, setSelProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [dbColors, setDbColors] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:wght@400;500;600;700&family=Share+Tech+Mono&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  useEffect(() => {
    async function loadData() {
      // Load products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .order('sort_order');

      // Load colors
      const { data: colors } = await supabase
        .from('product_colors')
        .select('*')
        .order('sort_order');

      if (products) setDbProducts(products);
      if (colors) setDbColors(colors.map(c => ({ id: c.slug, name: c.name, hex: c.hex_code })));
      setDbLoading(false);
    }
    loadData();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const key = item.id + item.selectedVariant + item.selectedColor;
      const existing = prev.findIndex(c => c.id + c.selectedVariant + c.selectedColor === key);
      if (existing >= 0) {
        return prev.map((c, i) => i === existing ? { ...c, qty: c.qty + item.qty } : c);
      }
      return [...prev, item];
    });
    setCartOpen(true);
  };

  const openProduct = (p) => { setSelProduct(p); setPage("product"); window.scrollTo(0, 0); };
  const openCategory = (cat) => { setSelCat(cat); setPage("category"); window.scrollTo(0, 0); };
  const goHome = () => { setPage("home"); setSelProduct(null); setSelCat(null); window.scrollTo(0, 0); };

  const activeProducts = dbProducts.length > 0 ? dbProducts.map(p => ({
    ...p,
    cat: p.category,
    images: ['img_1', 'img_2', 'img_3'],
  })) : PRODUCTS;

  const filteredProducts = selCat ? activeProducts.filter(p => p.cat === selCat) : activeProducts;
  const searchResults = searchQ.length > 1 ? activeProducts.filter(p => `${p.name} ${p.desc} ${p.cat}`.toLowerCase().includes(searchQ.toLowerCase())) : [];

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: FONT.body, opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }}>
      {/* HEADER */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: C.bg + "f0", backdropFilter: "blur(10px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <button onClick={goHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 4, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: FONT.display, fontSize: 20, fontWeight: 700, color: C.bg }}>TP</span>
              </div>
              <span style={{ fontFamily: FONT.display, fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: 2 }}>TACTICAL PRINTING</span>
            </button>
          </div>

          <nav style={{ display: "flex", gap: 4 }}>
            {CATEGORIES.slice(0, 6).map(cat => (
              <button key={cat.id} onClick={() => openCategory(cat.id)} style={{
                padding: "6px 14px", borderRadius: 3, border: "none", cursor: "pointer",
                fontFamily: FONT.display, fontSize: 12, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase",
                background: selCat === cat.id ? C.accent + "18" : "transparent",
                color: selCat === cat.id ? C.accent : C.textMuted,
                transition: "all 0.15s",
              }}>{cat.name}</button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}>
              <Ic n="search" s={20} c={C.textMuted} />
            </button>
            <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, position: "relative" }}>
              <Ic n="cart" s={20} c={C.textMuted} />
              {cartCount > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, width: 18, height: 18, borderRadius: "50%", background: C.accent, color: C.bg, fontFamily: FONT.display, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div style={{ padding: "0 24px 16px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: "10px 14px" }}>
              <Ic n="search" s={18} c={C.textDim} />
              <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..." style={{ background: "transparent", border: "none", outline: "none", flex: 1, color: C.text, fontFamily: FONT.body, fontSize: 15 }} />
              {searchQ && <button onClick={() => setSearchQ("")} style={{ background: "none", border: "none", cursor: "pointer" }}><Ic n="x" s={16} c={C.textDim} /></button>}
            </div>
            {searchResults.length > 0 && (
              <div style={{ marginTop: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, overflow: "hidden" }}>
                {searchResults.map(p => (
                  <button key={p.id} onClick={() => { openProduct(p); setSearchOpen(false); setSearchQ(""); }} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", width: "100%",
                    background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`,
                    cursor: "pointer", textAlign: "left", color: C.text,
                  }}>
                    <Ic n="pkg" s={18} c={C.textDim} />
                    <div><div style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: 14 }}>{p.name}</div><div style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 12 }}>${p.price.toFixed(2)}</div></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* PRODUCT DETAIL */}
        {page === "product" && selProduct && (
          <ProductDetail product={selProduct} onBack={() => { setPage(selCat ? "category" : "home"); setSelProduct(null); }} onAddToCart={addToCart} />
        )}

        {/* HOME / CATEGORY */}
        {page !== "product" && (
          <>
            {/* Hero (home only) */}
            {page === "home" && (
              <div style={{
                padding: "60px 48px", borderRadius: 6, marginBottom: 40, position: "relative", overflow: "hidden",
                background: `linear-gradient(135deg, ${C.bgAlt}, ${C.card})`,
                border: `1px solid ${C.border}`,
              }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 30px, ${C.text} 30px, ${C.text} 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, ${C.text} 30px, ${C.text} 31px)` }} />
                <div style={{ position: "relative", maxWidth: 600 }}>
                  <div style={{ fontFamily: FONT.display, fontSize: 11, color: C.accent, letterSpacing: 3, marginBottom: 12 }}>3D PRINTED FIREARM ACCESSORIES</div>
                  <h1 style={{ fontFamily: FONT.display, fontSize: 48, fontWeight: 700, color: C.white, letterSpacing: 2, lineHeight: 1.1, margin: "0 0 16px" }}>PRECISION PRINTED.<br/>COMBAT TESTED.</h1>
                  <p style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 16, lineHeight: 1.6, marginBottom: 24, maxWidth: 480 }}>
                    Flared magwells, mag couplers, optic covers, mounts, and organizational accessories. PETG-CF printed. Made in the USA. Lifetime warranty.
                  </p>
                  <div style={{ display: "flex", gap: 12 }}>
                    <Btn onClick={() => openCategory(null)}>Shop All Products <Ic n="arrow" s={16} c={C.bg} /></Btn>
                    <Btn v="secondary" onClick={() => openCategory("magwells")}>Magwells</Btn>
                  </div>
                </div>
                <div style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", opacity: 0.06 }}>
                  <span style={{ fontFamily: FONT.display, fontSize: 200, fontWeight: 700, color: C.white, letterSpacing: 10 }}>TP</span>
                </div>
              </div>
            )}

            {/* Category Header */}
            {page === "category" && (
              <div style={{ marginBottom: 24 }}>
                <button onClick={goHome} style={{ background: "none", border: "none", color: C.accent, fontFamily: FONT.body, fontSize: 13, cursor: "pointer", marginBottom: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  <Ic n="left" s={14} c={C.accent} /> All Categories
                </button>
                {selCat && <h2 style={{ fontFamily: FONT.display, fontSize: 32, color: C.white, letterSpacing: 2, margin: 0 }}>{CATEGORIES.find(c => c.id === selCat)?.name.toUpperCase()}</h2>}
              </div>
            )}

            {/* Categories Grid (home only) */}
            {page === "home" && (
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontFamily: FONT.display, fontSize: 14, color: C.accent, letterSpacing: 3, marginBottom: 16 }}>SHOP BY CATEGORY</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
                  {CATEGORIES.map(cat => {
                    const count = PRODUCTS.filter(p => p.cat === cat.id).length;
                    return (
                      <button key={cat.id} onClick={() => openCategory(cat.id)} style={{
                        padding: "20px 16px", borderRadius: 4, background: C.card, border: `1px solid ${C.border}`,
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent + "44"; e.currentTarget.style.background = C.cardHover; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}
                      >
                        <div style={{ fontFamily: FONT.display, fontSize: 14, color: C.white, letterSpacing: 1, marginBottom: 4 }}>{cat.name.toUpperCase()}</div>
                        <div style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 12 }}>{count} products</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div>
              {page === "home" && <h2 style={{ fontFamily: FONT.display, fontSize: 14, color: C.accent, letterSpacing: 3, marginBottom: 16 }}>{selCat ? "" : "ALL PRODUCTS"}</h2>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {filteredProducts.map(p => (
                  <div key={p.id} onClick={() => openProduct(p)} style={{
                    borderRadius: 6, overflow: "hidden", background: C.card, border: `1px solid ${C.border}`,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent + "33"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "none"; }}
                  >
                    <div style={{ position: "relative" }}>
                      <ProductImage product={p} color="black" size={220} />
                      {p.badge && <div style={{ position: "absolute", top: 10, left: 10 }}><Badge>{p.badge}</Badge></div>}
                    </div>
                    <div style={{ padding: "14px 16px 18px" }}>
                      <div style={{ fontFamily: FONT.body, fontWeight: 600, color: C.text, fontSize: 15, marginBottom: 6, lineHeight: 1.3 }}>{p.name}</div>
                      <Stars r={p.rating} s={12} count={p.reviews} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                        <span style={{ fontFamily: FONT.display, fontSize: 22, fontWeight: 700, color: C.accent, letterSpacing: 1 }}>${p.price.toFixed(2)}</span>
                        <span style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 11 }}>{p.variants.length} models</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Value Props (home only) */}
            {page === "home" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 48 }}>
                {[
                  { icon: "truck", title: "FAST SHIPPING", text: "1-4 business days. $5 flat rate. Free over $50." },
                  { icon: "shield", title: "LIFETIME WARRANTY", text: "If it breaks, we replace it. No questions asked." },
                  { icon: "flag", title: "MADE IN USA", text: "Designed and 3D printed in the United States." },
                  { icon: "pkg", title: "PETG-CF MATERIAL", text: "High-temp resistant carbon fiber reinforced filament." },
                ].map(v => (
                  <div key={v.title} style={{ padding: 24, borderRadius: 4, background: C.card, border: `1px solid ${C.border}`, textAlign: "center" }}>
                    <Ic n={v.icon} s={28} c={C.od} />
                    <div style={{ fontFamily: FONT.display, fontSize: 12, color: C.white, letterSpacing: 1.5, marginTop: 12, marginBottom: 6 }}>{v.title}</div>
                    <div style={{ fontFamily: FONT.body, color: C.textMuted, fontSize: 12, lineHeight: 1.4 }}>{v.text}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 32 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 3, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.bg }}>TP</span>
              </div>
              <span style={{ fontFamily: FONT.display, fontSize: 14, color: C.white, letterSpacing: 2 }}>TACTICAL PRINTING</span>
            </div>
            <p style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 12, maxWidth: 300, lineHeight: 1.5 }}>
              3D printed firearm accessories. Designed and printed in the USA. PETG-CF material. Lifetime warranty on all products.
            </p>
          </div>
          <div style={{ display: "flex", gap: 40 }}>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 11, color: C.textMuted, letterSpacing: 1.5, marginBottom: 12 }}>SHOP</div>
              {CATEGORIES.slice(0, 5).map(c => (
                <button key={c.id} onClick={() => openCategory(c.id)} style={{ display: "block", background: "none", border: "none", color: C.textDim, fontFamily: FONT.body, fontSize: 13, cursor: "pointer", padding: "3px 0" }}>{c.name}</button>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: FONT.display, fontSize: 11, color: C.textMuted, letterSpacing: 1.5, marginBottom: 12 }}>INFO</div>
              {["Shipping Policy", "Refund Policy", "Terms of Service", "Contact Us"].map(l => (
                <div key={l} style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 13, padding: "3px 0", cursor: "pointer" }}>{l}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontFamily: FONT.display, fontSize: 11, color: C.textMuted, letterSpacing: 1.5, marginBottom: 12 }}>STAY UPDATED</div>
            <div style={{ display: "flex", gap: 6 }}>
              <input placeholder="Email address" style={{ padding: "10px 12px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontFamily: FONT.body, fontSize: 13, outline: "none", width: 180 }} />
              <Btn st={{ padding: "10px 16px" }}>JOIN</Btn>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: "20px auto 0", paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 11 }}>{String.fromCharCode(169)} 2026 Tactical Printing. All rights reserved. tacticalprinting.com</span>
          <div style={{ display: "flex", gap: 12 }}>
            {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map(p => (
              <span key={p} style={{ fontFamily: FONT.body, color: C.textDim, fontSize: 10, padding: "3px 8px", border: `1px solid ${C.border}`, borderRadius: 3 }}>{p}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* CART DRAWER */}
      <CartDrawer cart={cart} setCart={setCart} open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}