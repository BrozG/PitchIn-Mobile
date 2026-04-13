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
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const InvestorSignupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1
    fullName: '',
    email: '',
    linkedinUrl: '',
    country: '',
    // Step 2
    investorType: '',
    checkSizeRange: '',
    sectors: [],
    stagePref: [],
    geoFocus: [],
    // Step 3
    lookingForText: '',
    dealsPerMonth: '',
    capitalStatus: '',
  });

  // Animation values
  const contentOpacity = useSharedValue(1);
  const contentTranslateX = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const investorTypes = ['Angel', 'VC', 'Family Office', 'Corporate VC', 'Syndicate', 'Other'];
  const checkSizeRanges = ['Under $25K', '$25K–$100K', '$100K–$500K', '$500K–$2M', '$2M+'];
  const sectors = ['Fintech', 'Healthtech', 'SaaS', 'EdTech', 'Web3', 'DeepTech', 'Consumer', 'Climate', 'Other'];
  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A'];
  const regions = ['North America', 'Europe', 'South Asia', 'Southeast Asia', 'Middle East', 'Africa', 'Latin America', 'Global'];

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

    if (step < 4) {
      animateStepTransition('next', () => {
        setStep(step + 1);
      });
    } else {
      Alert.alert('Success', 'Investor profile created!');
      navigation.navigate('InvestorDiscovery');
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

  const toggleArray = (field, value) => {
    const arr = form[field];
    if (arr.includes(value)) {
      updateForm(field, arr.filter(item => item !== value));
    } else {
      updateForm(field, [...arr, value]);
    }
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
            <Text style={styles.stepTitle}>Identity</Text>
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
              placeholder="LinkedIn URL" 
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
            <Text style={styles.stepTitle}>Investor Profile</Text>
            <Text style={styles.stepDescription}>
              Define your investment preferences
            </Text>
            <Text style={styles.label}>Investor Type</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={form.investorType} 
                onValueChange={(v) => updateForm('investorType', v)} 
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Select Type" value="" />
                {investorTypes.map((type) => <Picker.Item key={type} label={type} value={type} />)}
              </Picker>
            </View>
            <Text style={styles.label}>Typical Check Size</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={form.checkSizeRange} 
                onValueChange={(v) => updateForm('checkSizeRange', v)} 
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Select Range" value="" />
                {checkSizeRanges.map((range) => <Picker.Item key={range} label={range} value={range} />)}
              </Picker>
            </View>
            <Text style={styles.label}>Sectors of Interest (select up to 5)</Text>
            <View style={styles.chipContainer}>
              {sectors.map((sector) => (
                <TouchableOpacity
                  key={sector}
                  style={[styles.chip, form.sectors.includes(sector) && styles.chipSelected]}
                  onPress={() => toggleArray('sectors', sector)}
                >
                  <Text style={[styles.chipText, form.sectors.includes(sector) && styles.chipTextSelected]}>{sector}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Stage Preference</Text>
            <View style={styles.chipContainer}>
              {stages.map((stage) => (
                <TouchableOpacity
                  key={stage}
                  style={[styles.chip, form.stagePref.includes(stage) && styles.chipSelected]}
                  onPress={() => toggleArray('stagePref', stage)}
                >
                  <Text style={[styles.chipText, form.stagePref.includes(stage) && styles.chipTextSelected]}>{stage}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.label}>Geographic Focus</Text>
            <View style={styles.chipContainer}>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[styles.chip, form.geoFocus.includes(region) && styles.chipSelected]}
                  onPress={() => toggleArray('geoFocus', region)}
                >
                  <Text style={[styles.chipText, form.geoFocus.includes(region) && styles.chipTextSelected]}>{region}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Preferences</Text>
            <Text style={styles.stepDescription}>
              Share your investment approach
            </Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="What are you actively looking for right now?" 
              placeholderTextColor={COLORS.textLight}
              multiline 
              numberOfLines={4} 
              value={form.lookingForText} 
              onChangeText={(v) => updateForm('lookingForText', v)} 
            />
            <Text style={styles.label}>How many deals do you review per month?</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={form.dealsPerMonth} 
                onValueChange={(v) => updateForm('dealsPerMonth', v)} 
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="1–5" value="1–5" />
                <Picker.Item label="5–15" value="5–15" />
                <Picker.Item label="15–30" value="15–30" />
                <Picker.Item label="30+" value="30+" />
              </Picker>
            </View>
            <Text style={styles.label}>Capital deployment status</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={form.capitalStatus} 
                onValueChange={(v) => updateForm('capitalStatus', v)} 
                style={styles.picker}
                dropdownIconColor={COLORS.primary}
              >
                <Picker.Item label="Select" value="" />
                <Picker.Item label="Actively deploying" value="Actively deploying" />
                <Picker.Item label="Deploying in 3–6 months" value="Deploying in 3–6 months" />
                <Picker.Item label="Just exploring" value="Just exploring" />
              </Picker>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Agreements</Text>
            <Text style={styles.stepDescription}>
              Please review and agree to the following
            </Text>
            <View style={styles.agreementBox}>
              <View style={styles.agreementItem}>
                <View style={styles.checkIcon}>✓</View>
                <Text style={styles.agreementText}>I agree to the Terms of Service</Text>
              </View>
              <View style={styles.agreementItem}>
                <View style={styles.checkIcon}>✓</View>
                <Text style={styles.agreementText}>I confirm I am an accredited investor where required by law</Text>
              </View>
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

  const renderStepIndicator = () => {
    const steps = [1, 2, 3, 4];
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
            {stepNum < 4 && (
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
              {step === 4 ? 'Complete Profile' : 'Continue'}
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
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONTS.semiBold,
  },
  agreementBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginVertical: 20,
  },
  agreementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agreementText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  note: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
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

export default InvestorSignupScreen;
