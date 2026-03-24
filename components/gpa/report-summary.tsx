import { StyleSheet, Text, View } from 'react-native';

import { BaseData, DegreeClass, DegreeCriteria } from '@/features/gpa/types';

type ReportSummaryProps = {
  baseData: BaseData;
  degreeClass: DegreeClass;
  criteria: DegreeCriteria;
  degreeLabel: string;
};

export function ReportSummary({ baseData, degreeClass, criteria, degreeLabel }: ReportSummaryProps) {
  const progressPct = Math.min(Math.round((baseData.totalRealCredits / criteria.totalCredits) * 100), 100);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Current GPA Report</Text>
      <Text style={[styles.gpaValue, { color: degreeClass.color }]}>{baseData.gpa.toFixed(2)}</Text>
      <Text style={styles.gpaLabel}>Current Grade Point Average</Text>
      <View style={[styles.badge, { backgroundColor: degreeClass.background }]}>
        <Text style={[styles.badgeText, { color: degreeClass.color }]}>{degreeClass.label}</Text>
      </View>
      <Text style={styles.degreeText}>{degreeLabel}</Text>

      <View style={styles.statsRow}>
        <StatCard label="Credits" value={`${baseData.totalRealCredits}/${criteria.totalCredits}`} />
        <StatCard label="Progress" value={`${progressPct}%`} />
        <StatCard label="Courses" value={`${baseData.included.length}`} />
      </View>

      <Text style={styles.sectionTitle}>Level GPA</Text>
      {baseData.levelGPA.length ? (
        baseData.levelGPA.map((item) => {
          const width = `${Math.min((item.gpa / 4) * 100, 100)}%` as const;
          return (
            <View key={`lvl-${item.level}`} style={styles.progressBlock}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Level {item.level}</Text>
                <Text style={styles.progressValue}>{item.gpa.toFixed(2)}</Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width, backgroundColor: '#8B1A1A' }]} />
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.emptyText}>No completed graded courses found yet.</Text>
      )}
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'center',
  },
  gpaValue: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 64,
    fontWeight: '800',
    letterSpacing: -2,
  },
  gpaLabel: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'center',
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  badgeText: {
    fontWeight: '700',
    fontSize: 13,
  },
  degreeText: {
    textAlign: 'center',
    marginTop: 7,
    color: '#718096',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: {
    fontWeight: '700',
    color: '#1A202C',
    fontSize: 16,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#718096',
    fontWeight: '700',
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 16,
    color: '#1A202C',
    fontWeight: '700',
  },
  progressBlock: {
    marginBottom: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressLabel: {
    color: '#1A202C',
    fontSize: 14,
    fontWeight: '600',
  },
  progressValue: {
    color: '#718096',
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
  emptyText: {
    color: '#718096',
    fontSize: 13,
  },
});
