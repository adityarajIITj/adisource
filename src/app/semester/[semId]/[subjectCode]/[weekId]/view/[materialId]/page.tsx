import { getSemester, getSubject, getWeek } from "@/data/courses";
import { notFound } from "next/navigation";
import LearningEnvironment from "@/components/LearningEnvironment";

export default async function ViewMaterialPage(
  props: { params: Promise<{ semId: string; subjectCode: string; weekId: string; materialId: string }> }
) {
  const params = await props.params;
  const semId = parseInt(params.semId, 10);
  const weekId = parseInt(params.weekId, 10);
  const subjectCode = params.subjectCode;
  const materialId = params.materialId;

  const semester = getSemester(semId);
  const subject = getSubject(semId, subjectCode);
  const week = getWeek(semId, subjectCode, weekId);

  if (!semester || !subject || !week) {
    notFound();
  }

  // Get all materials for this subject to drive the sidebar navigation
  // We will collect all materials across all weeks for hopping, or just this week.
  // The sidebar in LearningEnvironment is designed to show lectures. Let's send all materials in the week,
  // or if we want to show all materials in the entire subject, we can do that. Let's send ALL materials in the subject.
  const allMaterials = subject.weeks.reduce((acc, w) => [...acc, ...w.materials], [] as any[]);

  const material = allMaterials.find(m => m.id === materialId);

  if (!material) {
    notFound();
  }

  return (
    <LearningEnvironment 
      subject={subject}
      week={week}
      material={material}
      allMaterials={allMaterials}
      semId={semId}
    />
  );
}
