import { useState } from 'react'
import './index.css'

function App() {
  // --- States ---
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [ripples, setRipples] = useState([]); 

  // --- Toggles ---
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);
  const toggleContact = () => setIsContactOpen(!isContactOpen);

  // --- Ripple Effect Logic ---
  const createRipple = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const newRipple = { x, y, id: Date.now() };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  return (
    <div className="portfolio-container" onClick={createRipple}>
      
      {/* Visual Ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">AZ.</div>
        <div className="links">
          <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleAbout(); }}>About</a>
          <a href="#projects" onClick={(e) => e.stopPropagation()}>Work</a>
          <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleContact(); }}>Contact</a>
        </div>
      </nav>

      {/* 🏃‍♂️ MARQUEE BAR (Status Update) */}
      <div className="marquee-container">
        <div className="marquee-content">
          🚧 <strong>Update In Progress:</strong> This portfolio is actively being developed. New AI Agents and .NET projects are added weekly. Last updated: January 2026. &nbsp;&nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;&nbsp; 🚀 <strong>Status:</strong> Open to work & Freelance projects.
        </div>
      </div>

      {/* --- ABOUT MODAL --- */}
      {isAboutOpen && (
        <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); toggleAbout(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleAbout}>&times;</button>
            <h2>About Me</h2>
            <div className="modal-body">
              <p>
                I am a dedicated and results-driven professional with a strong passion for technology. 
                Currently, I am a <strong>freelance Google Business Profile Specialist</strong> on Fiverr.
              </p>
              <p>
                I specialize in <strong>AI Agent & Bot Development</strong>. I build intelligent chatbots using <strong>Botpress</strong> and LLMs that automate workflows.
              </p>
              <p>
                I previously gained valuable experience as an <strong>IT Intern at FFC</strong>, honing my skills in web development and the .NET framework. 
              </p>
              <p>
                I am currently pursuing my <strong>Bachelor's degree in Computer Science</strong> at NUML.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTACT MODAL --- */}
      {isContactOpen && (
        <div className="modal-overlay" onClick={(e) => { e.stopPropagation(); toggleContact(); }}>
          <div className="modal-content contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={toggleContact}>&times;</button>
            <h2>Let's Connect</h2>
            <p style={{color: '#94a3b8', marginBottom: '20px'}}>
              I am open to internships and freelance projects.
            </p>
            <div className="contact-links">
              <a href="mailto:ahmedzafar21.az@gmail.com" className="contact-btn">
                <span className="icon">📧</span> ahmedzafar21.az@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/ahmed-zafar-malik" target="_blank" className="contact-btn">
                <span className="icon">💼</span> LinkedIn Profile
              </a>
              <a href="https://github.com/SleepyAki" target="_blank" className="contact-btn">
                <span className="icon">💻</span> GitHub Profile
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="hero">
        {/* Floating Animation Widgets */}
        <div className="floating-widget widget-1 float-slow">
          <div className="icon-circle" style={{background: '#3b82f6'}}></div>
          <div><div className="fake-bar" style={{width: '60px'}}></div><div className="fake-bar" style={{width: '40px', marginTop: '5px'}}></div></div>
        </div>
        <div className="floating-widget widget-2 float-fast">
          <div className="icon-circle" style={{background: '#10b981'}}></div><div className="fake-bar"></div>
        </div>
        <div className="floating-widget widget-3 float-medium">
          <div className="icon-circle" style={{background: '#f43f5e'}}></div>
          <div><div className="fake-bar" style={{width: '50px'}}></div><div className="fake-bar" style={{width: '30px', marginTop: '5px'}}></div></div>
        </div>

        {/* --- HEADLINE CONTENT --- */}
        <div className="hero-content">
          <h1>
            Engineering <br/>
            <span className="highlight">Digital Workforce</span>
          </h1>
          <p className="hero-subtext">
            Hi, I'm <strong>Ahmed Zafar</strong>.<br/>
            I build autonomous AI agents and scalable web systems that do the work for you.
          </p>
          <div style={{marginTop: '30px'}}>
             <a href="#projects" className="cta-button" onClick={(e) => e.stopPropagation()}>View Projects</a>
          </div>
        </div>
      </header>

      {/* Projects Section */}
      <section id="projects" className="section">
        <div className="section-header"><h2>Selected Works</h2><div className="line"></div></div>
        <div className="grid">
          
          {/* 1. AI AGENT CARD */}
          <div className="card">
            <div className="card-icon">🤖</div>
            <h3>Portfolio AI Agent</h3>
            <p>Intelligent chatbot built with Botpress ADK & React that answers questions about my resume automatically.</p>
            <a 
              href="https://github.com/SleepyAki/BOTdev" 
              target="_blank" 
              style={{
                display: 'inline-block',
                marginTop: '10px',
                color: '#10b981', 
                fontWeight: 'bold', 
                textDecoration: 'none'
              }}
            >
              View on GitHub ↗
            </a>
            <div className="tags"><span>Botpress</span><span>TypeScript</span><span>AI</span></div>
          </div>

          {/* 2. SEO CARD */}
          <div className="card">
            <div className="card-icon">📈</div>
            <h3>Google Business SEO</h3>
            <p>Freelance service for ranking & recovering profiles. Successfully managed multiple client reinstatements.</p>
            <a 
              href="https://www.fiverr.com/s/EgL7E6q" 
              target="_blank" 
              style={{
                display: 'inline-block',
                marginTop: '10px',
                color: '#10b981', 
                fontWeight: 'bold', 
                textDecoration: 'none'
              }}
            >
              View on Fiverr ↗
            </a>
            <div className="tags"><span>SEO</span><span>GMB</span><span>Freelance</span></div>
          </div>

          {/* 3. WEB APP CARD */}
          <div className="card">
            <div className="card-icon">💻</div>
            <h3>Web Application (.NET)</h3>
            <p>Enterprise-level appraisal application developed for FFC using ASP.NET Blazor and SQL.</p>
            <a 
              href="https://github.com/SleepyAki/AppraisalAppFFC" 
              target="_blank" 
              style={{
                display: 'inline-block',
                marginTop: '10px',
                color: '#10b981', 
                fontWeight: 'bold', 
                textDecoration: 'none'
              }}
            >
              View on GitHub ↗
            </a>
            <div className="tags"><span>C#</span><span>.NET</span><span>SQL</span></div>
          </div>

        </div>
      </section>

      <footer className="footer"><p>© 2026 Ahmed Zafar | Built with React + Vite</p></footer>
    </div>
  )
}

export default App