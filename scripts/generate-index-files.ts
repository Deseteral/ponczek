import fs from 'fs';
import path from 'path';

const ignoredModules = [
  'imgui',
];

function writeIndexForFiles(files: string[], indexFilePath: string): void {
  const exportList = [
    ...files.map((fileName) => `export * from './${fileName}';`),
    '',
  ];
  fs.writeFileSync(indexFilePath, exportList.join('\n'), { encoding: 'utf-8' });
}

const rootFolderContent = fs.readdirSync('./src', { withFileTypes: true });

// Create modules index files
rootFolderContent
  .filter((entry) => entry.isDirectory())
  .filter((entry) => !ignoredModules.includes(entry.name))
  .map((entry) => path.resolve('.', 'src', entry.name))
  .forEach((modulePath) => {
    const indexFilePath = path.resolve(modulePath, 'index.ts');
    const fileList = fs.readdirSync(modulePath)
      .map((filePath) => path.basename(filePath, path.extname(filePath)))
      .filter((fileName) => fileName !== 'index');

    writeIndexForFiles(fileList, indexFilePath);
  });

// Create root index file
const rootIndexPath = path.resolve('.', 'src', 'index.ts');
const rootModules = rootFolderContent
  .filter((entry) => (entry.isDirectory() || path.extname(entry.name) === '.ts'))
  .filter((entry) => !ignoredModules.includes(entry.name))
  .map((entry) => entry.name)
  .map((filePath) => path.basename(filePath, path.extname(filePath)))
  .filter((name) => name !== 'index');

writeIndexForFiles(rootModules, rootIndexPath);
