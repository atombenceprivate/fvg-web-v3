import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './style.css'

const copy = {
  hu: {
    nav: ['Stúdió', 'Munkáink', 'Szolgáltatások', 'Kapcsolat'],
    heroLabel: 'FILM • TARTALOM • TÖRTÉNETEK',
    hero: 'Történetek, amelyek\nmozgásba hozzák a világot.',
    intro: 'A FirstVideos Group egy független produkciós stúdió. A márkákat filmekkel, élményekkel és valódi emberi pillanatokkal tesszük emlékezetessé.',
    play: 'Showreel lejátszása',
    work: 'Kiemelt munkáink', more: 'Összes projekt',
    services: 'Amit készítünk', contact: 'Van egy történeted?', cta: 'Beszéljünk róla',
    footer: 'Budapest · Magyarország', admin: 'Adminisztráció'
  },
  en: {
    nav: ['Studio', 'Work', 'Services', 'Contact'],
    heroLabel: 'FILM • CONTENT • STORIES',
    hero: 'Stories that\nmove the world.',
    intro: 'FirstVideos Group is an independent production studio. We make brands memorable through films, experiences and real human moments.',
    play: 'Play showreel',
    work: 'Selected work', more: 'All projects',
    services: 'What we make', contact: 'Have a story?', cta: "Let's talk", footer: 'Budapest · Hungary', admin: 'Administration'
  }
}
const projects = [
  {title:'WHERE THE ROAD ENDS', type:'BRAND FILM', cls:'road'},
  {title:'STILL MOVING', type:'CAMPAIGN', cls:'moving'},
  {title:'THE ART OF NOW', type:'DOCUMENTARY', cls:'art'}
]
function App(){
  const [lang,setLang]=useState(localStorage.getItem('fvg-lang') || 'hu')
  const [dark,setDark]=useState(localStorage.getItem('fvg-theme') === 'dark')
  const [projectsState,setProjects]=useState(projects)
  const t=copy[lang]
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';localStorage.setItem('fvg-theme',dark?'dark':'light')},[dark])
  const changeLang = (l)=>{setLang(l); localStorage.setItem('fvg-lang',l)}
  return <>
    <header><a className="logo" href="#top">FIRST<span>VIDEOS</span><em>GROUP</em></a><nav>{t.nav.map((n,i)=><a href={['#studio','#work','#services','#contact'][i]} key={n}>{n}</a>)}</nav><div className="controls"><button aria-label="Theme" onClick={()=>setDark(!dark)}><i className={dark?'fa-solid fa-sun':'fa-solid fa-moon'}/></button><button className="lang" onClick={()=>changeLang(lang==='hu'?'en':'hu')}>{lang==='hu'?'EN':'HU'}</button><a className="admin-link" href="/admin">{t.admin}</a></div></header>
    <main id="top"><section className="hero"><div className="grain"/><p>{t.heroLabel}</p><h1>{t.hero.split('\n').map((l,i)=><React.Fragment key={l}>{l}{i===0&&<br/>}</React.Fragment>)}</h1><button className="play"><i className="fa-solid fa-play"/><span>{t.play}</span></button><div className="scroll">SCROLL <i className="fa-solid fa-arrow-down"/></div></section>
    <section id="studio" className="intro"><span className="eyebrow">01 / STUDIO</span><p>{t.intro}</p><a href="#contact" className="arrowlink"><i className="fa-solid fa-arrow-down"/> {t.cta}</a></section>
    <section id="work" className="work"><div className="sectionhead"><span className="eyebrow">02 / WORK</span><h2>{t.work}</h2><a href="#work">{t.more} <i className="fa-solid fa-arrow-up-right-from-square"/></a></div><div className="grid">{projectsState.map((p,i)=><article key={p.cls} className={'project '+p.cls}><div className="project-no">0{i+1}</div><div className="project-info"><span>{p.type}</span><h3>{p.title}</h3></div><i className="fa-solid fa-arrow-up-right-from-square"/></article>)}</div></section>
    <section id="services" className="services"><span className="eyebrow">03 / SERVICES</span><h2>{t.services}</h2><div>{['Creative direction','Commercial production','Documentary','Post production'].map((s,i)=><p key={s}><b>0{i+1}</b>{s}<i className="fa-solid fa-arrow-up-right-from-square"/></p>)}</div></section>
    <section id="contact" className="contact"><span className="eyebrow">04 / CONTACT</span><h2>{t.contact}</h2><a href="mailto:hello@firstvideos.group">hello@firstvideos.group <i className="fa-solid fa-arrow-up-right-from-square"/></a></section></main>
    <footer><a className="logo" href="#top">FIRST<span>VIDEOS</span><em>GROUP</em></a><span>{t.footer}</span><span>© 2026 FVG</span><div><i className="fa-brands fa-instagram"/><i className="fa-brands fa-vimeo-v"/><i className="fa-brands fa-linkedin-in"/></div></footer>
  </>
}
function Admin(){
 const [status,setStatus]=useState(null),[token,setToken]=useState(localStorage.getItem('fvg-token')),[form,setForm]=useState({email:'',password:''}),[error,setError]=useState('')
 useEffect(()=>{fetch('/api/auth/status').then(r=>r.json()).then(setStatus).catch(()=>setError('Az admin szolgáltatás nem érhető el.'))},[])
 const submit=async(e)=>{e.preventDefault();setError('');const endpoint=status?.setupRequired?'setup':'login';const r=await fetch('/api/auth/'+endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)});const data=await r.json();if(!r.ok)return setError(data.error);if(data.token){localStorage.setItem('fvg-token',data.token);setToken(data.token)}else{setStatus({setupRequired:false});setForm({email:'',password:''})}}
 if(token)return <div className="admin-page"><aside><img src="/fvg-logo-white.svg"/><span>SUPERADMIN</span><a href="/">← Public website</a><button onClick={()=>{localStorage.removeItem('fvg-token');setToken(null)}}>Sign out</button></aside><main><span className="eyebrow">ADMIN / DASHBOARD</span><h1>Good to see you.</h1><div className="dashboard-card"><i className="fa-solid fa-clapperboard"/><div><b>Website content</b><p>Project, service and page settings will be managed here.</p></div></div></main></div>
 return <div className="auth-page"><a className="logo" href="/"><span>FIRST</span>VIDEOS<em>GROUP</em></a><div className="auth-card"><span className="eyebrow">{status?.setupRequired?'FIRST INSTALLATION':'ADMIN SIGN IN'}</span><h1>{status?.setupRequired?'Create the superadmin account':'Welcome back.'}</h1><p>{status?.setupRequired?'This account has unrestricted access to the dashboard.':'Sign in to manage FirstVideos Group.'}</p>{status?.demoMode&&<button type="button" className="demo-login" onClick={async()=>{const r=await fetch('/api/auth/demo-credentials');if(r.ok)setForm(await r.json())}}><i className="fa-solid fa-wand-magic-sparkles"/> Use demo superadmin</button>}<form onSubmit={submit}><label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" minLength="12" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>{error&&<div className="auth-error">{error}</div>}<button type="submit">{status?.setupRequired?'Create superadmin':'Sign in'} <i className="fa-solid fa-arrow-right"/></button></form></div></div>
}
createRoot(document.getElementById('root')).render(location.pathname === '/admin' ? <Admin/> : <App />)
