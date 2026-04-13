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

  const investorTypes = ['Angel', 'VC', 'Family Office', 'Corporate VC', 'Syndicate', 'Other'];
  const checkSizeRanges = ['Under $25K', '$25K–$100K', '$100K–$500K', '$500K–$2M', '$2M+'];
  const sectors = ['Fintech', 'Healthtech', 'SaaS', 'EdTech', 'Web3', 'DeepTech', 'Consumer', 'Climate', 'Other'];
  const stages = ['Idea', 'Pre-Seed', 'Seed', 'Series A'];
  const regions = ['North America', 'Europe', 'South Asia', 'Southeast Asia', 'Middle East', 'Africa', 'Latin America', 'Global'];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      Alert.alert('Success', 'Investor profile created!');
      navigation.navigate('InvestorDashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View>
            <Text style={styles.stepTitle}>Identity</Text>
            <TextInput style={styles.input} placeholder="Full Name" value={form.fullName} onChangeText={(v) => updateForm('fullName', v)} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={form.email} onChangeText={(v) => updateForm('email', v)} />
            <TextInput style={styles.input} placeholder="LinkedIn URL" value={form.linkedinUrl} onChangeText={(v) => updateForm('linkedinUrl', v)} />
            <TextInput style={styles.input} placeholder="Country" value={form.country} onChangeText={(v) => updateForm('country', v)} />
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.stepTitle}>Investor Profile</Text>
            <Text style={styles.label}>Investor Type</Text>
            <Picker selectedValue={form.investorType} onValueChange={(v) => updateForm('investorType', v)} style={styles.picker}>
              <Picker.Item label="Select Type" value="" />
              {investorTypes.map((type) => <Picker.Item key={type} label={type} value={type} />)}
            </Picker>
            <Text style={styles.label}>Typical Check Size</Text>
            <Picker selectedValue={form.checkSizeRange} onValueChange={(v) => updateForm('checkSizeRange', v)} style={styles.picker}>
              <Picker.Item label="Select Range" value="" />
              {checkSizeRanges.map((range) => <Picker.Item key={range} label={range} value={range} />)}
            </Picker>
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
          <View>
            <Text style={styles.stepTitle}>Preferences</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="What are you actively looking for right now?" multiline numberOfLines={4} value={form.lookingForText} onChangeText={(v) => updateForm('lookingForText', v)} />
            <Text style={styles.label}>How many deals do you review per month?</Text>
            <Picker selectedValue={form.dealsPerMonth} onValueChange={(v) => updateForm('dealsPerMonth', v)} style={styles.picker}>
              <Picker.Item label="Select" value="" />
              <Picker.Item label="1–5" value="1–5" />
              <Picker.Item label="5–15" value="5–15" />
              <Picker.Item label="15–30" value="15–30" />
              <Picker.Item label="30+" value="30+" />
            </Picker>
            <Text style={styles.label}>Capital deployment status</Text>
            <Picker selectedValue={form.capitalStatus} onValueChange={(v) => updateForm('capitalStatus', v)} style={styles.picker}>
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Actively deploying" value="Actively deploying" />
              <Picker.Item label="Deploying in 3–6 months" value="Deploying in 3–6 months" />
              <Picker.Item label="Just exploring" value="Just exploring" />
            </Picker>
          </View>
        );
      case 4:
        return (
          <View>
            <Text style={styles.stepTitle}>Agreements</Text>
            <Text style={styles.summaryText}>Please review and agree to the following:</Text>
            <View style={styles.agreementBox}>
              <Text style={styles.agreementText}>• I agree to the Terms of Service</Text>
              <Text style={styles.agreementText}>• I confirm I am an accredited investor where required by law</Text>
            </View>
            <Text style={styles.note}>Investors get immediate dashboard access after signup.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Investor Signup</Text>
        <Text style={styles.headerSubtitle}>Step {step} of 4</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
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
          <Text style={styles.buttonText}>{step === 4 ? 'Complete' : 'Next'}</Text>
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
    marginBottom: 12,
    fontSize: 16,
    marginTop: 8,
  },
  picker: {
    backgroundColor: '#0F1623',
    color: '#F0F4FF',
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2D45',
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
    backgroundColor: '#1E2D45',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: '#C9A84C',
  },
  chipText: {
    color: '#8A94A6',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#080C14',
    fontWeight: 'bold',
  },
  agreementBox: {
    backgroundColor: '#0F1623',
    padding: 20,
    borderRadius: 12,
    marginVertical: 20,
  },
  agreementText: {
    color: '#F0F4FF',
    fontSize: 16,
    marginBottom: 12,
  },
  note: {
    color: '#8A94A6',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  summaryText: {
    color: '#F0F4FF',
    fontSize: 18,
    marginBottom: 20,
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

export default InvestorSignupScreen;