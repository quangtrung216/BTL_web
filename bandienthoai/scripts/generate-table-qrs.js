require('dotenv').config();

const fs = require('fs');
const os = require('os');
const path = require('path');
const db = require('../src/config/db');

const VERSION = 3;
const SIZE = 21 + VERSION * 4;
const DATA_CODEWORDS = 44;
const EC_CODEWORDS = 26;
const FORMAT_EC_M = 0;

function detectLanBaseUrl() {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  Object.values(interfaces).forEach((items) => {
    (items || []).forEach((item) => {
      if (item.family === 'IPv4' && !item.internal) addresses.push(item.address);
    });
  });

  const preferred =
    addresses.find((address) => address.startsWith('10.')) ||
    addresses.find((address) => address.startsWith('192.168.')) ||
    addresses.find((address) => address.startsWith('172.')) ||
    addresses[0] ||
    '127.0.0.1';

  return `http://${preferred}:${process.env.PORT || 3000}`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bit(value, index) {
  return ((value >>> index) & 1) !== 0;
}

function gfMultiply(x, y) {
  let result = 0;
  while (y > 0) {
    if (y & 1) result ^= x;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
    y >>>= 1;
  }
  return result;
}

function reedSolomonDivisor(degree) {
  let result = [1];
  let root = 1;

  for (let i = 0; i < degree; i += 1) {
    const next = Array(result.length + 1).fill(0);
    result.forEach((coefficient, index) => {
      next[index] ^= gfMultiply(coefficient, root);
      next[index + 1] ^= coefficient;
    });
    result = next;
    root = gfMultiply(root, 0x02);
  }

  return result.slice(1);
}

function reedSolomonRemainder(data, divisor) {
  const result = Array(divisor.length).fill(0);

  data.forEach((value) => {
    const factor = value ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, index) => {
      result[index] ^= gfMultiply(coefficient, factor);
    });
  });

  return result;
}

function appendBits(bits, value, length) {
  for (let i = length - 1; i >= 0; i -= 1) {
    bits.push((value >>> i) & 1);
  }
}

function encodeData(text) {
  const bytes = Buffer.from(text, 'utf8');
  if (bytes.length > 41) {
    throw new Error(`URL is too long for QR version ${VERSION}: ${text}`);
  }

  const bits = [];
  appendBits(bits, 0x4, 4);
  appendBits(bits, bytes.length, 8);
  bytes.forEach((value) => appendBits(bits, value, 8));

  appendBits(bits, 0, Math.min(4, DATA_CODEWORDS * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const data = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) value = (value << 1) | bits[i + j];
    data.push(value);
  }

  for (let pad = 0xec; data.length < DATA_CODEWORDS; pad ^= 0xec ^ 0x11) {
    data.push(pad);
  }

  const ec = reedSolomonRemainder(data, reedSolomonDivisor(EC_CODEWORDS));
  return data.concat(ec);
}

function createMatrix() {
  return {
    modules: Array.from({ length: SIZE }, () => Array(SIZE).fill(false)),
    reserved: Array.from({ length: SIZE }, () => Array(SIZE).fill(false))
  };
}

function setFunction(matrix, x, y, value) {
  matrix.modules[y][x] = Boolean(value);
  matrix.reserved[y][x] = true;
}

function drawFinder(matrix, x, y) {
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || xx >= SIZE || yy < 0 || yy >= SIZE) continue;
      const dark =
        (dx >= 0 && dx <= 6 && (dy === 0 || dy === 6)) ||
        (dy >= 0 && dy <= 6 && (dx === 0 || dx === 6)) ||
        (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      setFunction(matrix, xx, yy, dark);
    }
  }
}

function drawAlignment(matrix, centerX, centerY) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      setFunction(
        matrix,
        centerX + dx,
        centerY + dy,
        Math.max(Math.abs(dx), Math.abs(dy)) !== 1
      );
    }
  }
}

function drawFunctionPatterns(matrix) {
  drawFinder(matrix, 0, 0);
  drawFinder(matrix, SIZE - 7, 0);
  drawFinder(matrix, 0, SIZE - 7);
  drawAlignment(matrix, 22, 22);

  for (let i = 0; i < SIZE; i += 1) {
    if (!matrix.reserved[6][i]) setFunction(matrix, i, 6, i % 2 === 0);
    if (!matrix.reserved[i][6]) setFunction(matrix, 6, i, i % 2 === 0);
  }

  drawFormatBits(matrix, 0);
}

