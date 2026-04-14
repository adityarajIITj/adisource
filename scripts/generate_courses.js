const fs = require('fs');
const path = require('path');

const materialsDir = path.join(__dirname, '../public/materials');
const outputFile = path.join(__dirname, '../src/data/courses.ts');

const sem1Meta = {
  'ATA': { name: 'Algorithmic Thinking and Its Application', icon: '🧠', color: 'from-cyan-500 to-blue-600' },
  'BDA': { name: 'Basics of Data Analytics', icon: '📊', color: 'from-blue-500 to-indigo-600' },
  'FSP': { name: 'Foundation of Statistics and Probability', icon: '📐', color: 'from-indigo-500 to-purple-600' },
  'LANA': { name: 'Linear Algebra and Numerical Analysis', icon: '🔢', color: 'from-purple-500 to-pink-600' }
};

const sem2Meta = {
  'FAI': { name: 'Foundations of AI', icon: '🤖', color: 'from-teal-500 to-emerald-600' },
  'NO': { name: 'Numerical Optimization', icon: '📈', color: 'from-orange-500 to-red-600' },
  'PRP': { name: 'Probability and Random Processes', icon: '🎲', color: 'from-rose-500 to-pink-600' },
  'VSD': { name: 'Visual Storytelling & Design', icon: '🎨', color: 'from-fuchsia-500 to-purple-600' }
};

const sem1Subjects = {};
const sem2Subjects = {};

// Default initialization
Object.keys(sem1Meta).forEach(code => {
  sem1Subjects[code] = { name: sem1Meta[code].name, code: code, icon: sem1Meta[code].icon, color: sem1Meta[code].color, weeks: {} };
});
Object.keys(sem2Meta).forEach(code => {
  sem2Subjects[code] = { name: sem2Meta[code].name, code: code, icon: sem2Meta[code].icon, color: sem2Meta[code].color, weeks: {} };
});

if (fs.existsSync(materialsDir)) {
  const files = fs.readdirSync(materialsDir).filter(f => f.endsWith('.html'));

  files.forEach(file => {
    // Determine subject and target array
    let subjectCode = '';
    let targetSem = null;

    for (const code of Object.keys(sem1Meta)) {
      if (file.toUpperCase().startsWith(code)) {
        subjectCode = code;
        targetSem = sem1Subjects;
        break;
      }
    }
    
    if (!subjectCode) {
      for (const code of Object.keys(sem2Meta)) {
        if (file.toUpperCase().startsWith(code)) {
          subjectCode = code;
          targetSem = sem2Subjects;
          break;
        }
      }
    }

    if (!subjectCode || !targetSem) return; // Skip unrecognized files

    // Determine primary week
    const weekMatch = file.match(/W(\d+)/i);
    const weekId = weekMatch ? parseInt(weekMatch[1], 10) : 1; 

    // Create a beautiful title
    let title = file.replace('.html', '');
    // Replace typical separators
    title = title.replace(subjectCode, '').replace(/_/g, ' ');

    // Calculate time based on rule: 0.1875 * (sizeKB) + 6.25
    const stat = fs.statSync(path.join(materialsDir, file));
    const sizeKB = stat.size / 1024;
    const estimatedMinutes = Math.max(5, Math.round(0.1875 * sizeKB + 6.25));

    if (!targetSem[subjectCode].weeks[weekId]) {
      targetSem[subjectCode].weeks[weekId] = {
        id: weekId,
        title: `Week ${weekId} Lectures`,
        materials: []
      };
    }

    targetSem[subjectCode].weeks[weekId].materials.push({
      id: `m-${file.replace(/[^a-zA-Z0-9]/g, '')}`,
      title: title || 'Course Material',
      type: 'html', 
      estimatedMinutes: estimatedMinutes,
      dateAdded: '2025-08-01',
      fileName: file
    });
  });
}

// Ensure weeks are arrays and sorted by ID
[sem1Subjects, sem2Subjects].forEach(semObj => {
  Object.keys(semObj).forEach(code => {
    const weeksObj = semObj[code].weeks;
    const weeksArr = Object.values(weeksObj).sort((a, b) => a.id - b.id);
    // Sort materials within each week too
    weeksArr.forEach(w => w.materials.sort((a, b) => a.title.localeCompare(b.title)));
    semObj[code].weeks = weeksArr;
  });
});

const fileContent = `// auto-generated data model
export type MaterialType = "pdf" | "slides" | "video" | "notes" | "assignment" | "html";

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  estimatedMinutes: number;
  dateAdded: string; 
  fileName: string;
}

export interface Week {
  id: number;
  title: string;
  materials: Material[];
}

export interface Subject {
  name: string;
  code: string;
  icon: string;
  color: string;
  weeks: Week[];
}

export interface Semester {
  id: number;
  label: string;
  status: "completed" | "ongoing" | "upcoming";
  subjects: Subject[];
}

export const semesters: Semester[] = [
  {
    id: 1,
    label: "Semester 1",
    status: "ongoing",
    subjects: ${JSON.stringify(Object.values(sem1Subjects), null, 2)}
  },
  {
    id: 2,
    label: "Semester 2",
    status: "ongoing",
    subjects: ${JSON.stringify(Object.values(sem2Subjects), null, 2)}
  }
];

export function getSemester(id: number): Semester | undefined {
  return semesters.find((s) => s.id === id);
}

export function getSubject(semId: number, code: string): Subject | undefined {
  const sem = getSemester(semId);
  return sem?.subjects.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function getWeek(semId: number, code: string, weekId: number): Week | undefined {
  const subject = getSubject(semId, code);
  return subject?.weeks.find((w) => w.id === weekId);
}

export function getTotalMinutes(weeks: Week[]): number {
  return weeks.reduce(
    (total, week) =>
      total + week.materials.reduce((wTotal, m) => wTotal + m.estimatedMinutes, 0),
    0
  );
}

export function getTotalMaterials(weeks: Week[]): number {
  return weeks.reduce((total, week) => total + week.materials.length, 0);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return \`\${minutes} min\`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? \`\${h}h \${m}m\` : \`\${h}h\`;
}

export function getMaterialIcon(type: MaterialType): string {
  switch (type) {
    case "html": return "📄";
    case "pdf": return "📄";
    case "slides": return "📊";
    case "video": return "🎬";
    case "notes": return "📝";
    case "assignment": return "✏️";
  }
}

export function getMaterialLabel(type: MaterialType): string {
  switch (type) {
    case "html": return "Notes";
    case "pdf": return "PDF";
    case "slides": return "Slides";
    case "video": return "Video";
    case "notes": return "Notes";
    case "assignment": return "Assignment";
  }
}
`;

fs.writeFileSync(outputFile, fileContent, 'utf8');
console.log('Successfully generated src/data/courses.ts based on files in public/materials');
