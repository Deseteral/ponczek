/* eslint-disable @typescript-eslint/explicit-function-return-type */

const fs = require('fs');
const path = require('path');

function readFileNames(directoryPath) {
  return fs.readdirSync(directoryPath).map((fileName) => path.parse(fileName).name);
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' });
}

writeData('./assets/textures.json', readFileNames('./assets/textures'));
writeData('./assets/sounds.json', readFileNames('./assets/sounds'));
