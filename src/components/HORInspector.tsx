// ============================================================
// HOR DEVELOPER KIT - INSPECTOR COMPONENT
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ElementMetrics {
  width: number; height: number;
  top: number; bottom: number;
  left: number; right: number; area: number;
}

interface ElementData {
  guide: string;
  guideName: string;
  elementId: string;
  elementType: string;
  route?: string;
  metrics: ElementMetrics;
  parentChain: string[];
  domPath: string;
  textContent: string;
  cssClasses: string;
}

const TAILWIND_PATTERN = /^(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|w|h|min|max|text|bg|flex|grid|block|inline|hidden|items|justify|content|self|gap|space|divide|rounded|border|ring|shadow|opacity|z|top|bottom|left|right|inset|overflow|cursor|select|pointer|transition|duration|ease|delay|animate|transform|scale|rotate|translate|skew|origin|sr|not|group|peer|col|row|order|float|clear|object|aspect|break|box|table|list|decoration|font|leading|tracking|whitespace|truncate|align|uppercase|lowercase|capitalize|normal|italic|underline|line|no|antialiased|placeholder|appearance|outline|resize|snap|scroll|touch|will|filter|blur|brightness|contrast|drop|grayscale|hue|invert|saturate|sepia|backdrop|fill|stroke|dark|sm|md|lg|xl|2xl|hover|focus|active|visited|disabled|checked|first|last|odd|even|before|after|from|to|via)(:|$|-)/;

function getSemanticName(el: HTMLElement): string {
  const explicit = el.getAttribute('data-guide-name') || el.getAttribute('aria-label');
  if (explicit) return explicit.trim().slice(0, 40);
  if (el.id && el.id.length <= 30) return el.id;
  const tag = el.tagName.toLowerCase();
  const semanticMap: Record<string, string> = {
    nav: 'Navigation', header: 'Header', footer: 'Footer', main: 'Main',
    aside: 'Sidebar', section: 'Section', article: 'Article', form: 'Form',
    h1: 'Heading 1', h2: 'Heading 2', h3: 'Heading 3',
    h4: 'Heading 4', h5: 'Heading 5', h6: 'Heading 6',
  };
  if (semanticMap[tag]) return semanticMap[tag];
  const classes = (typeof el.className === 'string' ? el.className : '').split(/\s+/);
  const meaningful = classes.find(c => c.length > 3 && !TAILWIND_PATTERN.test(c) && !c.startsWith('['));
  if (meaningful) return meaningful.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).trim();
  if ((tag === 'button' || tag === 'a') && el.textContent?.trim()) {
    return `"${el.textContent.trim().slice(0, 25)}"`;
  }
  return `<${tag}>`;
}

function buildParentChain(guideId: string): string[] {
  const parts = guideId.replace('#', '').split('.');
  return parts.map((_, i) => '#' + parts.slice(0, i + 1).join('.'));
}

function detectElementType(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute('role');
  if (tag === 'button' || role === 'button') return 'button';
  if (tag === 'a') return 'link';
  if (['input', 'textarea', 'select'].includes(tag)) return 'form-field';
  if (tag === 'img') return 'image';
  if (tag === 'nav') return 'navigation';
  if (tag === 'header') return 'header';
  if (tag === 'footer') return 'footer';
  if (tag === 'section') return 'section';
  if (tag === 'main') return 'main';
  if (tag === 'form') return 'form';
  if (['h1','h2','h3','h4','h5','h6'].includes(tag)) return 'heading';
  const cls = typeof el.className === 'string' ? el.className : '';
  if (cls.includes('card')) return 'card';
  if (cls.includes('hero')) return 'hero';
  if (cls.includes('modal')) return 'modal';
  return 'container';
}

function detectRoute(el: HTMLElement): string | undefined {
  for (const attr of ['href', 'to', 'data-route']) {
    const v = el.getAttribute(attr);
    if (v && (v.startsWith('/') || v.startsWith('#'))) return v;
  }
  const parent = el.closest('a[href], [to]');
  if (parent) {
    const h = parent.getAttribute('href') || parent.getAttribute('to');
    if (h) return h;
  }
  return undefined;
}

function getMetrics(el: HTMLElement): ElementMetrics {
  const r = el.getBoundingClientRect();
  return {
    width: Math.round(r.width), height: Math.round(r.height),
    top: Math.round(r.top), bottom: Math.round(r.bottom),
    left: Math.round(r.left), right: Math.round(r.right),
    area: Math.round(r.width * r.height),
  };
}

