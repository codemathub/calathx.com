const fs = require('fs');

/**
 * Parse MySQL VALUES tuples from INSERT INTO `table` (...) VALUES (...), (...);
 * Handles escaped quotes, newlines inside strings, NULLs, and numbers.
 */
function parseSqlValues(valuesStr) {
  const rows = [];
  let i = 0;
  const len = valuesStr.length;

  while (i < len) {
    // Find start of tuple '('
    while (i < len && valuesStr[i] !== '(') i++;
    if (i >= len) break;
    i++; // skip '('

    const row = [];
    while (i < len) {
      // Skip whitespace
      while (i < len && /\s/.test(valuesStr[i])) i++;
      if (i >= len) break;

      if (valuesStr[i] === ')') {
        i++;
        break;
      }

      if (valuesStr[i] === "'") {
        // Parse quoted string
        i++; // skip opening quote
        let str = '';
        while (i < len) {
          const ch = valuesStr[i];
          if (ch === '\\') {
            const next = valuesStr[i + 1];
            if (next === 'n') str += '\n';
            else if (next === 'r') str += '\r';
            else if (next === 't') str += '\t';
            else if (next === '0') str += '\0';
            else str += next ?? '';
            i += 2;
          } else if (ch === "'" && valuesStr[i + 1] === "'") {
            str += "'";
            i += 2;
          } else if (ch === "'") {
            i++; // skip closing quote
            break;
          } else {
            str += ch;
            i++;
          }
        }
        row.push(str);
      } else {
        // Parse unquoted token (number, NULL)
        let token = '';
        while (i < len && valuesStr[i] !== ',' && valuesStr[i] !== ')') {
          token += valuesStr[i];
          i++;
        }
        token = token.trim();
        if (token.toUpperCase() === 'NULL') {
          row.push(null);
        } else if (/^-?\d+(\.\d+)?$/.test(token)) {
          row.push(Number(token));
        } else {
          row.push(token);
        }
      }

      // Skip whitespace and comma
      while (i < len && /\s/.test(valuesStr[i])) i++;
      if (valuesStr[i] === ',') i++;
    }

    if (row.length > 0) rows.push(row);
  }

  return rows;
}

/**
 * Extract all rows for a given table name from a phpMyAdmin SQL dump.
 * Returns an array of objects keyed by column name.
 */
function extractTable(sqlContent, tableName) {
  const escaped = tableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `INSERT INTO \\\`${escaped}\\\` \\(([^)]+)\\) VALUES\\s*([\\s\\S]*?);\\r?\\n`,
    'g'
  );

  const records = [];
  let match;
  while ((match = regex.exec(sqlContent)) !== null) {
    const columns = match[1]
      .split(',')
      .map((col) => col.trim().replace(/^`|`$/g, ''));
    const rows = parseSqlValues(match[2]);

    for (const row of rows) {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx] !== undefined ? row[idx] : null;
      });
      records.push(obj);
    }
  }

  return records;
}

function loadSqlFile(sqlPath) {
  return fs.readFileSync(sqlPath, 'utf8');
}

module.exports = { loadSqlFile, extractTable };

