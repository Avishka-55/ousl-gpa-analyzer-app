import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TargetResult } from '@/features/gpa/types';

type TargetOption = {
  label: string;
  value: number;
};

type TargetCalculatorProps = {
  options: TargetOption[];
  selectedTarget: number;
  onSelectTarget: (value: number) => void;
  result: TargetResult | null;
};

export function TargetCalculator({
  options,
  selectedTarget,
  onSelectTarget,
  result,
}: TargetCalculatorProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Target Class Calculator</Text>
      <Text style={styles.description}>
        Choose a class and check the exact remaining average needed.
      </Text>

      <View style={styles.optionsWrap}>
        {options.map((option) => {
          const active = selectedTarget === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.optionBtn, active && styles.optionBtnActive]}
              onPress={() => onSelectTarget(option.value)}>
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {result ? (
        <View style={styles.resultCard}>
          {result.status === 'no-remaining' ? (
            <Text style={styles.neutral}>No remaining incomplete courses available.</Text>
          ) : null}

          {result.status === 'secured' ? <Text style={styles.good}>{result.message}</Text> : null}

          {result.status === 'impossible' ? <Text style={styles.bad}>{result.message}</Text> : null}

          {result.status === 'needed' ? (
            <>
              <Text style={styles.needValue}>{result.closestGrade}</Text>
              <Text style={styles.needText}>{result.message}</Text>
            </>
          ) : null}
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
    marginBottom: 28,
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
  optionsWrap: {
    gap: 8,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionBtnActive: {
    borderColor: '#8B1A1A',
    backgroundColor: '#FFF5F5',
  },
  optionText: {
    color: '#2D3748',
    fontSize: 13,
    fontWeight: '600',
  },
  optionTextActive: {
    color: '#8B1A1A',
  },
  resultCard: {
    marginTop: 12,
    backgroundColor: '#FAFBFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 12,
  },
  neutral: {
    color: '#4A5568',
    fontWeight: '600',
    fontSize: 13,
  },
  good: {
    color: '#2F855A',
    fontWeight: '700',
    fontSize: 13,
  },
  bad: {
    color: '#C53030',
    fontWeight: '700',
    fontSize: 13,
  },
  needValue: {
    color: '#8B1A1A',
    fontSize: 30,
    fontWeight: '800',
  },
  needText: {
    marginTop: 4,
    color: '#4A5568',
    fontSize: 13,
    lineHeight: 18,
  },
});
