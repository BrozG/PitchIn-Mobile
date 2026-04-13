import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ImageBackground } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  const translateY = useSharedValue(-70);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const underlineWidth = useSharedValue(0);

  useEffect(() => {
    // Animation sequence
    const animate = async () => {
      // Step 2: after 200ms delay, animate text
      translateY.value = withDelay(200, withSpring(0, { damping: 14, stiffness: 120, mass: 1 }));
      opacity.value = withDelay(200, withSpring(1, { damping: 14, stiffness: 120, mass: 1 }));
      scale.value = withDelay(200, withSpring(1, { damping: 14, stiffness: 120, mass: 1 }));

      // Step 3: underline width animation
      underlineWidth.value = withDelay(400, withTiming(70, { duration: 500 }));

      // Step 4: haptic feedback
      await new Promise(resolve => setTimeout(resolve, 600));
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {}

      // Step 5: hold for 1400ms then fade out
      await new Promise(resolve => setTimeout(resolve, 1400));
      opacity.value = withTiming(0, { duration: 500 });

      // Step 6: navigate to AuthScreen
      await new Promise(resolve => setTimeout(resolve, 500));
      runOnJS(navigation.replace)('Auth');
    };

    animate();
  }, []);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const underlineAnimatedStyle = useAnimatedStyle(() => ({
    width: underlineWidth.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        source={require('../assets/loading_image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Animated.Text style={[styles.title, textAnimatedStyle]}>
            Pitch In
          </Animated.Text>
          <Animated.View style={[styles.underline, underlineAnimatedStyle]} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  underline: {
    height: 3,
    backgroundColor: '#C9A84C',
    borderRadius: 2,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default LoadingScreen;