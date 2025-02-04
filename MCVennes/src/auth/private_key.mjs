import fs from 'fs';
import path from 'path';
const privateKey = fs.readFileSync(path.resolve('./src/auth/private.key'));
export { privateKey };
