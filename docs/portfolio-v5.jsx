import { useState, useEffect, useRef, useCallback } from "react";

/* ── Data ────────────────────────────────────────────────── */

const LATEST_ACTIVITIES = [
  { date: "2025.08", title: "C106: ロードバイクお買い物論", desc: "コミックマーケット106で新刊を頒布。ロードバイクの購入戦略を体系化した一冊。", link: "https://www.gensobunya.net/c106/", tag: "Doujin" },
  { date: "2022.12", title: "東方我楽多叢誌「ユレカ vol.2」ライブレポート", desc: "モジャン棒・少年ヴィヴィッドの章でライターを担当。", link: "https://touhougarakuta.com/article/eureka-vol2", tag: "Writing" },
];

const PRODUCTS = [
  {
    name: "AJOCC Toys",
    tagline: "シクロクロスレース情報を拡張するChrome Extension",
    desc: "AJOCCのレース結果ページに便利な機能を追加するChrome拡張機能。レース結果の閲覧体験を向上させます。",
    url: "https://chromewebstore.google.com/detail/ajocctoys/amaehgcenbhjoacemfgiljkfmjlglabi",
    cta: "Chrome Web Store",
    stack: ["Chrome Extension", "JavaScript"],
    status: "Active",
  },
];

const WORKS = [
  { id: "c106", title: "ロードバイクお買い物論", event: "C106", year: 2025, isNew: true, color: { dark: "#FF6B4A", light: "#B8301F" }, cover: "https://www.gensobunya.net/_astro/c106-cover.pzelu4DX_Z1cfTCj.png" },
  { id: "c103", title: "チューブレスレディ最前線", event: "C103", year: 2023, isNew: false, color: { dark: "#4ECDC4", light: "#1E7A72" }, cover: "https://www.gensobunya.net/_astro/c103_cover.NEcQ6T9A_ZqzMK.jpg" },
  { id: "c102", title: "限界自転車部屋", event: "C102", year: 2023, isNew: false, color: { dark: "#95E77E", light: "#2D7A1E" }, cover: "https://www.gensobunya.net/_astro/c102_cover.tvD0oWlR_Z6fTfK.jpg" },
  { id: "c101", title: "限界車載ナレッジ", event: "C101", year: 2022, isNew: false, color: { dark: "#FFD93D", light: "#8A6D00" }, cover: "https://www.gensobunya.net/_astro/c101_cover.8GWvknpi_Z27AJgU.png" },
  { id: "c100", title: "サイクリング・デジタルトランスフォーメーション", event: "C100", year: 2022, isNew: false, color: { dark: "#6C5CE7", light: "#4A3BBF" }, cover: "https://www.gensobunya.net/_astro/c100cover.7WMTvh0C_Z2hs0nC.png" },
  { id: "c99", title: "Cyclocross Deep Dive", event: "C99", year: 2021, isNew: false, color: { dark: "#A8E6CF", light: "#1A8A70" }, cover: "https://www.gensobunya.net/_astro/c99cover.hq-bNXVa_dyUDj.png" },
  { id: "c97", title: "週末洗車部", event: "C97", year: 2019, isNew: false, color: { dark: "#FD79A8", light: "#C4306A" }, cover: "https://www.gensobunya.net/_astro/c97cover.v8MPWLyu_Z1OSlQO.jpg" },
  { id: "c95", title: "泥輪事情", event: "C95", year: 2018, isNew: false, color: { dark: "#FDCB6E", light: "#8A6D00" }, cover: "https://www.gensobunya.net/_astro/c95sample1.LxyWkp0U_uTdlg.jpg" },
];

