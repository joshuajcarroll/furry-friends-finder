// app/api/mock-lambda/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('Mock Furry Friends Lambda hit!');
  const { catDescription } = await request.json();

  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return a mock assessment, care steps, and resources
  const mockAssessment = `This is a mock assessment for a cat described as "${catDescription}". The real assessment will come from the LLM!`;
  const mockImmediateCareSteps = [
    'Mock step 1: Provide water and a small amount of food if safe.',
    'Mock step 2: Do not try to pick up if fearful.',
    'Mock step 3: Observe from a distance for 24-48 hours if seemingly healthy.'
  ];
  const mockResourceCategories = 'mock shelter, mock vet, mock animal control';
  const mockKeywords = 'mock, test, stray cat';

  return NextResponse.json({
    assessment: mockAssessment,
    immediateCareSteps: mockImmediateCareSteps,
    resourceCategories: mockResourceCategories,
    keywords: mockKeywords,
  });
}