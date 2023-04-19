
const { execSync } = require('child_process');

try {
  const status = execSync('git status --porcelain');

  if(status) {
    console.error('Dirty git HEAD; aborting process.');
    process.exit(1);
  }

  console.log('Clean git HEAD; continuing process.');

} catch(e) {
  console.error(e);
}
