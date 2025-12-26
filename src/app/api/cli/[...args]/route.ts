import { NextResponse } from 'next/server';
import { executeCliCommand } from '@/lib/cli';

export async function GET(
  request: Request,
  { params }: { params: { args: string[] } }
) {
  if (!params.args || params.args.length === 0) {
    return NextResponse.json({ error: 'No command provided' }, { status: 400 });
  }

  // The dynamic route parts are the command and its main arguments
  const [command, ...restArgs] = params.args;
  
  // Search query params are handled separately
  const { searchParams } = new URL(request.url);
  const queryArgs = Array.from(searchParams.entries()).flatMap(([key, value]) => {
    // some args are flags, others are key-value pairs
    return value ? [`--${key}`, value] : [`--${key}`];
  });

  // Combine all arguments
  const allArgs = [...restArgs, ...queryArgs];

  const { stdout, stderr } = await executeCliCommand(command, allArgs);

  if (stderr && !stdout) {
    // If there's stderr and no stdout, it's likely a real error.
    return NextResponse.json({ error: stderr, stdout: stdout }, { status: 500 });
  }
  
  // Many CLI commands use stderr for progress/status messages, so we check stdout first.
  try {
    const jsonOutput = JSON.parse(stdout);
    // If there's stderr, we can include it for logging/debugging, but the request is successful.
    return NextResponse.json(stderr ? { ...jsonOutput, warnings: stderr } : jsonOutput);
  } catch (e) {
    // If stdout is not JSON, return as plain text. Stderr is included as a header for debugging.
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    if (stderr) {
      headers.set('X-Command-Warnings', Buffer.from(stderr).toString('base64'));
    }
    return new Response(stdout, { headers });
  }
}
