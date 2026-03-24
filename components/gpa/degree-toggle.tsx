import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DegreeType } from '@/features/gpa/types';

type DegreeToggleProps = {
  value: DegreeType;
  onChange: (next: DegreeType) => void;
};

type Choice = {
  type: DegreeType;
  title: string;
  subtitle: string;
};

const CHOICES: Choice[] = [
  { type: 'general', title: 'BSc General Degree', subtitle: 'S1 Structure · 90 Credits' },
  { type: 'honours', title: 'BSc Honours Degree', subtitle: 'SS Structure · 120 Credits' },
];

export function DegreeToggle({ value, onChange }: DegreeToggleProps) {
  return (
    <View style={styles.wrap}>
      {CHOICES.map((choice) => {
        const active = value === choice.type;
        return (
          <Pressable
            key={choice.type}
            onPress={() => onChange(choice.type)}
            style={[styles.button, active && styles.buttonActive]}>
            <Text style={[styles.title, active && styles.titleActive]}>{choice.title}</Text>
            <Text style={styles.subtitle}>{choice.subtitle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  button: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  buttonActive: {
    backgroundColor: '#FFF5F5',
    borderColor: '#8B1A1A',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  titleActive: {
    color: '#8B1A1A',
  },
  subtitle: {
    marginTop: 2,
    color: '#718096',
    fontSize: 12,
  },
});
