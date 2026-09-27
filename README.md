# expo-widgets: `(0, n.memo) is not a function` in the widget bundle

Minimal reproduction for a bug in `expo-widgets@58.0.7` with `@expo/ui@58.0.7` (Expo SDK 58 preview).

The JS bundle that `expo-widgets` embeds in the widget extension (`ExpoWidgets.bundle`) throws while it is evaluated, so every widget and Live Activity renders the error card **"Could not create context for layout evaluation."** instead of its layout.

This app is a fresh `create-expo-app --template blank-typescript@sdk-58` project with:

- `expo-widgets@58.0.7` and `@expo/ui@58.0.7` pinned exactly.
- One Live Activity (`src/activity.tsx`) whose layout only uses `HStack`, `Text` and `Image` from `@expo/ui/swift-ui`. It never uses `List`.
- Two buttons in `App.tsx` to start and end the Live Activity.

## Versions

| Package        | Version            |
| -------------- | ------------------ |
| `expo`         | `58.0.0-preview.7` |
| `expo-widgets` | `58.0.7`           |
| `@expo/ui`     | `58.0.7`           |
| `react`        | `19.3.0`           |
| `react-native` | `0.88.0-rc.1`      |

Tested with Xcode 27.0 and an iPhone 17 simulator on iOS 27.0, macOS 27.0, Node 24.

## Reproduce without a simulator (fastest)

```sh
npm install
npm run widgets:bundle   # builds ExpoWidgets.bundle with expo-widgets' own metro config
npm run widgets:eval     # evaluates it with the system JavaScriptCore
```

`widgets:bundle` runs `node_modules/expo-widgets/scripts/build-bundle.mjs`, the same script the Xcode build phase runs, and writes `build/ExpoWidgets.bundle`.

**Expected:** `function` (the bundle evaluates and defines `__expoWidgetRender`).

**Actual:**

```text
Exception: TypeError: (0,n.memo) is not a function. (In '(0,n.memo)(function({Slot:n,item:s,index:o,itemKey:u,revision:c,renderItem:v}){return(0,t.jsx)(n,{itemKey:u,index:o,revision:c,children:v({item:s,index:o})})})', '(0,n.memo)' is undefined)
```

## Reproduce on the iOS simulator

No Apple team is needed for the simulator.

```sh
npm install
npx expo prebuild -p ios
npx expo run:ios
```

1. Tap **Start Live Activity**.
2. Lock the simulator (Device > Lock, or ⌘L) and look at the Lock Screen.

**Expected:** a row with a star and "Hello from expo-widgets".

**Actual:** a red card that says "Error / Could not create context for layout evaluation." (`screenshots/bug.png`).

## Fix

The `fix` branch adds an identity `memo` to `expo-widgets/bundle/react-stub.ts` through `patch-package` (`patches/expo-widgets+58.0.7.patch`):

```diff
 export const useContext = <T>(context: StubContext<T>): T => context._currentValue;
+
+export const memo = <T>(component: T): T => component;
```

```sh
git checkout fix
npm install              # postinstall applies the patch
npm run widgets:bundle && npm run widgets:eval   # prints "function"
npx expo run:ios         # the Live Activity renders (screenshots/fixed.png)
```
