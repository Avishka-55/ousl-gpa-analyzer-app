import { parse } from 'node-html-parser';

import { CourseRecord } from '@/features/gpa/types';

export function parseOUSLResultSheet(html: string): CourseRecord[] {
  const root = parse(html);
  const rows = root.querySelectorAll('tr');

  const courses: CourseRecord[] = [];
  rows.forEach((row) => {
    const cols = row
      .querySelectorAll('td')
      .map((td) => td.text.trim())
      .filter(Boolean);

    if (cols.length < 5) return;
    if (cols[0].toLowerCase() === 'course code') return;

    courses.push({
      code: cols[0],
      name: cols[1],
      year: cols[2],
      status: cols[3],
      grade: cols[4],
    });
  });

  return courses;
}
