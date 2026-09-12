import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./style.css";
gsap.registerPlugin(ScrollTrigger);
const ui = {
  hu: {
    studio: "Stúdió",
    work: "Munkáink",
    services: "Szolgáltatások",
    contact: "Kapcsolat",
    play: "Showreel",
    scroll: "Görgess",
    selected: "Válogatott munkáink",
    all: "Összes projekt",
    what: "Amit készítünk",
    story: "Van egy történeted?",
    talk: "Dolgozzunk együtt",
    place: "Budapest, Magyarország",
  },
  en: {
    studio: "Studio",
    work: "Work",
    services: "Services",
    contact: "Contact",
    play: "Showreel",
    scroll: "Scroll",
    selected: "Selected work",
    all: "All projects",
    what: "What we make",
    story: "Have a story?",
    talk: "Let's make it happen",
    place: "Budapest, Hungary",
  },
};
const fallback = {
  settings: {
    hero_title_hu: "Történetek, amelyek\nmozgásba hozzák a világot.",
    hero_title_en: "Stories that\nmove the world.",
    hero_kicker_hu: "FILM • TARTALOM • TÖRTÉNETEK",
    hero_kicker_en: "FILM • CONTENT • STORIES",
    intro_hu: "A FirstVideos Group egy független produkciós stúdió.",
    intro_en: "FirstVideos Group is an independent production studio.",
    email: "hello@firstvideos.group",
    showreel_url: "https://vimeo.com/",
    instagram_url: "#",
    vimeo_url: "#",
    linkedin_url: "#",
  },
  projects: [],
  services: [],
};
const api = async (path, opt = {}) => {
    const token = localStorage.getItem("fvg-token"),
      r = await fetch("/api" + path, {
        ...opt,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      }),
      d = await r.json().catch(() => ({}));
    if (!r.ok) throw Error(d.error || "Request failed");
    return d;
  },
  Brand = () => (
    <span className="brand">
      <b>FIRST</b>VIDEOS<small>GROUP</small>
    </span>
  );
