import { NextRequest, NextResponse } from 'next/server';
import { getAvailability } from '@/lib/appointments/availability';
import { RequestValidationError, validateAvailabilityQuery } from '@/lib/appointments/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const input = validateAvailabilityQuery({
      department: query.get('department'), treatment: query.get('treatment'),
      practitioner: query.get('practitioner'), from: query.get('from'), to: query.get('to'),
    });
    return NextResponse.json(await getAvailability(input));
  } catch (error) {
    const status = error instanceof RequestValidationError ? 400 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Availability could not be loaded.' }, { status });
  }
}
