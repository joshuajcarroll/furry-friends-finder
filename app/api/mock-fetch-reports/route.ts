// app/api/mock-fetch-reports/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Mock Furry Friends Fetch Lambda hit!');

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock data
  const mockReports = [
    {
      reportId: 'mock-1',
      timestamp: new Date().toISOString(),
      catDescription: 'Mock cat 1: Friendly, fluffy, sitting on porch.',
      assessment: 'Mock Assessment: Appears to be a lost housecat.',
      immediateCareSteps: ['Mock step 1: Offer food.', 'Mock step 2: Check for collar.'],
      resourceCategories: 'shelter, lost pet registries',
      keywords: 'friendly, fluffy, lost',
    },
    {
      reportId: 'mock-2',
      timestamp: new Date().toISOString(),
      catDescription: 'Mock cat 2: Small, limping, hiding under car.',
      assessment: 'Mock Assessment: Possibly injured stray.',
      immediateCareSteps: ['Mock step 1: Do not approach.', 'Mock step 2: Call animal control.'],
      resourceCategories: 'veterinary clinic, animal control',
      keywords: 'injured, shy, stray',
    },
  ];

  return NextResponse.json({ reports: mockReports });
}