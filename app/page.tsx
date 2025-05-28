'use client'; // This directive is necessary for client-side interactivity in the App Router

import { useState } from 'react';

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
      // This will be our Next.js API route later
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Furry Friends Finder - Report a Cat</h1>

        <div className="mb-4">
          <label htmlFor="catDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Describe the Cat&#39;s Condition & Behavior:
          </label>
          <textarea
            id="catDescription"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48 resize-y"
            placeholder="e.g., 'Small, limping, meowing loudly' or 'Friendly, but covered in fleas'"
            value={catDescription}
            onChange={(e) => setCatDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleReport}
          disabled={loading || !catDescription.trim()}
          className={`w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline text-white font-bold transition-colors duration-200 ${
            loading || !catDescription.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Generating Assessment...' : 'Submit Report'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        {(assessment || immediateCareSteps.length > 0 || resourceCategories || keywords) && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded">
            {assessment && (
              <>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">Assessment:</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{assessment}</p>
              </>
            )}
            {immediateCareSteps.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Immediate Safe Care Steps:</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {immediateCareSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
              </>
            )}
            {resourceCategories && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Suggested Resource Categories:</h2>
                <p className="text-gray-700">{resourceCategories}</p>
              </>
            )}
            {keywords && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 text-gray-800">Keywords:</h2>
                <p className="text-gray-700">{keywords}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}