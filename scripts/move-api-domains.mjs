import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const API_DIR = path.join(dirName, '../src/shared/api');
const DOMAIN_DIR = path.join(API_DIR, 'domain');

const DOMAIN_FILE_REGEX = /^[A-Z][A-Za-z0-9]+\.ts$/;

if (!fs.existsSync(DOMAIN_DIR)) {
  fs.mkdirSync(DOMAIN_DIR, { recursive: true });
}

fs.readdirSync(API_DIR)
  .filter(file => DOMAIN_FILE_REGEX.test(file))
  .forEach(file => {
    const domainName = file.replace(/\.ts$/, '');
    const targetDir = path.join(DOMAIN_DIR, domainName.toLowerCase());
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const oldPath = path.join(API_DIR, file);
    const newPath = path.join(targetDir, file);
    fs.renameSync(oldPath, newPath);
    let content = fs.readFileSync(newPath, 'utf8');
    content = content.replace(/from "\.\/((data-contracts|http-client))"/g, 'from "../../$1"');
    fs.writeFileSync(newPath, content, 'utf8');
    console.log(`Moved ${file} → domain/${domainName.toLowerCase()}/${file} (imports fixed)`);
  });
