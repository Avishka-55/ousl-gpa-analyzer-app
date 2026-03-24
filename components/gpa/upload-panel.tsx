import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type UploadPanelProps = {
  selectedFileName: string | null;
  statusMessage: string | null;
  statusTone: 'ok' | 'error' | null;
  exclusionsText: string;
  onChangeExclusions: (value: string) => void;
  onPickFile: () => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
};

export function UploadPanel({
  selectedFileName,
  statusMessage,
  statusTone,
  exclusionsText,
  onChangeExclusions,
  onPickFile,
  onAnalyze,
  canAnalyze,
}: UploadPanelProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.step}>Step 1</Text>
      <Text style={styles.title}>Setup and Upload</Text>
      <Text style={styles.description}>
        Import your result export from myOUSL and tune exclusions before analysis.
      </Text>

      <Pressable style={styles.fileDrop} onPress={onPickFile}>
        <Text style={styles.fileIcon}>📄</Text>
        <Text style={styles.fileLabel}>{selectedFileName ?? 'Tap to choose .xls or .html file'}</Text>
        <Text style={styles.fileHint}>Supports portal export files</Text>
      </Pressable>

      {statusMessage ? (
        <View style={[styles.statusPill, statusTone === 'error' ? styles.statusError : styles.statusOk]}>
          <Text style={[styles.statusText, statusTone === 'error' ? styles.statusTextError : styles.statusTextOk]}>
            {statusMessage}
          </Text>
        </View>
      ) : null}

      <Text style={styles.label}>Exclude non-GPA courses (comma-separated codes)</Text>
      <TextInput
        value={exclusionsText}
        onChangeText={onChangeExclusions}
        style={styles.input}
        placeholder="LTE3401, FDE3020"
        autoCapitalize="characters"
      />

      <Pressable
        style={[styles.primaryButton, !canAnalyze && styles.primaryButtonDisabled]}
        disabled={!canAnalyze}
        onPress={onAnalyze}>
        <Text style={styles.primaryButtonText}>Analyze My Results</Text>
      </Pressable>
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
    gap: 10,
  },
  step: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#8B1A1A',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A202C',
  },
  description: {
    color: '#718096',
    fontSize: 14,
  },
  fileDrop: {
    marginTop: 4,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E0',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  fileIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  fileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'center',
  },
  fileHint: {
    marginTop: 4,
    fontSize: 12,
    color: '#718096',
  },
  statusPill: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  statusOk: {
    backgroundColor: '#E6FFFA',
  },
  statusError: {
    backgroundColor: '#FFF5F5',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  statusTextOk: {
    color: '#2F855A',
  },
  statusTextError: {
    color: '#C53030',
  },
  label: {
    marginTop: 4,
    color: '#2D3748',
    fontWeight: '600',
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    paddingVertical: 11,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A202C',
  },
  primaryButton: {
    backgroundColor: '#8B1A1A',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.45,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
