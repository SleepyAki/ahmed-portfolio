import React from "react";

const Experience = () => {
  const experiences = [
    {
      title: "Freelance GMB Specialist",
      company: "Fiverr",
      date: "Sept 2023 - Present",
      description: "Specializing in Google Business Profile reinstatement and optimization for global clients.",
      icon: "💼",
    },
    {
      title: "Software Intern",
      company: "Fauji Fertilizer Company (FFC)",
      date: "July 2025 - Sept 2025",
      description: "Developed an Appraisal Application using .NET 8 Blazor in the Information Systems Division.",
      icon: "💻",
    },
    {
      title: "BS Computer Science",
      company: "NUML, Rawalpindi",
      date: "2023 - Present",
      description: "Currently in 5th Semester. Focused on Web Engineering, Computer Architecture, and Software Development.",
      icon: "🎓",
    },
  ];

  return (
    <section className="experience-section" id="experience">
      <h2 className="section-title">My Journey</h2>
      
      <div className="timeline-container">
        {/* The Vertical Line */}
        <div className="timeline-line"></div>

        {experiences.map((exp, index) => (
          <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            
            {/* The Icon Dot */}
            <div className="timeline-dot">
              {exp.icon}
            </div>

            {/* The Card */}
            <div className="timeline-content card">
              <span className="timeline-date">{exp.date}</span>
              <h3>{exp.title}</h3>
              <h4>{exp.company}</h4>
              <p>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;