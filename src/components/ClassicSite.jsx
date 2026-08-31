import React, { useState } from "react";
import { EXPERIENCE, SKILLS, PROJECTS } from "../panels";
import InfoModal from "./InfoModal";
import HeroAccent from "./HeroAccent";
import Reveal from "./Reveal";

const CATEGORY_LABELS = { ai_tools: "AI & Tools", graphics_3d: "3D & Graphics" };
const labelFor = (category) => CATEGORY_LABELS[category] || category[0].toUpperCase() + category.slice(1);

// Cursor-follow spotlight on hoverable tiles - CSS custom properties
// updated on pointer move, no extra libraries.
const spotlight = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

const ClassicSite = ({ onEnterRoom }) => {
  const [panel, setPanel] = useState(null);

  return (
    <div className="cx">
      <div className="cx-bg" />

      <nav className="cx-nav">
        {/* logo6.png is a black monogram - inverted + given a teal glow
            below to read against the dark navbar. */}
        <div className="cx-logo-frame">
          <img src="/logo6.png" alt="Ahmed Zafar" className="cx-nav-logo" />
        </div>
        <div className="cx-nav-links">
          <a href="#experience">experience</a>
          <a href="#skills">skills</a>
          <a href="#projects">projects</a>
          <button onClick={() => setPanel("about")}>about</button>
          <button onClick={() => setPanel("contact")}>contact</button>
        </div>
        <button className="cx-nav-room" onClick={onEnterRoom}>enter the room →</button>
      </nav>

      <header className="cx-hero">
        <div className="cx-hero-text">
          <div className="cx-hero-eyebrow">
            <span className="cx-prompt">ahmed@sycora</span>
            <span className="cx-prompt-dim">:~$</span> whoami
          </div>
          <h1 className="cx-hero-name">Ahmed Zafar</h1>
          <p className="cx-hero-role">
            CS student · freelance GMB specialist · AI agent developer · co-founder, <a href="https://sycora.dev" target="_blank" rel="noreferrer">Sycora</a>
          </p>
          <div className="cx-hero-actions">
            <a href="#projects" className="cx-btn cx-btn-primary">see the work</a>
            <button className="cx-btn" onClick={() => setPanel("about")}>about me</button>
          </div>
        </div>
        <div className="cx-hero-visual">
          <HeroAccent />
        </div>
      </header>

      <Reveal>
        <section className="cx-section" id="experience">
          <h2 className="cx-heading"><span className="cx-heading-num">01</span> Experience</h2>
          <div className="cx-timeline">
            {EXPERIENCE.map((exp, i) => (
              <div className="cx-timeline-row" key={i}>
                <div className="cx-timeline-date">{exp.date}</div>
                <div className="cx-timeline-body">
                  <h3>{exp.title}</h3>
                  <p className="cx-timeline-company">{exp.company}</p>
                  <p className="cx-timeline-desc">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="cx-section" id="skills">
          <h2 className="cx-heading"><span className="cx-heading-num">02</span> Skills</h2>
          <div className="cx-skills">
            {Object.entries(SKILLS).map(([category, list]) => (
              <div className="cx-skill-group" key={category} onMouseMove={spotlight}>
                <h3>{labelFor(category)}</h3>
                <div className="cx-skill-tags">
                  {list.map((skill, i) => (
                    <span key={i}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="cx-section" id="projects">
          <h2 className="cx-heading"><span className="cx-heading-num">03</span> Projects</h2>
          <div className="cx-projects">
            {PROJECTS.map((proj, i) => (
              <a
                className="cx-project"
                key={i}
                href={proj.link}
                target="_blank"
                rel="noreferrer"
                onMouseMove={spotlight}
              >
                <span className="cx-project-icon">{proj.icon}</span>
                <div className="cx-project-body">
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  <div className="cx-project-tags">
                    {proj.tags.map((tag, j) => (
                      <span key={j}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="cx-project-arrow">↗</span>
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      <footer className="cx-footer">
        <span>© {new Date().getFullYear()} Ahmed Zafar</span>
        <button onClick={() => setPanel("contact")}>get in touch →</button>
      </footer>

      <InfoModal panelId={panel} onClose={() => setPanel(null)} />
    </div>
  );
};

export default ClassicSite;