const WRITING = [
  { year: 2022, title: "「ユレカ vol.2」ライブレポート", outlet: "東方我楽多叢誌", desc: "モジャン棒・少年ヴィヴィッドの章を執筆", url: "https://touhougarakuta.com/article/eureka-vol2" },
  { year: 2022, title: "Flowering Night 2020 ライブレポート", outlet: "東方我楽多叢誌", desc: "ライブレポート記事を担当", url: "https://www.gensobunya.net/2022_super_toho_live/" },
  { year: 2021, title: "「東方オトハナビ」全曲レビュー", outlet: "東方我楽多叢誌", desc: "アルバム全曲レビュー企画に参加", url: "https://www.gensobunya.net/garakuta_otohanabi/" },
  { year: 2020, title: "東方アレンジ シングルCD特集", outlet: "東方我楽多叢誌", desc: "シングルCDレビュー記事を執筆", url: "https://www.gensobunya.net/2020_tohosingle/" },
  { year: 2020, title: "五月氏インタビュー", outlet: "東方我楽多叢誌", desc: "アーティスト取材記事を担当", url: "https://www.gensobunya.net/2020_gogatsu/" },
  { year: 2020, title: "Flowering Night 2020 ライブレポート", outlet: "東方我楽多叢誌", desc: "ライブイベントのレポート記事", url: "https://www.gensobunya.net/2020flowering_night/" },
  { year: 2020, title: "東方アレンジ曲レビュー", outlet: "東方我楽多叢誌", desc: "アレンジ楽曲のレビュー連載", url: "https://www.gensobunya.net/garakuta1/" },
  { year: 2019, title: "岸田教団&THE明星ロケッツ ライブレポート大賞", outlet: "岸田教団", desc: "ライブレポート企画で大賞受賞", url: "https://www.gensobunya.net/2019kishida_livereport/", highlight: true },
];

const SECTIONS = [
  { id: "products", label: "Products" },
  { id: "publications", label: "Publications" },
  { id: "writing", label: "Writing" },
  { id: "about", label: "About" },
  { id: "links", label: "Links" },
];

const LINKS_DATA = [
  { cat: "Blog", items: [
    { title: "幻想サイクルBlog", url: "https://blog.gensobunya.net/", desc: "シクロクロス・グラベルライド中心の自転車ブログ" },
    { title: "gensobunya Life Blog", url: "https://gensobunya-tech.hatenablog.com/", desc: "資産運用・スマートホームなど生活の備忘録" },
  ]},
  { cat: "Technical", items: [
    { title: "Zenn", url: "https://zenn.dev/gensobunya", desc: "OpenTelemetry・Splunk・クラウドインフラ技術記事" },
  ]},
  { cat: "Touhou", items: [
    { title: "東方我楽多叢誌", url: "https://touhougarakuta.com/", desc: "東方Project総合ファンサイト（ライター参加中）" },
  ]},
  { cat: "Doujinshi", items: [
    { title: "Kindle著者ページ", url: "https://amzn.to/2Ls8KPj", desc: "同人誌のKindle電子版" },
    { title: "メロンブックス", url: "https://www.melonbooks.co.jp/circle/index.php?circle_id=45540", desc: "同人誌の委託通販" },
  ]},
];

const SOCIALS = [
  { name: "GitHub", url: "https://github.com/gentksb", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
  )},
  { name: "X", url: "https://twitter.com/gen_sobunya", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
  { name: "Instagram", url: "https://instagram.com/gen_sobunya", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  )},
];

/* ── Hooks ───────────────────────────────────────────────── */

function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useActiveSection() {
  const [active, setActive] = useState("products");
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) setActive(e.target.id); }
    }, { rootMargin: "-40% 0px -55% 0px" });
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

function useTheme() {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const h = (e) => setTheme(e.matches ? "light" : "dark");
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return { theme, toggle: useCallback(() => setTheme(t => t === "dark" ? "light" : "dark"), []) };
}

/* ── Components ──────────────────────────────────────────── */

function ThemeToggle({ theme, toggle }) {
  return (
    <button onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s, color 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      )}
    </button>
  );
}

function SectionHeading({ label, count, sub }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36, paddingBottom: 16, borderBottom: "1px solid var(--border)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s ease" }}>
      <div>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.14em", margin: 0 }}>{label}</h2>
        {sub && <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", margin: "6px 0 0" }}>{sub}</p>}
      </div>
      {count != null && <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-subtle)", fontWeight: 500 }}>{count}</span>}
    </div>
  );
}

