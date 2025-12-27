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

  const [command, subCommand, ...pathRest] = params.args;

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

  const pathArgs = params.args.slice(1);

  const { searchParams } = new URL(request.url);
  const queryArgs = Array.from(searchParams.entries()).flatMap(([key, value]) => {
    if (value === 'true') {
        return [`--${key}`];
    }
    return [`--${key}`, value];
  });

  const allArgs = [...pathArgs, ...queryArgs];

  const { stdout, stderr } = await executeCliCommand(command, allArgs);

  if (stderr && !stdout) {
    return NextResponse.json({ error: stderr }, { status: 500 });
  }
    
  // The cli can return valid json but still have warnings in stderr
  // so we try to parse json and attach warnings if they exist.
  try {
    const jsonOutput = JSON.parse(stdout);
    return NextResponse.json(stderr ? { ...jsonOutput, warnings: stderr } : jsonOutput);
  } catch (e) {
    // If stdout is not json, return it as plain text.
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    if (stderr) {
      // Encode warnings in a header to be optionally used by the client.
      headers.set('X-Command-Warnings', Buffer.from(stderr).toString('base64'));
    }
    return new Response(stdout, { headers });
  }
}
