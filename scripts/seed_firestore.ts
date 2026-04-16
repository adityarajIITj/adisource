// Seed Firestore with existing static course data
// Run: npx tsx scripts/seed_firestore.ts

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { semesters } from "../src/data/courses"; // Now we can import properly

// Use the same config as the app
const firebaseConfig = {
  apiKey: "AIzaSyAPngX-UkrCUPbfSbOvYKhL3Z1iO4xvTMQ",
  authDomain: "adisource-4e0f2.firebaseapp.com",
  projectId: "adisource-4e0f2",
  storageBucket: "adisource-4e0f2.firebasestorage.app",
  messagingSenderId: "634894336851",
  appId: "1:634894336851:web:f56485b11edb0438f917a6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log(`\n🌱 Seeding Firestore with ${semesters.length} semesters...\n`);

  for (const semester of semesters) {
    console.log(`📚 Semester ${semester.id}: ${semester.label}`);
    
    // Write semester document
    await setDoc(doc(db, "semesters", String(semester.id)), {
      id: semester.id,
      label: semester.label,
      status: semester.status,
    });

    for (const subject of semester.subjects) {
      console.log(`  📖 ${subject.code}: ${subject.name}`);
      
      // Write subject document
      await setDoc(
        doc(db, "semesters", String(semester.id), "subjects", subject.code.toLowerCase()),
        {
          name: subject.name,
          code: subject.code,
          icon: subject.icon,
          color: subject.color,
        }
      );

      for (const week of subject.weeks || []) {
        console.log(`    📅 Week ${week.id}: ${week.title}`);
        
        // Write week document  
        await setDoc(
          doc(
            db,
            "semesters",
            String(semester.id),
            "subjects",
            subject.code.toLowerCase(),
            "weeks",
            String(week.id)
          ),
          {
            id: week.id,
            title: week.title,
          }
        );

        for (const material of week.materials || []) {
          console.log(`      📄 ${material.title}: ${material.fileName}`);
          
          // Write material document
          await setDoc(
            doc(
              db,
              "semesters",
              String(semester.id),
              "subjects",
              subject.code.toLowerCase(),
              "weeks",
              String(week.id),
              "materials",
              material.id
            ),
            {
              id: material.id,
              title: material.title,
              type: material.type,
              estimatedMinutes: material.estimatedMinutes,
              dateAdded: material.dateAdded,
              fileName: material.fileName,
            }
          );
        }
      }
    }
  }

  console.log("\n✅ Seeding complete!\n");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
