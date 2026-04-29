import type { Skill } from "@/interfaces/ProfileInterfaces/skillInterface";

export const skills: Skill[] = [
    { "label": "JavaScript", "value": "javascript" },
    { "label": "TypeScript", "value": "typescript" },
    { "label": "Python", "value": "python" },
    { "label": "Java", "value": "java" },
    { "label": "C++", "value": "c++" },
    { "label": "HTML", "value": "html" },
    { "label": "CSS", "value": "css" },
    { "label": "SASS/SCSS", "value": "sass_scss" },

    { "label": "React.js", "value": "reactjs" },
    { "label": "Next.js", "value": "nextjs" },
    { "label": "Node.js", "value": "nodejs" },
    { "label": "Express.js", "value": "expressjs" },
    { "label": "Redux", "value": "redux" },
    { "label": "Zustand", "value": "zustand" },
    { "label": "Tailwind CSS", "value": "tailwindcss" },
    { "label": "Bootstrap", "value": "bootstrap" },

    { "label": "MongoDB", "value": "mongodb" },
    { "label": "PostgreSQL", "value": "postgresql" },
    { "label": "MySQL", "value": "mysql" },
    { "label": "Redis", "value": "redis" },
    { "label": "Firebase", "value": "firebase" },

    { "label": "REST API Development", "value": "rest_api_development" },
    { "label": "GraphQL", "value": "graphql" },
    { "label": "API Integration", "value": "api_integration" },
    { "label": "Authentication & Authorization", "value": "auth_and_authorization" },

    { "label": "Git", "value": "git" },
    { "label": "GitHub", "value": "github" },
    { "label": "Docker", "value": "docker" },
    { "label": "CI/CD", "value": "cicd" },

    { "label": "Frontend Development", "value": "frontend_development" },
    { "label": "Backend Development", "value": "backend_development" },
    { "label": "Full Stack Development", "value": "fullstack_development" },
    { "label": "Web Development", "value": "web_development" },

    { "label": "Data Structures and Algorithms", "value": "data_structures_and_algorithms" },
    { "label": "Problem Solving", "value": "problem_solving" },
    { "label": "Debugging", "value": "debugging" },
    { "label": "System Design", "value": "system_design" },

    { "label": "Object-Oriented Programming", "value": "oop" },
    { "label": "Functional Programming", "value": "functional_programming" },

    { "label": "Agile Methodology", "value": "agile_methodology" },
    { "label": "Scrum", "value": "scrum" },
    { "label": "Project Management", "value": "project_management" },

    { "label": "Communication", "value": "communication" },
    { "label": "Teamwork", "value": "teamwork" },
    { "label": "Leadership", "value": "leadership" },
    { "label": "Time Management", "value": "time_management" },
    { "label": "Adaptability", "value": "adaptability" },
    { "label": "Critical Thinking", "value": "critical_thinking" },
    { "label": "Creativity", "value": "creativity" },

    { "label": "UI/UX Design", "value": "ui_ux_design" },
    { "label": "Responsive Design", "value": "responsive_design" },

    { "label": "Testing", "value": "testing" },
    { "label": "Unit Testing", "value": "unit_testing" },
    { "label": "Jest", "value": "jest" },
    { "label": "Cypress", "value": "cypress" },

    { "label": "Cloud Computing", "value": "cloud_computing" },
    { "label": "AWS", "value": "aws" },
    { "label": "Azure", "value": "azure" },
    { "label": "Google Cloud Platform", "value": "gcp" },

    { "label": "Machine Learning", "value": "machine_learning" },
    { "label": "Artificial Intelligence", "value": "artificial_intelligence" }
]

export const skillMap: Record<string, string> = Object.fromEntries(
  skills.map(skill => [skill.value, skill.label])
);