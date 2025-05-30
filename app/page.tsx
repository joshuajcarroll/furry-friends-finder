'use client'; // This directive is necessary for client-side interactivity in the App Router

import { useState } from 'react';
import Link from 'next/link'; // Import Link from Next.js

export default function HomePage() {
  const [catDescription, setCatDescription] = useState('');
  const [assessment, setAssessment] = useState('');
  const [immediateCareSteps, setImmediateCareSteps] = useState<string[]>([]);
  const [resourceCategories, setResourceCategories] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async () => {
    setLoading(true);
    setError(null);
    setAssessment('');
    setImmediateCareSteps([]);
    setResourceCategories('');
    setKeywords('');

    try {
      const response = await fetch('/api/report-cat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate assessment.');
      }

      const data = await response.json();
      setAssessment(data.assessment);
      setImmediateCareSteps(data.immediateCareSteps);
      setResourceCategories(data.resourceCategories);
      setKeywords(data.keywords);

    } catch (err) {
      console.error('Error generating assessment:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
          🐾 Furry Friends Finder 🐾
        </h1>

        <div className="mb-6">
          <label htmlFor="catDescription" className="block text-gray-700 text-base font-semibold mb-2">
            Describe the Cat&#39;s Condition & Behavior:
          </label>
          <textarea
            id="catDescription"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 h-40 sm:h-48 resize-y transition-all duration-200 ease-in-out text-base shadow-sm"
            placeholder="e.g., 'Small, limping, meowing loudly' or 'Friendly, but covered in fleas'"
            value={catDescription}
            onChange={(e) => setCatDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleReport}
          disabled={loading || !catDescription.trim()}
          className={`w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out text-lg font-semibold shadow-md
            ${loading || !catDescription.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Assessment...
            </span>
          ) : (
            'Submit Report'
          )}
        </button>

        {/* New button to link to reports page */}
        <div className="mt-4"> {/* Added margin top for spacing */}
          <Link href="/reports" passHref>
            <button
              className="w-full py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 ease-in-out text-lg font-semibold shadow-md
                         bg-purple-600 hover:bg-purple-700 text-white transform hover:scale-105"
            >
              View All Reports
            </button>
          </Link>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg shadow-sm text-center font-medium">
            Error: {error}
          </div>
        )}

        {(assessment || immediateCareSteps.length > 0 || resourceCategories || keywords) && (
          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-inner">
            {assessment && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-blue-800 mb-2">Assessment:</h2>
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{assessment}</p>
              </div>
            )}
            {immediateCareSteps.length > 0 && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-blue-800 mt-4 mb-2">Immediate Safe Care Steps:</h2>
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                  {immediateCareSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
            {resourceCategories && (
              <div className="mb-4">
                <h2 className="text-xl font-bold text-blue-800 mt-4 mb-2">Suggested Resource Categories:</h2>
                <p className="text-gray-800">{resourceCategories}</p>
              </div>
            )}
            {keywords && (
              <div>
                <h2 className="text-xl font-bold text-blue-800 mt-4 mb-2">Keywords:</h2>
                <p className="text-gray-800">{keywords}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}