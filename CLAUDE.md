# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

General Expo rules (versioned docs, `npx expo install`, Continuous Native Generation, EAS) live in `AGENTS.md`. This file covers what is specific to this repo.

## Project

This is a UI-only sports betting app covering football, basketball and tennis. All data is static mock data and all state lives in memory. There is no backend.

- **Platforms:** iOS and Android only. `app.json` sets `platforms: ["ios", "android"]`, and there is no web support. `react-dom` and `react-native-web` stay installed only because `expo-router` and `@expo/ui` list them as peer dependencies.
- **Currency:** Naira (₦).
- **UI:** built with Expo UI (`@expo/ui`) universal components, which render SwiftUI on iOS and Jetpack Compose on Android.

Stack: Expo SDK 57, React Native 0.86, React 19.2 with React Compiler, TypeScript 6 (strict). The package manager is npm, so use `npx`.

## Commands

```bash
npx expo start            # dev server (npm run ios / npm run android)
npx tsc --noEmit          # typecheck
npx expo lint             # ESLint (eslint-config-expo)
npx expo-doctor           # dependency/config checks
npx expo export --platform ios --platform android --output-dir <tmp-dir>   # bundle both platforms
```

There is no test runner.

`expo export` is the quickest way to check that both platform bundles build, including `.ios.ts` files and Android icon XML assets. It also regenerates the typed routes in `.expo/types/`. After adding or renaming a route, `tsc` fails on the new `href`s until that has run (or `expo start` has).

## Architecture

**Navigation.** `src/app/_layout.tsx` wraps the app in `BettingProvider` and renders `NativeTabs` with five tab groups:

| Tab | Group | Screen |
|---|---|---|
| Sports | `(index)` | `index` |
| Live | `(live)` | `live` |
| Bet Slip | `(slip)` | `bet-slip` |
| My Bets | `(bets)` | `my-bets` |
| Account | `(account)` | `account` |

Each group has its own `Stack` for native headers. Shared header options are in `src/constants/navigation.ts`.

Sports and Live are one array group, `(index,live)`, so both tabs can push the shared `match/[id]` screen. Its layout uses the `segment` prop and `unstable_settings` anchors to choose which screen each copy of the stack starts on.

**Screen shape.** Every screen is an `AppHost` (an Expo UI `Host` with the brand `seedColor`) wrapping one `FieldGroup` of `FieldGroup.Section`s. `FieldGroup` renders as a SwiftUI `Form` on iOS and a Material 3 grouped `LazyColumn` on Android. Each child of a section is one row.

**Expo UI constraints.**
- **Platform-specific imports.** Import `@expo/ui/swift-ui` or `@expo/ui/jetpack-compose` only inside a platform-split pair: `foo.ios.tsx` plus a plain `foo.tsx`, which serves as the Android version. Importing them on the wrong platform crashes at runtime. Current pairs:
  - `src/components/ui/modifiers`:
    - `stretch`: equal-width and full-width layout, which the universal `style` prop can't express because it only takes fixed sizes. Buttons need two halves: `stretch.rowItem` or `stretch.fullWidthButton` on the `Button`, and `stretch.buttonContent` on its child.
    - `sheetTint`
  - `src/components/live-dot`, the pulsing dot in the LIVE badge:
    - iOS uses the native continuous SF Symbol `symbolEffect` pulse.
    - Compose modifiers can't loop, so on Android one shared JS timer flips an `animated()` `graphicsLayer` alpha and Compose runs each fade.
    - Both skip the pulse when Reduce Motion is on.
- **`Text` children** must be a single string. Use template literals, not JSX interpolation.
- **Bottom sheets.** Use `AppBottomSheet` and render it as a sibling of `AppHost`, not inside it, because the sheet creates its own `Host`.
  - Theming: the sheet doesn't get the `seedColor`. On iOS, `sheetTint` restores the brand tint; on Android the sheet uses the system Material palette.
  - State: keep the sheet's content data separate from `isPresented`. Android animates the sheet out after `isPresented` turns false.
- **Icons.**
  - Content icons are declared in `src/components/icons.ts` with `Icon.select({ ios: '<SF Symbol>', android: import('@expo/material-symbols/<name>.xml') })`. The `@expo/ui` Babel plugin rewrites the `import()`.
  - Tab icons use `NativeTabs.Trigger.Icon`'s `sf` and `md` props instead.
- **`Picker` on Android** is a full-width dropdown text field. That's why `LabeledControl` on the Account screen stacks the label above it on Android.

**State.** `src/store/betting.tsx` is a `useReducer` + context store. It holds:
- the wallet balance
- bet slip selections (at most one per match; picking another outcome replaces the existing one)
- placed bets
- the odds format

Read it with `useBetting()`. Its `formatOdds` uses the user's chosen format (decimal, fractional or American), so display odds through it rather than `utils/format` directly.

**Data.**
- `src/data/matches.ts` builds the fixtures with per-sport helpers (`football`, `basketball`, `tennis`) that generate three markets each. `markets[0]` is the main market shown in match lists.
- `src/data/bets.ts` seeds the bet history.
- Bet math (combined odds, returns, cash-out offer) is in `src/utils/bets.ts`.
- Formatting (`formatMoney` in ₦, `formatOdds`, dates) is in `src/utils/format.ts`.

**Theme.** In `src/constants/theme.ts`:
- `BrandColor` seeds every `AppHost` and tints the tab bar.
- `Colors` only holds the accents the native toolkits don't provide (`textSecondary`, `live`, `won`, `lost`). Read them through `useTheme()`. Primary text, backgrounds and control colors come from SwiftUI and Material 3.
- `Spacing` and `Typography` are the presets used for Expo UI `spacing` and `textStyle` props.

## Conventions

- Path aliases: `@/*` → `src/*`, `@/assets/*` → `assets/*`.
- Files are kebab-case. Components are named exports; route screens are default exports.
- React Compiler is on, so don't add manual `useMemo`/`useCallback`/`memo`.
- `ios/` and `android/` are generated (CNG) and gitignored. Configure native behavior through `app.json` and config plugins.
- `.claude/settings.json` enables the `expo` plugin. Load its skills (`expo:expo-ui`, `expo:expo-router`, etc.) before Expo work, and check component APIs against the installed `.d.ts` files in `node_modules/@expo/ui/build/universal/`.
