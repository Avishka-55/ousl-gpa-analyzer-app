import { StyleSheet, Text, View } from 'react-native';

type ScreenHeaderProps = {
  title: string;
  subtitle: string;
};

export function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.crest}>
        <Text style={styles.crestText}>🎓</Text>
      </View>
      <View style={styles.copyBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.tag}>
        <Text style={styles.tagText}>MOBILE EDITION</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#8B1A1A',
    borderBottomWidth: 4,
    borderBottomColor: '#5C1111',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  crest: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crestText: {
    fontSize: 22,
  },
  copyBlock: {
    flex: 1,
  },
  title: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  tag: {
    backgroundColor: '#B8860B',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.6,
  },
});
