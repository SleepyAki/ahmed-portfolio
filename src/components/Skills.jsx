import React from "react";

const Skills = () => {
  const skills = {
    frontend: ["React", "Vite", "JavaScript", "HTML5", "CSS3", "Tailwind (Learning)"],
    backend: ["C#", ".NET Blazor", "ASP.NET Core", "SQL Server", "Web API"],
    ai_tools: ["Botpress", "LLMs", "AI Agents", "SEO / GMB", "Git/GitHub", "VS Code"]
  };

  return (
    <section className="skills-section" id="skills">
      <h2 className="section-title">Technical Proficiency</h2>
      
      <div className="skills-grid">
        
        {/* Frontend Category */}
        <div className="skill-category">
          <h3 className="skill-header frontend">Frontend</h3>
          <div className="skill-tags">
            {skills.frontend.map((skill, index) => (
              <span key={index} className="skill-tag frontend">{skill}</span>
            ))}
          </div>
        </div>

        {/* Backend Category */}
        <div className="skill-category">
          <h3 className="skill-header backend">Backend</h3>
          <div className="skill-tags">
            {skills.backend.map((skill, index) => (
              <span key={index} className="skill-tag backend">{skill}</span>
            ))}
          </div>
        </div>

        {/* AI & Tools Category */}
        <div className="skill-category">
          <h3 className="skill-header tools">AI & Tools</h3>
          <div className="skill-tags">
            {skills.ai_tools.map((skill, index) => (
              <span key={index} className="skill-tag tools">{skill}</span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Skills;