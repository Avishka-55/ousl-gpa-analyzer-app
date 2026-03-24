import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>About OUSL GPA Analyzer</Text>
        <Text style={styles.subtitle}>Faculty of Natural Sciences · Mobile Professional Edition</Text>

        <Card
          heading="How to use"
          body="Go to Analyzer tab, upload your myOUSL result export, verify exclusions, then tap Analyze My Results. You will get current GPA, classification path, incomplete-course projections, and target class guidance."
        />

        <Card
          heading="What is included"
          body="The app supports General and Honours degree logic with weighted effective credits for Honours levels, skipped-course identification, and a real-time what-if projection model."
        />

        <Card
          heading="Important"
          body="This app is for academic planning and self-checking. Final degree classification should always be verified with official faculty records and regulations."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Card({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardHeading}>{heading}</Text>
      <Text style={styles.cardBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A202C',
  },
  subtitle: {
    marginTop: 4,
    color: '#718096',
    fontSize: 13,
    marginBottom: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B1A1A',
    marginBottom: 6,
  },
  cardBody: {
    color: '#2D3748',
    lineHeight: 20,
  },
});
