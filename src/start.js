const { execSync } = require('child_process');

// Run npm start in the src directory
execSync('npm start', { stdio: 'inherit', cwd: 'src', shell: true });