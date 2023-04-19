
const { execSync } = require('child_process');

try {
  const status = execSync('git status --porcelain');

  console.log(status.toString())

} catch(e) {
  console.error('No git HEAD; default gitRev set.');
}
