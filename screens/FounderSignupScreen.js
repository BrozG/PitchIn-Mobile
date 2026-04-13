import React, { useState, useEffect } from 'react';
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
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const FounderSignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1
    fullName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    country: '',
    // Step 2
    companyName: '',
    website: '',
    industry: '',
    stage: '',
    yearFounded: '',
    teamSize: '',
    coFounders: '',
    // Step 3
    mrr: '',
    mau: '',
    keyMetric: '',
    accelerator: '',
    // Step 4
    amountRaising: '',
    equityOffered: '',
    useOfFunds: '',
    prevFunding: '',
    // Step 5
    pitchDeckUrl: '',
    oneLinePitch: '',
    problemDescription: '',
  });

  // Animation values
  const contentOpacity = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const industries = ['Fintech', 'Healthtech', 'SaaS', 'EdTech', 'Web3', 'DeepTech', 'Consumer', 'Climate', 'Other'];
  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A'];

  const animateStepTransition = (direction, callback) => {
    contentOpacity.value = withTiming(0, { duration: 200 });
    contentTranslateX.value = withTiming(direction === 'next' ? -50 : 50, { duration: 200 });

    setTimeout(() => {
      callback();
      contentTranslateX.value = direction === 'next' ? 50 : -50;
      contentOpacity.value = withTiming(1, { duration: 300 });
      contentTranslateX.value = withTiming(0, { duration: 300 });
    }, 200);
  };

  const handleNext = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Button animation
    buttonScale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );

    if (step < 6) {
      animateStepTransition('next', () => {
        setStep(step + 1);
      });
    } else {
      // Submit
      Alert.alert('Submission', 'Founder profile submitted for review.');
      navigation.navigate('PendingReview');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      // Haptic feedback
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Button animation
      buttonScale.value = withSequence(
        withSpring(0.95, { damping: 15 }),
        withSpring(1, { damping: 15 })
      );

      animateStepTransition('back', () => {
        setStep(step - 1);
      });
    }
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{ translateX: contentTranslateX.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Personal Info</Text>
            <Text style={styles.stepDescription}>
              Tell us about yourself
            </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Full Name" 
              placeholderTextColor={COLORS.textLight}
              value={form.fullName} 
              onChangeText={(v) => updateForm('fullName', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="email-address" 
              value={form.email} 
              onChangeText={(v) => updateForm('email', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Phone with country code" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad" 
              value={form.phone} 
              onChangeText={(v) => updateForm('phone', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="LinkedIn Profile URL" 
              placeholderTextColor={COLORS.textLight}
              value={form.linkedinUrl} 
              onChangeText={(v) => updateForm('linkedinUrl', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Country" 
              placeholderTextColor={COLORS.textLight}
              value={form.country} 
              onChangeText={(v) => updateForm('country', v)} 
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your Company</Text>
            <Text style={styles.stepDescription}>
              Tell us about your startup
            </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Company Name" 
              placeholderTextColor={COLORS.textLight}
              value={form.companyName} 
              onChangeText={(v) => updateForm('companyName', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Website or Landing Page URL" 
              placeholderTextColor={COLORS.textLight}
              value={form.website} 
              onChangeText={(v) => updateForm('website', v)} 
            />
            <Text style={styles.label}>Industry</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={form.industry} 
                onValueChange={(v) => updateForm('industry', v)} 
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Select Industry" value="" />
                {industries.map((ind) => <Picker.Item key={ind} label={ind} value={ind} />)}
              </Picker>
            </View>
            <Text style={styles.label}>Funding Stage</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={form.stage} 
                onValueChange={(v) => updateForm('stage', v)} 
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Select Stage" value="" />
                {stages.map((s) => <Picker.Item key={s} label={s} value={s} />)}
              </Picker>
            </View>
            <TextInput 
              style={styles.input} 
              placeholder="Year Founded" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.yearFounded} 
              onChangeText={(v) => updateForm('yearFounded', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Team Size" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.teamSize} 
              onChangeText={(v) => updateForm('teamSize', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Number of Co-founders" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.coFounders} 
              onChangeText={(v) => updateForm('coFounders', v)} 
            />
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Traction</Text>
            <Text style={styles.stepDescription}>
              Show us your progress
            </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Monthly Revenue (USD)" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.mrr} 
              onChangeText={(v) => updateForm('mrr', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Monthly Active Users" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.mau} 
              onChangeText={(v) => updateForm('mau', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Key Metric (e.g., 10,000 downloads)" 
              placeholderTextColor={COLORS.textLight}
              value={form.keyMetric} 
              onChangeText={(v) => updateForm('keyMetric', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Accelerator / YC Batch / Press" 
              placeholderTextColor={COLORS.textLight}
              value={form.accelerator} 
              onChangeText={(v) => updateForm('accelerator', v)} 
            />
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Funding Ask</Text>
            <Text style={styles.stepDescription}>
              What you're looking for
            </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Amount Raising (USD)" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.amountRaising} 
              onChangeText={(v) => updateForm('amountRaising', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Equity Offered (%)" 
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric" 
              value={form.equityOffered} 
              onChangeText={(v) => updateForm('equityOffered', v)} 
            />
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="What the funds will be used for" 
              placeholderTextColor={COLORS.textLight}
              multiline 
              numberOfLines={4} 
              value={form.useOfFunds} 
              onChangeText={(v) => updateForm('useOfFunds', v)} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Previous Funding (optional)" 
              placeholderTextColor={COLORS.textLight}
              value={form.prevFunding} 
              onChangeText={(v) => updateForm('prevFunding', v)} 
            />
          </View>
        );
      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Proof</Text>
            <Text style={styles.stepDescription}>
              Share your pitch materials
            </Text>
            <TextInput 
              style={styles.input} 
              placeholder="Pitch Deck URL (PDF)" 
              placeholderTextColor={COLORS.textLight}
              value={form.pitchDeckUrl} 
              onChangeText={(v) => updateForm('pitchDeckUrl', v)} 
            />
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="One-line pitch (150 chars)" 
              placeholderTextColor={COLORS.textLight}
              multiline 
              numberOfLines={2} 
              value={form.oneLinePitch} 
              onChangeText={(v) => updateForm('oneLinePitch', v)} 
            />
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe the problem you solve" 
              placeholderTextColor={COLORS.textLight}
              multiline 
              numberOfLines={5} 
              value={form.problemDescription} 
              onChangeText={(v) => updateForm('problemDescription', v)} 
            />
          </View>
        );
      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Agree</Text>
            <Text style={styles.stepDescription}>
              Please review your information
            </Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Name: <Text style={styles.summaryValue}>{form.fullName}</Text></Text>
              <Text style={styles.summaryLabel}>Company: <Text style={styles.summaryValue}>{form.companyName}</Text></Text>
              <Text style={styles.summaryLabel}>Industry: <Text style={styles.summaryValue}>{form.industry}</Text></Text>
              <Text style={styles.summaryLabel}>Amount Raising: <Text style={styles.summaryValue}>${form.amountRaising}</Text></Text>
              <Text style={styles.summaryLabel}>One-line Pitch: <Text style={styles.summaryValue}>{form.oneLinePitch}</Text></Text>
            </View>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxItem}>
                <View style={styles.checkboxIcon}>✓</View>
                <Text style={styles.checkboxText}>I agree to Terms of Service</Text>
              </View>
              <View style={styles.checkboxItem}>
                <View style={styles.checkboxIcon}>✓</View>
                <Text style={styles.checkboxText}>All information is truthful</Text>
              </View>
              <View style={styles.checkboxItem}>
                <View style={styles.checkboxIcon}>✓</View>
                <Text style={styles.checkboxText}>I understand consequences of false info</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const renderStepIndicator = () => {
    const steps = [1, 2, 3, 4, 5, 6];
    return (
      <View style={styles.stepIndicator}>
        {steps.map((stepNum) => (
          <View key={stepNum} style={styles.stepItem}>
            <View 
              style={[
                styles.stepCircle,
                stepNum === step && styles.stepCircleActive,
                stepNum < step && styles.stepCircleCompleted,
              ]}
            >
              <Text 
                style={[
                  styles.stepNumber,
                  (stepNum === step || stepNum < step) && styles.stepNumberActive,
                ]}
              >
                {stepNum}
              </Text>
            </View>
            {stepNum < 6 && (
              <View 
                style={[
                  styles.stepLine,
                  stepNum < step && styles.stepLineCompleted,
                ]} 
              />
            )}
          </View>
        ))}
      </View>
    );
  };

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
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={handleBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        <Animated.View style={[styles.nextButtonContainer, buttonAnimatedStyle]}>
          <TouchableOpacity 
            style={[styles.button, styles.nextButton]} 
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {step === 6 ? 'Submit Application' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.playfairBold,
    fontSize: 32,
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
  },
  stepCircleCompleted: {
    backgroundColor: COLORS.success,
  },
  stepNumber: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.textLight,
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.border,
  },
  stepLineCompleted: {
    backgroundColor: COLORS.success,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentWrapper: {
    paddingBottom: 40,
  },
  stepContainer: {
    paddingTop: 20,
  },
  stepTitle: {
    fontFamily: FONTS.playfairBold,
    fontSize: 28,
    color: COLORS.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  label: {
    color: COLORS.text,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    color: COLORS.text,
    height: 50,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 24,
  },
  summaryLabel: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  summaryValue: {
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
  checkboxContainer: {
    marginTop: 24,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: '#FFFFFF',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  backButton: {
    backgroundColor: COLORS.border,
    marginRight: 12,
  },
  nextButtonContainer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
  },
  backButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.text,
  },
  nextButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default FounderSignupScreen;
