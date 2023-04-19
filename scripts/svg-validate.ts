

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

    if(file.includes('width=')) {
      badSVGs.push(svg);
    }

    if(file.includes('height=')) {
      badSVGs.push(svg);
    }

    if(!file.includes('viewBox="0 0 512 512"')) {
      badSVGs.push(svg);
    }
  });

  if(badSVGs.length > 0) {
    console.error('The following SVGs have a fill attribute, width attribute, or height attribute, which is not allowed. They may also have an invalid viewBox - check other SVGs for how the <svg> should look.');
    console.error([...new Set(badSVGs)]);
    process.exit(1);
  }

  console.log('☑ All SVGs are valid!');
};

checkSVGs();
