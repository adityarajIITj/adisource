import { getSemester, getSubject, getTotalMaterials, getTotalMinutes, formatMinutes } from "@/data/courses";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, FileText, Lock } from "lucide-react";

export default async function SubjectPage(props: { params: Promise<{ semId: string; subjectCode: string }> }) {
  const params = await props.params;
  const semId = parseInt(params.semId, 10);
  const subjectCode = params.subjectCode;

  const subject = getSubject(semId, subjectCode);
  const semester = getSemester(semId);

  if (!subject || !semester) {
    notFound();
  }

  const totalMaterials = getTotalMaterials(subject.weeks);
  const totalMinutes = getTotalMinutes(subject.weeks);

  return (
    <div className="relative min-h-screen flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumbs & Back */}
          <div className="mb-8 flex items-center gap-4 text-sm text-text-muted">
            <Link href="/#subjects" className="hover:text-brand-blue flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <span>/</span>
            <span>{semester.label}</span>
          </div>

          {/* Subject Header */}
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${subject.color} opacity-20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none`} />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{subject.icon}</span>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-lg bg-gradient-to-r ${subject.color} text-white`}>
                    {subject.code}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-text-primary max-w-2xl">
                  {subject.name}
                </h1>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm font-medium text-text-secondary">
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-xl">
                  <FileText className="w-4 h-4 text-brand-blue" />
                  <span>{totalMaterials} Files</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 px-4 py-2 rounded-xl">
                  <Clock className="w-4 h-4 text-brand-purple" />
                  <span>{formatMinutes(totalMinutes)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weeks List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Course Material</h2>
            
            {subject.weeks.length > 0 ? (
              subject.weeks.map((week) => {
                const weekMaterials = week.materials.length;
                const weekMins = week.materials.reduce((t, m) => t + m.estimatedMinutes, 0);

                return (
                  <div key={week.id} className="glass-card rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-brand-blue mb-1">
                          Week {week.id}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-text-primary group-hover:text-brand-purple transition-colors">
                          {week.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>{weekMaterials} items</span>
                          <span>•</span>
                          <span>{formatMinutes(weekMins)}</span>
                        </div>
                        <Link 
                          href={`/semester/${semId}/${subjectCode.toLowerCase()}/${week.id}`}
                          className="btn-secondary !py-2 !px-4"
                        >
                          View Materials
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 glass-card rounded-2xl">
                <Lock className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-text-primary mb-2">Content Locked</h3>
                <p className="text-text-secondary">
                  Materials for this subject will be published soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
