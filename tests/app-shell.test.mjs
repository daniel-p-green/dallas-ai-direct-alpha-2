import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('App Router route files exist for required paths', () => {
  const required = [
    'app/page.tsx',
    'app/signup/page.tsx',
    'app/room/page.tsx',
    'app/admin/page.tsx',
    'app/layout.tsx'
  ];

  for (const file of required) {
    assert.equal(fs.existsSync(path.join(repoRoot, file)), true, `Expected ${file} to exist`);
  }
});

test('shared layout renders environment banner text', () => {
  const layout = read('app/layout.tsx');

  assert.match(layout, /ALPHA DEMO/);
  assert.match(layout, /ENV: STAGE/);
  assert.match(layout, /PUBLIC VIEW SAFE/);
});

test('shared footer renders required privacy text', () => {
  const layout = read('app/layout.tsx');

  assert.match(layout, /Email stays private and never appears on the public board\./);
});
