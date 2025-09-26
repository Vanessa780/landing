import React, { useEffect, useMemo, useRef, useState } from "react";
import { Building2, Landmark, Info, LogIn, Languages, Moon, Sun, X, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

// ======= Catálogo de municipios (sustituye por los 84 completos) =======
const MUNICIPIOS: string[] = [
  "Pachuca de Soto","Mineral de la Reforma","Tulancingo de Bravo","Tula de Allende","Tepeji del Río de Ocampo",
  "Huejutla de Reyes","Ixmiquilpan","Actopan","Tizayuca","Zempoala",
  "Atotonilco de Tula","Atotonilco el Grande","Apan","Tepeapulco","Mixquiahuala de Juárez",
  "Progreso de Obregón","San Salvador","Tezontepec de Aldama","Cuautepec de Hinojosa","Santiago Tulantepec"
  // TODO: agrega el resto hasta 84
];

// ======= Imágenes (reemplaza por rutas locales /public si usas Next) =======
const IMAGES = {
  municipios: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1000&q=60",
  ejecutivo: "https://images.unsplash.com/photo-1496302662116-85c7734b20cf?auto=format&fit=crop&w=1000&q=60",
  pattern:    "https://images.unsplash.com/photo-1524169113253-c6ba17f68498?auto=format&fit=crop&w=1200&q=40",
  logo:       "https://dummyimage.com/240x80/fdf2f2/7f1d1d.png&text=LOGO"
};

// ======= FAQs =======
const FAQS: { q: string; a: string }[] = [
  { q: "¿Qué necesito para ingresar?", a: "Tu CURP y RFC con homoclave. En algunos casos se requiere correo institucional." },
  { q: "¿Cómo elijo mi municipio?", a: "Haz clic en 'Municipios' y selecciona en el buscador. Luego pulsa 'Ir al portal'." },
  { q: "¿Qué navegadores son compatibles?", a: "Chrome, Edge y Firefox en sus versiones actuales." },
  { q: "¿Olvidé mis datos, qué hago?", a: "Contacta a soporte de tu dependencia para reestablecer o validar tus credenciales." },
  { q: "¿El sistema está disponible 24/7?", a: "Sí, salvo ventanas de mantenimiento anunciadas." },
];

// ======= Slides del hero (carrusel) =======
const HERO_SLIDES: { url: string; title: string; subtitle?: string }[] = [
  {
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=60",
    title: "Accede a municipios o ejecutivo desde un solo lugar",
    subtitle: "Rápido, claro y con una experiencia modernizada.",
  },
  {
    url: "https://images.unsplash.com/photo-1529078155058-5d716f45d604?auto=format&fit=crop&w=1600&q=60",
    title: "Trámites más ágiles",
    subtitle: "Navegación simple y accesible para todos.",
  },
  {
    url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=60",
    title: "Transparencia y orden",
    subtitle: "Un portal unificado para tus declaraciones.",
  },
];

// ======= Paletas claras (incluye Carmesí/Crema solicitada) =======
const PALETTES = {
  pastel: {
    lightBg: "bg-slate-100 text-slate-800",
    darkBg: "bg-slate-900 text-slate-100",
    ring: "focus:ring-sky-300/40",
    grad1: "#93c5fd",
    grad2: "#a5b4fc",
    accentFrom: "from-sky-300",
    accentTo: "to-rose-300",
    badgeLight: "bg-white/70",
    badgeDark: "bg-slate-900/70",
  },
  brisa: {
    lightBg: "bg-sky-50 text-slate-800",
    darkBg: "bg-slate-900 text-slate-100",
    ring: "focus:ring-cyan-300/40",
    grad1: "#7dd3fc",
    grad2: "#a7f3d0",
    accentFrom: "from-cyan-300",
    accentTo: "to-emerald-300",
    badgeLight: "bg-white/70",
    badgeDark: "bg-slate-900/70",
  },
  arena: {
    lightBg: "bg-amber-50 text-stone-800",
    darkBg: "bg-stone-900 text-slate-100",
    ring: "focus:ring-amber-300/40",
    grad1: "#fde68a",
    grad2: "#f5d0fe",
    accentFrom: "from-amber-300",
    accentTo: "to-fuchsia-300",
    badgeLight: "bg-white/70",
    badgeDark: "bg-stone-900/70",
  },
  guinda: {
    lightBg: "bg-[#F7EFE7] text-stone-900",
    darkBg: "bg-[#2a0a15] text-stone-100",
    ring: "focus:ring-rose-300/40",
    grad1: "#8B1E3F",
    grad2: "#F2D3B3",
    accentFrom: "from-[#8B1E3F]",
    accentTo: "to-[#F2D3B3]",
    badgeLight: "bg-white/70",
    badgeDark: "bg-[#1b050c]/70",
  },
  carmesi: {
    lightBg: "bg-[#fff3d1] text-stone-900", // crema solicitada
    darkBg: "bg-[#2b0006] text-stone-100",  // carmesí muy oscuro
    ring: "focus:ring-rose-400/40",
    grad1: "#DC143C", // carmesí
    grad2: "#fff3d1", // crema solicitada
    accentFrom: "from-[#DC143C]",
    accentTo: "to-[#fff3d1]",
    badgeLight: "bg-white/70",
    badgeDark: "bg-[#1b0006]/70",
  },
} as const;

type PaletteKey = keyof typeof PALETTES;

const TEXTS = {
  es: {
    title: "Sistema de Declaraciones",
    subtitle: "Elige un portal para continuar",
    municipios: "Municipios",
    ejecutivo: "Ejecutivo",
    ingresar: "Ingresar",
    aviso: "Aviso de privacidad",
    soporte: "Soporte",
    verMas: "Más información",
    municipioDesc: "Portal para ayuntamientos y entes municipales.",
    ejecutivoDesc: "Portal para dependencias del Poder Ejecutivo.",
    footer: "Gobierno del Estado de Hidalgo – Contraloría",
    idioma: "Idioma",
    paleta: "Paleta",
    selMunicipio: "Selecciona un municipio",
    buscarMunicipio: "Buscar municipio…",
    sinResultados: "Sin resultados",
    cancelar: "Cancelar",
    irPortal: "Ir al portal",
    continuar: "Continuar",
    entrando: "Verificando credenciales…",
    faq: "FAQ",
    preguntasFrecuentes: "Preguntas frecuentes",
    buscar: "Buscar…",
    cerrar: "Cerrar",
  },
  en: {
    title: "Declarations System",
    subtitle: "Choose a portal to continue",
    municipios: "Municipal",
    ejecutivo: "Executive",
    ingresar: "Enter",
    aviso: "Privacy notice",
    soporte: "Support",
    verMas: "Learn more",
    municipioDesc: "Portal for municipalities and local entities.",
    ejecutivoDesc: "Portal for Executive Branch agencies.",
    footer: "Government of Hidalgo – Comptroller's Office",
    idioma: "Language",
    paleta: "Palette",
    selMunicipio: "Select a municipality",
    buscarMunicipio: "Search municipality…",
    sinResultados: "No results",
    cancelar: "Cancel",
    irPortal: "Go to portal",
    continuar: "Continue",
    entrando: "Verifying credentials…",
    faq: "FAQ",
    preguntasFrecuentes: "Frequently asked questions",
    buscar: "Search…",
    cerrar: "Close",
  }
} as const;

function withAlpha(hex: string, alpha = 0.2) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function DeclaracionesLanding() {
  const [dark, setDark] = useState(true);
  const [lang, setLang] = useState<"es" | "en">("es");
  const [loading, setLoading] = useState<{active: boolean; target?: string}>({active:false});
  const [palette, setPalette] = useState<PaletteKey>("carmesi");

  // Estados Municipios
  const [showMunicipios, setShowMunicipios] = useState(false);
  const [municipioQuery, setMunicipioQuery] = useState("");
  const [selectedMunicipio, setSelectedMunicipio] = useState<string | null>(null);

  // FAQ
  const [showFAQ, setShowFAQ] = useState(false);
  const [faqQuery, setFaqQuery] = useState("");

  // Carrusel hero
  const [heroIndex, setHeroIndex] = useState(0);
  const heroLen = HERO_SLIDES.length;
  const nextSlide = () => setHeroIndex((i) => (i + 1) % heroLen);
  const prevSlide = () => setHeroIndex((i) => (i - 1 + heroLen) % heroLen);
  useEffect(() => {
    const id = setInterval(nextSlide, 5000);
    return () => clearInterval(id);
  }, [heroLen]);

  const t = useMemo(() => TEXTS[lang], [lang]);
  const theme = useMemo(() => {
    const p = PALETTES[palette];
    return {
      bg: dark ? p.darkBg : p.lightBg,
      ring: p.ring,
      grad1: p.grad1,
      grad2: p.grad2,
      accentFrom: p.accentFrom,
      accentTo: p.accentTo,
      badgeBg: dark ? p.badgeDark : p.badgeLight,
      glow: withAlpha(p.grad1, 0.22),
    } as const;
  }, [palette, dark]);

  // Parallax sutil con scroll para los blobs de fondo
  const { scrollY } = useScroll();
  const yBlob1 = useTransform(scrollY, [0, 600], [0, -60]);
  const yBlob2 = useTransform(scrollY, [0, 600], [0, 80]);

  // Atajos M/E
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (loading.active) return;
      const k = e.key.toLowerCase();
      if (k === "m") handleEnter(t.municipios);
      if (k === "e") handleEnter(t.ejecutivo);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading.active, t.municipios, t.ejecutivo]);

  function handleEnter(target: string){
    if (target === t.municipios) { setShowMunicipios(true); return; }
    setLoading({active:true, target});
    setTimeout(() => setLoading({active:false, target: undefined}), 900);
  }

  function handleGoMunicipio(){
    if (!selectedMunicipio) return;
    setShowMunicipios(false);
    setLoading({active:true, target: `${t.municipios}: ${selectedMunicipio}`});
    // Ejemplo Next: router.push(`/municipios/${encodeURIComponent(selectedMunicipio)}`)
    setTimeout(() => setLoading({active:false, target: undefined}), 900);
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Fondo sutil con gradientes claros + parallax */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* blob superior con parallax */}
        <motion.div
          className="absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ y: yBlob1 as any, background: `radial-gradient(circle at center, ${theme.grad1}, transparent 60%)` }}
        />
        {/* blob inferior con parallax */}
        <motion.div
          className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40"
          style={{ y: yBlob2 as any, background: `radial-gradient(circle at center, ${theme.grad2}, transparent 60%)` }}
        />
        {/* Patrón sutil con la crema #fff3d1 para unificar la paleta */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${withAlpha('#fff3d1',0.25)} 0 10px, transparent 10px 20px)`
          }}
        />
      </div>

      {/* Header con espacio de logo */}
      <header className="relative z-10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-40 overflow-hidden rounded-xl bg-white/60 ring-1 ring-black/5 grid place-items-center">
              <img src={IMAGES.logo} alt="Logo institucional" className="h-8 w-auto"/>
            </div>
            <div className="leading-tight">
              <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
              <p className="text-sm opacity-80">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label={dark ? "Switch to light mode" : "Cambiar a modo oscuro"}
              onClick={() => setDark(v => !v)}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:scale-[1.02] active:scale-[0.98] transition"
            >
              {dark ? <Sun size={16}/> : <Moon size={16}/>} {dark ? "Light" : "Dark"}
            </button>
            <button
              aria-label={t.idioma}
              onClick={() => setLang(l => l === "es" ? "en" : "es")}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:scale-[1.02] active:scale-[0.98] transition"
            >
              <Languages size={16}/> {lang.toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* Hero con carrusel de imágenes */}
      <section className="relative z-10 mx-auto mt-2 max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl border bg-white/60 backdrop-blur shadow-lg">
          <div className="relative h-[260px] w-full md:h-[320px]">
            {HERO_SLIDES.map((s, i) => (
              <img
                key={i}
                src={s.url}
                alt={s.title}
                loading={i === heroIndex ? 'eager' : 'lazy'}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === heroIndex ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 md:p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur-sm ring-1 ring-white/30">
                <span className="h-2 w-2 rounded-full bg-white/70"/>
                <span>Portal unificado</span>
              </div>
              <h2 className="mt-3 max-w-3xl text-balance text-2xl font-semibold tracking-tight text-white drop-shadow md:text-3xl">
                {HERO_SLIDES[heroIndex].title}
              </h2>
              {HERO_SLIDES[heroIndex].subtitle && (
                <p className="mt-1 max-w-2xl text-sm text-white/90 drop-shadow">
                  {HERO_SLIDES[heroIndex].subtitle}
                </p>
              )}
              <div className="mt-4">
                <a href="#" className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} px-4 py-2 text-sm font-medium text-stone-900 shadow-md hover:opacity-95 active:opacity-90`}>
                  <LogIn size={16}/> {t.ingresar}
                </a>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
              <button onClick={prevSlide} aria-label="Anterior" className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/45">
                <ChevronLeft size={18}/>
              </button>
              <button onClick={nextSlide} aria-label="Siguiente" className="pointer-events-auto grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm hover:bg-black/45">
                <ChevronRight size={18}/>
              </button>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Ir al slide ${i+1}`}
                    onClick={() => setHeroIndex(i)}
                    className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/50 ${i===heroIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-16">
        <motion.div
          initial={{opacity: 0, y: 8}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{ once: true, amount: 0.3 }}
          transition={{duration: 0.5}}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <motion.div initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{duration:0.5, delay:0.05}}>
            <CardButton
              theme={theme}
              icon={<Building2 className="h-6 w-6"/>}
              badge="Acceso"
              title={t.municipios}
              description={t.municipioDesc}
              imageUrl={IMAGES.municipios}
              imageAlt="Edificio municipal"
              onClick={() => handleEnter(t.municipios)}
              ariaLabel={`${t.ingresar} – ${t.municipios}`}
            />
          </motion.div>

          <motion.div initial={{opacity:0, y:12}} whileInView={{opacity:1, y:0}} viewport={{ once: true }} transition={{duration:0.5, delay:0.12}}>
            <CardButton
              theme={theme}
              icon={<Landmark className="h-6 w-6"/>}
              badge="Acceso"
              title={t.ejecutivo}
              description={t.ejecutivoDesc}
              imageUrl={IMAGES.ejecutivo}
              imageAlt="Edificio de gobierno"
              onClick={() => handleEnter(t.ejecutivo)}
              ariaLabel={`${t.ingresar} – ${t.ejecutivo}`}
            />
          </motion.div>
        </motion.div>

        {/* CTA secundaria */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#"
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:scale-[1.02] active:scale-[0.98] transition ${theme.ring}`}
          >
            <Info size={16}/> {t.verMas}
          </a>
          <a
            href="#"
            className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} px-4 py-2 text-sm font-medium text-stone-900 shadow-lg hover:opacity-95 active:opacity-90`}
          >
            <LogIn size={16}/> {t.ingresar}
          </a>
        </div>

        {showMunicipios && (
          <MunicipioPickerDialog
            theme={theme}
            t={t}
            onClose={() => setShowMunicipios(false)}
            municipios={MUNICIPIOS}
            query={municipioQuery}
            setQuery={setMunicipioQuery}
            selected={selectedMunicipio}
            setSelected={setSelectedMunicipio}
            onConfirm={handleGoMunicipio}
          />
        )}
      </main>

      {/* Loader simulado */}
      {loading.active && (
        <div role="status" aria-live="assertive" className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 text-center text-slate-700 shadow-2xl">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-slate-400/40 border-t-slate-600" />
            <div className="text-sm opacity-90">{t.entrando}</div>
            {loading.target && <div className="mt-1 text-xs opacity-70">{loading.target}</div>}
          </div>
        </div>
      )}

      {/* Botón flotante de FAQ */}
      <motion.button
        onClick={() => setShowFAQ(true)}
        aria-label={t.preguntasFrecuentes}
        initial={{ y: 0, boxShadow: "0 8px 24px rgba(0,0,0,.15)" }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.06, rotate: -2 }}
        whileTap={{ scale: 0.96, rotate: 0 }}
        className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} text-stone-900 shadow-xl ring-1 ring-black/10`}
        title={t.preguntasFrecuentes}
      >
        <HelpCircle size={22} />
      </motion.button>

      {/* Modal FAQ */}
      {showFAQ && (
        <FAQDialog
          t={t}
          onClose={() => setShowFAQ(false)}
          query={faqQuery}
          setQuery={setFaqQuery}
          faqs={FAQS}
          theme={{ ring: theme.ring, accentFrom: theme.accentFrom, accentTo: theme.accentTo }}
        />
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-8 px-6 pb-8 pt-10">
        {/* barra superior con degradado carmesí/crema */}
        <div className={`pointer-events-none absolute left-0 right-0 -top-0.5 h-1 bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo}`} />
        <div className="mx-auto grid max-w-6xl gap-8 rounded-3xl border bg-white/60 p-6 backdrop-blur md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="h-9 w-36 overflow-hidden rounded-lg bg-white/70 ring-1 ring-black/5 grid place-items-center">
              <img src={IMAGES.logo} alt="Logo institucional" className="h-7 w-auto"/>
            </div>
            <p className="text-sm opacity-80">{t.footer}</p>
          </div>
          {/* Enlaces */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <ul className="space-y-2">
              <li className="font-semibold opacity-80">Portal</li>
              <li><a className="hover:underline" href="#">{t.municipios}</a></li>
              <li><a className="hover:underline" href="#">{t.ejecutivo}</a></li>
              <li><a className="hover:underline" href="#">{t.verMas}</a></li>
            </ul>
            <ul className="space-y-2">
              <li className="font-semibold opacity-80">Legal</li>
              <li><a className="hover:underline" href="#">{t.aviso}</a></li>
              <li><a className="hover:underline" href="#">{t.soporte}</a></li>
            </ul>
          </div>
          {/* Contacto */}
          <div className="text-sm">
            <p className="font-semibold opacity-80">Contacto</p>
            <p className="opacity-80 mt-2">contraloria@hidalgo.gob.mx</p>
            <p className="opacity-80">Lunes a Viernes 9:00–17:00</p>
            <div className="mt-3 flex gap-2">
              <a href="#" className={`rounded-lg border px-2 py-1 ${theme.ring} hover:scale-[1.02] transition`}>Soporte</a>
              <a href="#" className={`rounded-lg border px-2 py-1 ${theme.ring} hover:scale-[1.02] transition`}>Reportar un problema</a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-4 max-w-6xl text-center text-xs opacity-60">© {new Date().getFullYear()} Gobierno del Estado de Hidalgo</div>
      </footer>
    </div>
  );
}

function MunicipioPickerDialog({ theme, t, onClose, municipios, query, setQuery, selected, setSelected, onConfirm }:{
  theme: { ring: string; grad1: string; accentFrom: string; accentTo: string; badgeBg: string; glow: string };
  t: typeof TEXTS["es"];
  onClose: () => void;
  municipios: string[];
  query: string;
  setQuery: (v: string) => void;
  selected: string | null;
  setSelected: (v: string) => void;
  onConfirm: () => void;
}){
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(()=>{ inputRef.current?.focus(); },[]);
  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    return q ? municipios.filter(m => m.toLowerCase().includes(q)) : municipios;
  },[query, municipios]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold">{t.selMunicipio}</h2>
          <button aria-label="Cerrar" onClick={onClose} className="rounded-md p-1 hover:bg-black/5"><X size={16}/></button>
        </div>
        <div className="px-4 py-3">
          <input
            ref={inputRef}
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder={t.buscarMunicipio}
            className={`w-full rounded-xl border px-3 py-2 text-sm ${theme.ring}`}
          />
          <div className="mt-3 max-h-64 overflow-auto rounded-xl border">
            {filtered.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm opacity-60">{t.sinResultados}</div>
            ) : (
              <ul className="divide-y text-sm">
                {filtered.map((m) => (
                  <li key={m}>
                    <button
                      onClick={()=> setSelected(m)}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-black/5 ${selected===m ? 'bg-black/5 font-medium' : ''}`}
                    >
                      <span>{m}</span>
                      {selected===m && <span className="text-xs">✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-xl border px-3 py-2 text-sm">{t.cancelar}</button>
            <button
              onClick={onConfirm}
              disabled={!selected}
              className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} px-4 py-2 text-sm font-medium text-stone-900 shadow disabled:opacity-50`}
            >
              {t.irPortal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQDialog({ t, onClose, query, setQuery, faqs, theme }:{
  t: typeof TEXTS["es"];
  onClose: () => void;
  query: string;
  setQuery: (v: string) => void;
  faqs: { q: string; a: string }[];
  theme: { ring: string; accentFrom: string; accentTo: string };
}){
  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return faqs;
    return faqs.filter(item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q));
  },[query, faqs]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{opacity:0, scale:0.98}}
        animate={{opacity:1, scale:1}}
        className="w-full max-w-xl overflow-hidden rounded-2xl border bg-white text-slate-800 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-r ${theme.accentFrom} ${theme.accentTo} text-stone-900`}>
              <HelpCircle size={16}/>
            </div>
            <h2 className="text-sm font-semibold">{t.preguntasFrecuentes}</h2>
          </div>
          <button aria-label={t.cerrar} onClick={onClose} className="rounded-md p-1 hover:bg-black/5"><X size={16}/></button>
        </div>
        <div className="px-4 py-3">
          <input
            value={query}
            onChange={e=>setQuery(e.target.value)}
            placeholder={t.buscar}
            className={`w-full rounded-xl border px-3 py-2 text-sm ${theme.ring}`}
          />
          <div className="mt-3 max-h-80 overflow-auto rounded-xl border divide-y">
            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm opacity-60">{t.sinResultados}</div>
            ) : (
              filtered.map((item, idx) => (
                <details key={idx} className="group open:bg-black/3">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-black/5">
                    {item.q}
                  </summary>
                  <div className="px-4 pb-4 text-sm opacity-90">
                    {item.a}
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CardButton({ theme, icon, title, description, badge, imageUrl, imageAlt, onClick, ariaLabel }: {
  theme: { ring: string; grad1: string; accentFrom: string; accentTo: string; badgeBg: string; glow: string };
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  imageUrl?: string;
  imageAlt?: string;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLButtonElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--x", `${x}px`);
    el.style.setProperty("--y", `${y}px`);
  }

  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={onMove}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left focus:outline-none focus:ring-4 ${theme.ring}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
           style={{background: `radial-gradient(800px 200px at var(--x,50%) var(--y,0%), ${theme.glow}, transparent 40%)`}}
      />

      {badge && (
        <span className={`absolute right-3 top-3 rounded-full border ${theme.badgeBg} px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700 shadow-sm backdrop-blur`}>
          {badge}
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className="relative h-12 w-12 shrink-0">
          <div className="absolute inset-0 grid place-items-center rounded-xl bg-white/70 ring-1 ring-white/50">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <p className="mt-1 text-sm opacity-80">{description}</p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
            <span className="underline-offset-4 group-hover:underline">{TEXTS.es.continuar}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 transition-transform group-hover:translate-x-0.5"><path d="M13.293 4.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 1 1-1.414-1.414L17.586 12l-4.293-4.293a1 1 0 0 1 0-1.414Z"/><path d="M3 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Z"/></svg>
          </div>
        </div>
        {imageUrl && (
          <div className="relative hidden h-28 w-40 overflow-hidden rounded-xl sm:block">
            <img src={imageUrl} alt={imageAlt ?? ''} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"/>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent"/>
          </div>
        )}
      </div>
    </motion.button>
  );
}
