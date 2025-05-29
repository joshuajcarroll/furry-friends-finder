// app/api/get-reports/route.ts
import { NextResponse } from 'next/server';

// This is where we will call your AWS Lambda function that retrieves reports.
// We'll create this new Lambda function in the next step.
const lambdaFetchEndpoint = process.env.NEXT_PUBLIC_LAMBDA_FETCH_API_URL || 'http://localhost:3000/api/mock-fetch-reports'; // Fallback for local testing

export async function GET() {
  try {
    const response = await fetch(lambdaFetchEndpoint, {
      method: 'GET', // This Lambda will handle GET requests
      headers: {
        'Content-Type': 'application/json',
        // Potentially add an API key here later for security if needed
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from Lambda (get-reports):', errorData);
      return NextResponse.json({ error: errorData.message || 'Failed to fetch reports from Lambda.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data); // Forward Lambda's response (list of reports)

  } catch (error) {
    console.error('Error in Next.js API route (get-reports):', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}