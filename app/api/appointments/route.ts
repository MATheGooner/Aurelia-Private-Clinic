import { NextRequest, NextResponse } from 'next/server';
import { bookAppointment } from '@/lib/appointments/booking';
import { RequestValidationError } from '@/lib/appointments/validation';
import { getCurrentUser } from '@/lib/auth/session';
import { AuthorizationError } from '@/lib/auth/permissions';
import { AppointmentConflictError } from '@/lib/db/repositories/booking';

export async function POST(request: NextRequest) {
  try {
    const actor = await getCurrentUser();
    const result = await bookAppointment(await request.json(), actor);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const status = error instanceof AppointmentConflictError ? 409
      : error instanceof RequestValidationError ? 400
        : error instanceof AuthorizationError ? 403 : 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : 'The appointment could not be requested.' }, { status });
  }
}
