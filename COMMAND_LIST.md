# Arduino CLI Commands Used in This Application

This file tracks all the `arduino-cli` commands that the user interface is designed to call.

## Board Management
- **List connected boards:**
  `arduino-cli board list --format json`

- **Search for boards:**
  `arduino-cli board search <keywords> --format json`

- **List installed platforms/cores:**
  `arduino-cli core list --format json`

- **Search for cores:**
  `arduino-cli core search <keywords> --format json`

- **Install a core:**
  `arduino-cli core install <core_name>`

- **Uninstall a core:**
  `arduino-cli core uninstall <core_name>`

## Library Management
- **Search for libraries:**
  `arduino-cli lib search <keywords> --format json`

- **List installed libraries:**
  `arduino-cli lib list --format json`
  
- **Install a library:**
  `arduino-cli lib install <library_name>`

- **Uninstall a library:**
  `arduino-cli lib uninstall <library_name>`

## Sketch Workflow
- **Verify/Compile a sketch:**
  `arduino-cli compile --fqbn <fqbn> --output-dir <build_path> <sketch_path>`

- **Upload a sketch:**
  `arduino-cli upload -p <port> --fqbn <fqbn> <sketch_path>`

## Other
- **Update the index:**
  `arduino-cli core update-index`
  `arduino-cli lib update-index`
