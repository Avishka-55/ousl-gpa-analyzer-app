import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseList } from '@/components/gpa/course-list';
import { DegreeToggle } from '@/components/gpa/degree-toggle';
import { ReportSummary } from '@/components/gpa/report-summary';
import { ScreenHeader } from '@/components/gpa/screen-header';
import { TargetCalculator } from '@/components/gpa/target-calculator';
import { UploadPanel } from '@/components/gpa/upload-panel';
import { WhatIfPanel } from '@/components/gpa/what-if-panel';
import {
    calculateBaseData,
    calculateProjection,
    calculateTarget,
    getDegreeClass,
    listIncompleteCourses,
    parseExclusions,
} from '@/features/gpa/calculations';
import { CRITERIA, DEFAULT_EXCLUSIONS, GRADE_ORDER } from '@/features/gpa/constants';
import { parseOUSLResultSheet } from '@/features/gpa/parser';
import { BaseData, CourseRecord, DegreeType, TargetResult } from '@/features/gpa/types';

const TARGET_OPTIONS = [
  { label: 'First Class (GPA >= 3.70)', value: 3.7 },
  { label: 'Second Class Upper (GPA >= 3.30)', value: 3.3 },
  { label: 'Second Class Lower (GPA >= 3.00)', value: 3 },
  { label: 'Pass (GPA >= 2.00)', value: 2 },
];

function looksLikeHtml(input: string): boolean {
  const head = input.trimStart().slice(0, 400).toLowerCase();
  return (
    head.startsWith('<!doctype') ||
    head.startsWith('<html') ||
    head.includes('<table') ||
    head.includes('<tr')
  );
}

export default function HomeScreen() {
  const [degreeType, setDegreeType] = useState<DegreeType>('general');
  const [allCourses, setAllCourses] = useState<CourseRecord[]>([]);
  const [baseData, setBaseData] = useState<BaseData | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<'ok' | 'error' | null>(null);
  const [exclusionsText, setExclusionsText] = useState(DEFAULT_EXCLUSIONS.join(', '));
  const [includedCollapsed, setIncludedCollapsed] = useState(true);
  const [skippedCollapsed, setSkippedCollapsed] = useState(true);
  const [selectedGrades, setSelectedGrades] = useState<Record<string, string>>({});
  const [targetClass, setTargetClass] = useState(3.7);
  const [targetResult, setTargetResult] = useState<TargetResult | null>(null);

  const exclusions = useMemo(() => parseExclusions(exclusionsText), [exclusionsText]);
  const criteria = CRITERIA[degreeType];

  const incompleteCourses = useMemo(
    () => listIncompleteCourses(allCourses, exclusions),
    [allCourses, exclusions]
  );

  const projection = useMemo(() => {
    if (!baseData) return null;
    return calculateProjection(baseData, degreeType, selectedGrades);
  }, [baseData, degreeType, selectedGrades]);

  async function pickFile() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/html', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) return;

    const picked = result.assets[0];
    if (!picked?.uri) {
      setStatusTone('error');
      setStatusMessage('Unable to read selected file.');
      return;
    }

    try {
      const html = await FileSystem.readAsStringAsync(picked.uri);
      const lowerName = (picked.name ?? '').toLowerCase();

      if (!looksLikeHtml(html)) {
        const looksLikeExcel =
          lowerName.endsWith('.xls') ||
          lowerName.endsWith('.xlsx') ||
          picked.mimeType?.includes('excel');

        if (looksLikeExcel) {
          throw new Error(
            'This file is a binary Excel workbook. Please upload the HTML result export from myOUSL (or an .xls that opens as HTML).'
          );
        }

        throw new Error('Unsupported file format. Please upload the myOUSL HTML result sheet.');
      }

      const parsed = parseOUSLResultSheet(html);

      if (!parsed.length) {
        throw new Error('No course rows found in this file.');
      }

      setAllCourses(parsed);
      setSelectedFileName(picked.name ?? 'result-sheet.html');
      setStatusTone('ok');
      setStatusMessage(`${parsed.length} courses loaded successfully.`);
      setBaseData(null);
      setTargetResult(null);
      setSelectedGrades({});
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to parse result sheet.';
      setStatusTone('error');
      setStatusMessage(message);
    }
  }

  function analyzeResults() {
    if (!allCourses.length) return;
    const next = calculateBaseData(allCourses, degreeType, exclusions);
    setBaseData(next);
    setTargetResult(null);
  }

  function onChangeDegree(next: DegreeType) {
    setDegreeType(next);
    if (allCourses.length) {
      const nextData = calculateBaseData(allCourses, next, exclusions);
      setBaseData(nextData);
    }
  }

  function onChangeExclusions(next: string) {
    setExclusionsText(next);
    if (allCourses.length) {
      const nextData = calculateBaseData(allCourses, degreeType, parseExclusions(next));
      setBaseData(nextData);
    }
  }

  function onSelectGrade(code: string, grade: string) {
    setSelectedGrades((prev) => ({
      ...prev,
      [code]: grade,
    }));
  }

  function onCalculateTarget(target: number) {
    if (!baseData) return;
    setTargetClass(target);
    const result = calculateTarget(baseData, allCourses, degreeType, exclusions, target);
    setTargetResult(result);
  }

  const degreeLabel = degreeType === 'general' ? 'BSc General Degree' : 'BSc Honours Degree';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="OUSL GPA Analyzer"
          subtitle="Faculty of Natural Sciences · Academic Performance"
        />

        <View style={styles.panel}>
          <Text style={styles.label}>Choose programme</Text>
          <DegreeToggle value={degreeType} onChange={onChangeDegree} />
        </View>

        <UploadPanel
          selectedFileName={selectedFileName}
          statusMessage={statusMessage}
          statusTone={statusTone}
          exclusionsText={exclusionsText}
          onChangeExclusions={onChangeExclusions}
          onPickFile={pickFile}
          onAnalyze={analyzeResults}
          canAnalyze={allCourses.length > 0}
        />

        {baseData ? (
          <>
            <ReportSummary
              baseData={baseData}
              degreeClass={getDegreeClass(baseData.gpa)}
              criteria={criteria}
              degreeLabel={degreeLabel}
            />

            <CourseList
              title={`Included Courses (${baseData.included.length})`}
              courses={baseData.included}
              type="included"
              collapsed={includedCollapsed}
              onToggleCollapse={() => setIncludedCollapsed((value) => !value)}
            />

            {baseData.skipped.length ? (
              <CourseList
                title={`Skipped Courses (${baseData.skipped.length})`}
                courses={baseData.skipped}
                type="skipped"
                collapsed={skippedCollapsed}
                onToggleCollapse={() => setSkippedCollapsed((value) => !value)}
              />
            ) : null}

            <WhatIfPanel
              courses={incompleteCourses}
              selectedGrades={selectedGrades}
              onSelectGrade={onSelectGrade}
              gradeOrder={GRADE_ORDER}
              projection={projection}
            />

            <TargetCalculator
              options={TARGET_OPTIONS}
              selectedTarget={targetClass}
              onSelectTarget={onCalculateTarget}
              result={targetResult}
            />
          </>
        ) : (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Upload your result sheet and press Analyze My Results to generate the full report.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 28,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3748',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  infoCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    color: '#4A5568',
    fontSize: 14,
    lineHeight: 20,
  },
});