function extractElementData(el: HTMLElement): ElementData {
  // حساب الـ Guide ID بناءً على الموقع الفعلي في الهرمية
  const guide = buildGuideFromPath(el);

  const domPath = (() => {
    const parts: string[] = [];
    let cur: HTMLElement | null = el;
    let d = 0;
    while (cur && cur !== document.body && d < 5) {
      const tag = cur.tagName.toLowerCase();
      const gid = cur.getAttribute('data-guide-id');
      const id = cur.id ? `#${cur.id}` : '';
      parts.unshift(`${tag}${id}${gid ? `[${gid}]` : ''}`);
      cur = cur.parentElement; d++;
    }
    return parts.join(' > ');
  })();

  const classes = (typeof el.className === 'string' ? el.className : '').split(/\s+/)
    .filter(c => c && !TAILWIND_PATTERN.test(c)).join(' ');

  return {
    guide,
    guideName: getSemanticName(el),
    elementId: el.id ? `#${el.id}` : el.tagName.toLowerCase(),
    elementType: detectElementType(el),
    route: detectRoute(el),
    metrics: getMetrics(el),
    parentChain: buildParentChain(guide),
    domPath,
    textContent: el.textContent?.trim().slice(0, 50) || '',
    cssClasses: classes || (typeof el.className === 'string' ? el.className.split(/\s+/).slice(0, 3).join(' ') : ''),
  };
}

/**
 * يحسب Guide ID بناءً على الموقع الفعلي في الهرمية
 * كل عنصر ليه data-guide-id بياخده مباشرة، والعناصر اللي ما عندهم بيتم حساب index لهم
 */
function buildGuideFromPath(el: HTMLElement): string {
  const path: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current !== document.body) {
    // لو العنصر عنده data-guide-id، استخدمه مباشرة وأضف الـ index للأبناء
    const existingGuide = current.getAttribute('data-guide-id');
    if (existingGuide) {
      path.unshift(existingGuide.replace('#', ''));
    } else {
      // احسب index العنصر في الـ siblings
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children) as HTMLElement[];
        let index = 1;
        for (const sibling of siblings) {
          if (sibling === current) break;
          index++;
        }
        path.unshift(String(index));
      }
    }

    current = current.parentElement;
  }

  if (path.length === 0) return '#?';

  const result = path.join('.');
  return '#' + result;
}

function buildFullReport(d: ElementData): string {
  const distFromBottom = window.innerHeight - d.metrics.bottom;
  return `══════════════════════════════════════
HOR INSPECTOR REPORT
══════════════════════════════════════
Guide ID:     ${d.guide}
Guide Name:   ${d.guideName}
Element ID:   ${d.elementId}
Element Type: ${d.elementType}
Text Content: ${d.textContent || 'None'}
CSS Classes:  ${d.cssClasses || 'None'}
Route:        ${d.route || 'None'}
──────────────────────────────────────
DOM PATH (للـ AI)
${d.domPath}
──────────────────────────────────────
للتعديل — قل للـ AI:
"عدّل العنصر data-guide-id="${d.guide}" في الكود"
──────────────────────────────────────
MEASUREMENTS
Width:       ${d.metrics.width}px
Height:      ${d.metrics.height}px
Top:         ${d.metrics.top}px
Left:        ${d.metrics.left}px
From Bottom: ${distFromBottom}px
──────────────────────────────────────
PARENT CHAIN
${d.parentChain.map((id, i) => '  '.repeat(i) + '↳ ' + id).join('\n')}
══════════════════════════════════════`;
}

const TYPE_COLORS: Record<string, string> = {
  button: 'bg-green-500/20 text-green-400 border-green-500/30',
  link: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  navigation: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  header: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  footer: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  section: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  hero: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  card: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  form: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  heading: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
};

