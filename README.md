# OUSL GPA Analyzer App

Mobile GPA analysis app built with Expo + React Native for OUSL students.

The app lets users upload a result sheet export, calculate GPA/class standing, run what-if grade projections, and estimate required grades for a target class.

## Features

- Degree mode selector: BSc General and BSc Honours
- Result sheet upload and parsing from myOUSL-style HTML table exports
- Course exclusion list (custom comma-separated course codes)
- Current GPA and degree class summary
- Included vs skipped course breakdown
- What-if projection for incomplete courses
- Target class calculator (First, Upper, Lower, Pass)

## Important File Format Note

The parser accepts either HTML table content or a true Excel workbook export.

- Supported: HTML result export (`.html`) from myOUSL
- Supported: Excel workbooks (`.xls` and `.xlsx`)
- Also supported: `.xls` files that actually contain HTML

## Tech Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript

## Local Development

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run start
```

3. Run on specific platforms

```bash
npm run android
npm run ios
npm run web
```

4. Lint

```bash
npm run lint
```

## Running From GitHub Codespaces

If `--tunnel` is unstable, use LAN/web during development:

```bash
npm run start
# or
npm run web
```

If tunnel works in your environment:

```bash
npx expo start --tunnel --clear
```

## Build APK With EAS

Project is already configured with EAS (`eas.json`).

1. Login

```bash
npx eas login
```

2. Build preview APK

```bash
npx eas-cli@latest build --platform android --profile preview
```

3. Build production artifact

```bash
npx eas-cli@latest build --platform android --profile production
```

After the build completes, open the Expo build URL and download/install the APK (or AAB for store flow).

## Project Structure

- `app/(tabs)/index.tsx`: main analyzer screen
- `app/(tabs)/explore.tsx`: about/help screen
- `components/gpa/*`: modular UI blocks
- `features/gpa/*`: parser, constants, types, and calculation logic

## Disclaimer

This app is for academic planning and self-checking. Always confirm final degree classification with official OUSL records and faculty regulations.