function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem("fvg-theme") || "auto",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("fvg-theme", theme);
  }, [theme]);
  return [theme, setTheme];
}
function transitionState(change) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    change();
    return;
  }
  const surface = ".site-shell, .admin-shell, .login-page";
  gsap
    .timeline({ defaults: { ease: "expo.inOut" } })
    .to(surface, { scale: 0.985, y: -10, autoAlpha: 0.65, duration: 0.42 }, 0)
    .fromTo(
      ".page-transition-line",
      { top: "0%" },
      { top: "100%", duration: 0.58 },
      0.03,
    )
    .to(
      ".page-transition",
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.58,
        onComplete: () => {
          change();
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              gsap
                .timeline({ defaults: { ease: "expo.inOut" } })
                .fromTo(
                  ".page-transition-line",
                  { top: "100%" },
                  { top: "0%", duration: 0.68 },
                  0,
                )
                .to(".page-transition", {
                  clipPath: "inset(0% 0% 100% 0%)",
                  duration: 0.68,
                })
                .fromTo(
                  surface,
                  { scale: 1.015, y: 16, autoAlpha: 0.55 },
                  { scale: 1, y: 0, autoAlpha: 1, duration: 0.68 },
                  0.08,
                ),
            ),
          );
        },
      },
      0.03,
    );
}
function PageTransition() {
  const layer = useRef(null);
  useLayoutEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const surface = ".site-shell, .admin-shell, .login-page";
    const reveal = () =>
      reduce
        ? gsap.set(layer.current, { clipPath: "inset(0% 0% 100% 0%)" })
        : gsap
            .timeline({ defaults: { ease: "expo.inOut" } })
            .fromTo(
              surface,
              { scale: 1.015, y: 16, autoAlpha: 0.55 },
              { scale: 1, y: 0, autoAlpha: 1, duration: 0.72 },
            )
            .fromTo(
              layer.current,
              { clipPath: "inset(0% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 100% 0%)", duration: 0.72 },
              0,
            )
            .fromTo(
              ".page-transition-line",
              { top: "100%" },
              { top: "0%", duration: 0.72 },
              0,
            );
    reveal();
    const followLink = (event) => {
      const link = event.target.closest("a");
      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.getAttribute("href")?.startsWith("#")
      )
        return;
      const destination = new URL(link.href, location.href);
      if (destination.origin !== location.origin) return;
      event.preventDefault();
      if (reduce) return location.assign(destination.href);
      gsap
        .timeline({ defaults: { ease: "expo.inOut" } })
        .to(
          surface,
          { scale: 0.985, y: -10, autoAlpha: 0.65, duration: 0.44 },
          0,
        )
        .to(
          layer.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            onComplete: () => location.assign(destination.href),
          },
          0.02,
        )
        .fromTo(
          ".page-transition-line",
          { top: "0%" },
          { top: "100%", duration: 0.6 },
          0.02,
        );
    };
    document.addEventListener("click", followLink);
    window.addEventListener("pageshow", reveal);
    return () => {
      document.removeEventListener("click", followLink);
      window.removeEventListener("pageshow", reveal);
    };
  }, []);
  return (
    <div className="page-transition" ref={layer} aria-hidden="true">
      <span className="page-transition-line" />
    </div>
  );
}
function Theme({ theme, setTheme }) {
  return (
    <button
      className="icon-button"
      onClick={() =>
        setTheme(
          theme === "auto" ? "light" : theme === "light" ? "dark" : "auto",
        )
      }
      aria-label="Change theme"
    >
      <i
        className={
          theme === "light"
            ? "fa-solid fa-sun"
            : theme === "dark"
              ? "fa-solid fa-moon"
              : "fa-solid fa-circle-half-stroke"
        }
      />
    </button>
  );
}
function Public() {
  const root = useRef(null),
    [lang, setLang] = useState(localStorage.getItem("fvg-lang") || "hu"),
    [theme, setTheme] = useTheme(),
    [data, setData] = useState(fallback),
    [menu, setMenu] = useState(false),
    [ready, setReady] = useState(false);
  useEffect(() => {
    api("/content")
      .then(setData)
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  useLayoutEffect(() => {
    if (!ready) return;
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".site-header", { y: -24, autoAlpha: 0, duration: 0.7 })
        .from(".hero-media", { scale: 1.12, duration: 1.5 }, 0)
        .from(
          ".hero-content > *",
          { y: 42, autoAlpha: 0, duration: 0.85, stagger: 0.1 },
          0.15,
        )
        .from(".scroll-cue, .hero-index", { autoAlpha: 0, duration: 0.6 }, 0.7);

      const reveal = (trigger, targets, options = {}) =>
        gsap.from(targets, {
          scrollTrigger: { trigger, start: "top 82%", once: true },
          y: 46,
          autoAlpha: 0,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          ...options,
        });

      reveal(".studio", ".studio > *");
      reveal(".work", ".section-top > *");
      reveal(".project-grid", ".project-card", { y: 64, stagger: 0.13 });
      reveal(".services", ".services > *");
      reveal(".service-list", ".service-list > div", { y: 24, stagger: 0.08 });
      reveal(".contact", ".contact > *", { y: 54, stagger: 0.12 });
    }, root);
    return () => context.revert();
  }, [ready, data.projects.length, data.services.length]);
  const t = ui[lang],
    s = data.settings,
    L = (k) => s[`${k}_${lang}`] || "",
    switchLang = () => {
      const n = lang === "hu" ? "en" : "hu";
      setLang(n);
      localStorage.setItem("fvg-lang", n);
    };
  return (
    <div className="site-shell" ref={root}>
      <header className="site-header">
        <a href="#top">
          <Brand />
        </a>
        <nav>
          {["studio", "work", "services", "contact"].map((x) => (
            <a key={x} href={"#" + x}>
              {t[x]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <Theme theme={theme} setTheme={setTheme} />
          <button className="language" onClick={switchLang}>
            {lang === "hu" ? "EN" : "HU"}
          </button>
          <button className="menu-button" onClick={() => setMenu(!menu)}>
            <i className={menu ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
          </button>
        </div>
        {menu && (
          <div className="mobile-menu">
            {["studio", "work", "services", "contact"].map((x) => (
              <a key={x} onClick={() => setMenu(false)} href={"#" + x}>
                {t[x]}
              </a>
            ))}
          </div>
        )}
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-media" />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="kicker">{L("hero_kicker")}</p>
            <h1>
              {L("hero_title")
                .split("\n")
                .map((x, i) => (
                  <React.Fragment key={x}>
                    {x}
                    {!i && <br />}
                  </React.Fragment>
                ))}
            </h1>
            <a className="showreel" href={s.showreel_url}>
              <i className="fa-solid fa-play" />
              {t.play}
            </a>
          </div>
          <span className="scroll-cue">
            {t.scroll}
            <i className="fa-solid fa-arrow-down-long" />
          </span>
          <span className="hero-index">01 — 04</span>
        </section>
        <section className="studio" id="studio">
          <div className="section-label">
            <span>01</span>
            {t.studio}
          </div>
          <div>
            <p>{L("intro")}</p>
            <a className="text-link" href="#contact">
              {t.talk}
              <i className="fa-solid fa-arrow-right-long" />
            </a>
          </div>
        </section>
        <section className="work" id="work">
          <div className="section-top">
            <div>
              <div className="section-label light">
                <span>02</span>
                {t.work}
              </div>
              <h2>{t.selected}</h2>
            </div>
            <a className="text-link light" href="#contact">
              {t.all}
              <i className="fa-solid fa-arrow-up-right-from-square" />
            </a>
          </div>
          <div className="project-grid">
            {data.projects.map((p, i) => (
              <article className="project-card" key={p.id}>
                <img src={p.image_url} alt={p[`title_${lang}`]} />
                <div className="project-overlay" />
                <span className="project-number">0{i + 1}</span>
                <div>
                  <small>{p[`category_${lang}`]}</small>
                  <h3>{p[`title_${lang}`]}</h3>
                </div>
                <i className="fa-solid fa-arrow-up-right" />
              </article>
            ))}
          </div>
        </section>
        <section className="services" id="services">
          <div>
            <div className="section-label">
              <span>03</span>
              {t.services}
            </div>
            <h2>{t.what}</h2>
          </div>
          <div className="service-list">
            {data.services.map((x, i) => (
              <div key={x.id}>
                <span>0{i + 1}</span>
                <i className={`fa-solid ${x.icon}`} />
                <h3>{x[`name_${lang}`]}</h3>
              </div>
            ))}
          </div>
        </section>
        <section className="contact" id="contact">
          <div className="section-label light">
            <span>04</span>
            {t.contact}
          </div>
          <h2>{t.story}</h2>
          <a href={`mailto:${s.email}`}>
            {s.email}
            <i className="fa-solid fa-arrow-up-right" />
          </a>
        </section>
      </main>
      <footer>
        <Brand />
        <span>{t.place}</span>
        <span>© {new Date().getFullYear()} FVG</span>
        <div>
          <a href={s.instagram_url}>
            <i className="fa-brands fa-instagram" />
          </a>
          <a href={s.vimeo_url}>
            <i className="fa-brands fa-vimeo-v" />
          </a>
          <a href={s.linkedin_url}>
            <i className="fa-brands fa-linkedin-in" />
          </a>
          <a href="/admin">Admin</a>
        </div>
      </footer>
    </div>
  );
}
function Login({ done }) {
  const [status, setStatus] = useState(null),
    [form, setForm] = useState({ email: "", password: "" }),
    [error, setError] = useState(""),
    [theme, setTheme] = useTheme();
  useEffect(() => {
    api("/auth/status")
      .then(setStatus)
      .catch((e) => setError(e.message));
  }, []);
  async function submit(e) {
    e.preventDefault();
    try {
      const d = await api(
        status?.setupRequired ? "/auth/setup" : "/auth/login",
        { method: "POST", body: JSON.stringify(form) },
      );
      localStorage.setItem("fvg-token", d.token);
      done();
    } catch (e) {
      setError(e.message);
    }
  }
  async function fillDemo() {
    try {
      setForm(await api("/auth/demo-credentials"));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <main className="login-page">
      <header>
        <a href="/">
          <Brand />
        </a>
        <Theme theme={theme} setTheme={setTheme} />
      </header>
      <section>
        <div>
          <span>FVG / CONTROL ROOM</span>
          <h1>
            {status?.setupRequired
              ? "Create the first admin."
              : "Welcome back."}
          </h1>
          <p>
            {status?.setupRequired
              ? "Set up the superadmin account for this installation."
              : "Sign in to manage the studio website."}
          </p>
        </div>
        <form onSubmit={submit}>
          {status?.demoMode && (
            <button className="demo-fill" type="button" onClick={fillDemo}>
              <i className="fa-solid fa-flask" />
              <span>
                <b>Fill local test account</b>
                <small>Available only with the local database</small>
              </span>
              <i className="fa-solid fa-wand-magic-sparkles" />
            </button>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              minLength="12"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button>
            {status?.setupRequired ? "Create account" : "Sign in"}
            <i className="fa-solid fa-arrow-right-long" />
          </button>
        </form>
      </section>
    </main>
  );
}
function Admin() {
  const adminRoot = useRef(null),
    [auth, setAuth] = useState(Boolean(localStorage.getItem("fvg-token"))),
    [view, setView] = useState("overview"),
    [data, setData] = useState(fallback),
    [edit, setEdit] = useState(null),
    [notice, setNotice] = useState(""),
    [theme, setTheme] = useTheme();
  useEffect(() => {
    if (auth)
      Promise.all([api("/auth/me"), api("/content")])
        .then(([, d]) => setData(d))
        .catch(() => {
          localStorage.removeItem("fvg-token");
          setAuth(false);
        });
  }, [auth]);
  useLayoutEffect(() => {
    if (
      !auth ||
      !adminRoot.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const context = gsap.context(() => {
      gsap.from(".admin-shell > aside", {
        x: -34,
        autoAlpha: 0,
        duration: 0.65,
        ease: "power3.out",
      });
    }, adminRoot);
    return () => context.revert();
  }, [auth]);
  useLayoutEffect(() => {
    if (
      !auth ||
      !adminRoot.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const context = gsap.context(() => {
      gsap.from(".admin-shell main > header > *", {
        y: 28,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(
        ".stats > *, .admin-callout, .setting-card, .collection-head, .collection-row",
        {
          y: 34,
          autoAlpha: 0,
          duration: 0.55,
          stagger: 0.055,
          ease: "power3.out",
          delay: 0.08,
        },
      );
    }, adminRoot);
    return () => context.revert();
  }, [auth, view, data.projects.length, data.services.length]);
  useLayoutEffect(() => {
    if (!edit || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    gsap.fromTo(
      ".modal-layer",
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2 },
    );
    gsap.fromTo(
      ".editor",
      { y: 34, scale: 0.97, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: 0.38, ease: "power3.out" },
    );
  }, [edit]);
  if (!auth) return <Login done={() => transitionState(() => setAuth(true))} />;
  const flash = (x) => {
      setNotice(x);
      setTimeout(() => setNotice(""), 2000);
    },
    saveItem = async (e) => {
      e.preventDefault();
      const { type, item } = edit;
      if (type === "settings") {
        await api("/settings", {
          method: "PUT",
          body: JSON.stringify({ [item.key]: item.value }),
        });
        setData((d) => ({
          ...d,
          settings: { ...d.settings, [item.key]: item.value },
        }));
        setEdit(null);
        flash("Setting saved");
        return;
      }
      const saved = await api(`/${type}${item.id ? "/" + item.id : ""}`, {
        method: item.id ? "PUT" : "POST",
        body: JSON.stringify(item),
      });
      setData((d) => ({
        ...d,
        [type]: item.id
          ? d[type].map((x) => (x.id === item.id ? saved : x))
          : [...d[type], saved],
      }));
      setEdit(null);
      flash("Content saved");
    },
    remove = async (type, id) => {
      if (confirm("Delete this item?")) {
        await api(`/${type}/${id}`, { method: "DELETE" });
        setData((d) => ({ ...d, [type]: d[type].filter((x) => x.id !== id) }));
      }
    };
  return (
    <div className="admin-shell" ref={adminRoot}>
      <aside>
        <a href="/">
          <Brand />
        </a>
        <nav>
          {[
            ["overview", "fa-table-cells-large"],
            ["settings", "fa-file-lines"],
            ["projects", "fa-clapperboard"],
            ["services", "fa-layer-group"],
          ].map(([x, i]) => (
            <button
              key={x}
              className={view === x ? "active" : ""}
              onClick={() => setView(x)}
            >
              <i className={`fa-solid ${i}`} />
              {x === "settings"
                ? "Page content"
                : x[0].toUpperCase() + x.slice(1)}
            </button>
          ))}
        </nav>
        <div className="aside-bottom">
          <a href="/">
            <i className="fa-solid fa-arrow-up-right-from-square" />
            View website
          </a>
          <button
            onClick={() => {
              localStorage.removeItem("fvg-token");
              transitionState(() => setAuth(false));
            }}
          >
            <i className="fa-solid fa-arrow-right-from-bracket" />
            Sign out
          </button>
        </div>
      </aside>
      <main>
        <header>
          <div>
            <span>ADMIN / {view.toUpperCase()}</span>
            <h1>
              {view === "overview"
                ? "Control room"
                : view === "settings"
                  ? "Page content"
                  : view[0].toUpperCase() + view.slice(1)}
            </h1>
          </div>
          <Theme theme={theme} setTheme={setTheme} />
        </header>
        {view === "overview" && (
          <>
            <div className="stats">
              <button onClick={() => setView("projects")}>
                <i className="fa-solid fa-film" />
                <b>{String(data.projects.length).padStart(2, "0")}</b>
                <span>Featured projects</span>
              </button>
              <button onClick={() => setView("services")}>
                <i className="fa-solid fa-layer-group" />
                <b>{String(data.services.length).padStart(2, "0")}</b>
                <span>Services</span>
              </button>
              <a href="/">
                <i className="fa-solid fa-globe" />
                <b>LIVE</b>
                <span>Website status</span>
              </a>
            </div>
            <div className="admin-callout">
              <div>
                <span>CONTENT SYSTEM</span>
                <h2>Everything in one frame.</h2>
                <p>
                  Edit both languages, portfolio cards, contact details and
                  services from this control room.
                </p>
              </div>
              <i className="fa-solid fa-sliders" />
            </div>
          </>
        )}
        {view === "settings" && (
          <div className="settings-grid">
            {[
              "hero_kicker_hu",
              "hero_kicker_en",
              "hero_title_hu",
              "hero_title_en",
              "intro_hu",
              "intro_en",
              "email",
              "showreel_url",
              "instagram_url",
              "vimeo_url",
              "linkedin_url",
            ].map((key) => (
              <button
                className="setting-card"
                key={key}
                onClick={() =>
                  setEdit({
                    type: "settings",
                    item: { key, value: data.settings[key] || "" },
                  })
                }
              >
                <span>
                  {key.endsWith("_hu")
                    ? "HU"
                    : key.endsWith("_en")
                      ? "EN"
                      : "GLOBAL"}
                </span>
                <b>{key.replaceAll("_", " ")}</b>
                <p>{data.settings[key] || "Not set"}</p>
                <i className="fa-solid fa-pen" />
              </button>
            ))}
          </div>
        )}
        {(view === "projects" || view === "services") && (
          <div className="collection">
            <div className="collection-head">
              <p>Manage the content shown on the homepage.</p>
              <button
                className="primary-button"
                onClick={() =>
                  setEdit({
                    type: view,
                    item:
                      view === "projects"
                        ? {
                            title_hu: "",
                            title_en: "",
                            category_hu: "",
                            category_en: "",
                            image_url: "",
                            sort_order: data.projects.length + 1,
                          }
                        : {
                            name_hu: "",
                            name_en: "",
                            icon: "fa-film",
                            sort_order: data.services.length + 1,
                          },
                  })
                }
              >
                <i className="fa-solid fa-plus" />
                Add new
              </button>
            </div>
            {data[view].map((x) => (
              <div className="collection-row" key={x.id}>
                {view === "projects" ? (
                  <img src={x.image_url} />
                ) : (
                  <i className={`fa-solid ${x.icon}`} />
                )}
                <div>
                  <b>{x[view === "projects" ? "title_en" : "name_en"]}</b>
                  <span>{x[view === "projects" ? "title_hu" : "name_hu"]}</span>
                </div>
                <small>#{x.sort_order}</small>
                <button onClick={() => setEdit({ type: view, item: { ...x } })}>
                  <i className="fa-solid fa-pen" />
                </button>
                <button onClick={() => remove(view, x.id)}>
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      {notice && (
        <div className="notice">
          <i className="fa-solid fa-circle-check" />
          {notice}
        </div>
      )}
      {edit && (
        <div className="modal-layer">
          <form className="editor" onSubmit={saveItem}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setEdit(null)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <span>EDIT CONTENT</span>
            <h2>
              {edit.type === "settings"
                ? edit.item.key.replaceAll("_", " ")
                : edit.item.id
                  ? "Edit item"
                  : "Add item"}
            </h2>
            {edit.type === "settings" ? (
              <label>
                Value
                <textarea
                  rows={
                    edit.item.key.includes("intro") ||
                    edit.item.key.includes("title")
                      ? 6
                      : 3
                  }
                  required
                  value={edit.item.value}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      item: { ...edit.item, value: e.target.value },
                    })
                  }
                />
              </label>
            ) : (
              <>
                {(edit.type === "projects"
                  ? [
                      "title_hu",
                      "title_en",
                      "category_hu",
                      "category_en",
                      "image_url",
                    ]
                  : ["name_hu", "name_en", "icon"]
                ).map((k) => (
                  <label key={k}>
                    {k.replaceAll("_", " ")}
                    <input
                      required
                      value={edit.item[k]}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          item: { ...edit.item, [k]: e.target.value },
                        })
                      }
                    />
                  </label>
                ))}
                <label>
                  Order
                  <input
                    type="number"
                    value={edit.item.sort_order}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        item: {
                          ...edit.item,
                          sort_order: Number(e.target.value),
                        },
                      })
                    }
                  />
                </label>
              </>
            )}
            <button className="primary-button">
              Save
              <i className="fa-solid fa-check" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
function App() {
  return (
    <>
      <PageTransition />
      {location.pathname.startsWith("/admin") ? <Admin /> : <Public />}
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