export const HORInspector: React.FC = () => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<ElementData | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string, ok: boolean) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, ok });
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  const copy = useCallback(async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast('تم النسخ ✓', true);
      setTimeout(() => setCopiedField(null), 2500);
    } catch { showToast('فشل النسخ ✗', false); }
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    if (!active) return;
    const t = e.target as HTMLElement;
    if (t.closest('[data-hor-panel]')) return;
    e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    setSelected(extractElementData(t));
    setCount(c => c + 1);
    setPanelOpen(true);
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setActive(p => { if (p) { setSelected(null); setPanelOpen(false); } return !p; });
      }
      if (e.key === 'Escape' && active) { setActive(false); setSelected(null); setPanelOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  useEffect(() => {
    if (active) document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [active, handleClick]);

  return (
    <>
      <style>{`
        @keyframes hor-pulse { 0%,100%{box-shadow:0 0 20px rgba(59,130,246,.4)} 50%{box-shadow:0 0 40px rgba(59,130,246,.7)} }
        @keyframes hor-slide { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes hor-toast { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        [data-hor-panel] ::-webkit-scrollbar{width:4px}
        [data-hor-panel] ::-webkit-scrollbar-thumb{background:rgba(59,130,246,.35);border-radius:2px}
        .hor-slide{animation:hor-slide .28s ease-out}
        .hor-toast{animation:hor-toast .22s ease-out}
        ${active ? 'body *{cursor:crosshair!important}[data-hor-panel],[data-hor-panel] *{cursor:auto!important}' : ''}
      `}</style>

      {/* زر التفعيل */}
      <button
        data-hor-panel=""
        onClick={() => setActive(p => { if (p) { setSelected(null); setPanelOpen(false); } return !p; })}
        title="HOR Developer Kit (Ctrl+Shift+D)"
        style={{
          position:'fixed', bottom:24, right:24, zIndex:9999,
          width:56, height:56, borderRadius:16,
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .3s',
          ...(active
            ? { background:'linear-gradient(135deg,rgba(59,130,246,.3),rgba(168,85,247,.3))', backdropFilter:'blur(20px)', border:'2px solid rgba(59,130,246,.5)', animation:'hor-pulse 2s ease-in-out infinite' }
            : { background:'rgba(0,0,0,.6)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.15)' })
        }}
      >
        <svg style={{ width:24, height:24, color: active ? '#60a5fa' : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        {active && <span style={{ position:'absolute', top:-4, right:-4, width:12, height:12, background:'#3b82f6', borderRadius:'50%' }} className="animate-pulse" />}
      </button>

      {/* شريط الحالة */}
      {active && (
        <div data-hor-panel="" style={{ position:'fixed', bottom:24, left:24, zIndex:9999 }}>
          <div style={{ padding:'10px 16px', borderRadius:12, background:'rgba(0,0,0,.85)', backdropFilter:'blur(20px)', border:'1px solid rgba(59,130,246,.3)', display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#60a5fa' }} className="animate-pulse" />
            <span style={{ fontSize:14, color:'#60a5fa', fontWeight:500 }}>HOR Developer Kit</span>
            <span style={{ fontSize:12, color:'#6b7280' }}>فحوصات: <span style={{ color:'#facc15', fontFamily:'monospace' }}>{count}</span></span>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div data-hor-panel="" className="hor-toast" style={{
          position:'fixed', top:20, left:'50%', transform:'translateX(-50%)', zIndex:99999,
          padding:'12px 20px', borderRadius:12, backdropFilter:'blur(20px)',
          border:'1px solid', fontSize:14, fontWeight:500, color:'white',
          background: toast.ok ? 'rgba(34,197,94,.95)' : 'rgba(239,68,68,.95)',
          borderColor: toast.ok ? 'rgba(74,222,128,.5)' : 'rgba(252,165,165,.5)',
        }}>
          {toast.msg}
        </div>
      )}

      {/* لوحة الفحص */}
      {active && panelOpen && selected && (
        <div data-hor-panel="" className="hor-slide" style={{
          position:'fixed', top:80, right:24, zIndex:9998,
          width:460, maxHeight:'85vh', overflow:'hidden',
          background:'rgba(8,8,12,.94)', backdropFilter:'blur(24px)',
          border:'1px solid rgba(255,255,255,.1)', borderRadius:20,
          boxShadow:'0 8px 40px rgba(0,0,0,.7),0 0 60px rgba(59,130,246,.1)',
        }}>

          {/* Header */}
          <div style={{ padding:'16px 20px', background:'linear-gradient(90deg,rgba(59,130,246,.12),rgba(168,85,247,.07),transparent)', borderBottom:'1px solid rgba(255,255,255,.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,rgba(59,130,246,.2),rgba(168,85,247,.2))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg style={{ width:20, height:20, color:'#60a5fa' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'white' }}>HOR Inspector</div>
                <div style={{ fontSize:11, color:'#6b7280' }}>اضغط على أي عنصر لفحصه</div>
              </div>
            </div>
            <button onClick={() => setPanelOpen(false)} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.05)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg style={{ width:16, height:16, color:'#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div style={{ padding:20, overflowY:'auto', maxHeight:'calc(85vh - 140px)', display:'flex', flexDirection:'column', gap:10 }}>

            {/* Guide ID */}
            <div style={{ padding:16, borderRadius:14, background:'linear-gradient(135deg,rgba(59,130,246,.12),rgba(168,85,247,.08))', border:'1px solid rgba(59,130,246,.25)' }}>
              <div style={{ fontSize:10, color:'#9ca3af', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>Guide ID</div>
              <div style={{ fontSize:32, fontFamily:'monospace', fontWeight:900, color:'#60a5fa' }}>{selected.guide}</div>
              <div style={{ marginTop:6, fontSize:13, color:'#d1d5db' }}>{selected.guideName}</div>
              {selected.textContent && (
                <div style={{ marginTop:4, fontSize:11, color:'#9ca3af' }}>نص: "{selected.textContent}"</div>
              )}
            </div>

            {/* Type */}
            <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:10, color:'#6b7280', textTransform:'uppercase', letterSpacing:1 }}>النوع</span>
              <span className={`px-2.5 py-1 text-xs rounded-full font-semibold border ${TYPE_COLORS[selected.elementType] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                {selected.elementType}
              </span>
            </div>

            {/* CSS Classes */}
            {selected.cssClasses && (
              <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.06)' }}>
                <div style={{ fontSize:10, color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>CSS Classes</div>
                <div style={{ fontSize:11, fontFamily:'monospace', color:'#a78bfa', wordBreak:'break-all' }}>{selected.cssClasses}</div>
              </div>
            )}

            {/* Route */}
            {selected.route && (
              <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:10, color:'#6b7280', textTransform:'uppercase', letterSpacing:1 }}>Route</span>
                <span style={{ fontSize:12, fontFamily:'monospace', color:'#22d3ee' }}>{selected.route}</span>
              </div>
            )}

            {/* DOM Path */}
            <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:10, color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>DOM Path</div>
              <div style={{ fontSize:11, fontFamily:'monospace', color:'#9ca3af', wordBreak:'break-all', lineHeight:1.6 }}>{selected.domPath}</div>
            </div>

            {/* Measurements */}
            <div style={{ padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:10, color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:10 }}>القياسات</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                {[
                  ['العرض', `${selected.metrics.width}px`],
                  ['الارتفاع', `${selected.metrics.height}px`],
                  ['المساحة', `${selected.metrics.area}px²`],
                  ['من الأعلى', `${selected.metrics.top}px`],
                  ['من اليسار', `${selected.metrics.left}px`],
                  ['من الأسفل', `${window.innerHeight - selected.metrics.bottom}px`],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding:'8px 10px', borderRadius:8, background:'rgba(255,255,255,.03)', textAlign:'center' }}>
                    <div style={{ fontSize:9, color:'#6b7280', marginBottom:3 }}>{label}</div>
                    <div style={{ fontSize:12, fontFamily:'monospace', color:'white', fontWeight:600 }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent Chain */}
            <div style={{ padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,.025)', border:'1px solid rgba(255,255,255,.06)' }}>
              <div style={{ fontSize:10, color:'#6b7280', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>سلسلة الأب</div>
              {selected.parentChain.map((id, i) => (
                <div key={id} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                  {i > 0 && <span style={{ color:'#4b5563', fontSize:11 }}>↳</span>}
                  <span style={{ fontFamily:'monospace', fontSize:12, color: i === selected.parentChain.length - 1 ? '#60a5fa' : '#6b7280', fontWeight: i === selected.parentChain.length - 1 ? 700 : 400 }}>
                    {id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,.06)', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
            {[
              { label:'نسخ Guide', field:'guide', text: selected.guide, color:'rgba(59,130,246,.2)', border:'rgba(59,130,246,.3)', textColor:'#60a5fa' },
              { label:'تقرير كامل', field:'report', text: buildFullReport(selected), color:'rgba(168,85,247,.2)', border:'rgba(168,85,247,.3)', textColor:'#c084fc' },
              { label:'نسخ JSON', field:'json', text: JSON.stringify({ guide:selected.guide, guideName:selected.guideName, type:selected.elementType, textContent:selected.textContent, cssClasses:selected.cssClasses, route:selected.route, domPath:selected.domPath, metrics:selected.metrics }, null, 2), color:'rgba(255,255,255,.05)', border:'rgba(255,255,255,.1)', textColor:'#d1d5db' },
            ].map(({ label, field, text, color, border, textColor }) => (
              <button
                key={field}
                onClick={() => copy(text, field)}
                style={{
                  padding:'10px 12px', borderRadius:10, border:`1px solid ${copiedField === field ? 'rgba(34,197,94,.3)' : border}`,
                  background: copiedField === field ? 'rgba(34,197,94,.2)' : color,
                  color: copiedField === field ? '#4ade80' : textColor,
                  fontSize:12, fontWeight:600, cursor:'pointer', transition:'all .2s',
                }}
              >
                {copiedField === field ? '✓ تم' : label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default HORInspector;