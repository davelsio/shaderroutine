<h1 align="center">Expo Stack</h1>
<p align="center"><i>Simple Expo SDK53 starter</i></p>

### Stack

- Expo [SDK53](https://expo.dev/changelog/sdk-53-beta) with the new architecture enabled.
- [Unistyles 3.0](https://www.unistyl.es/v3/start/introduction) as a drop-in replacement for the `StyleSheet` API.
- [Radix UI](https://www.radix-ui.com/colors) to provide the base color palettes.
- [React Hook Form](https://react-hook-form.com/) to compose form controllers.
- [Zod](https://zod.dev/) for the validation of form schemas and API responses.
- [ESlint 9](https://eslint.org/docs/latest/use/getting-started) configured with the new flat config.

## Examples

#### Google Fonts: Platform-based naming
[`./theme/vars/fonts.ts`](./theme/vars/fonts.ts)

#### Google Fonts: Embedding with `expo-font`
[`./app.config.ts`](./app.config.ts)

#### Google Fonts: Using custom and default faces
[`./features/home/HomeView.tsx`](./features/home/HomeView.tsx)

## Commands

```bash
pnpm run start                  # Start the development server
pnpm run android                # Create an Android development build
pnpm run ios                    # Create an iOS development build
pnpm run android:build:preview  # EAS preview build for Android
pnpm run android:build:prod     # EAS production build for Android
pnpm run ios:build:preview      # EAS preview build for iOS
pnpm run ios:build:prod         # EAS production build for iOS
pnpm run eas:update:preview     # EAS update for preview
pnpm run eas:update:prod        # EAS update for production
pnpm run lint                   # Run ESLint and fix issues
pnpm run format                 # Run Prettier and fix formatting issues
pnpm run test                   # Run Jest tests
pnpm run expo:check             # Check dependency versions
pnpm run expo:doctor            # Check for issues with Expo Doctor
pnpm run expo:install           # Install expo dependencies
pnpm run expo:prebuild          # Prebuild the app
```
