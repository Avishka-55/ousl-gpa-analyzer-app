import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IncludedCourse, SkippedCourse } from '@/features/gpa/types';

type CourseListProps = {
  title: string;
  courses: IncludedCourse[] | SkippedCourse[];
  type: 'included' | 'skipped';
  collapsed: boolean;
  onToggleCollapse: () => void;
  renderLimit?: number;
};

export function CourseList({
  title,
  courses,
  type,
  collapsed,
  onToggleCollapse,
  renderLimit = 5,
}: CourseListProps) {
  const visible = collapsed ? courses.slice(0, renderLimit) : courses;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {visible.map((item) =>
        type === 'included' ? (
          <IncludedRow key={`${item.code}-${item.grade}-${item.year}`} item={item as IncludedCourse} />
        ) : (
          <SkippedRow key={`${item.code}-${item.grade}-${item.year}`} item={item as SkippedCourse} />
        )
      )}

      {!courses.length ? <Text style={styles.empty}>No rows available.</Text> : null}

      {courses.length > renderLimit ? (
        <Pressable style={styles.toggleBtn} onPress={onToggleCollapse}>
          <Text style={styles.toggleText}>{collapsed ? `Show all ${courses.length}` : 'Show less'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function IncludedRow({ item }: { item: IncludedCourse }) {
  return (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.grade}>{item.grade}</Text>
        <Text style={styles.meta}>L{item.level ?? '?'} · {item.credits}cr</Text>
      </View>
    </View>
  );
}

function SkippedRow({ item }: { item: SkippedCourse }) {
  return (
    <View style={styles.row}>
      <View style={styles.leftCol}>
        <Text style={styles.code}>{item.code}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.reason}>{item.reason}</Text>
      </View>
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
    fontSize: 17,
    fontWeight: '700',
    color: '#1A202C',
    marginBottom: 10,
  },
  row: {
    borderWidth: 1,
    borderColor: '#EDF2F7',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 11,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  leftCol: {
    flex: 1,
  },
  rightCol: {
    alignItems: 'flex-end',
  },
  code: {
    color: '#8B1A1A',
    fontWeight: '800',
    fontSize: 13,
  },
  name: {
    color: '#2D3748',
    marginTop: 2,
    fontSize: 13,
  },
  grade: {
    color: '#1A202C',
    fontWeight: '700',
    fontSize: 14,
  },
  meta: {
    marginTop: 2,
    color: '#718096',
    fontSize: 12,
  },
  reason: {
    color: '#A0AEC0',
    fontStyle: 'italic',
    fontSize: 12,
  },
  toggleBtn: {
    marginTop: 4,
    borderRadius: 10,
    backgroundColor: '#EDF2F7',
    alignItems: 'center',
    paddingVertical: 10,
  },
  toggleText: {
    color: '#2D3748',
    fontWeight: '700',
    fontSize: 13,
  },
  empty: {
    color: '#718096',
    fontSize: 13,
  },
});
