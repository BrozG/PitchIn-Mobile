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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

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

  const industries = ['Fintech', 'Healthtech', 'SaaS', 'EdTech', 'Web3', 'DeepTech', 'Consumer', 'Climate', 'Other'];
  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A'];

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      // Submit
      Alert.alert('Submission', 'Founder profile submitted for review.');
      navigation.navigate('PendingReview');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateForm = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Personal Info</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={form.fullName} onChangeText={(v) => updateForm('fullName', v)} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={(v) => updateForm('email', v)} />
            <TextInput style={styles.input} placeholder="Phone with country code" keyboardType="phone-pad" value={form.phone} onChangeText={(v) => updateForm('phone', v)} />
            <TextInput style={styles.input} placeholder="LinkedIn Profile URL" value={form.linkedinUrl} onChangeText={(v) => updateForm('linkedinUrl', v)} />
            <TextInput style={styles.input} placeholder="Country" value={form.country} onChangeText={(v) => updateForm('country', v)} />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Your Company</Text>
            <TextInput style={styles.input} placeholder="Company Name" value={form.companyName} onChangeText={(v) => updateForm('companyName', v)} />
            <TextInput style={styles.input} placeholder="Website or Landing Page URL" value={form.website} onChangeText={(v) => updateForm('website', v)} />
            <Text style={styles.label}>Industry</Text>
            <Picker selectedValue={form.industry} onValueChange={(v) => updateForm('industry', v)} style={styles.picker}>
              <Picker.Item label="Select Industry" value="" />
              {industries.map((ind) => <Picker.Item key={ind} label={ind} value={ind} />)}
            </Picker>
            <Text style={styles.label}>Funding Stage</Text>
            <Picker selectedValue={form.stage} onValueChange={(v) => updateForm('stage', v)} style={styles.picker}>
              <Picker.Item label="Select Stage" value="" />
              {stages.map((s) => <Picker.Item key={s} label={s} value={s} />)}
            </Picker>
            <TextInput style={styles.input} placeholder="Year Founded" keyboardType="numeric" value={form.yearFounded} onChangeText={(v) => updateForm('yearFounded', v)} />
            <TextInput style={styles.input} placeholder="Team Size" keyboardType="numeric" value={form.teamSize} onChangeText={(v) => updateForm('teamSize', v)} />
            <TextInput style={styles.input} placeholder="Number of Co-founders" keyboardType="numeric" value={form.coFounders} onChangeText={(v) => updateForm('coFounders', v)} />
          </View>
        );
      case 3:
        return (
          <View>
            <Text style={styles.stepTitle}>Traction</Text>
            <TextInput style={styles.input} placeholder="Monthly Revenue (USD)" keyboardType="numeric" value={form.mrr} onChangeText={(v) => updateForm('mrr', v)} />
            <TextInput style={styles.input} placeholder="Monthly Active Users" keyboardType="numeric" value={form.mau} onChangeText={(v) => updateForm('mau', v)} />
            <TextInput style={styles.input} placeholder="Key Metric (e.g., 10,000 downloads)" value={form.keyMetric} onChangeText={(v) => updateForm('keyMetric', v)} />
            <TextInput style={styles.input} placeholder="Accelerator / YC Batch / Press" value={form.accelerator} onChangeText={(v) => updateForm('accelerator', v)} />
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Funding Ask</Text>
            <TextInput style={styles.input} placeholder="Amount Raising (USD)" keyboardType="numeric" value={form.amountRaising} onChangeText={(v) => updateForm('amountRaising', v)} />
            <TextInput style={styles.input} placeholder="Equity Offered (%)" keyboardType="numeric" value={form.equityOffered} onChangeText={(v) => updateForm('equityOffered', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="What the funds will be used for" multiline numberOfLines={4} value={form.useOfFunds} onChangeText={(v) => updateForm('useOfFunds', v)} />
            <TextInput style={styles.input} placeholder="Previous Funding (optional)" value={form.prevFunding} onChangeText={(v) => updateForm('prevFunding', v)} />
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.stepTitle}>Proof</Text>
            <TextInput style={styles.input} placeholder="Pitch Deck URL (PDF)" value={form.pitchDeckUrl} onChangeText={(v) => updateForm('pitchDeckUrl', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="One-line pitch (150 chars)" multiline numberOfLines={2} value={form.oneLinePitch} onChangeText={(v) => updateForm('oneLinePitch', v)} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe the problem you solve" multiline numberOfLines={5} value={form.problemDescription} onChangeText={(v) => updateForm('problemDescription', v)} />
          </View>
        );
      case 6:
        return (
          <View>
            <Text style={styles.stepTitle}>Review & Agree</Text>
            <Text style={styles.summaryText}>Please review your information.</Text>
            <Text style={styles.summaryLabel}>Name: {form.fullName}</Text>
            <Text style={styles.summaryLabel}>Company: {form.companyName}</Text>
            <Text style={styles.summaryLabel}>Industry: {form.industry}</Text>
            <Text style={styles.summaryLabel}>Amount Raising: ${form.amountRaising}</Text>
            <Text style={styles.summaryLabel}>One-line Pitch: {form.oneLinePitch}</Text>
            <View style={styles.checkboxContainer}>
              <Text style={styles.checkboxText}>✓ I agree to Terms of Service</Text>
              <Text style={styles.checkboxText}>✓ All information is truthful</Text>
              <Text style={styles.checkboxText}>✓ I understand consequences of false info</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Founder Signup</Text>
        <Text style={styles.headerSubtitle}>Step {step} of 6</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 6) * 100}%` }]} />
      </View>
      <ScrollView style={styles.scrollView}>
        {renderStep()}
      </ScrollView>
      <View style={styles.buttonRow}>
        {step > 1 && (
          <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button, styles.nextButton]} onPress={handleNext}>
          <Text style={styles.buttonText}>{step === 6 ? 'Submit' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8A94A6',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1E2D45',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#C9A84C',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    color: '#F0F4FF',
    marginBottom: 20,
    fontFamily: 'ClashDisplay-Bold',
  },
  input: {
    backgroundColor: '#0F1623',
    borderWidth: 1,
    borderColor: '#1E2D45',
    borderRadius: 12,
    padding: 16,
    color: '#F0F4FF',
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  label: {
    color: '#8A94A6',
    marginBottom: 8,
    fontSize: 14,
  },
  picker: {
    backgroundColor: '#0F1623',
    color: '#F0F4FF',
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  summaryText: {
    color: '#F0F4FF',
    fontSize: 18,
    marginBottom: 20,
  },
  summaryLabel: {
    color: '#8A94A6',
    fontSize: 16,
    marginBottom: 8,
  },
  checkboxContainer: {
    marginTop: 30,
  },
  checkboxText: {
    color: '#22C55E',
    fontSize: 16,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  backButton: {
    backgroundColor: '#1E2D45',
  },
  nextButton: {
    backgroundColor: '#C9A84C',
  },
  buttonText: {
    color: '#080C14',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FounderSignupScreen;