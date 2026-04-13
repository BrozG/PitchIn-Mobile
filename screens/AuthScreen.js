import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Modal from 'react-native-modal';
import { COLORS, FONTS } from '../constants/theme';

// Placeholder for supabase client - replace with actual import
// import { supabase } from '../lib/supabase';
const supabase = { auth: {} }; // dummy

const { width: screenWidth } = Dimensions.get('window');

const AuthScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotVisible, setForgotVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Animation values
  const cardTranslateY = useSharedValue(400);
  const tabIndicatorTranslateX = useSharedValue(0);
  const buttonShakeX = useSharedValue(0);

  // Tab switch animation
  useEffect(() => {
    const targetX = activeTab === 'signup' ? 0 : screenWidth / 2 - 28;
    tabIndicatorTranslateX.value = withSpring(targetX, { damping: 20, stiffness: 120 });
  }, [activeTab]);

  // Card entry animation
  useEffect(() => {
    cardTranslateY.value = withSpring(0, { damping: 20, stiffness: 120 });
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const tabIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabIndicatorTranslateX.value }],
  }));

  const buttonShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: buttonShakeX.value }],
  }));

  // Validation
  const validateSignup = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (!email.trim() || !email.includes('@') || !email.includes('.')) return 'Valid email is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const validateLogin = () => {
    if (!email.trim() || !email.includes('@') || !email.includes('.')) return 'Valid email is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    return null;
  };

  // Shake button on invalid
  const shakeButton = () => {
    buttonShakeX.value = withSequence(
      withTiming(10, { duration: 80 }),
      withTiming(-10, { duration: 80 }),
      withTiming(10, { duration: 80 }),
      withTiming(-10, { duration: 80 }),
      withTiming(0, { duration: 80 })
    );
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {}
  };

  // Sign up handler
  const handleSignUp = async () => {
    const error = validateSignup();
    if (error) {
      setAuthError(error);
      shakeButton();
      return;
    }
    setLoading(true);
    setAuthError('');
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
      // if (error) throw error;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('RoleSelection');
    } catch (err) {
      setAuthError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  // Log in handler
  const handleLogin = async () => {
    const error = validateLogin();
    if (error) {
      setAuthError(error);
      shakeButton();
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      // if (error) throw error;
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const hasProfile = false;
      if (hasProfile) {
        navigation.navigate('InvestorDiscovery');
      } else {
        navigation.navigate('RoleSelection');
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Social auth
  const handleGoogleAuth = async () => {
    try {
      WebBrowser.maybeCompleteAuthSession();
      const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'pitchin' });
      // const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl } });
      // if (data?.url) await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  const handleAppleAuth = async () => {
    try {
      WebBrowser.maybeCompleteAuthSession();
      const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'pitchin' });
      // const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: redirectUrl } });
      // if (data?.url) await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      setAuthError('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      // await supabase.auth.resetPasswordForEmail(resetEmail, { redirectTo: 'pitchin://reset-password' });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setResetSent(true);
      setTimeout(() => {
        setForgotVisible(false);
        setResetSent(false);
        setResetEmail('');
      }, 2500);
    } catch (err) {
      setAuthError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../assets/loading_image.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        
        <View style={styles.topBranding}>
          <Text style={styles.brandTitle}>Pitch In</Text>
          <Text style={styles.brandSubtitle}>Where dreams meet capital</Text>
          <View style={styles.brandUnderline} />
        </View>

        <Animated.View style={[styles.bottomCard, cardAnimatedStyle]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => {
                  setActiveTab('signup');
                  try { Haptics.selectionAsync(); } catch (e) {}
                }}
              >
                <Text style={activeTab === 'signup' ? styles.tabActiveText : styles.tabInactiveText}>
                  Sign Up
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tabButton}
                onPress={() => {
                  setActiveTab('login');
                  try { Haptics.selectionAsync(); } catch (e) {}
                }}
              >
                <Text style={activeTab === 'login' ? styles.tabActiveText : styles.tabInactiveText}>
                  Log In
                </Text>
              </TouchableOpacity>
              <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
            </View>

            {activeTab === 'signup' ? (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
                <Animated.View style={buttonShakeStyle}>
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.buttonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={styles.forgotLink}
                  onPress={() => setForgotVisible(true)}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
                <Animated.View style={buttonShakeStyle}>
                  <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} />
                    ) : (
                      <Text style={styles.buttonText}>Log In</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}

            {authError ? <Text style={styles.errorText}>{authError}</Text> : null}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleAuth}>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={handleAppleAuth}>
                <Text style={styles.appleIcon}></Text>
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>Apple</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </ImageBackground>

      <Modal
        isVisible={forgotVisible}
        onBackdropPress={() => setForgotVisible(false)}
        onSwipeComplete={() => setForgotVisible(false)}
        swipeDirection="down"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          {!resetSent ? (
            <>
              <Text style={styles.modalTitle}>Reset Password</Text>
              <Text style={styles.modalSubtitle}>
                Enter your email and we'll send a reset link
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={COLORS.textMuted}
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.backLink}
                onPress={() => setForgotVisible(false)}
              >
                <Text style={styles.backLinkText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.successIcon}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
              <Text style={styles.modalTitle}>Check your inbox!</Text>
              <Text style={styles.modalSubtitle}>
                We've sent a reset link to {resetEmail}
              </Text>
            </>
          )}
        </View>
      </Modal>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  topBranding: {
    position: 'absolute',
    top: '15%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  brandTitle: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  brandUnderline: {
    width: 50,
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 8,
  },
  bottomCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabActiveText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.white,
    textAlign: 'center',
  },
  tabInactiveText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    height: '100%',
    width: '50%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 14,
    placeholderTextColor: COLORS.textMuted,
  },
  button: {
    backgroundColor: COLORS.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: FONTS.semibold,
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.gold,
  },
  errorText: {
    color: COLORS.error,
    fontFamily: FONTS.regular,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#DEDEDE',
  },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginHorizontal: 8,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  appleButton: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.text,
  },
  googleIcon: {
    color: '#4285F4',
    fontSize: 16,
    marginRight: 8,
    fontFamily: FONTS.semibold,
  },
  appleIcon: {
    color: COLORS.white,
    fontSize: 18,
    marginRight: 8,
  },
  socialButtonText: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.text,
  },
  appleButtonText: {
    color: COLORS.white,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
  },
  modalSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 24,
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.gold,
    textAlign: 'center',
  },
  successIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  checkmark: {
    fontSize: 40,
    color: COLORS.gold,
  },
});

export default AuthScreen;