function drawFormatBits(matrix, mask) {
  const data = (FORMAT_EC_M << 3) | mask;
  let remainder = data;
  for (let i = 0; i < 10; i += 1) {
    remainder = (remainder << 1) ^ (((remainder >>> 9) & 1) ? 0x537 : 0);
  }
  const bits = ((data << 10) | remainder) ^ 0x5412;

  for (let i = 0; i <= 5; i += 1) setFunction(matrix, 8, i, bit(bits, i));
  setFunction(matrix, 8, 7, bit(bits, 6));
  setFunction(matrix, 8, 8, bit(bits, 7));
  setFunction(matrix, 7, 8, bit(bits, 8));
  for (let i = 9; i < 15; i += 1) setFunction(matrix, 14 - i, 8, bit(bits, i));

  for (let i = 0; i < 8; i += 1) setFunction(matrix, SIZE - 1 - i, 8, bit(bits, i));
  for (let i = 8; i < 15; i += 1) setFunction(matrix, 8, SIZE - 15 + i, bit(bits, i));
  setFunction(matrix, 8, SIZE - 8, true);
}

function maskBit(mask, x, y) {
  switch (mask) {
    case 0: return (x + y) % 2 === 0;
    case 1: return y % 2 === 0;
    case 2: return x % 3 === 0;
    case 3: return (x + y) % 3 === 0;
    case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5: return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6: return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    case 7: return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    default: return false;
  }
}

function drawCodewords(matrix, codewords) {
  const bits = [];
  codewords.forEach((value) => appendBits(bits, value, 8));

  let index = 0;
  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vertical = 0; vertical < SIZE; vertical += 1) {
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? SIZE - 1 - vertical : vertical;
        if (!matrix.reserved[y][x] && index < bits.length) {
          matrix.modules[y][x] = bits[index] === 1;
          index += 1;
        }
      }
    }
  }
}

function applyMask(matrix, mask) {
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      if (!matrix.reserved[y][x] && maskBit(mask, x, y)) {
        matrix.modules[y][x] = !matrix.modules[y][x];
      }
    }
  }
  drawFormatBits(matrix, mask);
}

function penaltyScore(modules) {
  let score = 0;

  for (let y = 0; y < SIZE; y += 1) {
    let runColor = modules[y][0];
    let runLength = 1;
    for (let x = 1; x < SIZE; x += 1) {
      if (modules[y][x] === runColor) {
        runLength += 1;
      } else {
        if (runLength >= 5) score += runLength - 2;
        runColor = modules[y][x];
        runLength = 1;
      }
    }
    if (runLength >= 5) score += runLength - 2;
  }

  for (let x = 0; x < SIZE; x += 1) {
    let runColor = modules[0][x];
    let runLength = 1;
    for (let y = 1; y < SIZE; y += 1) {
      if (modules[y][x] === runColor) {
        runLength += 1;
      } else {
        if (runLength >= 5) score += runLength - 2;
        runColor = modules[y][x];
        runLength = 1;
      }
    }
    if (runLength >= 5) score += runLength - 2;
  }

  for (let y = 0; y < SIZE - 1; y += 1) {
    for (let x = 0; x < SIZE - 1; x += 1) {
      const color = modules[y][x];
      if (
        color === modules[y][x + 1] &&
        color === modules[y + 1][x] &&
        color === modules[y + 1][x + 1]
      ) {
        score += 3;
      }
    }
  }

  const pattern = [true, false, true, true, true, false, true, false, false, false, false];
  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x <= SIZE - 11; x += 1) {
      if (pattern.every((value, index) => modules[y][x + index] === value)) score += 40;
      if (pattern.every((value, index) => modules[y][x + 10 - index] === value)) score += 40;
    }
  }
  for (let x = 0; x < SIZE; x += 1) {
    for (let y = 0; y <= SIZE - 11; y += 1) {
      if (pattern.every((value, index) => modules[y + index][x] === value)) score += 40;
      if (pattern.every((value, index) => modules[y + 10 - index][x] === value)) score += 40;
    }
  }

  const dark = modules.flat().filter(Boolean).length;
  score += Math.floor(Math.abs(dark * 20 - SIZE * SIZE * 10) / (SIZE * SIZE)) * 10;

  return score;
}

