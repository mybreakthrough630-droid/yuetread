import fs from 'node:fs';
import path from 'node:path';

const sourceRoot = process.argv[2];
const outputPath = process.argv[3];

if (!sourceRoot || !outputPath) {
  throw new Error('Usage: node build-pinyin-data.mjs <package-root> <output-file>');
}

const traditional = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'json/traditional.json'), 'utf8'));
const modern = JSON.parse(fs.readFileSync(path.join(sourceRoot, 'json/modern.json'), 'utf8'));
const output = `window.PinyinTraditionalDict=${JSON.stringify(traditional)};\nwindow.PinyinModernDict=${JSON.stringify(modern)};\n`;

fs.writeFileSync(outputPath, output);
