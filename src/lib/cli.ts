'use server';

import { spawn } from 'child_process';

const isLocal = process.env.IS_LOCAL === 'true';

// Mock data for development environment
const mockData: Record<string, any> = {
  'board list --json': {
    stdout: JSON.stringify({
      "detected_ports": [
        {
          "port": {
            "address": "COM3",
            "label": "COM3",
            "protocol": "serial",
            "protocol_label": "Serial Port (COM3)"
          }
        },
        {
          "port": {
            "address": "/dev/ttyACM0",
            "label": "/dev/ttyACM0",
            "protocol": "serial",
            "protocol_label": "Serial Port (ACM0)"
          }
        }
      ]
    }),
    stderr: '',
  },
  'lib list --json': {
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
  'core list --json': {
    stdout: JSON.stringify({
      platforms: [
        { id: 'arduino:avr', name: 'Arduino AVR Boards', installed_version: '1.8.6', latest_version: '1.8.6' },
      ],
    }),
    stderr: '',
  },
  'lib search servo --json': {
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
   'lib search sd --json': {
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
  'core search avr --json': {
    stdout: JSON.stringify({
      platforms: [{ id: 'arduino:avr', name: 'Arduino AVR Boards', latest_version: '1.8.6', releases: {'1.8.6': {name: 'Arduino AVR Boards'}} }],
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
    const commandAndArgs = [command, ...args].join(' ').trim();
    console.log(`[MOCK] Searching for command: ${commandAndArgs}`);
    
    // Prioritize exact matches
    if(mockData[commandAndArgs]) return mockData[commandAndArgs];

    const simpleCommand = command;
    const action = args.find(a => !a.startsWith('--'));

    let mockKey = `${simpleCommand}${action ? ' ' + action : ''}`;
    
    // Fallback for install/uninstall
    if (simpleCommand === 'lib' && (action === 'install' || action === 'uninstall')) {
      return mockData[`lib ${action}`];
    }
    if (simpleCommand === 'core' && (action === 'install' || action === 'uninstall')) {
      return mockData[`core ${action}`];
    }
    
    const searchKey = `${simpleCommand} ${action} ${args.find(a => !a.startsWith('--') && a !== action)} --json`.trim();
    if(mockData[searchKey]) return mockData[searchKey];
    
    // Dynamic search mock
    if (command === 'lib' && action === 'search') {
      return { stdout: JSON.stringify({ "libraries": [] }), stderr: '' };
    }
    if (command === 'core' && action === 'search') {
      return { stdout: JSON.stringify({ "platforms": [] }), stderr: '' };
    }
    
    return { stdout: `{"message": "No mock data for '${commandAndArgs}'"}`, stderr: '' };
}

export async function executeCliCommand(command: string, args: string[] = []): Promise<{ stdout: string; stderr: string }> {
  if (!isLocal) {
    return getMockData(command, args);
  }

  return new Promise((resolve, reject) => {
    const commandWithArgs = `arduino-cli ${command} ${args.join(' ')}`;
    console.log(`[LOCAL] Executing command: ${commandWithArgs}`);
    
    const child = spawn('arduino-cli', [command, ...args]);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        // Even on non-zero exit code, stdout might have useful info (e.g. warnings)
        // The calling function will decide if stderr constitutes a full error.
        resolve({ stdout, stderr: stderr || `Process exited with code ${code}` });
      }
    });

    child.on('error', (err) => {
      // This is for errors in spawning the process itself
      reject({ stdout: '', stderr: err.message });
    });
  });
}
