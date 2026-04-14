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
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const InvestorSignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [fillWarning, setFillWarning] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    linkedinUrl: '',
    country: '',
    investorType: '',
    checkSizeRange: '',
    sectors: [],
    stagePref: [],
    geoFocus: [],
    lookingForText: '',
    dealsPerMonth: '',
    capitalStatus: '',
  });

  const contentOpacity    = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);
  const buttonScale       = useSharedValue(1);

  const investorTypes    = ['Angel', 'VC', 'Family Office', 'Corporate VC', 'Syndicate', 'Other'];
  const checkSizeRanges  = ['Under $25K', '$25K–$100K', '$100K–$500K', '$500K–$2M', '$2M+'];
  const sectorList       = ['Fintech', 'Healthtech', 'SaaS', 'EdTech', 'Web3', 'DeepTech', 'Consumer', 'Climate', 'Other'];
  const stages           = ['Idea', 'Pre-Seed', 'Seed', 'Series A'];
  const regions          = ['North America', 'Europe', 'South Asia', 'Southeast Asia', 'Middle East', 'Africa', 'Latin America', 'Global'];

  const animateStepTransition = (direction, callback) => {
    console.log(`Starting ${direction} animation`);
    contentOpacity.value    = withTiming(0, { duration: 200 });
    contentTranslateX.value = withTiming(direction === 'next' ? -50 : 50, { duration: 200 });
    setTimeout(() => {
      console.log('Animation callback executed');
      callback();
      contentTranslateX.value = direction === 'next' ? 50 : -50;
      contentOpacity.value    = withTiming(1, { duration: 300 });
      contentTranslateX.value = withTiming(0, { duration: 300 });
    }, 200);
  };

  // ── Per-step validation ───────────────────────────────────────────
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!form.fullName.trim()) return 'Full name is required';
        if (!form.email.trim() || !form.email.includes('@')) return 'Valid email is required';
        return null;
      case 2:
        if (!form.investorType)          return 'Please select investor type';
        if (!form.checkSizeRange)        return 'Please select a check size range';
        if (form.sectors.length === 0)   return 'Select at least one sector';
        return null;
      case 3:
        // optional fields
        return null;
      case 4:
        // agreements – always proceed
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    console.log('HandleNext called at step:', step);
    const error = validateStep();
    if (error) {
      console.log('Validation failed:', error);
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

    if (step < 4) {
      animateStepTransition('next', () => setStep(step + 1));
    } else {
      console.log('Attempting navigation to InvestorDiscovery');
      Alert.alert('Success', 'Investor profile created! You can now browse startups.', [
        {
          text: 'Continue',
          onPress: () => {
            console.log('Navigating to InvestorDiscovery');
            navigation.navigate('InvestorDiscovery');
          },
        },
      ]);
    }
  };

  const handleBack = () => {
    console.log('HandleBack called from step:', step);
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

  const updateForm   = (field, value) => setForm({ ...form, [field]: value });
  const toggleArray  = (field, item) => {
    const arr = form[field];
    setForm({
      ...form,
      [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
    });
  };

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
            <Text style={styles.stepTitle}>About You</Text>
            <Text style={styles.stepDescription}>Tell us who you are</Text>
            <TextInput style={styles.input} placeholder="Full Name *" placeholderTextColor={COLORS.textLight}
              value={form.fullName} onChangeText={(v) => updateForm('fullName', v)} />
            <TextInput style={styles.input} placeholder="Email *" placeholderTextColor={COLORS.textLight}
              keyboardType="email-address" autoCapitalize="none"
              value={form.email} onChangeText={(v) => updateForm('email', v)} />
            <TextInput style={styles.input} placeholder="LinkedIn Profile URL" placeholderTextColor={COLORS.textLight}
              value={form.linkedinUrl} onChangeText={(v) => updateForm('linkedinUrl', v)} />
            <TextInput style={styles.input} placeholder="Country" placeholderTextColor={COLORS.textLight}
              value={form.country} onChangeText={(v) => updateForm('country', v)} />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Investment Profile</Text>
            <Text style={styles.stepDescription}>Tell us how you invest</Text>

            <Text style={styles.label}>Investor Type *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={form.investorType} onValueChange={(v) => updateForm('investorType', v)}
                style={styles.picker} dropdownIconColor={COLORS.primary}>
                <Picker.Item label="Select Type" value="" />
                {investorTypes.map(t => <Picker.Item key={t} label={t} value={t} />)}
              </Picker>
            </View>

            <Text style={styles.label}>Check Size Range *</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={form.checkSizeRange} onValueChange={(v) => updateForm('checkSizeRange', v)}
                style={styles.picker} dropdownIconColor={COLORS.primary}>
                <Picker.Item label="Select Range" value="" />
                {checkSizeRanges.map(r => <Picker.Item key={r} label={r} value={r} />)}
              </Picker>
            </View>

            <Text style={styles.label}>Sectors * (select all that apply)</Text>
            <View style={styles.chipContainer}>
              {sectorList.map((s) => (
                <TouchableOpacity key={s}
                  style={[styles.chip, form.sectors.includes(s) && styles.chipSelected]}
                  onPress={() => toggleArray('sectors', s)}>
                  <Text style={[styles.chipText, form.sectors.includes(s) && styles.chipTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Stage Preference</Text>
            <View style={styles.chipContainer}>
              {stages.map((s) => (
                <TouchableOpacity key={s}
                  style={[styles.chip, form.stagePref.includes(s) && styles.chipSelected]}
                  onPress={() => toggleArray('stagePref', s)}>
                  <Text style={[styles.chipText, form.stagePref.includes(s) && styles.chipTextSelected]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Geographic Focus</Text>
            <View style={styles.chipContainer}>
              {regions.map((r) => (
                <TouchableOpacity key={r}
                  style={[styles.chip, form.geoFocus.includes(r) && styles.chipSelected]}
                  onPress={() => toggleArray('geoFocus', r)}>
                  <Text style={[styles.chipText, form.geoFocus.includes(r) && styles.chipTextSelected]}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Preferences</Text>
            <Text style={styles.stepDescription}>Share your investment approach</Text>
            <TextInput style={[styles.input, styles.textArea]}
              placeholder="What are you actively looking for right now?"
              placeholderTextColor={COLORS.textLight} multiline numberOfLines={4}
              value={form.lookingForText} onChangeText={(v) => updateForm('lookingForText', v)} />
            <Text style={styles.label}>Deals reviewed per month</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={form.dealsPerMonth} onValueChange={(v) => updateForm('dealsPerMonth', v)}
                style={styles.picker} dropdownIconColor={COLORS.primary}>
                <Picker.Item label="Select" value="" />
                {['1–5', '5–15', '15–30', '30+'].map(v => <Picker.Item key={v} label={v} value={v} />)}
              </Picker>
            </View>
            <Text style={styles.label}>Capital deployment status</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={form.capitalStatus} onValueChange={(v) => updateForm('capitalStatus', v)}
                style={styles.picker} dropdownIconColor={COLORS.primary}>
                <Picker.Item label="Select" value="" />
                {[
                  'Actively deploying',
                  'Deploying in 3–6 months',
                  'Just exploring',
                ].map(v => <Picker.Item key={v} label={v} value={v} />)}
              </Picker>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Agreements</Text>
            <Text style={styles.stepDescription}>Please review and agree to the following</Text>
            <View style={styles.agreementBox}>
              {[
                'I agree to the Terms of Service',
                'I confirm I am an accredited investor where required by law',
              ].map((t) => (
                <View key={t} style={styles.agreementItem}>
                  <View style={styles.checkIcon}><Text style={styles.checkMark}>✓</Text></View>
                  <Text style={styles.agreementText}>{t}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.note}>
              Investors get immediate dashboard access after signup.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((stepNum) => (
        <View key={stepNum} style={styles.stepItem}>
          <View style={[
            styles.stepCircle,
            stepNum === step && styles.stepCircleActive,
            stepNum < step  && styles.stepCircleCompleted,
          ]}>
            <Text style={[styles.stepNumber, (stepNum === step || stepNum < step) && styles.stepNumberActive]}>
              {stepNum < step ? '✓' : stepNum}
            </Text>
          </View>
          {stepNum < 4 && (
            <View style={[styles.stepLine, stepNum < step && styles.stepLineCompleted]} />
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investor Signup</Text>
        <Text style={styles.headerSubtitle}>Step {step} of 4</Text>
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
          {!!fillWarning && (
            <TouchableOpacity onPress={() => setFillWarning('')} style={styles.fillWarning}>
              <Text style={styles.fillWarningText}>⚠  {fillWarning}  •  tap to dismiss</Text>
            </TouchableOpacity>
          )}
          <Animated.View style={buttonAnimatedStyle}>
            <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {step === 4 ? 'Complete Profile' : 'Continue →'}
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
  header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 16, alignItems: 'center' },
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
  stepLine:          { width: 40, height: 2, backgroundColor: COLORS.border },
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

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    backgroundColor: COLORS.border, marginRight: 8, marginBottom: 8,
  },
  chipSelected: { backgroundColor: COLORS.primary },
  chipText:         { color: COLORS.textLight, fontSize: 13, fontFamily: FONTS.regular },
  chipTextSelected: { color: '#FFFFFF', fontFamily: FONTS.semiBold },

  agreementBox: {
    backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1,
    borderColor: COLORS.border, padding: 18, marginVertical: 18,
  },
  agreementItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  checkIcon: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.success,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  checkMark:     { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  agreementText: { fontFamily: FONTS.regular, fontSize: 15, color: COLORS.text, flex: 1 },
  note: {
    fontFamily: FONTS.regular, fontSize: 13, color: COLORS.textLight,
    fontStyle: 'italic', textAlign: 'center', marginTop: 12,
  },

  buttonRow: {
    flexDirection: 'row', padding: 16, borderTopWidth: 1,
    borderTopColor: COLORS.borderLight, backgroundColor: '#FFFFFF', alignItems: 'flex-end',
  },
  button: {
    paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  backButton:     { backgroundColor: COLORS.border, marginRight: 12, minWidth: 90 },
  backButtonText: { fontFamily: FONTS.semiBold, fontSize: 15, color: COLORS.text },
  nextSide: { flex: 1 },

  fillWarning: {
    backgroundColor: '#FFF8E7', borderWidth: 1, borderColor: COLORS.gold,
    borderRadius: 10, paddingVertical: 8, paddingHorizontal: 12, marginBottom: 8,
  },
  fillWarningText: { fontFamily: FONTS.regular, fontSize: 12, color: '#8B6914', textAlign: 'center' },

  nextButton:     { backgroundColor: COLORS.primary, borderRadius: 12 },
  nextButtonText: { fontFamily: FONTS.semiBold, fontSize: 16, color: '#FFFFFF' },
});

export default InvestorSignupScreen;