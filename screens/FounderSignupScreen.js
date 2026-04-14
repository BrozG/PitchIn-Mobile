import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,   // ← was missing, caused crash
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const FounderSignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [fillWarning, setFillWarning] = useState('');   // ← inline validation message
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    country: '',
    companyName: '',
    website: '',
    industry: '',
    stage: '',
    yearFounded: '',
    teamSize: '',
    coFounders: '',
    mrr: '',
    mau: '',
    keyMetric: '',
    accelerator: '',
    amountRaising: '',
    equityOffered: '',
    useOfFunds: '',
    prevFunding: '',
    pitchDeckUrl: '',
    oneLinePitch: '',
    problemDescription: '',
  });

  const contentOpacity   = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);
  const buttonScale      = useSharedValue(1);

  const industries = ['Fintech', 'Healthtech', 'SaaS', 'EdTech', 'Web3', 'DeepTech', 'Consumer', 'Climate', 'Other'];
  const stages     = ['Idea', 'Pre-Seed', 'Seed', 'Series A'];

  const animateStepTransition = (direction, callback) => {
    contentOpacity.value    = withTiming(0, { duration: 200 });
    contentTranslateX.value = withTiming(direction === 'next' ? -50 : 50, { duration: 200 });
    setTimeout(() => {
      callback();
      contentTranslateX.value = direction === 'next' ? 50 : -50;
      contentOpacity.value    = withTiming(1, { duration: 300 });
      contentTranslateX.value = withTiming(0, { duration: 300 });
    }, 200);
  };

  // ── Per-step required field validation ──────────────────────────────
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!form.fullName.trim())   return 'Full name is required';
        if (!form.email.trim() || !form.email.includes('@')) return 'Valid email is required';
        return null;
      case 2:
        if (!form.companyName.trim()) return 'Company name is required';
        if (!form.industry)           return 'Please select an industry';
        if (!form.stage)              return 'Please select a funding stage';
        return null;
      case 3:
        // traction fields are optional
        return null;
      case 4:
        if (!form.amountRaising.trim()) return 'Amount raising is required';
        return null;
      case 5:
        if (!form.oneLinePitch.trim()) return 'One-line pitch is required';
        return null;
      case 6:
        // agreements – always ok
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateStep();
    if (error) {
      setFillWarning(error);
      buttonScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1,    { damping: 15 })
      );
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); } catch(e) {}
      return;
    }
    setFillWarning('');
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {}
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1,    { damping: 15 })
    );

    if (step < 6) {
      animateStepTransition('next', () => setStep(step + 1));
    } else {
      Alert.alert('Submission', 'Founder profile submitted for review.');
      navigation.navigate('PendingReview');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setFillWarning('');
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch(e) {}
      buttonScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1,    { damping: 15 })
      );
      animateStepTransition('back', () => setStep(step - 1));
    }
  };

  const updateForm = (field, value) => setForm({ ...form, [field]: value });

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // ─────────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Info</Text>
            <Text style={styles.stepDescription}>Tell us about yourself</Text>
            <TextInput style={styles.input} placeholder="Full Name *" placeholderTextColor={COLORS.textLight}
              value={form.fullName} onChangeText={(v) => updateForm('fullName', v)} />
            <TextInput style={styles.input} placeholder="Email *" placeholderTextColor={COLORS.textLight}
              keyboardType="email-address" value={form.email} onChangeText={(v) => updateForm('email', v)} />
            <TextInput style={styles.input} placeholder="Phone with country code" placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad" value={form.phone} onChangeText={(v) => updateForm('phone', v)} />
            <TextInput style={styles.input} placeholder="LinkedIn Profile URL" placeholderTextColor={COLORS.textLight}
              value={form.linkedinUrl} onChangeText={(v) => updateForm('linkedinUrl', v)} />
            <TextInput style={styles.input} placeholder="Country" placeholderTextColor={COLORS.textLight}
              value={form.country} onChangeText={(v) => updateForm('country', v)} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Company</Text>
            <Text style={styles.stepDescription}>Tell us about your startup</Text>
            <TextInput style={styles.input} placeholder="Company Name *" placeholderTextColor={COLORS.textLight}
              value={form.companyName} onChangeText={(v) => updateForm('companyName', v)} />
            <TextInput style={styles.input} placeholder="Website or Landing Page URL" placeholderTextColor={COLORS.textLight}
              value={form.website} onChangeText={(v) => updateForm('website', v)} />
            <Text style={styles.label}>Industry *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={form.industry} onValueChange={(v) => updateForm('industry', v)}
                style={styles.picker} dropdownIconColor={COLORS.primary}>
                <Picker.Item label="Select Industry" value="" />
                {industries.map(ind => <Picker.Item key={ind} label={ind} value={ind} />)}
              </Picker>
            </View>
            <Text style={styles.label}>Funding Stage *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={form.stage} onValueChange={(v) => updateForm('stage', v)}
                style={styles.picker} dropdownIconColor={COLORS.primary}>
                <Picker.Item label="Select Stage" value="" />
                {stages.map(s => <Picker.Item key={s} label={s} value={s} />)}
              </Picker>
            </View>
            <TextInput style={styles.input} placeholder="Year Founded" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.yearFounded} onChangeText={(v) => updateForm('yearFounded', v)} />
            <TextInput style={styles.input} placeholder="Team Size" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.teamSize} onChangeText={(v) => updateForm('teamSize', v)} />
            <TextInput style={styles.input} placeholder="Number of Co-founders" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.coFounders} onChangeText={(v) => updateForm('coFounders', v)} />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Traction</Text>
            <Text style={styles.stepDescription}>Show us your progress</Text>
            <TextInput style={styles.input} placeholder="Monthly Revenue (USD)" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.mrr} onChangeText={(v) => updateForm('mrr', v)} />
            <TextInput style={styles.input} placeholder="Monthly Active Users" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.mau} onChangeText={(v) => updateForm('mau', v)} />
            <TextInput style={styles.input} placeholder="Key Metric (e.g., 10,000 downloads)" placeholderTextColor={COLORS.textLight}
              value={form.keyMetric} onChangeText={(v) => updateForm('keyMetric', v)} />
            <TextInput style={styles.input} placeholder="Accelerator / YC Batch / Press" placeholderTextColor={COLORS.textLight}
              value={form.accelerator} onChangeText={(v) => updateForm('accelerator', v)} />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Funding Ask</Text>
            <Text style={styles.stepDescription}>What you're looking for</Text>
            <TextInput style={styles.input} placeholder="Amount Raising (USD) *" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.amountRaising} onChangeText={(v) => updateForm('amountRaising', v)} />
            <TextInput style={styles.input} placeholder="Equity Offered (%)" placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" value={form.equityOffered} onChangeText={(v) => updateForm('equityOffered', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="What the funds will be used for"
              placeholderTextColor={COLORS.textLight} multiline numberOfLines={4}
              value={form.useOfFunds} onChangeText={(v) => updateForm('useOfFunds', v)} />
            <TextInput style={styles.input} placeholder="Previous Funding (optional)" placeholderTextColor={COLORS.textLight}
              value={form.prevFunding} onChangeText={(v) => updateForm('prevFunding', v)} />
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Proof</Text>
            <Text style={styles.stepDescription}>Share your pitch materials</Text>
            <TextInput style={styles.input} placeholder="Pitch Deck URL (PDF)" placeholderTextColor={COLORS.textLight}
              value={form.pitchDeckUrl} onChangeText={(v) => updateForm('pitchDeckUrl', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="One-line pitch (150 chars) *"
              placeholderTextColor={COLORS.textLight} multiline numberOfLines={2}
              value={form.oneLinePitch} onChangeText={(v) => updateForm('oneLinePitch', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the problem you solve"
              placeholderTextColor={COLORS.textLight} multiline numberOfLines={5}
              value={form.problemDescription} onChangeText={(v) => updateForm('problemDescription', v)} />
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Agree</Text>
            <Text style={styles.stepDescription}>Please review your information</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Name: <Text style={styles.summaryValue}>{form.fullName}</Text></Text>
              <Text style={styles.summaryLabel}>Company: <Text style={styles.summaryValue}>{form.companyName}</Text></Text>
              <Text style={styles.summaryLabel}>Industry: <Text style={styles.summaryValue}>{form.industry}</Text></Text>
              <Text style={styles.summaryLabel}>Amount Raising: <Text style={styles.summaryValue}>${form.amountRaising}</Text></Text>
              <Text style={styles.summaryLabel}>One-line Pitch: <Text style={styles.summaryValue}>{form.oneLinePitch}</Text></Text>
            </View>
            <View style={styles.checkboxContainer}>
              {[
                'I agree to Terms of Service',
                'All information is truthful',
                'I understand consequences of false info',
              ].map((t) => (
                <View key={t} style={styles.checkboxItem}>
                  <View style={styles.checkboxIcon}><Text style={styles.checkMark}>✓</Text></View>
                  <Text style={styles.checkboxText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1,2,3,4,5,6].map((stepNum) => (
        <View key={stepNum} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            stepNum === step && styles.stepCircleActive,
            stepNum < step  && styles.stepCircleCompleted,
          ]}>
            <Text style={[
              styles.stepNumber,
              (stepNum === step || stepNum < step) && styles.stepNumberActive,
            ]}>
              {stepNum < step ? '✓' : stepNum}
            </Text>
          </View>
          {stepNum < 6 && (
            <View style={[styles.stepLine, stepNum < step && styles.stepLineCompleted]} />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Founder Signup</Text>
        <Text style={styles.headerSubtitle}>Step {step} of 6</Text>
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.scrollView}>
        <Animated.View style={[styles.contentWrapper, contentAnimatedStyle]}>
          {renderStep()}
        </Animated.View>
      </ScrollView>

      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        )}
        <View style={styles.nextSide}>
          {/* Inline fill warning — tap to dismiss */}
          {!!fillWarning && (
            <TouchableOpacity onPress={() => setFillWarning('')} style={styles.fillWarning}>
              <Text style={styles.fillWarningText}>⚠  {fillWarning}  •  tap to dismiss</Text>
            </TouchableOpacity>
          )}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {step === 6 ? 'Submit Application' : 'Continue →'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, alignItems: 'center',
  },
  headerTitle: { fontFamily: FONTS.playfairBold, fontSize: 30, color: COLORS.text, marginBottom: 4 },
  headerSubtitle: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textLight },

  stepIndicator: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, marginBottom: 24,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  stepCircleActive:    { backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.primaryLight },
  stepCircleCompleted: { backgroundColor: COLORS.success },
  stepNumber:       { fontFamily: FONTS.semiBold, fontSize: 14, color: COLORS.textLight },
  stepNumberActive: { color: '#FFFFFF' },
  stepLine:          { width: 28, height: 2, backgroundColor: COLORS.border },
  stepLineCompleted: { backgroundColor: COLORS.success },

  scrollView: { flex: 1, paddingHorizontal: 24 },
  contentWrapper: { paddingBottom: 40 },
  stepContainer: { paddingTop: 16 },
  stepTitle:       { fontFamily: FONTS.playfairBold, fontSize: 26, color: COLORS.text, marginBottom: 6 },
  stepDescription: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textLight, marginBottom: 20 },

  input: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 14, color: COLORS.text, marginBottom: 14,
    fontSize: 15, fontFamily: FONTS.regular,
  },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  label: { color: COLORS.text, marginBottom: 6, fontSize: 13, fontFamily: FONTS.semiBold },
  pickerContainer: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, marginBottom: 14, overflow: 'hidden',
  },
  picker: { backgroundColor: '#FFFFFF', color: COLORS.text, height: 48 },

  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1,
    borderColor: COLORS.border, padding: 18, marginBottom: 20,
  },
  summaryLabel: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.textLight, marginBottom: 6 },
  summaryValue: { fontFamily: FONTS.semiBold, color: COLORS.text },

  checkboxContainer: { marginTop: 16 },
  checkboxItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  checkboxIcon: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  checkMark: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  checkboxText: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text, flex: 1 },

  buttonRow: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1,
    borderTopColor: COLORS.borderLight, backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  button: {
    paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  backButton:     { backgroundColor: COLORS.border, marginRight: 12, minWidth: 90 },
  backButtonText: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  nextSide: { flex: 1 },

  // Inline fill warning inside button row
  fillWarning: {
    backgroundColor: '#FFF8E7', borderWidth: 1, borderColor: COLORS.gold,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8,
  },
  fillWarningText: { fontFamily: FONTS.regular, fontSize: 12, color: '#8B6914', textAlign: 'center' },

  nextButton:     { backgroundColor: COLORS.primary, borderRadius: 12 },
  nextButtonText: { fontFamily: FONTS.semiBold, fontSize: 16, color: '#FFFFFF' },
  nextButtonContainer: { flex: 1 },
});

export default FounderSignupScreen;