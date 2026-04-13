import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { CreditCard, Globe, Smartphone, CheckCircle } from 'lucide-react-native';

const PaymentScreen = ({ navigation, route }) => {
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  const amount = route?.params?.amount || 25;
  const type = route?.params?.type || 'founder_fee';

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { id: 'upi', label: 'UPI (India)', icon: Smartphone },
    { id: 'netbanking', label: 'NetBanking', icon: Globe },
    { id: 'applepay', label: 'Apple Pay', icon: CheckCircle, platform: 'ios' },
    { id: 'googlepay', label: 'Google Pay', icon: CheckCircle, platform: 'android' },
  ];

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('Dashboard') }]
      );
    }, 2000);
  };

  const filteredMethods = paymentMethods.filter(method => {
    if (method.platform === 'ios' && Platform.OS !== 'ios') return false;
    if (method.platform === 'android' && Platform.OS !== 'android') return false;
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Payment</Text>
          <Text style={styles.subtitle}>Less than a coffee. Once.</Text>
        </View>

        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>${amount}.00 USD</Text>
          <Text style={styles.note}>
            This fee removes spammers and proves your seriousness to investors.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {filteredMethods.map((method) => {
            const Icon = method.icon;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  selectedMethod === method.id && styles.methodCardSelected,
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Icon size={24} color={selectedMethod === method.id ? '#C9A84C' : '#8A94A6'} />
                <Text style={[styles.methodLabel, selectedMethod === method.id && styles.methodLabelSelected]}>
                  {method.label}
                </Text>
                <View style={[styles.radioOuter, selectedMethod === method.id && styles.radioOuterSelected]}>
                  {selectedMethod === method.id && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Security</Text>
          <View style={styles.securityRow}>
            <Text style={styles.securityText}>🔒 Encrypted SSL</Text>
            <Text style={styles.securityText}>✅ PCI‑DSS Compliant</Text>
            <Text style={styles.securityText}>🛡️ 3D Secure</Text>
          </View>
          <Text style={styles.securityNote}>
            Your payment details are securely processed by {Platform.OS === 'ios' ? 'Apple' : 'Razorpay/Stripe'}.
            Pitch In never stores your card information.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processing...' : `Pay $${amount}.00`}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Investors on Pitch In have deployed $2.4M+ to founders like you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8A94A6',
    marginTop: 8,
    textAlign: 'center',
  },
  amountCard: {
    backgroundColor: '#0F1623',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  amountLabel: {
    color: '#8A94A6',
    fontSize: 16,
  },
  amount: {
    fontSize: 56,
    color: '#C9A84C',
    fontFamily: 'ClashDisplay-Bold',
    marginVertical: 8,
  },
  note: {
    color: '#8A94A6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#F0F4FF',
    marginBottom: 16,
    fontFamily: 'ClashDisplay-Bold',
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1623',
    borderWidth: 1,
    borderColor: '#1E2D45',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  methodCardSelected: {
    borderColor: '#C9A84C',
    backgroundColor: '#1A2433',
  },
  methodLabel: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
    color: '#F0F4FF',
  },
  methodLabelSelected: {
    color: '#C9A84C',
    fontWeight: '600',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8A94A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#C9A84C',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#C9A84C',
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  securityText: {
    color: '#8A94A6',
    fontSize: 14,
  },
  securityNote: {
    color: '#8A94A6',
    fontSize: 14,
    lineHeight: 20,
  },
  payButton: {
    backgroundColor: '#C9A84C',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  payButtonDisabled: {
    backgroundColor: '#3A3A3A',
  },
  payButtonText: {
    color: '#080C14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#8A94A6',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PaymentScreen;