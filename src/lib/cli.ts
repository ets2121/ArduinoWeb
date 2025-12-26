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
    stdout: JSON.stringify([
      {
        library: {
          name: 'Servo',
          version: '1.2.1',
          author: 'Arduino',
          maintainer: 'Arduino',
        },
      },
    ]),
    stderr: '',
  },
  'core list --format json': {
    stdout: JSON.stringify({
      result: [
        { name: 'Arduino AVR Boards', id: 'arduino:avr', version: '1.8.6' },
      ],
    }),
    stderr: '',
  },
  'lib search servo': {
    stdout: JSON.stringify({
      libraries: [{ name: 'Servo', version: '1.2.1', author: 'Arduino' }],
    }),
    stderr: '',
  },
  'core search avr': {
    stdout: JSON.stringify({
      cores: [{ id: 'arduino:avr', name: 'Arduino AVR Boards' }],
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

    const simpleCommand = command.split(' ')[0]; // e.g., 'lib', 'core'
    const action = command.split(' ')[1]; // e.g., 'search', 'install'

    if (command === 'lib' && action === 'search') {
        return mockData['lib search servo'];
    }
    if (command === 'core' && action === 'search') {
        return mockData['core search avr'];
    }
     if (command === 'lib' && action === 'list') {
        return mockData['lib list --format json'];
    }
    if (command === 'core' && action === 'list') {
        return mockData['core list --format json'];
    }
    if (command === 'lib' && action === 'install') {
        return mockData['lib install'];
    }
    if (command === 'lib' && action === 'uninstall') {
        return mockData['lib uninstall'];
    }
     if (command === 'core' && action === 'install') {
        return mockData['core install'];
    }
    if (command === 'core' && action === 'uninstall') {
        return mockData['core uninstall'];
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

  const commandWithArgs = `arduino-cli ${command} ${args.join(' ')}`;

  try {
    console.log(`[LOCAL] Executing command: ${commandWithArgs}`);
    const { stdout, stderr } = await execAsync(commandWithArgs);
    return { stdout, stderr };
  } catch (error: any) {
    // The error object from execAsync often has stdout and stderr properties
    return { stdout: error.stdout || '', stderr: error.stderr || error.message };
  }
}