function LatestActivity({ activities }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all 0.6s ease" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.14em", margin: 0 }}>LATEST</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {activities.map((a, i) => (
          <LatestItem key={i} item={a} delay={i * 0.08} />
        ))}
      </div>
      <div style={{ marginTop: 24, display: "flex", gap: 12, flexWrap: "wrap" }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", background: "none", border: "1px solid var(--border)", padding: "7px 16px", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.06em" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--border-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
            {s.label} ↓
          </button>
        ))}
      </div>
    </div>
  );
}

function LatestItem({ item, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--border)",
        textDecoration: "none", color: "inherit", transition: "all 0.2s",
        animationDelay: `${delay}s`,
      }}>
      <div style={{ flexShrink: 0, width: 64 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{item.date}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: hov ? "var(--text-primary)" : "var(--text-body)", transition: "color 0.2s" }}>{item.title}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", color: "var(--accent)", padding: "2px 8px", border: "1px solid var(--accent-border)", fontWeight: 600 }}>{item.tag}</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-muted)", margin: "4px 0 0", lineHeight: 1.6 }}>{item.desc}</p>
      </div>
      <span style={{ fontSize: 14, color: hov ? "var(--text-muted)" : "var(--text-subtle)", transform: hov ? "translateX(3px)" : "translateX(0)", transition: "all 0.2s", flexShrink: 0, alignSelf: "center" }}>→</span>
    </a>
  );
}

function WorkCard({ work, index, theme }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useInView(0.08);
  const [imgLoaded, setImgLoaded] = useState(false);
  const accent = theme === "dark" ? work.color.dark : work.color.light;
  return (
    <a ref={ref} href={`https://www.gensobunya.net/${work.id}/`} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ display: "block", textDecoration: "none", color: "inherit", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `all 0.55s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06}s` }}>
      <div style={{ position: "relative", aspectRatio: "3 / 4", overflow: "hidden", background: "var(--surface)", marginBottom: 12, border: "1px solid var(--border)" }}>
        <img src={work.cover} alt={work.title} loading="lazy" onLoad={() => setImgLoaded(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: imgLoaded ? 1 : 0, transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: hovered ? "var(--card-overlay)" : "transparent", transition: "background 0.3s ease" }} />
        {work.isNew && <div style={{ position: "absolute", top: 10, right: 10, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: "#fff", background: accent, padding: "3px 10px" }}>NEW</div>}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 8, left: 10, fontFamily: "var(--font-mono)", fontSize: 11, color: "#ffffffDD", letterSpacing: "0.06em" }}>{work.event}</div>
        <div style={{ position: "absolute", bottom: 8, right: 10, fontFamily: "var(--font-mono)", fontSize: 11, color: "#ffffffAA" }}>{work.year}</div>
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: hovered ? "var(--text-primary)" : "var(--text-body)", transition: "color 0.2s", margin: 0 }}>{work.title}</h3>
    </a>
  );
}

function ProductCard({ product, theme }) {
  const [hovered, setHovered] = useState(false);
  const [ref, visible] = useInView(0.1);
  const accent = theme === "dark" ? "#4ECDC4" : "#1E7A72";
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`, background: hovered ? "var(--surface-hover)" : "var(--surface)", transition: "all 0.35s ease", overflow: "hidden" }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}, transparent)`, opacity: hovered ? 1 : 0.5, transition: "opacity 0.3s ease" }} />
        <div className="product-inner" style={{ padding: "32px 32px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", color: accent, padding: "3px 10px", border: `1px solid ${accent}60`, textTransform: "uppercase", fontWeight: 600 }}>{product.status}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>{product.name}</h3>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", margin: "6px 0 0", lineHeight: 1.4 }}>{product.tagline}</p>
            </div>
            <a href={product.url} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-body)", background: "var(--surface)", border: `1px solid ${hovered ? "var(--border-hover)" : "var(--border)"}`, padding: "10px 20px", textDecoration: "none", transition: "all 0.25s ease", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 8 }}>
              {product.cta}<span style={{ fontSize: 14 }}>↗</span>
            </a>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-muted)", margin: "20px 0 0", lineHeight: 1.8, maxWidth: 560 }}>{product.desc}</p>
          <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
            {product.stack.map(t => <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", padding: "3px 10px", border: "1px solid var(--border)" }}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function WritingRow({ item, index }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView(0.08);
  return (
    <a ref={ref} href={item.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "grid", gridTemplateColumns: "48px 1fr auto", gap: 16, alignItems: "center",
        padding: "16px 0", borderBottom: "1px solid var(--border)",
        textDecoration: "none", color: "inherit",
        opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-12px)",
        transition: `all 0.45s ease ${index * 0.04}s`,
      }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-subtle)", fontWeight: 500 }}>{item.year}</span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: hov ? "var(--text-primary)" : "var(--text-body)", transition: "color 0.2s" }}>{item.title}</span>
          {item.highlight && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", color: "var(--accent)", padding: "2px 6px", border: "1px solid var(--accent-border)", fontWeight: 600 }}>AWARD</span>}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 3 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{item.outlet}</span>
          <span style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)" }}>— {item.desc}</span>
        </div>
      </div>
      <span style={{ fontSize: 14, color: hov ? "var(--text-muted)" : "var(--text-subtle)", transform: hov ? "translateX(3px)" : "translateX(0)", transition: "all 0.2s", flexShrink: 0 }}>↗</span>
    </a>
  );
}

