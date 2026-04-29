import { NextRequest, NextResponse } from 'next/server';

/**
 * Example API route
 * GET /api/hello
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name') || 'World';

  return NextResponse.json(
    {
      message: `Hello, ${name}!`,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

/**
 * Example POST API route
 * POST /api/hello
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: `Hello, ${name}!`,
        received: body,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }
}
