import { NextResponse } from 'next/server';
import { executeCliCommand } from '@/lib/cli';

// Whitelist of allowed commands and their primary sub-commands.
const ALLOWED_COMMANDS: Record<string, string[]> = {
  board: ['list'],
  core: ['list', 'search', 'install', 'uninstall', 'update-index'],
  lib: ['list', 'search', 'install', 'uninstall', 'update-index'],
  compile: [],
  upload: [],
};

export async function GET(
  request: Request,
  { params }: { params: { args: string[] } }
) {
  if (!params.args || params.args.length === 0) {
    return NextResponse.json({ error: 'No command provided' }, { status: 400 });
  }

  const [command, subCommand] = params.args;

  // Validate the command against the whitelist
  if (!ALLOWED_COMMANDS.hasOwnProperty(command)) {
    return NextResponse.json({ error: `Command '${command}' is not allowed.` }, { status: 403 });
  }

  // If the command has specific sub-commands, validate against them.
  const allowedSubCommands = ALLOWED_COMMANDS[command];
  if (allowedSubCommands.length > 0 && !allowedSubCommands.includes(subCommand)) {
     // This allows for dynamic values after the sub-command, like `install <lib_name>`
     const isActionWithId = ['install', 'uninstall', 'search'].includes(subCommand);
     if(!isActionWithId){
        return NextResponse.json({ error: `Sub-command '${subCommand}' for '${command}' is not allowed.` }, { status: 403 });
     }
  }


  const { searchParams } = new URL(request.url);
  const queryArgs = Array.from(searchParams.entries()).flatMap(([key, value]) => {
    return value ? [`--${key}`, value] : [`--${key}`];
  });

  const allArgs = [...params.args.slice(1), ...queryArgs];

  const { stdout, stderr } = await executeCliCommand(command, allArgs);

  if (stderr && !stdout) {
    return NextResponse.json({ error: stderr }, { status: 500 });
  }

  try {
    const jsonOutput = JSON.parse(stdout);
    return NextResponse.json(stderr ? { ...jsonOutput, warnings: stderr } : jsonOutput);
  } catch (e) {
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    if (stderr) {
      headers.set('X-Command-Warnings', Buffer.from(stderr).toString('base64'));
    }
    return new Response(stdout, { headers });
  }
}
