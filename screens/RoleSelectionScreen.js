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
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const RoleSelectionScreen = ({ navigation }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  // Animation values
  const founderScale = useSharedValue(1);
  const founderBorderColor = useSharedValue(COLORS.border);
  const investorScale = useSharedValue(1);
  const investorBorderColor = useSharedValue(COLORS.border);
  const founderOpacity = useSharedValue(0);
  const investorOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);

  // Entry animations
  useEffect(() => {
    const timer = setTimeout(() => {
      titleOpacity.value = withSpring(1, { damping: 15 });
      titleTranslateY.value = withSpring(0, { damping: 15 });

      founderOpacity.value = withDelay(
        200,
        withSpring(1, { damping: 15 })
      );
      investorOpacity.value = withDelay(
        400,
        withSpring(1, { damping: 15 })
      );
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const founderAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: founderScale.value }],
    borderColor: founderBorderColor.value,
    opacity: founderOpacity.value,
  }));

  const investorAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: investorScale.value }],
    borderColor: investorBorderColor.value,
    opacity: investorOpacity.value,
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const handleRoleSelect = (role) => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Visual feedback
    if (role === 'founder') {
      founderScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 15 })
      );
      founderBorderColor.value = withSpring(COLORS.primary, {
        duration: 300,
      });
    } else {
      investorScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 15 })
      );
      investorBorderColor.value = withSpring(COLORS.primary, {
        duration: 300,
      });
    }

    setSelectedRole(role);

    // Navigate after delay
    setTimeout(() => {
      if (role === 'founder') {
        navigation.navigate('FounderSignup');
      } else {
        navigation.navigate('InvestorSignup');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
          <Text style={styles.title}>I am a...</Text>
          <Text style={styles.subtitle}>
            Choose your path to get started
          </Text>
        </Animated.View>

        <View style={styles.cardsContainer}>
          {/* Founder Card */}
          <Animated.View style={[styles.card, founderAnimatedStyle]}>
            <TouchableOpacity
              style={styles.cardTouchable}
              activeOpacity={0.9}
              onPress={() => handleRoleSelect('founder')}
            >
              <View style={styles.cardIconContainer}>
                <Image
                  source={require('../assets/icon.png')}
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
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Pitch to investors
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Get funding matches
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Access deal rooms
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  {selectedRole === 'founder'
                    ? 'Selected ✓'
                    : 'Tap to select'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Investor Card */}
          <Animated.View style={[styles.card, investorAnimatedStyle]}>
            <TouchableOpacity
              style={styles.cardTouchable}
              activeOpacity={0.9}
              onPress={() => handleRoleSelect('investor')}
            >
              <View style={styles.cardIconContainer}>
                <Image
                  source={require('../assets/icon.png')}
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
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Discover startups
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Review pitch decks
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    Join deal rooms
                  </Text>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.cardFooterText}>
                  {selectedRole === 'investor'
                    ? 'Selected ✓'
                    : 'Tap to select'}
                </Text>
              </View>
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontFamily: FONTS.playfairBold,
    fontSize: 36,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 300,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTouchable: {
    flex: 1,
  },
  cardIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardIcon: {
    width: 80,
    height: 80,
    tintColor: COLORS.primary,
  },
  investorIcon: {
    tintColor: COLORS.secondary,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 28,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  cardFeatures: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginRight: 12,
  },
  featureText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
  cardFooter: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  cardFooterText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});

export default RoleSelectionScreen;