function makeQr(text) {
  const codewords = encodeData(text);
  let best = null;

  for (let mask = 0; mask < 8; mask += 1) {
    const matrix = createMatrix();
    drawFunctionPatterns(matrix);
    drawCodewords(matrix, codewords);
    applyMask(matrix, mask);

    const score = penaltyScore(matrix.modules);
    if (!best || score < best.score) best = { score, modules: matrix.modules };
  }

  return best.modules;
}

function toSvg(modules, title) {
  const quiet = 4;
  const totalSize = SIZE + quiet * 2;
  const cells = [];

  modules.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) cells.push(`<rect x="${x + quiet}" y="${y + quiet}" width="1" height="1"/>`);
    });
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" role="img" aria-label="${escapeHtml(title)}">`,
    '<rect width="100%" height="100%" fill="#fff"/>',
    '<g fill="#000">',
    cells.join(''),
    '</g>',
    '</svg>'
  ].join('');
}

async function main() {
  const baseUrl = String(process.argv[2] || process.env.TABLE_QR_BASE_URL || detectLanBaseUrl()).replace(/\/+$/, '');
  const outputDir = path.join(__dirname, '..', 'src', 'public', 'table-qr');
  fs.mkdirSync(outputDir, { recursive: true });

  const [tables] = await db.execute(
    `SELECT id, table_code, name, capacity, status, location
     FROM coffee_tables
     WHERE is_active = 1
     ORDER BY id ASC`
  );

  const cards = [];
  const manifest = [];

  tables.forEach((table) => {
    const code = String(table.table_code || '').toUpperCase();
    const label = table.name || `Bàn ${code}`;
    const url = `${baseUrl}/table/${encodeURIComponent(code)}`;
    const fileName = `${code}.svg`;

    fs.writeFileSync(
      path.join(outputDir, fileName),
      toSvg(makeQr(url), `QR ${label}`),
      'utf8'
    );

    manifest.push({ code, label, url, fileName });
    cards.push(`
      <article class="qr-card">
        <img src="./${escapeHtml(fileName)}" alt="QR ${escapeHtml(label)}">
        <h2>${escapeHtml(label)}</h2>
        <p>${escapeHtml(code)}</p>
        <small>${escapeHtml(url)}</small>
      </article>`);
  });

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify({ baseUrl, generatedAt: new Date().toISOString(), tables: manifest }, null, 2),
    'utf8'
  );

  fs.writeFileSync(
    path.join(outputDir, 'index.html'),
    `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>QR đặt món theo bàn</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; color: #241812; background: #f6f2ec; }
    main { width: min(1120px, calc(100% - 32px)); margin: 0 auto; padding: 28px 0; }
    header { margin-bottom: 18px; }
    h1 { margin: 0 0 6px; font-size: 28px; }
    header p { margin: 0; color: #6f665f; }
    .qr-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .qr-card { break-inside: avoid; padding: 18px; border: 1px solid #ded2c5; border-radius: 8px; background: #fff; text-align: center; }
    .qr-card img { width: 172px; height: 172px; }
    .qr-card h2 { margin: 10px 0 2px; font-size: 20px; }
    .qr-card p { margin: 0 0 8px; color: #536b2e; font-weight: 800; }
    .qr-card small { display: block; overflow-wrap: anywhere; color: #7b7169; font-size: 10px; line-height: 1.35; }
    @media print {
      body { background: #fff; }
      main { width: 100%; padding: 0; }
      header { display: none; }
      .qr-grid { grid-template-columns: repeat(2, 1fr); gap: 10mm; }
      .qr-card { box-shadow: none; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>QR đặt món theo bàn</h1>
      <p>Base URL: ${escapeHtml(baseUrl)}</p>
    </header>
    <section class="qr-grid">
      ${cards.join('\n')}
    </section>
  </main>
</body>
</html>`,
    'utf8'
  );

  console.log(`Generated ${tables.length} table QR codes in ${outputDir}`);
  console.log(`Open: ${baseUrl}/table-qr/`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.end());
