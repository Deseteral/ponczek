import fs from 'fs';
import path from 'path';
import { AssetDefinition } from 'ponczek/core/assets';

function readFileNames(directoryPath: string): AssetDefinition[] {
  fs.mkdirSync(directoryPath, { recursive: true });
  return fs.readdirSync(directoryPath).map((fileName: string) => [path.parse(fileName).name, path.extname(fileName).slice(1)]);
}

function writeData(filePath: string, data: any): void {
  fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' });
}

writeData(
  path.resolve(__dirname, '../assets/textures.json'),
  readFileNames(path.resolve(__dirname, '../assets/textures')),
);

writeData(
  path.resolve(__dirname, '../assets/sounds.json'),
  readFileNames(path.resolve(__dirname, '../assets/sounds')),
);
