
const fs = require('fs-extra');
const { gitDescribeSync } = require('git-describe');

let gitRev = 'UNCOMMITTED';
try {
  gitRev = gitDescribeSync({
    dirtyMark: false,
    dirtySemver: false
  });
} catch(e) {
  console.error('No git HEAD; default gitRev set.');
}

fs.writeJson(`${__dirname}/../src/assets/version.json`, gitRev);
console.log('Wrote version information', gitRev);
