import { NextResponse } from 'next/server';
import { seedAdminUsersAction } from '@/app/actions/auth';

export async function GET() {
  try {
    const result = await seedAdminUsersAction();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error seeding users',
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
