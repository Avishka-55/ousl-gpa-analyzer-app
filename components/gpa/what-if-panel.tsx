import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseRecord, ProjectionResult } from '@/features/gpa/types';

type WhatIfPanelProps = {
  courses: CourseRecord[];
  selectedGrades: Record<string, string>;
  onSelectGrade: (code: string, grade: string) => void;
  gradeOrder: string[];
  projection: ProjectionResult | null;
};

export function WhatIfPanel({
  courses,
  selectedGrades,
  onSelectGrade,
  gradeOrder,
  projection,
}: WhatIfPanelProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Future Projections</Text>
      <Text style={styles.description}>
        Assign hypothetical grades for incomplete courses to see projected final GPA.
      </Text>

      {!courses.length ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>All courses are completed. No projection needed.</Text>
        </View>
      ) : (
        courses.map((course) => {
          const selected = selectedGrades[course.code] ?? '';
          return (
            <View key={`${course.code}-${course.year}`} style={styles.courseCard}>
              <Text style={styles.courseCode}>{course.code}</Text>
              <Text style={styles.courseName}>{course.name}</Text>
              <View style={styles.chipsWrap}>
                {gradeOrder.map((grade) => {
                  const active = selected === grade;
                  return (
                    <Pressable
                      key={`${course.code}-${grade}`}
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => onSelectGrade(course.code, active ? '' : grade)}>
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>{grade}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })
      )}

      {projection ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Projected Final GPA</Text>
          <Text style={[styles.resultValue, { color: projection.projectedClass.color }]}>
            {projection.projectedGPA.toFixed(2)}
          </Text>
          <Text style={styles.resultClass}>{projection.projectedClass.label}</Text>
          <Text style={[styles.delta, { color: projection.delta >= 0 ? '#2F855A' : '#C53030' }]}>
            {projection.delta >= 0
              ? `+${projection.delta.toFixed(3)} improvement`
              : `${projection.delta.toFixed(3)} decrease`}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },
  title: {
    fontSize: 18,
    color: '#1A202C',
    fontWeight: '700',
  },
  description: {
    marginTop: 4,
    color: '#718096',
    fontSize: 13,
    marginBottom: 12,
  },
  courseCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  courseCode: {
    color: '#8B1A1A',
    fontWeight: '800',
    fontSize: 13,
  },
  courseName: {
    color: '#2D3748',
    fontSize: 13,
    marginTop: 3,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 7,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    borderColor: '#8B1A1A',
    backgroundColor: '#FFF5F5',
  },
  chipText: {
    color: '#4A5568',
    fontWeight: '700',
    fontSize: 12,
  },
  chipTextActive: {
    color: '#8B1A1A',
  },
  resultBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF8F0',
    padding: 14,
    alignItems: 'center',
  },
  resultLabel: {
    color: '#8B1A1A',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '700',
  },
  resultValue: {
    marginTop: 4,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: -1.2,
  },
  resultClass: {
    marginTop: 1,
    color: '#4A5568',
    fontWeight: '700',
  },
  delta: {
    marginTop: 8,
    fontWeight: '700',
    fontSize: 13,
  },
  successBox: {
    borderRadius: 10,
    backgroundColor: '#F0FFF4',
    borderWidth: 1,
    borderColor: '#9AE6B4',
    padding: 12,
  },
  successText: {
    color: '#2F855A',
    fontWeight: '600',
    fontSize: 13,
  },
});
