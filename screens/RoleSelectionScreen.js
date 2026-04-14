import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showFillWarning, setShowFillWarning] = useState(false);

  const founderScale   = useSharedValue(1);
  const investorScale  = useSharedValue(1);
  const founderOpacity = useSharedValue(0);
  const investorOpacity = useSharedValue(0);
  const titleOpacity   = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const nextButtonScale = useSharedValue(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      titleOpacity.value   = withSpring(1, { damping: 15 });
      titleTranslateY.value = withSpring(0, { damping: 15 });
      founderOpacity.value  = withDelay(200, withSpring(1, { damping: 15 }));
      investorOpacity.value = withDelay(400, withSpring(1, { damping: 15 }));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const founderAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: founderScale.value }],
    opacity: founderOpacity.value,
  }));
  const investorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: investorScale.value }],
    opacity: investorOpacity.value,
  }));
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));
  const nextButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextButtonScale.value }],
  }));

  const handleRoleSelect = (role) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch(e) {}
    setShowFillWarning(false);

    if (role === 'founder') {
      founderScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 15 })
      );
    } else {
      investorScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 15 })
      );
    }
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (!selectedRole) {
      // Show inline warning instead of navigating
      setShowFillWarning(true);
      nextButtonScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 15 })
      );
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch(e) {}
      return;
    }
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch(e) {}
    nextButtonScale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    if (selectedRole === 'founder') {
      navigation.navigate('FounderSignup');
    } else {
      navigation.navigate('InvestorSignup');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>

        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>I am a...</Text>
          <Text style={styles.subtitle}>Choose your path to get started</Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {/* ── Founder Card ── */}
          <Animated.View
            style={[
              styles.card,
              founderAnimatedStyle,
              selectedRole === 'founder' && styles.cardSelected,
            ]}
          >
            <TouchableOpacity
              style={styles.cardTouchable}
              activeOpacity={0.9}
              onPress={() => handleRoleSelect('founder')}
            >
              <View style={styles.cardIconContainer}>
                {/* 
                  ────────────────────────────────────────────────
                  FOUNDER IMAGE — make your image at:
                    200 × 200 px  (1×) or  400 × 400 px  (2× retina)
                    Format: PNG with transparent background
                    File: apps/assets/founder_icon.png
                  ────────────────────────────────────────────────
                */}
                <Image
                  source={require('../assets/founder_icon.png')}
                  style={styles.cardIcon}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.cardTitle}>Founder</Text>
              <Text style={styles.cardDescription}>
                Building a startup? Pitch your vision, find investors,
                and grow your business.
              </Text>
              <View style={styles.cardFeatures}>
                {['Pitch to investors', 'Get funding matches', 'Access deal rooms'].map(f => (
                  <View key={f} style={styles.featureItem}>
                    <View style={styles.featureDot} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardFooter}>
                <Text style={[
                  styles.cardFooterText,
                  selectedRole === 'founder' && styles.cardFooterSelected,
                ]}>
                  {selectedRole === 'founder' ? 'Selected ✓' : 'Tap to select'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Investor Card ── */}
          <Animated.View
            style={[
              styles.card,
              investorAnimatedStyle,
              selectedRole === 'investor' && styles.cardSelected,
            ]}
          >
            <TouchableOpacity
              style={styles.cardTouchable}
              activeOpacity={0.9}
              onPress={() => handleRoleSelect('investor')}
            >
              <View style={styles.cardIconContainer}>
                {/* 
                  ────────────────────────────────────────────────
                  INVESTOR IMAGE — make your image at:
                    200 × 200 px  (1×) or  400 × 400 px  (2× retina)
                    Format: PNG with transparent background
                    File: apps/assets/investor_icon.png
                  ────────────────────────────────────────────────
                */}
                <Image
                  source={require('../assets/investor_icon.png')}
                  style={[styles.cardIcon, styles.investorIcon]}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.cardTitle}>Investor</Text>
              <Text style={styles.cardDescription}>
                Looking for promising startups? Discover, evaluate, and
                invest in the next big thing.
              </Text>
              <View style={styles.cardFeatures}>
                {['Discover startups', 'Review pitch decks', 'Join deal rooms'].map(f => (
                  <View key={f} style={styles.featureItem}>
                    <View style={[styles.featureDot, styles.investorDot]} />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.cardFooter}>
                <Text style={[
                  styles.cardFooterText,
                  selectedRole === 'investor' && styles.cardFooterSelected,
                ]}>
                  {selectedRole === 'investor' ? 'Selected ✓' : 'Tap to select'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── Next Button ── */}
        <View style={styles.nextArea}>
          {/* Inline warning — tap to dismiss */}
          {showFillWarning && (
            <TouchableOpacity
              onPress={() => setShowFillWarning(false)}
              style={styles.fillWarningBox}
            >
              <Text style={styles.fillWarningText}>
                ⚠  Please select a role first  •  tap to dismiss
              </Text>
            </TouchableOpacity>
          )}

          <Animated.View style={nextButtonAnimatedStyle}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              {/*
                ────────────────────────────────────────────────
                NEXT BUTTON IMAGE — make your custom painting at:
                  Width:  full button width = screenWidth − 48
                  Typical phone ≈ 327 × 64 px  (1×)
                           or  654 × 128 px  (2× retina)
                  Use resizeMode="stretch" so it fills any width
                  File: apps/assets/next_button.png
                  (Remove the backgroundColor below once you add the image)
                ────────────────────────────────────────────────

                <Image
                  source={require('../assets/next_button.png')}
                  style={StyleSheet.absoluteFill}
                  resizeMode="stretch"
                />
              */}
              <Text style={styles.nextButtonText}>
                {selectedRole ? `Continue as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}  →` : 'Next  →'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            You can change your role later in settings
          </Text>
        </View>
      </View>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: FONTS.playfairBold,
    fontSize: 34,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardSelected: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.25,
    elevation: 8,
  },
  cardTouchable: { flex: 1 },
  cardIconContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  cardIcon: {
    width: 72,
    height: 72,
    tintColor: COLORS.primary,
  },
  investorIcon: {
    tintColor: COLORS.text,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 24,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFeatures: { marginBottom: 16 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  investorDot: { backgroundColor: COLORS.text },
  featureText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
  },
  cardFooter: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cardFooterText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textLight,
  },
  cardFooterSelected: {
    color: COLORS.gold,
  },

  // ── Next area ──
  nextArea: {
    marginBottom: 8,
  },
  fillWarningBox: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  fillWarningText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: '#8B6914',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 16,
    // Ornate double-border effect
    borderWidth: 2,
    borderColor: COLORS.goldLight,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // Inner shadow simulation
    shadowColor: '#8B6914',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 17,
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  footer: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default RoleSelectionScreen;