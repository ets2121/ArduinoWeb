# Arduino CLI Commands Used in This Application

This file tracks all the `arduino-cli` commands that the user interface is designed to call, along with their corresponding API endpoints.

**Base API Path:** `/api/cli/`

---

## Board Management

- **List connected boards:**
  - **CLI Command:** `arduino-cli board list --format json`
  - **API Endpoint:** `GET /api/cli/board/list?format=json`

- **List installed platforms/cores:**
  - **CLI Command:** `arduino-cli core list --format json`
  - **API Endpoint:** `GET /api/cli/core/list?format=json`

- **Search for cores (e.g., searching for "avr"):**
  - **CLI Command:** `arduino-cli core search avr --format json`
  - **API Endpoint:** `GET /api/cli/core/search/avr?format=json`

- **Install a core (e.g., installing "arduino:avr"):**
  - **CLI Command:** `arduino-cli core install arduino:avr`
  - **API Endpoint:** `GET /api/cli/core/install/arduino:avr`

- **Uninstall a core (e.g., uninstalling "arduino:avr"):**
  - **CLI Command:** `arduino-cli core uninstall arduino:avr`
  - **API Endpoint:** `GET /api/cli/core/uninstall/arduino:avr`

---

## Library Management

- **List installed libraries:**
  - **CLI Command:** `arduino-cli lib list --format json`
  - **API Endpoint:** `GET /api/cli/lib/list?format=json`

- **Search for libraries (e.g., searching for "servo"):**
  - **CLI Command:** `arduino-cli lib search servo --format json`
  - **API Endpoint:** `GET /api/cli/lib/search/servo?format=json`

- **Install a library (e.g., installing "Servo"):**
  - **CLI Command:** `arduino-cli lib install Servo`
  - **API Endpoint:** `GET /api/cli/lib/install/Servo`

- **Uninstall a library (e.g., uninstalling "Servo"):**
  - **CLI Command:** `arduino-cli lib uninstall Servo`
  - **API Endpoint:** `GET /api/cli/lib/uninstall/Servo`

---

## Sketch Workflow

- **Verify/Compile a sketch:**
  - **CLI Command:** `arduino-cli compile --fqbn <fqbn> <sketch_path>`
  - **API Endpoint:** `GET /api/cli/compile?fqbn=<fqbn>&sketch_path=<sketch_path>`
  - **Example:** `GET /api/cli/compile?fqbn=arduino:avr:uno&sketch_path=/path/to/sketch`

- **Upload a sketch:**
  - **CLI Command:** `arduino-cli upload -p <port> --fqbn <fqbn> <sketch_path>`
  - **API Endpoint:** `GET /api/cli/upload?p=<port>&fqbn=<fqbn>&sketch_path=<sketch_path>`
  - **Example:** `GET /api/cli/upload?p=COM3&fqbn=arduino:avr:uno&sketch_path=/path/to/sketch`

---

## Other

- **Update core index:**
  - **CLI Command:** `arduino-cli core update-index`
  - **API Endpoint:** `GET /api/cli/core/update-index`

- **Update library index:**
  - **CLI Command:** `arduino-cli lib update-index`
  - **API Endpoint:** `GET /api/cli/lib/update-index`
