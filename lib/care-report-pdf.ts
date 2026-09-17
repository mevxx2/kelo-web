import { jsPDF } from "jspdf";

export type WeeklyReport = {
  agencyName: string; clientName: string; dateRange: string; summaryLine: string;
  exception: string; visits: string; medications: string; meals: string; activity: string;
  comparison: string; nextWeek: string; notes: { text: string; byline: string }[];
};
export type SessionReport = {
  agencyName: string; clientName: string; caregiverName: string; date: string;
  startTime: string; endTime: string; actualStart?: string | null; actualEnd?: string | null;
};

const BLUE: [number, number, number] = [0, 102, 255];
const INK: [number, number, number] = [17, 18, 24];
const MUTED: [number, number, number] = [102, 102, 110];
const MARGIN = 18, WIDTH = 174, BOTTOM = 272;
const clean = (text: string) => String(text ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").replace(/[–—‑]/g, "-").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/…/g, "...");
export const safeFilename = (value: string) => value.trim().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "").toLowerCase() || "client";

// Match the app's weekly report: white page, blue wordmark, dark insight,
// ruled facts and generous spacing. Measure every line before placing it.
class ReportLayout {
  doc = new jsPDF({ unit: "mm", format: "a4" });
  y = 20;
  constructor(private agency: string, title: string, name: string, range: string) {
    this.doc.setProperties({ title: `Kelo ${title.toLowerCase()} - ${name}`, author: "Kelo Care" });
    this.write("kelo", 28, BLUE, "bold", 11);
    this.y += 10;
    this.write(title.toUpperCase(), 9, BLUE, "bold", 5);
    this.y += 2;
    this.write(name, 23, INK, "bold", 10);
    this.write(range, 10, MUTED);
    this.y += 6;
  }
  ensure(height: number) {
    if (this.y + height <= BOTTOM) return;
    this.doc.addPage(); this.y = 20;
    this.write("kelo  /  Care report continued", 9, BLUE, "bold", 5);
    this.y += 6;
  }
  write(text: string, size = 10, color = INK, weight = "normal", lineHeight = 5.2) {
    this.doc.setFont("helvetica", weight); this.doc.setFontSize(size);
    const lines = this.doc.splitTextToSize(clean(text), WIDTH) as string[];
    for (const line of lines) {
      this.ensure(lineHeight + 1);
      this.doc.setFont("helvetica", weight); this.doc.setFontSize(size); this.doc.setTextColor(...color);
      this.doc.text(line, MARGIN, this.y); this.y += lineHeight;
    }
  }
  section(label: string, value: string) {
    this.ensure(22); this.y += 5;
    this.write(label, 11, INK, "bold", 6);
    this.write(value);
  }
  insight(text: string) {
    this.doc.setFont("helvetica", "bold"); this.doc.setFontSize(14);
    const lines = this.doc.splitTextToSize(clean(text), WIDTH - 14) as string[];
    while (lines.length) {
      this.ensure(30);
      const count = Math.max(1, Math.floor((BOTTOM - this.y - 19) / 6.5));
      const chunk = lines.splice(0, count), height = 18 + chunk.length * 6.5;
      this.doc.setFillColor(7, 17, 31); this.doc.roundedRect(MARGIN, this.y, WIDTH, height, 5, 5, "F");
      this.doc.setFont("helvetica", "bold"); this.doc.setFontSize(8); this.doc.setTextColor(190, 200, 215);
      this.doc.text("ONE THING TO KNOW", MARGIN + 7, this.y + 7);
      this.doc.setFontSize(14); this.doc.setTextColor(255, 255, 255);
      chunk.forEach((line, index) => this.doc.text(line, MARGIN + 7, this.y + 15 + index * 6.5));
      this.y += height + 7;
    }
  }
  fact(label: string, value: string) {
    this.doc.setFont("helvetica", "normal"); this.doc.setFontSize(10);
    const lines = this.doc.splitTextToSize(clean(value), WIDTH - 40) as string[];
    let continued = false;
    while (lines.length) {
      this.ensure(18);
      const count = Math.max(1, Math.floor((BOTTOM - this.y - 8) / 5.2));
      const chunk = lines.splice(0, count), height = Math.max(14, chunk.length * 5.2 + 7);
      this.doc.setDrawColor(228, 228, 231); this.doc.line(MARGIN, this.y, MARGIN + WIDTH, this.y);
      this.doc.setFont("helvetica", "bold"); this.doc.setFontSize(9); this.doc.setTextColor(...MUTED);
      this.doc.text(continued ? "Continued" : label, MARGIN, this.y + 7);
      this.doc.setFont("helvetica", "normal"); this.doc.setFontSize(10); this.doc.setTextColor(...INK);
      chunk.forEach((line, index) => this.doc.text(line, MARGIN + 40, this.y + 7 + index * 5.2));
      this.y += height; continued = true;
    }
  }
  finish() {
    const total = this.doc.getNumberOfPages();
    for (let page = 1; page <= total; page++) {
      this.doc.setPage(page); this.doc.setFont("helvetica", "normal"); this.doc.setFontSize(7);
      this.doc.setDrawColor(228, 228, 231); this.doc.line(MARGIN, 279, MARGIN + WIDTH, 279);
      this.doc.setTextColor(...MUTED);
      let agency = clean(this.agency);
      while (this.doc.getTextWidth(agency) > WIDTH - 40) agency = agency.slice(0, -1);
      this.doc.text(agency, MARGIN, 284);
      this.doc.text(`Page ${page} of ${total}`, MARGIN + WIDTH, 284, { align: "right" });
      this.doc.text("Generated from care records in Kelo. Not medical advice or an emergency service.", MARGIN, 289);
    }
    return this.doc;
  }
}

export function buildWeeklyReportPdf(report: WeeklyReport) {
  const layout = new ReportLayout(report.agencyName, "Weekly care report", report.clientName, `Week of ${report.dateRange}`);
  layout.write(report.summaryLine, 11, INK, "bold", 6); layout.y += 5;
  layout.insight(report.exception);
  layout.fact("Visits", report.visits); layout.fact("Medications", report.medications);
  layout.fact("Meals", report.meals); layout.fact("Activity", report.activity);
  layout.section("Compared with last week", report.comparison);
  layout.section("Care-team notes", report.notes.length ? "" : "No handoff notes were recorded this week.");
  for (const note of report.notes) {
    layout.ensure(20); layout.write(note.byline, 9, BLUE, "bold");
    layout.write(note.text); layout.y += 4;
  }
  layout.section("Next week", report.nextWeek);
  return layout.finish();
}

export function buildSessionReportPdf(report: SessionReport) {
  const layout = new ReportLayout(report.agencyName, "Completed visit report", report.clientName, report.date);
  layout.insight("This visit was marked complete in Kelo.");
  layout.fact("Caregiver", report.caregiverName);
  layout.fact("Scheduled time", `${report.startTime} - ${report.endTime}`);
  const clock = (value?: string | null) => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Not recorded";
  layout.fact("Actual start", clock(report.actualStart)); layout.fact("Actual end", clock(report.actualEnd));
  layout.fact("Status", "Completed");
  layout.section("About this record", "This report confirms the visit status recorded in Kelo. Scheduled times describe the planned appointment; actual start and end times appear only when recorded. Completion does not by itself confirm that every care task was completed.");
  return layout.finish();
}
