const fs = require('fs');

const path = require('path');

const root = process.cwd();
const cacheRoot = path.join(root, '.next', 'cache', 'webpack');
if (process.argv[2] && process.argv[3]) {
  const source = fs.readFileSync(process.argv[2]).toString('latin1');
  const index = source.indexOf(process.argv[3]);
  console.log({ length: source.length, index });
  if (index >= 0) console.log(source.slice(Math.max(0, index - 10000), index + 2500));
  process.exit(0);
}
const cutoff = Date.now() - 60 * 60 * 1000;
const targets = [];

for (const top of ['app', 'components', 'lib']) {
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (/\.(?:ts|tsx)$/.test(entry.name)) {
        targets.push(path.relative(root, absolute).replaceAll('\\', '/'));
      }
    }
  };
  visit(path.join(root, top));
}

const packs = [];
const findPacks = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) findPacks(absolute);
    else if (entry.name.endsWith('.pack')) packs.push(fs.readFileSync(absolute));
  }
};
findPacks(cacheRoot);

function extract(relative) {
  const marker = Buffer.from(`// CONCATENATED MODULE: ./${relative}`);
  const signatures = [
    Buffer.from('/* __next_internal'),
    Buffer.from('import '),
    Buffer.from('export '),
    Buffer.from('"use strict";'),
    Buffer.from("'use strict';"),
  ];
  const sourceStart = (region) => {
    for (const signature of signatures) {
      const at = region.indexOf(signature);
      if (at >= 0) return at;
    }
    return -1;
  };
  let best;
  for (const pack of packs) {
    let markerAt = -1;
    while ((markerAt = pack.indexOf(marker, markerAt + 1)) >= 0) {
      const rawAt = pack.indexOf(Buffer.from('webpack-sources/RawSource'), markerAt);
      if (rawAt < 0 || rawAt - markerAt > 1000) continue;
      const nearby = pack.subarray(rawAt, Math.min(pack.length, rawAt + 1000));
      const relativeStart = sourceStart(nearby);
      if (relativeStart < 0) continue;
      const start = rawAt + relativeStart;
      const end = pack.indexOf(0x1f, start);
      if (end < 0) continue;
      const candidate = pack.subarray(start, end);
      const cleanEnd = candidate.findIndex((byte) => byte < 0x20 && ![0x09, 0x0a, 0x0d].includes(byte));
      const clean = cleanEnd >= 0 ? candidate.subarray(0, cleanEnd) : candidate;
      if (clean.length > 20 && (!best || clean.length < best.length)) best = clean;
    }
  }
  if (!best) {
    const absoluteNeedle = Buffer.from(path.join(root, relative));
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const pack of packs) {
      let pathAt = -1;
      while ((pathAt = pack.indexOf(absoluteNeedle, pathAt + 1)) >= 0) {
        const rawAt = pack.indexOf(Buffer.from('webpack-sources/RawSource'), pathAt);
        const distance = rawAt - pathAt;
        if (rawAt < 0 || distance <= 0 || distance > 250000 || distance > bestDistance) continue;
        const nearby = pack.subarray(rawAt, Math.min(pack.length, rawAt + 250000));
        const start = sourceStart(nearby);
        if (start < 0) continue;
        const candidate = nearby.subarray(start);
        const cleanEnd = candidate.findIndex((byte) => byte < 0x20 && ![0x09, 0x0a, 0x0d].includes(byte));
        const clean = cleanEnd >= 0 ? candidate.subarray(0, cleanEnd) : candidate;
        if (clean.length > 20) {
          best = clean;
          bestDistance = distance;
        }
      }
    }
  }
  if (!best) {
    const current = fs.readFileSync(path.join(root, relative), 'utf8');
    const literals = [...current.matchAll(/(['"`])([^\r\n]{10,}?)\1/g)]
      .map((match) => match[2])
      .filter((value) => !value.includes('${') && !/[âÂÃ�]/.test(value))
      .sort((a, b) => b.length - a.length);
    for (const literal of literals.slice(0, 60)) {
      const needle = Buffer.from(literal);
      for (const pack of packs) {
        const at = pack.indexOf(needle);
        if (at < 0) continue;
        const boundary = pack.lastIndexOf(0x1f, at);
        const end = pack.indexOf(0x1f, at);
        if (boundary < 0 || end < 0 || end - boundary > 500000) continue;
        const region = pack.subarray(boundary + 1, end);
        const start = sourceStart(region);
        if (start < 0) continue;
        const candidate = region.subarray(start);
        const cleanEnd = candidate.findIndex((byte) => byte < 0x20 && ![0x09, 0x0a, 0x0d].includes(byte));
        const clean = cleanEnd >= 0 ? candidate.subarray(0, cleanEnd) : candidate;
        if (clean.length > literal.length && (!best || clean.length < best.length)) best = clean;
      }
      if (best) break;
    }
  }
  return best;
}

let recovered = 0;
for (const relative of targets) {
  if (relative === 'app/globals.css') continue;
  if (new Set(['app/page.tsx', 'components/button.tsx', 'components/container.tsx', 'components/editorial-image.tsx', 'components/section-heading.tsx', 'components/section.tsx', 'components/site-footer.tsx', 'components/site-header.tsx', 'lib/practitioner-data.ts', 'lib/site-data.ts', 'app/layout.tsx']).has(relative)) continue;
  const existing = fs.readFileSync(path.join(root, relative), 'utf8');
  const explicitlyDamaged = new Set(['app/clinical/patients/page.tsx', 'app/portal/page.tsx', 'components/admin/notice.tsx', 'lib/db/schema.ts']);
  if (!existing.startsWith('// @ts-nocheck') && !explicitlyDamaged.has(relative)) continue;
  const source = extract(relative);
  if (!source) {
    console.log(`UNRECOVERED ${relative}`);
    continue;
  }
  fs.writeFileSync(path.join(root, relative), Buffer.concat([Buffer.from('// @ts-nocheck\n'), source]));
  recovered += 1;
}
console.log(`Recovered ${recovered}/${targets.length} changed TypeScript modules from the pre-change webpack cache.`);
