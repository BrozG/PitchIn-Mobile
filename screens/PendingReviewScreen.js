import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import LottieView from 'lottie-react-native';

const PendingReviewScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <LottieView
          source={require('../assets/hourglass.json')} // placeholder
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.heading}>You're in the queue</Text>
        <Text style={styles.subtext}>
          Our team handpicks founders. We'll email you within 48 hours.
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PENDING REVIEW</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  animation: {
    width: 200,
    height: 200,
  },
  heading: {
    fontSize: 32,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    marginTop: 30,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    color: '#8A94A6',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
  },
  badge: {
    backgroundColor: '#C9A84C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 30,
  },
  badgeText: {
    color: '#080C14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PendingReviewScreen;