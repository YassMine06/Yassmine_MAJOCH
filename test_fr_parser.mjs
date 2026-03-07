import { readFileSync } from 'fs';

// Minimal inline version of parsePortfolioData
function parsePortfolioData(text) {
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

  if (lines.length > 0) data.name = lines[0];
  if (lines.length > 1) {
    if (!lines[1].includes('📍') && !lines[1].includes('📧')) {
      data.title = lines[1];
    }
  }

  lines.forEach(line => {
    if (line.includes('📍'))     data.location = line.replace('📍', '').trim();
    if (line.includes('📧'))     data.email    = line.replace('📧', '').trim();
    if (line.includes('📱'))     data.phone    = line.replace('📱', '').trim();
    if (line.includes('GitHub:')) data.github  = line.replace(/.*GitHub:\s*/, '').trim();
    if (line.includes('LinkedIn:')) data.linkedin = line.replace(/.*LinkedIn:\s*/, '').trim();
  });

  let currentSection = null;
  let currentProject = null;
  let currentActivity = null;

  const SECTION_MARKERS = {
    'education':  ['Education', 'Formation'],
    'skills':     ['Technical Skills', 'Compétences Techniques', 'Compétences'],
    'projects':   ['Projects', 'Projets Académiques & Personnels', 'Projets'],
    'activities': ['Activities & Engagement', 'Activités & Engagement', 'Activités', 'Engagements & Activités', 'Activités et Engagement'],
    'languages':  ['Languages', 'Langues'],
  };

  const SKILL_SUBSECTIONS = {
    'Programming Languages':       'languages',
    'Langages de Programmation':   'languages',
    'Web Development':             'web',
    'Développement Web':           'web',
    'Frameworks & Technologies':   'frameworks',
    'Frameworks et Technologies':  'frameworks',
    'Frameworks & Outils':         'frameworks',
    'Databases':                   'databases',
    'Bases de Données':            'databases',
    'Tools':                       'tools',
    'Outils':                      'tools',
    'Operating Systems':           'systems',
    "Systèmes d'Exploitation":     'systems',
  };

  let currentSkillSubsection = null;
  let eduBuffer = [];
  let activityBuffer = [];
  let projectDescBuffer = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    let newSection = null;
    for (const [key, markers] of Object.entries(SECTION_MARKERS)) {
      if (markers.some(m => {
        const cleanM = m.toLowerCase().replace(/[^\w\s]/g, '').trim();
        const cleanLine = line.toLowerCase().replace(/[^\w\s]/g, '').trim();
        return cleanLine === cleanM;
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

    if (currentSection === 'education') {
      const isDegree = /^(Engineering Degree|Cycle Ingénieur|Diplôme d'Ingénieur|Diplome d'Ingenieur|Diplôme Ingénieur|DEUG|Baccalaureate|Master|Bachelor|Licence|Baccalauréat|Baccalaureat)/i.test(line);
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

    if (currentSection === 'skills') {
      const subSection = SKILL_SUBSECTIONS[line];
      if (subSection) {
        currentSkillSubsection = subSection;
      } else if (currentSkillSubsection) {
        const items = line.split(',').map(s => s.trim()).filter(Boolean);
        data.skills[currentSkillSubsection].push(...items);
      }
    }

    if (currentSection === 'projects') {
      const isTechLine = /^(Technologies?|Langage|Language|Technology|Technologie)\s*:/i.test(line);
      const isGithubLine = /^http/i.test(line);

      const isProjectTitle =
        !isTechLine &&
        !isGithubLine &&
        line.length < 70 &&
        !line.includes('Developed') &&
        !line.includes('Designed') &&
        !line.includes('Designed and developed') &&
        !line.includes('Technologies:') &&
        !line.includes('Langage:') &&
        !line.includes('Technologie:') &&
        !line.includes('développement d') &&
        !line.includes('Développement d') &&
        !line.includes('conception') &&
        !line.includes('Application qui') &&
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
          currentProject.tech = line.replace(/^(Technologies?|Langage|Language|Technology|Technologie)\s*:\s*/i, '');
        } else if (isGithubLine) {
          currentProject.github = line;
        } else {
          projectDescBuffer.push(line);
          const nextLine = lines[i + 1];
          const isSectionStart = nextLine && Object.values(SECTION_MARKERS).some(markers => markers.some(m => nextLine.includes(m)));
          const nextIsTitle = nextLine && nextLine.length < 70 && !nextLine.includes('Developed') && !/^(Technologies?|Language|Technology)\s*:/i.test(nextLine);

          if (!nextLine || isSectionStart || nextIsTitle) {
            currentProject.description = projectDescBuffer.join(' ');
            data.projects.push(currentProject);
            projectDescBuffer = [];
            currentProject = null;
          }
        }
      }
    }

    if (currentSection === 'activities') {
      const isActivityHeader = /^(Member|Active Member|Active member|Participant|COP27|Membre|Membre Actif|Participante|Organisateur|Volunteer)/i.test(line);
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

    if (currentSection === 'languages') {
      if (line.includes(':')) {
        const [lang, level] = line.split(':');
        data.languages.push({ language: lang.trim(), level: level.trim() });
      }
    }
  }

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

const fr = readFileSync('d:/YASSMINE/Cycle/S2/AAStage/Portfolio/public/README_FR.md', 'utf8');
const data = parsePortfolioData(fr);

console.log('=== NAME / TITLE ===');
console.log('name:', data.name);
console.log('title:', data.title);
console.log('location:', data.location);

console.log('\n=== EDUCATION ===');
data.education.forEach((e, i) => console.log(`${i}: ${e.degree} | ${e.institution} | badge:${e.badge ?? 'none'}`));

console.log('\n=== SKILLS ===');
Object.entries(data.skills).forEach(([k,v]) => console.log(`${k}: [${v.join(', ')}]`));

console.log('\n=== PROJECTS ===');
data.projects.forEach((p, i) => console.log(`${i}: title="${p.title}" tech="${p.tech}" desc="${p.description?.slice(0,50)}"`));

console.log('\n=== ACTIVITIES ===');
data.activities.forEach((a, i) => console.log(`${i}: title="${a.title}" detail="${a.detail?.slice(0,50)}"`));

console.log('\n=== LANGUAGES ===');
data.languages.forEach((l, i) => console.log(`${i}: ${l.language} - ${l.level}`));
