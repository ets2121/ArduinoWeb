'use server';

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const isLocal = process.env.IS_LOCAL === 'true';

// Mock data for development environment
const mockData: Record<string, any> = {
  'board list': {
    stdout: JSON.stringify([
      {
        port: {
          address: 'COM3',
          protocol: 'serial',
          protocol_label: 'Serial Port',
          label: 'COM3',
        },
        matching_boards: [
          {
            name: 'Arduino Uno',
            fqbn: 'arduino:avr:uno',
          },
        ],
      },
    ]),
    stderr: '',
  },
  'lib list --format json': {
    stdout: JSON.stringify({
      installed_libraries: [
        {
          library: {
            name: 'Servo',
            version: '1.2.1',
            author: 'Arduino',
            maintainer: 'Arduino',
          },
        },
        {
          library: {
            name: 'SD',
            version: '1.2.4',
            author: 'Arduino, SparkFun, Adafruit',
            maintainer: 'Arduino',
          },
        },
      ]
    }),
    stderr: '',
  },
  'core list --format json': {
    stdout: JSON.stringify({
      platforms: [
        { id: 'arduino:avr', name: 'Arduino AVR Boards', installed_version: '1.8.6', latest_version: '1.8.6' },
      ],
    }),
    stderr: '',
  },
  'lib search servo': {
    stdout: JSON.stringify({
      libraries: [
        {
          name: 'Servo',
          latest: {
            author: 'Arduino',
            version: '1.2.1',
            maintainer: 'Arduino',
            sentence: 'Allows Arduino boards to control a variety of servo motors.',
          },
        },
      ],
    }),
    stderr: '',
  },
   'lib search sd': {
    stdout: JSON.stringify({
      libraries: [
        {
          name: 'SD',
          latest: {
            author: 'Arduino, SparkFun, Adafruit',
            version: '1.2.4',
            maintainer: 'Arduino',
            sentence: 'Enables reading and writing on SD cards.',
          },
        },
      ],
    }),
    stderr: '',
  },
  'core search avr': {
    stdout: JSON.stringify({
      platforms: [{ id: 'arduino:avr', latest_version: '1.8.6', releases: {'1.8.6': {name: 'Arduino AVR Boards'}} }],
    }),
    stderr: '',
  },
  'compile': {
    stdout: `Sketch uses 928 bytes (2%) of program storage space. Maximum is 32256 bytes.
Global variables use 9 bytes (0%) of dynamic memory, leaving 2039 bytes for local variables. Maximum is 2048 bytes.`,
    stderr: '',
  },
  'upload': {
    stdout: 'Done uploading.',
    stderr: '',
  },
   'lib install': {
    stdout: 'Library installed successfully',
    stderr: '',
  },
  'lib uninstall': {
    stdout: 'Library uninstalled successfully',
    stderr: '',
  },
  'core install': {
    stdout: 'Core installed successfully',
    stderr: '',
  },
  'core uninstall': {
    stdout: 'Core uninstalled successfully',
    stderr: '',
  },
};

function getMockData(command: string, args: string[]) {
    const fullCommand = `${command} ${args.join(' ')}`;
    console.log(`[MOCK] Searching for command: ${fullCommand}`);

    const simpleCommand = command;
    const action = args[0]; 
    const query = args.length > 1 ? args.slice(1).find(a => !a.startsWith('--')) : undefined;


    if (simpleCommand === 'lib' && action === 'search' && query) {
        const mockKey = `lib search ${query}`;
        if(mockData[mockKey]) return mockData[mockKey];
        return { libraries: [] };
    }
    if (simpleCommand === 'core' && action === 'search' && query) {
        const mockKey = `core search ${query}`;
        if(mockData[mockKey]) return mockData[mockKey];
        return { platforms: [] };
    }
     if (simpleCommand === 'lib' && action === 'list') {
        return mockData['lib list --format json'];
    }
    if (simpleCommand === 'core' && action === 'list') {
        return mockData['core list --format json'];
    }
    if (simpleCommand === 'lib' && (action === 'install' || action ==='uninstall')) {
      return mockData[`lib ${action}`];
    }
     if (simpleCommand === 'core' && (action === 'install' || action === 'uninstall')) {
      return mockData[`core ${action}`];
    }

    const mockKey = Object.keys(mockData).find(key => fullCommand.includes(key));
     if (mockKey) {
        return mockData[mockKey];
    }
    
    return { stdout: `No mock data for "${fullCommand}"`, stderr: '' };
}

export async function executeCliCommand(command: string, args: string[] = []) {
  if (!isLocal) {
    return getMockData(command, args);
  }

  // Sanitize arguments to prevent command injection issues
  const sanitizedArgs = args.map(arg => {
    if (!arg) return '';
    // More robust sanitization might be needed depending on the use case
    // For arguments with spaces or special characters, wrap them in quotes if not already
    if (/\s/.test(arg) && !/^".*"$/.test(arg) && !/^'.*'$/.test(arg)) {
       return `"${arg.replace(/"/g, '\\"')}"`;
    }
    return arg;
  }).join(' ');
  
  const commandWithArgs = `arduino-cli ${command} ${sanitizedArgs}`;

  try {
    console.log(`[LOCAL] Executing command: ${commandWithArgs}`);
    const { stdout, stderr } = await execAsync(commandWithArgs);
    return { stdout, stderr };
  } catch (error: any) {
    // The error object from execAsync often has stdout and stderr properties
    return { stdout: error.stdout || '', stderr: error.stderr || error.message };
  }
}
