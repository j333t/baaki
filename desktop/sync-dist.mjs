// baaki.html is the single source of truth. The desktop wrapper
// just serves a copy of it, so refresh that copy before every build.
import { copyFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, 'dist');

// dist/index.html is generated, so it is gitignored, so the folder is
// empty, so git does not create it on a fresh checkout. CI found this;
// a machine that had ever run a build locally never would.
mkdirSync(dist, { recursive: true });
copyFileSync(join(here, '..', 'baaki.html'), join(dist, 'index.html'));
console.log('dist/index.html <- baaki.html');
