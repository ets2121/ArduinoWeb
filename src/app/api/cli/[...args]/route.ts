import { NextResponse } from 'next/server';
import { executeCliCommand } from '@/lib/cli';

export async function GET(
  request: Request,
  { params }: { params: { args: string[] } }
) {
  if (!params.args || params.args.length === 0) {
    return NextResponse.json({ error: 'No command provided' }, { status: 400 });
  }

  const [command, ...restArgs] = params.args;
  
  // The search query params are passed separately by Next.js
  const { searchParams } = new URL(request.url);
  const queryArgs = Array.from(searchParams.entries()).flatMap(([key, value]) => [`--${key}`, value]);

  const allArgs = [...restArgs, ...queryArgs];

  const { stdout, stderr } = await executeCliCommand(command, allArgs);

  if (stderr) {
    // Distinguish between actual errors and warnings if needed
    // For now, any stderr output is considered a potential error
    return NextResponse.json({ error: stderr, stdout }, { status: 500 });
  }

  try {
    // Try to parse stdout as JSON, as many CLI commands support it
    const jsonOutput = JSON.parse(stdout);
    return NextResponse.json(jsonOutput);
  } catch (e) {
    // If not JSON, return as plain text
    return new Response(stdout, { headers: { 'Content-Type': 'text/plain' } });
  }
}
