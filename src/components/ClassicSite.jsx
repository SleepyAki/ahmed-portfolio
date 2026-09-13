import { lazy, Suspense, useState } from 'react';
import { EXPERIENCE, SKILLS, PROJECTS, CONTACT } from '../panels';
const InfoModal = lazy(() => import('./InfoModal'));
import './Portfolio.css';

const labels = { frontend: 'Frontend', backend: 'Backend', graphics_3d: '3D & graphics', ai_tools: 'AI & tools' };
const projectTypes = ['AI DEVELOPMENT', 'LOCAL SEARCH', 'WEB APPLICATION'];

export default function ClassicSite({ onEnterRoom }) {
  const [panel, setPanel] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="portfolio" id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="portfolio-header">
        <a className="brand" href="#top" aria-label="Ahmed Zafar, home"><img src="/logo6.webp" alt="" width="38" height="38" /><span>ahmed<span className="accent">.</span></span></a>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close ×' : 'Menu +'}</button>
        <nav id="main-nav" className={`portfolio-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation" onClick={() => setMenuOpen(false)} onKeyDown={e => { if (e.key === 'Escape') setMenuOpen(false); }}>
          <a href="#projects">Work</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#contact">Contact ↗</a>
        </nav>
        <button className="room-link" onClick={onEnterRoom}>Explore my room ↗</button>
      </header>
      <main id="main">
        <section className="portfolio-hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" /> DEVELOPER · BUILDER · CURIOUS HUMAN</p>
            <h1 id="hero-title">Ahmed<br /><span>Zafar<span className="accent">.</span></span></h1>
            <p className="hero-statement">Useful software.<br />A little imagination.</p>
            <p className="hero-description">I build web applications and AI agents, help businesses get discovered, and co-found <a href="https://sycora.dev" target="_blank" rel="noreferrer">Sycora ↗</a> while studying computer science.</p>
            <div className="hero-actions"><a className="p-button primary" href="#projects">Explore my work <span aria-hidden="true">↓</span></a><a className="p-button" href="#contact">Let's talk <span aria-hidden="true">↗</span></a></div>
          </div>
          <aside className="identity-card" aria-label="A little more about me">
            <div className="identity-top"><span>THE PERSON BEHIND THE CODE</span><span aria-hidden="true">↗</span></div>
            <div className="identity-mark"><img src="/logo6.webp" alt="Ahmed Zafar monogram" width="220" height="220" /></div>
            <div className="identity-name"><span>SleepyAki</span><span className="identity-handle">@github</span></div>
            <div className="identity-details"><span>CS student at NUML</span><span>Co-founder at Sycora</span></div>
            <button className="identity-room" onClick={onEnterRoom}><span><small>A DIFFERENT WAY TO EXPLORE</small>Step inside my 3D room</span><span aria-hidden="true">↗</span></button>
          </aside>
          <div className="hero-bottom"><span>WEB DEVELOPMENT / AI AGENTS / 3D EXPERIENCES</span><a href="#projects">SCROLL TO EXPLORE ↓</a></div>
        </section>
        <section className="portfolio-section wrap" id="projects" aria-labelledby="work-title">
          <div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2 id="work-title">Ideas put to work<span className="accent">.</span></h2></div><a className="text-link" href="https://github.com/SleepyAki" target="_blank" rel="noreferrer">More on GitHub ↗</a></div>
          <div className="project-grid">{PROJECTS.map((project, index) => <a className={`work-card work-card-${index}`} href={project.link} target="_blank" rel="noreferrer" key={project.title}>
            <div className="work-card-top"><span className="work-number">0{index + 1}</span><span className="work-arrow" aria-hidden="true">↗</span></div>
            <p className="work-type">{projectTypes[index]}</p><h3>{project.title}</h3><p className="work-description">{project.description}</p>
            <div className="work-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="work-destination">{project.linkLabel}<span className="sr-only"> (opens in a new tab)</span></div>
          </a>)}</div>
        </section>
        <section className="portfolio-section wrap about-section" id="about" aria-labelledby="about-title">
          <div><p className="eyebrow">02 / A LITTLE ABOUT ME</p><h2 id="about-title">Always learning.<br />Always building.</h2><button className="text-link" onClick={() => setPanel('about')}>More about me ↗</button></div>
          <div className="about-copy"><p>I'm a computer science student at NUML, a freelance Google Business Profile specialist, and a developer with a growing interest in AI and interactive web experiences.</p><p>From building an appraisal application at FFC to helping clients recover their business profiles, I enjoy turning practical problems into things that work.</p><p>I'm also building <a href="https://sycora.dev" target="_blank" rel="noreferrer">Sycora ↗</a>, a digital engineering and design studio I co-founded with a friend.</p></div>
        </section>
        <section className="portfolio-section wrap" id="experience" aria-labelledby="experience-title">
          <div className="section-heading"><div><p className="eyebrow">03 / THE JOURNEY</p><h2 id="experience-title">Learning through doing.</h2></div></div>
          <div className="experience-list">{EXPERIENCE.map(exp => <article className="experience-row" key={exp.title}><p className="experience-date">{exp.date}</p><div><h3>{exp.title}</h3><p className="experience-company">{exp.company}</p></div><p className="experience-description">{exp.description}</p></article>)}</div>
        </section>
        <section className="portfolio-section wrap" id="skills" aria-labelledby="skills-title">
          <div className="section-heading"><div><p className="eyebrow">04 / MY TOOLKIT</p><h2 id="skills-title">Tools I build with.</h2></div></div>
          <div className="toolkit">{Object.entries(SKILLS).map(([category, skills]) => <div className="tool-group" key={category}><h3>{labels[category]}</h3><div>{skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>)}</div>
        </section>
        <section className="contact-section wrap" id="contact" aria-labelledby="contact-title"><p className="eyebrow">05 / SAY HELLO</p><div className="contact-heading"><h2 id="contact-title">Have something<br />in mind<span className="accent">?</span></h2><a className="contact-arrow" href={CONTACT[0].href} aria-label="Email Ahmed Zafar">↗</a></div><p>A project, a collaboration, or just a good conversation.</p><a className="email-link" href={CONTACT[0].href}>ahmedzafar21.az@gmail.com ↗</a><div className="social-links">{CONTACT.slice(1).map(contact => <a key={contact.href} href={contact.href} target="_blank" rel="noreferrer">{contact.label.replace(/^\S+\s/, '')} ↗</a>)}</div></section>
      </main>
      <footer className="portfolio-footer wrap"><span>© {new Date().getFullYear()} Ahmed Zafar</span><span>Built with curiosity.</span><a href="#top">Back to top ↑</a></footer>
      {panel && <Suspense fallback={<p role="status">Loading details…</p>}><InfoModal panelId={panel} onClose={() => setPanel(null)} /></Suspense>}
    </div>
  );
}
