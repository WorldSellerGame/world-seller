

const fs = require('fs');
const readdir = require('recursive-readdir');

const checkSVGs = async () => {
  const svgs = await readdir('./src/assets/icon');
  const badSVGs: string[] = [];

  svgs.forEach((svg: string) => {
    const file = fs.readFileSync(svg, 'utf8');
    if(file.includes('fill')) {
      badSVGs.push(svg);
    }
  });

  if(badSVGs.length > 0) {
    console.error('The following SVGs have a fill attribute, which is not allowed. Please remove it.');
    console.error(badSVGs);
    process.exit(1);
  }

  console.log('☑ All SVGs are valid!');
};

checkSVGs();
