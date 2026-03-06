/**
 * parseMarkdown.js
 * Parses the raw text content of README.md into structured portfolio data
 */

/**
 * Extracts sections from plain text-based markdown (no heading symbols needed)
 * Handles the specific format of the README.md provided
 */
export function parsePortfolioData(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');

  const data = {
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    about: '',
    education: [],
    skills: {
      languages: [],
      web: [],
      frameworks: [],
      databases: [],
      tools: [],
      systems: [],
    },
    projects: [],
    activities: [],
    languages: [],
  };

  // ── Name & title ────────────────────────────────────────────────────────────
  // Take lines[0] as name, lines[1] as title if they exist
  if (lines.length > 0) data.name = lines[0];
  if (lines.length > 1) {
    // If line 1 is contact-related, it's not the title
    if (!lines[1].includes('📍') && !lines[1].includes('📧')) {
      data.title = lines[1];
    }
  }

  // ── Contact info ────────────────────────────────────────────────────────────
  lines.forEach(line => {
    if (line.includes('📍'))     data.location = line.replace('📍', '').trim();
    if (line.includes('📧'))     data.email    = line.replace('📧', '').trim();
    if (line.includes('📱'))     data.phone    = line.replace('📱', '').trim();
    if (line.includes('GitHub:')) data.github  = line.replace(/.*GitHub:\s*/, '').trim();
    if (line.includes('LinkedIn:')) data.linkedin = line.replace(/.*LinkedIn:\s*/, '').trim();
  });

  // ── Sections ─────────────────────────────────────────────────────────────────
  let currentSection = null;
  let currentProject = null;
  let currentActivity = null;

  const SECTION_MARKERS = {
    'education':  ['Education', 'Formation'],
    'skills':     ['Technical Skills', 'Compétences Techniques', 'Compétences'],
    'projects':   ['Projects', 'Projets Académiques & Personnels', 'Projets'],
    'activities': ['Activities & Engagement', 'Activités & Engagement', 'Activités', 'Engagements & Activités'],
    'languages':  ['Languages', 'Langues'],
  };

  const SKILL_SUBSECTIONS = {
    'Programming Languages':     'languages',
    'Langages de Programmation': 'languages',
    'Web Development':           'web',
    'Développement Web':         'web',
    'Frameworks & Technologies': 'frameworks',
    'Frameworks & Outils':       'frameworks',
    'Databases':                 'databases',
    'Bases de Données':          'databases',
    'Tools':                     'tools',
    'Operating Systems':         'systems',
  };

  let currentSkillSubsection = null;
  let eduBuffer = [];
  let activityBuffer = [];
  let projectDescBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section
    let newSection = null;
    for (const [key, markers] of Object.entries(SECTION_MARKERS)) {
      // Check for exact start of line to avoid overlap (e.g., Programming Languages matching Languages)
      if (markers.some(m => {
        const cleanM = m.toLowerCase().replace(/[^\w\s]/g, '').trim();
        const cleanLine = line.toLowerCase().replace(/[^\w\s]/g, '').trim();
        return cleanLine === cleanM; // Exact match for section headers
      })) {
         newSection = key;
         break;
      }
    }

    if (newSection) {
      if (currentProject) {
        currentProject.description = projectDescBuffer.join(' ');
        data.projects.push(currentProject);
        projectDescBuffer = [];
      }
      if (currentActivity) {
        currentActivity.detail = activityBuffer.join(' ');
        data.activities.push(currentActivity);
        activityBuffer = [];
      }
      if (eduBuffer.length > 0) {
        data.education.push({
          degree:      eduBuffer[0] || '',
          institution: eduBuffer[1] || '',
          detail:      eduBuffer.slice(2).join(' ') || '',
        });
        eduBuffer = [];
      }
      currentSection = newSection;
      currentSkillSubsection = null;
      currentProject = null;
      currentActivity = null;
      continue;
    }

    if (!currentSection) continue;

    // ── Education ──────────────────────────────────────────────────────────────
    if (currentSection === 'education') {
      const isDegree = /^(Engineering Degree|Cycle Ingénieur|DEUG|Baccalaureate|Master|Bachelor|Licence|Baccalauréat)/i.test(line);
      
      if (isDegree) {
        if (eduBuffer.length > 0) {
          data.education.push({
            degree:      eduBuffer[0] || '',
            institution: eduBuffer[1] || '',
            detail:      eduBuffer.slice(2).join(' ') || '',
          });
        }
        eduBuffer = [line];
      } else if (eduBuffer.length > 0) {
        eduBuffer.push(line);
      }
    }

    // ── Skills ─────────────────────────────────────────────────────────────────
    if (currentSection === 'skills') {
      const subSection = SKILL_SUBSECTIONS[line];
      if (subSection) {
        currentSkillSubsection = subSection;
      } else if (currentSkillSubsection) {
        const items = line.split(',').map(s => s.trim()).filter(Boolean);
        data.skills[currentSkillSubsection].push(...items);
      }
    }

    // ── Projects ───────────────────────────────────────────────────────────────
    if (currentSection === 'projects') {
      const isTechLine = /^(Technologies?|Language|Technology)\s*:/i.test(line);
      const isGithubLine = /^http/i.test(line);
      
      const isProjectTitle = 
        !isTechLine && 
        !isGithubLine && 
        line.length < 60 && 
        !line.includes('Developed') && 
        !line.includes('Designed') &&
        !line.includes('Designed and developed') &&
        !line.includes('Technologies:') &&
        !line.startsWith('-') &&
        !/^[a-z]/.test(line);

      if (isProjectTitle) {
        if (currentProject) {
          currentProject.description = projectDescBuffer.join(' ');
          data.projects.push(currentProject);
          projectDescBuffer = [];
        }
        currentProject = { title: line, tech: '', description: '', github: '' };
      } else if (currentProject) {
        if (isTechLine) {
          currentProject.tech = line.replace(/^(Technologies?|Language|Technology)\s*:\s*/i, '');
        } else if (isGithubLine) {
          currentProject.github = line;
        } else {
          projectDescBuffer.push(line);
          const nextLine = lines[i + 1];
          const isSectionStart = nextLine && Object.values(SECTION_MARKERS).some(markers => markers.some(m => nextLine.includes(m)));
          const nextIsTitle = nextLine && nextLine.length < 60 && !nextLine.includes('Developed') && !/^(Technologies?|Language|Technology)\s*:/i.test(nextLine);
          
          if (!nextLine || isSectionStart || nextIsTitle) {
            currentProject.description = projectDescBuffer.join(' ');
            data.projects.push(currentProject);
            projectDescBuffer = [];
            currentProject = null;
          }
        }
      }
    }

    // ── Activities ─────────────────────────────────────────────────────────────
    if (currentSection === 'activities') {
      // Look for activity markers like "Member", "Active Member", "COP27", etc.
      const isActivityHeader = /^(Member|Active Member|Active member|Participant|COP27)/i.test(line);
      
      if (isActivityHeader) {
        if (currentActivity && activityBuffer.length > 0) {
          currentActivity.detail = activityBuffer.join(' ');
        }
        if (currentActivity) data.activities.push(currentActivity);
        
        currentActivity = { title: line, detail: '' };
        activityBuffer = [];
      } else if (currentActivity) {
        activityBuffer.push(line);
      }
    }

    // ── Languages ──────────────────────────────────────────────────────────────
    if (currentSection === 'languages') {
      if (line.includes(':')) {
        const [lang, level] = line.split(':');
        data.languages.push({ language: lang.trim(), level: level.trim() });
      }
    }
  }

  // Flush remaining buffers
  if (currentActivity) {
    currentActivity.detail = activityBuffer.join(' ');
    data.activities.push(currentActivity);
  }
  if (eduBuffer.length > 0) {
    data.education.push({
      degree:      eduBuffer[0] || '',
      institution: eduBuffer[1] || '',
      detail:      eduBuffer.slice(2).join(' ') || '',
    });
  }

  return data;
}
