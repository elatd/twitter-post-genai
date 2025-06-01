"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || "";

interface SummaryResult {
  summary: string;
  bullets: string[];
}

const PdfSummaryForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("apiKey", apiKey);

    try {
      const response = await fetch(`${BASE_URL}/api/summarize-pdf`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to summarize PDF");
      }
      const data = await response.json();
      setResult(data);
      toast.success("Summarized successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      console.error("Error summarizing PDF:", error);
      toast.error("Failed to summarize PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter your OpenAI API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-transparent border-2 border-gray-800 rounded-lg p-2.5 text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-gray-800 placeholder:text-gray-500"
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          className="w-full text-gray-100"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? "Summarizing..." : "Summarize PDF"}
        </button>
      </form>
      {result && (
        <div className="mt-4 text-gray-100">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="mb-2 whitespace-pre-line">{result.summary}</p>
          {result.bullets && result.bullets.length > 0 && (
            <>
              <h3 className="font-semibold mb-1">Bullet Points</h3>
              <ul className="list-disc list-inside">
                {result.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default PdfSummaryForm;
