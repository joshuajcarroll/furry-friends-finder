'use client'; // This directive is necessary for client-side data fetching

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define a type for your cat report data structure
interface CatReport {
  reportId: string;
  timestamp: string;
  catDescription: string;
  assessment: string;
  immediateCareSteps: string[];
  resourceCategories: string;
  keywords: string;
  // Add other fields as they appear in your DynamoDB table
}

export default function ReportsPage() {
  const [reports, setReports] = useState<CatReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/get-reports');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch reports.');
        }
        const data = await response.json();
        setReports(data.reports); // Assuming the API returns an object with a 'reports' array
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Furry Friends Finder - All Reports
        </h1>

        <div className="mb-6 text-center">
          <Link href="/">
            <span className="text-blue-600 hover:underline cursor-pointer">
              &larr; Back to Report Cat
            </span>
          </Link>
        </div>

        {loading && (
          <p className="text-center text-gray-600">Loading reports...</p>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-center">
            Error: {error}
          </div>
        )}

        {!loading && reports.length === 0 && !error && (
          <p className="text-center text-gray-600">No reports found yet. Submit one!</p>
        )}

        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report.reportId} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Report ID: {report.reportId}</h2>
              <p className="text-sm text-gray-500 mb-3">Reported: {new Date(report.timestamp).toLocaleString()}</p>

              <div className="mb-2">
                <p className="font-medium text-gray-700">Description:</p>
                <p className="text-gray-600 text-sm">{report.catDescription}</p>
              </div>

              <div className="mb-2">
                <p className="font-medium text-gray-700">Assessment:</p>
                <p className="text-gray-600 text-sm whitespace-pre-wrap">{report.assessment}</p>
              </div>

              {report.immediateCareSteps && report.immediateCareSteps.length > 0 && (
                <div className="mb-2">
                  <p className="font-medium text-gray-700">Immediate Care Steps:</p>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {report.immediateCareSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-2">
                <p className="font-medium text-gray-700">Resource Categories:</p>
                <p className="text-gray-600 text-sm">{report.resourceCategories}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Keywords:</p>
                <p className="text-gray-600 text-sm">{report.keywords}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}