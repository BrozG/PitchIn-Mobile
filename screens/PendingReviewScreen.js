import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const PendingReviewScreen = () => {
  const badgeScale = useSharedValue(1);
  const badgeOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(20);

  useEffect(() => {
    // Haptic feedback on mount
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Entry animations
    const timer = setTimeout(() => {
      contentOpacity.value = withTiming(1, { duration: 600 });
      contentTranslateY.value = withTiming(0, { duration: 600 });

      badgeOpacity.value = withDelay(
        800,
        withTiming(1, { duration: 400 })
      );

      // Pulsing animation for badge
      badgeScale.value = withRepeat(
        withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
    opacity: badgeOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateY: contentTranslateY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <LottieView
          source={require('../assets/hourglass.json')}
          autoPlay
          loop
          style={styles.animation}
        />
        
        <Text style={styles.heading}>You're in the queue</Text>
        
        <Text style={styles.subtext}>
          Our team handpicks founders. We'll email you within 48 hours.
        </Text>

        <Text style={styles.tip}>
          In the meantime, you can prepare your pitch deck and financials.
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>95%</Text>
            <Text style={styles.statLabel}>Approval Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>

        <Animated.View style={[styles.badge, badgeAnimatedStyle]}>
          <Text style={styles.badgeText}>PENDING REVIEW</Text>
        </Animated.View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You'll receive an email notification once reviewed.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  heading: {
    fontFamily: FONTS.playfairBold,
    fontSize: 36,
    color: COLORS.text,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtext: {
    fontFamily: FONTS.regular,
    fontSize: 18,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    maxWidth: 320,
  },
  tip: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 32,
    maxWidth: 300,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: FONTS.playfairBold,
    fontSize: 28,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: COLORS.borderLight,
    alignSelf: 'center',
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 280,
  },
});

export default PendingReviewScreen;