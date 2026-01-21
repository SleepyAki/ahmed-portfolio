import { useState } from 'react'
import './index.css'

// --- Component Imports ---
import Experience from './components/Experience';
import Skills from './components/Skills';
import SectionWrapper from './components/SectionWrapper';

function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [ripples, setRipples] = useState([]); 

  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  const createRipple = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <div className="portfolio-container" onClick={createRipple}>
      {ripples.map((ripple) => (
        <span key={ripple.id} className="ripple" style={{ left: ripple.x, top: ripple.y }} />
      ))}

      <nav className="navbar">
        {/* --- LOGO REPLACED HERE --- */}
        <div className="logo">
  <img src="/logo5.png" alt="Ahmed Zafar Logo" className="nav-logo" />
</div>
        
        <div className="links">
          <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleAbout(); }}>About</a>
          <a href="#experience" onClick={(e) => e.stopPropagation()}>Journey</a>
          <a href="#skills" onClick={(e) => e.stopPropagation()}>Skills</a>
          <a href="#projects" onClick={(e) => e.stopPropagation()}>Work</a>
          <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleContact(); }}>Contact</a>
        </div>
      </nav>

      <div className="marquee-container">
        <div className="marquee-content">
          🚧 <strong>Update In Progress:</strong> This portfolio is actively being developed. New AI Agents and .NET projects are added weekly. Last updated: January 2026. &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; 🚀 <strong>Status:</strong> Open to work & Freelance projects.
        </div>
      </div>

      {isAboutOpen && (
        <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); toggleAbout(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleAbout}>&times;</button>
            <h2>About Me</h2>
            <div className="modal-body">
              <p>I am a dedicated professional with a passion for technology. Currently a <strong>freelance GMB Specialist</strong> on Fiverr.</p>
              <p>I specialize in <strong>AI Agent Development</strong> using <strong>Botpress</strong> and LLMs.</p>
              <p>Previously an <strong>IT Intern at FFC</strong>, working with .NET framework.</p>
              <p>Pursuing <strong>BS Computer Science</strong> at NUML.</p>
            </div>
          </div>
        </div>
      )}

      {isContactOpen && (
        <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); toggleContact(); }}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleContact}>&times;</button>
            <h2>Let's Connect</h2>
            <div className="contact-links">
              <a href="mailto:ahmedzafar21.az@gmail.com" className="contact-btn">📧 ahmedzafar21.az@gmail.com</a>
              <a href="https://www.linkedin.com/in/ahmed-zafar-malik" target="_blank" className="contact-btn">💼 LinkedIn</a>
              <a href="https://github.com/SleepyAki" target="_blank" className="contact-btn">💻 GitHub</a>
            </div>
          </div>
        </div>
      )}

      <header className="hero">
        {/* --- Floating Widgets Added Back --- */}
        <div className="floating-widget widget-1 float-slow">
          <span className="visual-icon" style={{fontSize: '1.2rem'}}>🤖</span>
          <div className="fake-bar"></div>
        </div>

        <div className="floating-widget widget-2 float-medium">
          <span className="visual-icon" style={{fontSize: '1.2rem'}}>💻</span>
          <div className="fake-bar"></div>
        </div>

        <div className="floating-widget widget-3 float-fast">
          <span className="visual-icon" style={{fontSize: '1.2rem'}}>🚀</span>
          <div className="fake-bar"></div>
        </div>

        <div className="floating-widget widget-4 float-slow">
          <span className="visual-icon" style={{fontSize: '1.2rem'}}>📈</span>
          <div className="fake-bar"></div>
        </div>

        <div className="hero-content">
          <h1>Engineering <br/><span className="highlight">Digital Workforce</span></h1>
          <p className="hero-subtext">Hi, I'm <strong>Ahmed Zafar</strong>. I build autonomous AI agents and scalable web systems.</p>
          <div style={{marginTop: '30px'}}><a href="#projects" className="cta-button">View Projects</a></div>
        </div>
      </header>

      <SectionWrapper id="experience" delay={0.1}><Experience /></SectionWrapper>
      <SectionWrapper id="skills" delay={0.1}><Skills /></SectionWrapper>

      <SectionWrapper id="projects" delay={0.2}>
        <section className="section">
          <div className="section-header"><h2>Selected Works</h2><div className="line"></div></div>
          <div className="grid">
            <div className="card">
              <div className="project-image ai-gradient"><span className="visual-icon">🤖</span></div>
              <h3>Portfolio AI Agent</h3>
              <p>Intelligent chatbot built with Botpress ADK & React that answers questions about my resume automatically.</p>
              <div className="tags"><span>Botpress</span><span>TypeScript</span><span>AI</span></div>
              <a href="https://github.com/SleepyAki/BOTdev" target="_blank" className="project-link">View Source Code ↗</a>
            </div>

            <div className="card">
              <div className="project-image seo-gradient"><span className="visual-icon">📈</span></div>
              <h3>Google Business SEO</h3>
              <p>Freelance service for ranking & recovering profiles. Successfully managed multiple client reinstatements.</p>
              <div className="tags"><span>SEO</span><span>GMB</span><span>Freelance</span></div>
              <a href="https://www.fiverr.com/s/EgL7E6q" target="_blank" className="project-link">View on Fiverr ↗</a>
            </div>

            <div className="card">
              <div className="project-image net-gradient"><span className="visual-icon">💻</span></div>
              <h3>Web Application (.NET)</h3>
              <p>Enterprise-level appraisal application developed for FFC using ASP.NET Blazor and SQL.</p>
              <div className="tags"><span>C#</span><span>.NET</span><span>SQL</span></div>
              <a href="https://github.com/SleepyAki/AppraisalAppFFC" target="_blank" className="project-link">View Project ↗</a>
            </div>
          </div>
        </section>
      </SectionWrapper>

      <footer className="footer"><p>© 2026 Ahmed Zafar | Built with React + Vite</p></footer>
    </div>
  )
}

export default App