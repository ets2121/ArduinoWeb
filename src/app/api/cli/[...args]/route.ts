import { NextResponse } from 'next/server';
import { executeCliCommand } from '@/lib/cli';

const ALLOWED_COMMANDS: Record<string, string[]> = {
  board: ['list'],
  core: ['list', 'search', 'install', 'uninstall', 'update-index'],
  lib: ['list', 'search', 'install', 'uninstall', 'update-index'],
  compile: [],
  upload: [],
};


export async function GET(
  request: Request,
  context: { params: { args?: string[] } }
) {
  const { args = [] } = context.params;

  if (args.length === 0) {
    return NextResponse.json({ error: 'No command provided' }, { status: 400 });
  }

  const [command, subCommand] = args;

  if (!ALLOWED_COMMANDS.hasOwnProperty(command)) {
    return NextResponse.json(
      { error: `Command '${command}' is not allowed.` },
      { status: 403 }
    );
  }

  const allowedSubCommands = ALLOWED_COMMANDS[command];
  const isDynamicSubCommand = ['install', 'uninstall', 'search'].includes(subCommand);

  if (
    allowedSubCommands.length > 0 &&
    !allowedSubCommands.includes(subCommand) &&
    !isDynamicSubCommand
  ) {
    return NextResponse.json(
      { error: `Sub-command '${subCommand}' for '${command}' is not allowed.` },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);

  const commandArgs: string[] = [];
  args.slice(1).forEach(arg => commandArgs.push(arg));

  searchParams.forEach((value, key) => {
    if (value === 'true' || value === '') {
      commandArgs.push(`--${key}`);
    } else {
      commandArgs.push(`--${key}`, value);
    }
  });

  const { stdout, stderr } = await executeCliCommand(command, commandArgs);

  if (stderr && !stdout) {
    return NextResponse.json({ error: stderr }, { status: 500 });
  }

  try {
    const jsonOutput = JSON.parse(stdout);
    return NextResponse.json(
      stderr ? { ...jsonOutput, warnings: stderr } : jsonOutput
    );
  } catch {
    const headers = new Headers();
    headers.set('Content-Type', 'text/plain');
    if (stderr) {
      headers.set('X-Command-Warnings', Buffer.from(stderr).toString('base64'));
    }
    return new Response(stdout, { headers });
  }
  
}
