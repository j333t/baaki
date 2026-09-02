// baaki.html is the single source of truth. The desktop wrapper
// just serves a copy of it, so refresh that copy before every build.
import { copyFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
copyFileSync(join(here, '..', 'baaki.html'), join(here, 'dist', 'index.html'));
console.log('dist/index.html <- baaki.html');
