import { NextRequest, NextResponse } from 'next/server';
import { saveEnquiry } from '@/lib/services/organisationService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organisationId, enquiryData } = body;

    if (!organisationId || !enquiryData) {
      return NextResponse.json(
        { success: false, error: 'Missing organisationId or enquiryData' },
        { status: 400 }
      );
    }

    const result = await saveEnquiry(organisationId, enquiryData);
    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Server error processing enquiry';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
