import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Semester, Subject, Week, Material } from "@/data/courses";

const CACHE_KEY = "adisource_courses_cache_v3";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  semesters: Semester[];
  timestamp: number;
}

// ========================================
// READ OPERATIONS (with caching)
// ========================================

function getCached(): Semester[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached.semesters;
  } catch {
    return null;
  }
}

function setCache(semesters: Semester[]) {
  try {
    const data: CachedData = { semesters, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage full or unavailable
  }
}

export function invalidateCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}

export async function fetchSemesters(forceRefresh = false): Promise<Semester[]> {
  if (!forceRefresh) {
    const cached = getCached();
    if (cached) return cached;
  }

  try {
    const semSnap = await getDocs(
      query(collection(db, "semesters"), orderBy("id"))
    );

    const semesters: Semester[] = [];

    for (const semDoc of semSnap.docs) {
      const semData = semDoc.data();

      // Fetch subjects for this semester
      const subSnap = await getDocs(
        collection(db, "semesters", semDoc.id, "subjects")
      );

      const subjects: Subject[] = [];

      for (const subDoc of subSnap.docs) {
        const subData = subDoc.data();

        // Fetch weeks for this subject
        const weekSnap = await getDocs(
          query(
            collection(db, "semesters", semDoc.id, "subjects", subDoc.id, "weeks"),
            orderBy("id")
          )
        );

        const weeks: Week[] = [];

        for (const weekDoc of weekSnap.docs) {
          const weekData = weekDoc.data();

          // Fetch materials for this week
          const matSnap = await getDocs(
            collection(
              db,
              "semesters",
              semDoc.id,
              "subjects",
              subDoc.id,
              "weeks",
              weekDoc.id,
              "materials"
            )
          );

          const materials: Material[] = matSnap.docs.map((matDoc) => ({
            id: matDoc.id,
            ...matDoc.data(),
          })) as Material[];

          weeks.push({
            id: weekData.id,
            title: weekData.title,
            materials,
          });
        }

        subjects.push({
          name: subData.name,
          code: subData.code,
          icon: subData.icon,
          color: subData.color,
          weeks,
        });
      }

      semesters.push({
        id: semData.id,
        label: semData.label,
        status: semData.status,
        subjects,
      });
    }

    setCache(semesters);
    return semesters;
  } catch (error) {
    console.error("Error fetching semesters from Firestore:", error);
    // Try cache even if expired
    const cached = getCached();
    if (cached) return cached;
    return [];
  }
}

// ========================================
// WRITE OPERATIONS (Admin only)
// ========================================

export async function addSemester(semester: {
  id: number;
  label: string;
  status: "completed" | "ongoing" | "upcoming";
}) {
  await setDoc(doc(db, "semesters", String(semester.id)), semester);
  invalidateCache();
}

export async function updateSemester(
  semId: number,
  updates: Partial<{ label: string; status: string }>
) {
  await updateDoc(doc(db, "semesters", String(semId)), updates);
  invalidateCache();
}

export async function deleteSemester(semId: number) {
  // Delete all subcollections first
  const subSnap = await getDocs(
    collection(db, "semesters", String(semId), "subjects")
  );
  for (const subDoc of subSnap.docs) {
    await deleteSubjectDeep(semId, subDoc.id);
  }
  await deleteDoc(doc(db, "semesters", String(semId)));
  invalidateCache();
}

export async function addSubject(
  semId: number,
  subject: { name: string; code: string; icon: string; color: string }
) {
  await setDoc(
    doc(db, "semesters", String(semId), "subjects", subject.code.toLowerCase()),
    subject
  );
  invalidateCache();
}

export async function updateSubject(
  semId: number,
  subjectCode: string,
  updates: Partial<Subject>
) {
  await updateDoc(
    doc(db, "semesters", String(semId), "subjects", subjectCode.toLowerCase()),
    updates
  );
  invalidateCache();
}

async function deleteSubjectDeep(semId: number, subjectDocId: string) {
  // Delete all weeks and materials
  const weekSnap = await getDocs(
    collection(db, "semesters", String(semId), "subjects", subjectDocId, "weeks")
  );
  for (const weekDoc of weekSnap.docs) {
    await deleteWeekDeep(semId, subjectDocId, weekDoc.id);
  }
  await deleteDoc(
    doc(db, "semesters", String(semId), "subjects", subjectDocId)
  );
}

export async function deleteSubject(semId: number, subjectCode: string) {
  await deleteSubjectDeep(semId, subjectCode.toLowerCase());
  invalidateCache();
}

export async function addWeek(
  semId: number,
  subjectCode: string,
  week: { id: number; title: string }
) {
  await setDoc(
    doc(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectCode.toLowerCase(),
      "weeks",
      String(week.id)
    ),
    week
  );
  invalidateCache();
}

export async function updateWeek(
  semId: number,
  subjectCode: string,
  weekId: number,
  updates: Partial<Week>
) {
  await updateDoc(
    doc(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectCode.toLowerCase(),
      "weeks",
      String(weekId)
    ),
    updates
  );
  invalidateCache();
}

async function deleteWeekDeep(
  semId: number,
  subjectDocId: string,
  weekDocId: string
) {
  const matSnap = await getDocs(
    collection(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectDocId,
      "weeks",
      weekDocId,
      "materials"
    )
  );
  for (const matDoc of matSnap.docs) {
    await deleteDoc(matDoc.ref);
  }
  await deleteDoc(
    doc(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectDocId,
      "weeks",
      weekDocId
    )
  );
}

export async function deleteWeek(
  semId: number,
  subjectCode: string,
  weekId: number
) {
  await deleteWeekDeep(semId, subjectCode.toLowerCase(), String(weekId));
  invalidateCache();
}

export async function addMaterial(
  semId: number,
  subjectCode: string,
  weekId: number,
  material: Material
) {
  await setDoc(
    doc(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectCode.toLowerCase(),
      "weeks",
      String(weekId),
      "materials",
      material.id
    ),
    material
  );
  invalidateCache();
}

export async function updateMaterial(
  semId: number,
  subjectCode: string,
  weekId: number,
  materialId: string,
  updates: Partial<Material>
) {
  await updateDoc(
    doc(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectCode.toLowerCase(),
      "weeks",
      String(weekId),
      "materials",
      materialId
    ),
    updates
  );
  invalidateCache();
}

export async function deleteMaterial(
  semId: number,
  subjectCode: string,
  weekId: number,
  materialId: string
) {
  await deleteDoc(
    doc(
      db,
      "semesters",
      String(semId),
      "subjects",
      subjectCode.toLowerCase(),
      "weeks",
      String(weekId),
      "materials",
      materialId
    )
  );
  invalidateCache();
}

// ========================================
// USER OPERATIONS (Admin)
// ========================================

export async function fetchAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function updateUserRole(uid: string, role: "user" | "superadmin") {
  await updateDoc(doc(db, "users", uid), { role });
}

export async function deleteUser(uid: string) {
  // Get username to clean up
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    const username = userDoc.data().username;
    if (username) {
      await deleteDoc(doc(db, "usernames", username));
    }
  }
  await deleteDoc(doc(db, "users", uid));
}
