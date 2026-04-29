'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useReportsModule } from '../hooks';

export function ReportDetailPage() {
  const { local, id } = useParams<{ local: string; id: string }>();
  const { getReportById } = useReportsModule();
  const report = getReportById(id);

  if (!report) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <p className="text-sm text-muted-foreground">This report id does not exist in the current definitions.</p>
        <Link href={`/${local}/reports`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to reports
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{report.name}</h1>
          <p className="text-sm text-muted-foreground">Focused report view for category: {report.category}.</p>
        </div>
        <Link href={`/${local}/reports`} className="h-9 px-3 rounded-md border text-sm hover:bg-muted inline-flex items-center">
          Back to reports
        </Link>
      </div>

      <section className="rounded-xl border bg-background p-4">
        <h2 className="font-semibold">Snapshot</h2>
        <p className="text-sm text-muted-foreground mt-1">This route is the dedicated entry point for report details and future drill-down widgets.</p>
      </section>
    </div>
  );
}
