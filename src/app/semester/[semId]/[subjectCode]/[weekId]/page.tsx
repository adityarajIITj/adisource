import { getSemester, getSubject, getWeek, getMaterialIcon, getMaterialLabel, formatMinutes } from "@/data/courses";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Play, Download, ExternalLink, Calendar } from "lucide-react";

export default async function WeekPage(props: { params: Promise<{ semId: string; subjectCode: string; weekId: string }> }) {
  const params = await props.params;
  const semId = parseInt(params.semId, 10);
  const weekId = parseInt(params.weekId, 10);
  const subjectCode = params.subjectCode;

  const subject = getSubject(semId, subjectCode);
  const semester = getSemester(semId);
  const week = getWeek(semId, subjectCode, weekId);

  if (!subject || !semester || !week) {
    notFound();
  }

  const weekMins = week.materials.reduce((t, m) => t + m.estimatedMinutes, 0);

  return (
    <div className="relative min-h-screen flex flex-col pt-24">
      <Navbar />

      <main className="flex-grow px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Breadcrumbs */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/`} className="hover:text-brand-blue transition-colors">{semester.label}</Link>
            <span>/</span>
            <Link href={`/semester/${semId}/${subjectCode.toLowerCase()}`} className="hover:text-brand-blue transition-colors font-medium text-text-primary">
              {subject.code}
            </Link>
            <span>/</span>
            <span>Week {week.id}</span>
          </div>

          {/* Week Header */}
          <div className="glass-card rounded-3xl p-8 mb-12 border-l-4" style={{ borderLeftColor: subject.color.split("-")[2] }}>
            <div className="flex items-center gap-2 text-brand-blue font-semibold mb-2">
              <Calendar className="w-5 h-5" />
              Week {week.id}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
              {week.title}
            </h1>
            <p className="text-text-secondary">
              {week.materials.length} resources • {formatMinutes(weekMins)} estimated completion time
            </p>
          </div>

          {/* Materials List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-text-primary mb-6">Learning Materials</h2>
            
            {week.materials.map((material, index) => (
              <div 
                key={material.id} 
                className="glass-card rounded-2xl p-6 group hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Icon + Title */}
                  <div className="flex flex-row items-center gap-5 flex-1">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-inner`}>
                      <span className="text-2xl">{getMaterialIcon(material.type)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                          {getMaterialLabel(material.type)}
                        </span>
                        <span className="text-xs text-text-muted border border-text-muted/30 rounded-full px-2 py-0.5">
                          {formatMinutes(material.estimatedMinutes)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-text-primary group-hover:text-brand-blue transition-colors">
                        {material.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <button className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-text-secondary transition-colors" title="Download">
                      <Download className="w-5 h-5" />
                    </button>
                    <Link 
                      href={`/semester/${semId}/${subjectCode.toLowerCase()}/${week.id}/view/${material.id}`}
                      className="btn-primary !py-2.5 !px-5 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
