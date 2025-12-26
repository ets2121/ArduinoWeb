'use server';

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const isLocal = process.env.NEXT_PUBLIC_IS_LOCAL === 'true';

// Mock data for development environment
const mockData: Record<string, any> = {
  'board list': {
    stdout: JSON.stringify([
        {
          "port": {
            "address": "COM3",
            "protocol": "serial",
            "protocol_label": "Serial Port",
            "label": "COM3"
          },
          "matching_boards": [
            {
              "name": "Arduino Uno",
              "fqbn": "arduino:avr:uno"
            }
          ]
        }
      ]),
    stderr: '',
  },
  'lib search --format json "servo"': {
    stdout: JSON.stringify({
        "libraries": [
            { "name": "Servo", "version": "1.2.1", "author": "Arduino" }
        ]
    }),
    stderr: '',
  },
  'board search --format json "uno"': {
    stdout: JSON.stringify({
        "boards": [
            { "name": "Arduino Uno", "fqbn": "arduino:avr:uno" }
        ]
    }),
    stderr: '',
  },
  'core search --format json "avr"': {
    stdout: JSON.stringify({
        "cores": [
            { "id": "arduino:avr", "name": "Arduino AVR Boards" }
        ]
    }),
    stderr: '',
  },
  'compile --fqbn arduino:avr:uno --output-dir /tmp/build /tmp/sketch': {
    stdout: `Sketch uses 928 bytes (2%) of program storage space. Maximum is 32256 bytes.
Global variables use 9 bytes (0%) of dynamic memory, leaving 2039 bytes for local variables. Maximum is 2048 bytes.`,
    stderr: '',
  },
  'upload -p COM3 --fqbn arduino:avr:uno /tmp/sketch': {
    stdout: 'Done uploading.',
    stderr: '',
  },
};

export async function executeCliCommand(command: string, args: string[] = []) {
  const fullCommand = `arduino-cli ${command} ${args.join(' ')}`;
  
  if (!isLocal) {
    console.log(`[MOCK] Executing command: ${fullCommand}`);
    // Find a matching mock command. This is a simple implementation.
    const mockKey = Object.keys(mockData).find(key => fullCommand.includes(key) || key.includes(fullCommand));
    if (mockKey && mockData[mockKey]) {
      return mockData[mockKey];
    }
    return { stdout: `No mock data for "${fullCommand}"`, stderr: '' };
  }

  try {
    const { stdout, stderr } = await execAsync(fullCommand, { shell: '/bin/bash' });
    return { stdout, stderr };
  } catch (error: any) {
    return { stdout: '', stderr: error.message };
  }
}
