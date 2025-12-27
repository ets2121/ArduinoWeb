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
  const args = params.args || [];

  if (args.length === 0) {
    return NextResponse.json({ error: 'No command provided' }, { status: 400 });
  }

  const [command, subCommand] = args;

  if (!ALLOWED_COMMANDS.hasOwnProperty(command)) {
    return NextResponse.json({ error: `Command '${command}' is not allowed.` }, { status: 403 });
  }

  const allowedSubCommands = ALLOWED_COMMANDS[command];
  const isDynamicSubCommand = ['install', 'uninstall', 'search'].includes(subCommand);

  if (allowedSubCommands.length > 0 && !allowedSubCommands.includes(subCommand) && !isDynamicSubCommand) {
      return NextResponse.json({ error: `Sub-command '${subCommand}' for '${command}' is not allowed.` }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);

  // Reconstruct args: path parts come first, then query params
  const commandArgs = [...args.slice(1)]; // all path parts after the main command
  
  searchParams.forEach((value, key) => {
    // The arduino-cli uses flags like --json, not --json=true
    if (value === 'true') {
        commandArgs.push(`--${key}`);
    } else {
        commandArgs.push(`--${key}`, value);
    }
  });
  
  const { stdout, stderr } = await executeCliCommand(command, commandArgs);

  if (stderr && !stdout) {
    // If there's only an error, return a 500
    // The cli can return valid json but still have warnings in stderr
    return NextResponse.json({ error: stderr }, { status: 500 });
  }

  try {
    const jsonOutput = JSON.parse(stdout);
     // If there is a mix of JSON output and warnings, combine them
    return NextResponse.json(stderr ? { ...jsonOutput, warnings: stderr } : jsonOutput);
  } catch (e) {
    // If stdout is not json, it's likely plain text output
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    if (stderr) {
       // Send warnings in a header if the primary output is text
      headers.set('X-Command-Warnings', Buffer.from(stderr).toString('base64'));
    }
    return new Response(stdout, { headers });
  }
}