function LinkItem({ item, delay }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useInView(0.1);
  return (
    <a ref={ref} href={item.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border)", textDecoration: "none", color: "inherit", opacity: vis ? 1 : 0, transform: vis ? "translateX(0)" : "translateX(-12px)", transition: `all 0.45s ease ${delay}s` }}>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: hov ? "var(--text-primary)" : "var(--text-body)", transition: "color 0.2s" }}>{item.title}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{item.desc}</div>
      </div>
      <span style={{ fontSize: 14, color: hov ? "var(--text-muted)" : "var(--text-subtle)", transform: hov ? "translateX(3px)" : "translateX(0)", transition: "all 0.2s", flexShrink: 0, marginLeft: 12 }}>↗</span>
    </a>
  );
}

function AboutBlock({ title, children, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ marginBottom: 40, opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(20px)", transition: `all 0.6s ease ${delay}s` }}>
      <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.12em", marginBottom: 14 }}>{title}</h3>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 14, lineHeight: 1.9, color: "var(--text-body)" }}>{children}</div>
    </div>
  );
}

function SkillTag({ label }) {
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "4px 10px", color: "var(--text-muted)", border: "1px solid var(--border)", display: "inline-block" }}>{label}</span>;
}

/* ── Main ────────────────────────────────────────────────── */

