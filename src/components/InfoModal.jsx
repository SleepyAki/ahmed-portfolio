import { useEffect, useRef } from "react";
import { EXPERIENCE, SKILLS, PROJECTS, CONTACT, ABOUT_TEXT } from "../panels";
import MiniGame from "./MiniGame";

const InfoModal = ({ panelId, onClose }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (!panelId || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [panelId]);
  if (!panelId) return null;

  const renderBody = () => {
    switch (panelId) {
      case "about":
        return (
          <>
            <h2 id="info-modal-title">About Me</h2>
            <div className="modal-body">
              {ABOUT_TEXT.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </>
        );

      case "experience":
        return (
          <>
            <h2 id="info-modal-title">My Journey</h2>
            <div className="modal-body">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="modal-timeline-item">
                  <span className="timeline-date">
                    {exp.icon} {exp.date}
                  </span>
                  <h3>{exp.title}</h3>
                  <h4>{exp.company}</h4>
                  <p>{exp.description}</p>
                </div>
              ))}
            </div>
          </>
        );

      case "skills": {
        const CATEGORY_LABELS = {
          ai_tools: "AI & Tools",
          graphics_3d: "3D & Graphics",
        };
        const labelFor = (category) =>
          CATEGORY_LABELS[category] || category[0].toUpperCase() + category.slice(1);
        const classFor = (category) => (category === "ai_tools" ? "tools" : category);

        return (
          <>
            <h2 id="info-modal-title">Technical Proficiency</h2>
            <div className="modal-body skills-grid">
              {Object.entries(SKILLS).map(([category, list]) => (
                <div className="skill-category" key={category}>
                  <h3 className={`skill-header ${classFor(category)}`}>{labelFor(category)}</h3>
                  <div className="skill-tags">
                    {list.map((skill, i) => (
                      <span key={i} className={`skill-tag ${classFor(category)}`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      }

      case "projects":
        return (
          <>
            <h2 id="info-modal-title">Selected Works</h2>
            <div className="modal-body grid">
              {PROJECTS.map((proj, i) => (
                <div className="card" key={i}>
                  <div className="project-image">
                    <span className="visual-icon">{proj.icon}</span>
                  </div>
                  <h3>{proj.title}</h3>
                  <p>{proj.description}</p>
                  <div className="tags">
                    {proj.tags.map((tag, j) => (
                      <span key={j}>{tag}</span>
                    ))}
                  </div>
                  <a href={proj.link} target="_blank" rel="noreferrer" className="project-link">
                    {proj.linkLabel}
                  </a>
                </div>
              ))}
            </div>
          </>
        );

      case "game":
        return (
          <>
            <h2 id="info-modal-title">Take a Break</h2>
            <MiniGame />
          </>
        );

      case "contact":
        return (
          <>
            <h2 id="info-modal-title">Let's Connect</h2>
            <div className="contact-links">
              {CONTACT.map((c, i) => (
                <a key={i} href={c.href} target="_blank" rel="noreferrer" className="contact-btn">
                  {c.label}
                </a>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <dialog ref={dialogRef} className="modal-overlay" aria-labelledby="info-modal-title" onCancel={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close dialog" autoFocus>
          &times;
        </button>
        {renderBody()}
      </div>
    </dialog>
  );
};

export default InfoModal;
