import PdfSummaryForm from "../components/PdfSummaryForm";

export default function PdfSummaryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen container mx-auto">
      <h3 className="text-2xl font-bold text-gray-100 mb-4">PDF Summarizer</h3>
      <p className="text-gray-400 mb-4 text-center">Upload a PDF and get a concise summary with bullet points.</p>
      <PdfSummaryForm />
    </div>
  );
}
