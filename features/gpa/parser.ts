import { parse } from 'node-html-parser';
import * as XLSX from 'xlsx';

import { CourseRecord } from '@/features/gpa/types';

type TabularRow = Array<unknown>;

function cleanCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function normalizeRows(rows: TabularRow[]): string[][] {
  return rows
    .map((row) => row.map(cleanCell))
    .filter((row) => row.some(Boolean));
}

function isHeaderRow(row: string[]): boolean {
  const joined = row.join(' ').toLowerCase();
  return joined.includes('course code') || (joined.includes('course') && joined.includes('grade'));
}

function findColumnIndex(headers: string[], candidates: string[]): number {
  return headers.findIndex((header) => candidates.some((candidate) => header.includes(candidate)));
}

function parseTableRows(rows: TabularRow[]): CourseRecord[] {
  const normalizedRows = normalizeRows(rows);
  if (!normalizedRows.length) return [];

  const headerIndex = normalizedRows.findIndex(isHeaderRow);
  const dataRows = headerIndex >= 0 ? normalizedRows.slice(headerIndex + 1) : normalizedRows;
  const headerRow = headerIndex >= 0 ? normalizedRows[headerIndex] : [];

  const codeIndex = findColumnIndex(headerRow, ['course code', 'code']);
  const nameIndex = findColumnIndex(headerRow, ['course name', 'title', 'name']);
  const yearIndex = findColumnIndex(headerRow, ['year']);
  const statusIndex = findColumnIndex(headerRow, ['status']);
  const gradeIndex = findColumnIndex(headerRow, ['grade']);

  const hasMappedHeaders = [codeIndex, nameIndex, yearIndex, statusIndex, gradeIndex].every((index) => index >= 0);

  return dataRows
    .map((row) => {
      const columns = hasMappedHeaders ? [codeIndex, nameIndex, yearIndex, statusIndex, gradeIndex] : [0, 1, 2, 3, 4];
      const values = columns.map((index) => row[index] ?? '');

      return {
        code: values[0],
        name: values[1],
        year: values[2],
        status: values[3],
        grade: values[4],
      };
    })
    .filter((row) => row.code && row.grade && row.code.toLowerCase() !== 'course code');
}

export function parseOUSLResultSheet(html: string): CourseRecord[] {
  const root = parse(html);
  const rows = root.querySelectorAll('tr');
  const tableRows = rows.map((row) => row.querySelectorAll('td,th').map((cell) => cell.text.trim()));
  return parseTableRows(tableRows);
}

export function parseOUSLResultWorkbook(workbook: XLSX.WorkBook): CourseRecord[] {
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) continue;

    const rows = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      blankrows: false,
    }) as TabularRow[];

    const parsed = parseTableRows(rows);
    if (parsed.length) {
      return parsed;
    }
  }

  return [];
}
