import { NextResponse } from 'next/server';
import { successResponse } from '@/utils/responses';

export async function POST() {
  // Stateless JWT logout happens client-side by clearing token. This is a no-op endpoint.
  return NextResponse.json(successResponse('Logged out', null, 200), { status: 200 });
}


