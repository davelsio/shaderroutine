import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  type SkColor,
  Skia,
  type SkPoint,
  useClock,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { useCallback, useMemo } from 'react';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { router, usePathname } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';
import SegmentedControl, {
  type NativeSegmentedControlIOSChangeEvent,
} from '@react-native-segmented-control/segmented-control';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { NativeSyntheticEvent } from 'react-native';

import { useShader } from '@hooks/useShader';
import { remap } from '@shaders/remap';
import type { ShaderModule } from '@shaders/modules';
import springEasings from '@utils/springEasings';

import styles from './Sun.styles';
import { DEFAULT_PRESETS, type PresetName, useSunState } from './SunState';

const AnimatedSegmentedControl =
  Animated.createAnimatedComponent(SegmentedControl);

type Uniforms = {
  /**
   * Sun brightness.
   */
  uBrightness: number;
  /**
   * Corona color.
   */
  uCorona: SkColor;
  /**
   * Glow color.
   */
  uGlow: SkColor;
  /**
   * Sun radius in normalized y-axis units.
   */
  uRadius: number;
  /**
   * Image resolution.
   */
  uResolution: SkPoint;
  /**
   * Time in seconds.
   */
  uTime: number;
};

const sunSkShader: ShaderModule = {
  module: require('./Sun.sksl'),
  dependencies: [remap],
};

export function SunView() {
  const pathname = usePathname();
  const state = useSunState();
  const time = useClock();
  const { rt } = useUnistyles();

  const showPicker = useSharedValue(false);
  const rControls = useAnimatedStyle(() => ({
    opacity: showPicker.value
      ? withTiming(1, { duration: 300 })
      : withTiming(0, { duration: 200 }),
    transform: [
      {
        scale: showPicker.value
          ? withSpring(1, springEasings.easeOut)
          : withSpring(0.75, springEasings.easeOut),
      },
    ],
  }));

  const selectedPreset = useDerivedValue<number | undefined>(
    () => state.preset.value.index
  );

  const uniforms = useDerivedValue<Uniforms>(() => ({
    uBrightness: state.preset.value.brightness,
    uCorona: Skia.Color(state.preset.value.corona),
    uGlow: Skia.Color(state.preset.value.glow),
    uRadius: state.preset.value.radius,
    uResolution: vec(state.width.value, state.height.value),
    uTime: time.value / 1000,
  }));

  const surface = useImage(require('@assets/textures/sun.png'));

  const { shader } = useShader(sunSkShader);
  const skShader = useMemo(
    () => (shader ? Skia.RuntimeEffect.Make(shader) : null),
    [shader]
  );

  const presetValues = useMemo(() => {
    const keys = Object.keys(DEFAULT_PRESETS);
    return state.hasCustom ? [...keys, 'Custom'] : keys;
  }, [state.hasCustom]);

  /**
   * Show the custom controls view when long pressing on the main screen.
   * Adjust the shader viewport height to make room for the controls.
   */
  const showControlsGesture = Gesture.LongPress().onStart(() => {
    if (pathname !== '/sun') {
      return;
    }

    runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);

    state.height.value = withSpring(
      rt.screen.height / 1.75,
      springEasings.easeOut
    );
    runOnJS(router.navigate)('/sun/controls');
  });

  /**
   * Hide/Show the segmented control when tapping on the main view.
   * Ensure that it keeps a consistent state when the custom controls view is dismissed.
   */
  const togglePickerGesture = Gesture.Tap().onStart(() => {
    if (pathname === '/sun') {
      showPicker.value = !showPicker.value;
    } else {
      state.height.value = withSpring(rt.screen.height, springEasings.easeOut);
      runOnJS(router.dismissAll)();
    }
  });

  const gesture = Gesture.Race(showControlsGesture, togglePickerGesture);

  const selectPreset = useCallback(
    ({
      nativeEvent,
    }: NativeSyntheticEvent<NativeSegmentedControlIOSChangeEvent>) => {
      state.selectPreset(nativeEvent.value as PresetName);
    },
    [state]
  );

  if (!skShader) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureDetector gesture={gesture}>
        <Canvas style={styles.canvas}>
          <Fill>
            <Shader source={skShader} uniforms={uniforms}>
              <ImageShader
                image={surface}
                fit="fill"
                width={state.width}
                height={state.height}
                tx="repeat"
                ty="repeat"
              />
            </Shader>
          </Fill>
        </Canvas>
      </GestureDetector>
      <Animated.View style={[styles.picker, rControls]}>
        <AnimatedSegmentedControl
          appearance="dark"
          style={styles.segmentedControl}
          values={presetValues}
          selectedIndex={selectedPreset}
          onChange={selectPreset}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