export default function Portfolio() {
  const { theme, toggle } = useTheme();
  const activeSection = useActiveSection();
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const isDark = theme === "dark";

  return (
    <div data-theme={theme} style={{
      "--font-display": "'Noto Sans JP', sans-serif",
      "--font-body": "'Noto Sans JP', sans-serif",
      "--font-mono": "'JetBrains Mono', 'SF Mono', monospace",
      ...(isDark ? {
        "--bg": "#0A0A0A", "--surface": "#141414", "--surface-hover": "#1E1E1E",
        "--text-primary": "#E8E8E8", "--text-body": "#B0B0B0", "--text-muted": "#8A8A8A", "--text-subtle": "#6B6B6B",
        "--border": "#2A2A2A", "--border-hover": "#3D3D3D",
        "--nav-bg": "#1A1A1AE8", "--nav-active-bg": "rgba(255,255,255,0.09)",
        "--accent": "#FF6B4A", "--accent-teal": "#4ECDC4", "--accent-border": "#FF6B4A50",
        "--card-overlay": "rgba(0,0,0,0.12)", "--selection": "#FF6B4A30",
        "--hero-grain-opacity": "0.025",
      } : {
        "--bg": "#FAFAF7", "--surface": "#FFFFFF", "--surface-hover": "#F5F4F0",
        "--text-primary": "#1A1A1A", "--text-body": "#3D3D3D", "--text-muted": "#6E6E6E", "--text-subtle": "#8F8F8F",
        "--border": "#E0DED8", "--border-hover": "#C8C6BE",
        "--nav-bg": "#FFFFFFE8", "--nav-active-bg": "rgba(0,0,0,0.06)",
        "--accent": "#B8301F", "--accent-teal": "#1E7A72", "--accent-border": "#B8301F40",
        "--card-overlay": "rgba(0,0,0,0.06)", "--selection": "#B8301F20",
        "--hero-grain-opacity": "0.015",
      }),
      fontFamily: "var(--font-body)", background: "var(--bg)", color: "var(--text-body)",
      minHeight: "100vh", overflowX: "hidden", transition: "background 0.4s ease, color 0.4s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;600;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: var(--selection); color: var(--text-primary); }
        html { scroll-behavior: smooth; scroll-padding-top: 80px; }
        body { overflow-x: hidden; }
        a { color: inherit; }
        @keyframes heroFadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        @keyframes drift { 0%,100%{opacity:.3} 50%{opacity:.7} }
        @media (max-width: 640px) {
          .works-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 14px !important; }
          .section-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .hero-pad { padding-left: 24px !important; padding-right: 24px !important; }
          .about-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 52px !important; }
          .writing-row { grid-template-columns: 40px 1fr auto !important; gap: 10px !important; }
          .product-inner { padding: 24px 20px 20px !important; }
          .latest-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Floating Nav ── */}
      <nav style={{
        position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
        zIndex: 50, display: "flex", gap: 2, alignItems: "center",
        background: "var(--nav-bg)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid var(--border)", padding: 4,
        opacity: navVisible ? 1 : 0, pointerEvents: navVisible ? "auto" : "none", transition: "opacity 0.3s ease",
      }}>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => scrollTo(s.id)} style={{
            fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500,
            padding: "8px 14px", border: "none", cursor: "pointer",
            background: activeSection === s.id ? "var(--nav-active-bg)" : "transparent",
            color: activeSection === s.id ? "var(--text-primary)" : "var(--text-muted)",
            transition: "all 0.2s", letterSpacing: "0.04em",
          }}>{s.label}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 4px" }} />
        <ThemeToggle theme={theme} toggle={toggle} />
      </nav>

      {/* ── Hero + Latest Activity ── */}
      <header className="hero-pad" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "flex-end", padding: "0 48px 72px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: "var(--hero-grain-opacity)", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 24, right: 48 }}>
          <ThemeToggle theme={theme} toggle={toggle} />
        </div>

        <div style={{ maxWidth: 820, animation: "heroFadeUp 0.9s ease forwards" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-subtle)", fontWeight: 500, letterSpacing: "0.16em", marginBottom: 20 }}>PORTFOLIO</p>
          <h1 className="hero-title" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 10vw, 100px)", fontWeight: 900, lineHeight: 1, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>Gen</h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 15, color: "var(--text-muted)", marginTop: 20, lineHeight: 1.8, maxWidth: 460 }}>
            Cyclist — Technical Writer — Doujinshi Publisher<br />
            同人サークル「幻想サイクル」主宰 / 東方同人音楽ライター
          </p>
          <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
            {SOCIALS.map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name} aria-label={s.name}
                style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>{s.icon}</a>
            ))}
          </div>

          {/* Latest Activity — inside hero */}
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <LatestActivity activities={LATEST_ACTIVITIES} />
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, animation: "drift 2.5s infinite" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-subtle)", letterSpacing: "0.14em" }}>SCROLL</span>
          <div style={{ width: 1, height: 20, background: "var(--border-hover)" }} />
        </div>
      </header>

      {/* ── Products ── */}
      <section id="products" className="section-pad" style={{ padding: "100px 48px", maxWidth: 960, margin: "0 auto" }}>
        <SectionHeading label="PRODUCTS" sub="公開中のWebサービス・ツール" count={`${PRODUCTS.length} product`} />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {PRODUCTS.map(p => <ProductCard key={p.name} product={p} theme={theme} />)}
        </div>
        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-subtle)", letterSpacing: "0.1em", marginBottom: 12 }}>RETIRED</h3>
          <div style={{ padding: "16px 0", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, color: "var(--text-subtle)" }}>AJOCCランクカードジェネレーター</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-subtle)", marginLeft: 12 }}>2019–2024</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-subtle)", fontWeight: 500, padding: "2px 8px", border: "1px solid var(--border)" }}>END OF LIFE</span>
          </div>
        </div>
      </section>

      {/* ── Publications (Doujinshi) ── */}
      <section id="publications" className="section-pad" style={{ padding: "100px 48px", maxWidth: 960, margin: "0 auto" }}>
        <SectionHeading label="PUBLICATIONS" sub="コミックマーケット頒布の自転車技術同人誌" count={`${WORKS.length} works`} />
        <div className="works-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {WORKS.map((w, i) => <WorkCard key={w.id} work={w} index={i} theme={theme} />)}
        </div>
      </section>

      {/* ── Writing (Touhou + Achievements) ── */}
      <section id="writing" className="section-pad" style={{ padding: "100px 48px", maxWidth: 960, margin: "0 auto" }}>
        <SectionHeading label="WRITING" sub="東方同人音楽メディアでのライター活動" count={`${WRITING.length} articles`} />
        <div>
          {WRITING.map((w, i) => <WritingRow key={i} item={w} index={i} />)}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="section-pad" style={{ padding: "100px 48px", maxWidth: 960, margin: "0 auto" }}>
        <SectionHeading label="ABOUT" />
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
          <div>
            <AboutBlock title="PROFESSIONAL" delay={0}>
              <p>クラウドインフラストラクチャの可観測性（Observability）領域でプリセールス・テクニカルライティングに従事。Splunk Observability Cloud、OpenTelemetry、SOAR、ITSIを中心に、顧客のモニタリング戦略を支援しています。</p>
              <p style={{ marginTop: 12 }}>AWS・Kubernetes・クラウドネイティブアーキテクチャに関する深い技術知見を持ち、Zennなどのプラットフォームで技術記事を執筆しています。</p>
            </AboutBlock>
            <AboutBlock title="SKILLS" delay={0.1}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Splunk", "OpenTelemetry", "AWS", "Kubernetes", "TypeScript", "Astro", "Cloudflare Workers"].map(s => <SkillTag key={s} label={s} />)}
              </div>
            </AboutBlock>
          </div>
          <div>
            <AboutBlock title="CYCLING" delay={0.05}>
              <p>神奈川県藤沢市を拠点に、シクロクロスレースとグラベルライドを中心に活動するサイクリスト。JCX/AJOCCシクロクロスシリーズにME1カテゴリーで参戦中。</p>
              <p style={{ marginTop: 12 }}>同人サークル「幻想サイクル」として、コミックマーケットで自転車技術同人誌を頒布。Kindle電子版・メロンブックス委託でも入手可能です。</p>
            </AboutBlock>
            <AboutBlock title="TOUHOU MUSIC" delay={0.1}>
              <p>東方Project二次創作の同人音楽シーンで、東方我楽多叢誌を中心にライブレポートやアルバムレビューを執筆。2019年には岸田教団&THE明星ロケッツのライブレポート企画で大賞を受賞しています。</p>
            </AboutBlock>
            <AboutBlock title="INTERESTS" delay={0.15}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["シクロクロス", "グラベルライド", "同人誌制作", "東方同人音楽", "日本株投資"].map(s => <SkillTag key={s} label={s} />)}
              </div>
            </AboutBlock>
          </div>
        </div>
      </section>

      {/* ── Links ── */}
      <section id="links" className="section-pad" style={{ padding: "100px 48px 80px", maxWidth: 960, margin: "0 auto" }}>
        <SectionHeading label="LINKS" sub="ブログ・外部プラットフォーム" count={`${LINKS_DATA.reduce((a, c) => a + c.items.length, 0)} links`} />
        <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 56px" }}>
          {LINKS_DATA.map((group, gi) => (
            <div key={group.cat} style={{ marginBottom: 32 }}>
              <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.1em", marginBottom: 8 }}>{group.cat.toUpperCase()}</h3>
              {group.items.map((item, ii) => <LinkItem key={item.title} item={item} delay={gi * 0.05 + ii * 0.04} />)}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="section-pad" style={{ borderTop: "1px solid var(--border)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 960, margin: "0 auto", flexWrap: "wrap", gap: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-subtle)", letterSpacing: "0.06em" }}>© 2025 Gen / 幻想サイクル</span>
        <div style={{ display: "flex", gap: 16 }}>
          {SOCIALS.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name}
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}>{s.name}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
