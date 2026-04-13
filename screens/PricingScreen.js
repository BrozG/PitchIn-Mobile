import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Crown, Check, Star, Zap, TrendingUp, Users, Target } from 'lottie-react-native';

const { width } = Dimensions.get('window');

const PricingScreen = ({ navigation }) => {
  const [planType, setPlanType] = useState('annual'); // 'monthly' or 'annual'
  const [selectedTier, setSelectedTier] = useState('connector');

  // Animation values
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeIns = useRef([1, 2, 3].map(() => new Animated.Value(0))).current;
  const priceAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for recommended tier
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Stagger fade-in for cards
    fadeIns.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }).start();
    });

    // Price counter animation
    Animated.timing(priceAnim, {
      toValue: 1,
      duration: 800,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, []);

  const tiers = [
    {
      id: 'partner',
      name: 'Partner',
      monthlyPrice: 129,
      annualPrice: 999,
      originalMonthly: 199,
      originalAnnual: 1499,
      color: '#C9A84C',
      badge: 'VERIFIED PARTNER',
      features: [
        'Unlimited founder browsing',
        'Full contact info visible after match',
        'Unlimited messaging',
        'Unlimited Deal Rooms',
        '48‑hour early access to new founders',
        'Verified Partner Investor badge',
        'Dedicated account manager',
      ],
      icon: Crown,
    },
    {
      id: 'connector',
      name: 'Connector',
      monthlyPrice: 49,
      annualPrice: 399,
      originalMonthly: 79,
      originalAnnual: 599,
      color: '#22C55E',
      badge: 'MOST POPULAR',
      features: [
        'Browse up to 25 founders/month',
        'Full profile details',
        '10 intro messages/month',
        'Contact info visible after match',
        '1 active Deal Room at a time',
        'Priority support',
      ],
      icon: Zap,
      recommended: true,
    },
    {
      id: 'explorer',
      name: 'Explorer',
      monthlyPrice: 0,
      annualPrice: 0,
      color: '#8A94A6',
      badge: 'FREE',
      features: [
        '3 founder profiles per week',
        '1 intro note per week (150 chars)',
        'Contact info always hidden',
        'No Deal Room access',
        'Watermarked pitch deck previews',
        'Community support',
      ],
      icon: Target,
    },
  ];

  const getPrice = (tier) => {
    const price = planType === 'annual' ? tier.annualPrice : tier.monthlyPrice;
    const original = planType === 'annual' ? tier.originalAnnual : tier.originalMonthly;
    return { price, original };
  };

  const handleSelectTier = (tierId) => {
    setSelectedTier(tierId);
    // Navigate to payment or subscription
    navigation.navigate('Payment', { tier: tierId, planType });
  };

  const renderTierCard = (tier, index) => {
    const { price, original } = getPrice(tier);
    const animatedPrice = priceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [price + 20, price],
    });

    return (
      <Animated.View
        key={tier.id}
        style={[
          styles.tierCard,
          tier.recommended && styles.recommendedCard,
          { opacity: fadeIns[index], transform: [{ translateY: fadeIns[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }) }] },
        ]}
      >
        {tier.recommended && (
          <Animated.View style={[styles.recommendedBadge, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.recommendedBadgeText}>{tier.badge}</Text>
          </Animated.View>
        )}

        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: tier.color + '20' }]}>
            <tier.icon size={32} color={tier.color} />
          </View>
          <Text style={styles.tierName}>{tier.name}</Text>
          {!tier.recommended && <Text style={[styles.badge, { backgroundColor: tier.color + '20', color: tier.color }]}>{tier.badge}</Text>}
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceRow}>
            <Text style={styles.currency}>$</Text>
            <Animated.Text style={[styles.price, { color: tier.color }]}>
              {animatedPrice.interpolate({
                inputRange: [0, 1000],
                outputRange: ['0', Math.round(animatedPrice.__getValue()).toString()],
              })}
            </Animated.Text>
            <Text style={styles.period}>/{planType === 'annual' ? 'year' : 'month'}</Text>
          </View>
          {original && original > price && (
            <Animated.View style={[styles.originalPrice, { opacity: priceAnim }]}>
              <Text style={styles.originalPriceText}>${original}</Text>
            </Animated.View>
          )}
          {planType === 'annual' && (
            <Text style={styles.savings}>
              Save ${tier.originalAnnual - tier.annualPrice} · Just ${(tier.annualPrice / 12).toFixed(2)}/month
            </Text>
          )}
        </View>

        <View style={styles.features}>
          {tier.features.map((feature, idx) => (
            <View key={idx} style={styles.featureRow}>
              <Check size={20} color={tier.color} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.selectButton,
            { backgroundColor: tier.color },
            selectedTier === tier.id && styles.selectedButton,
          ]}
          onPress={() => handleSelectTier(tier.id)}
        >
          <Text style={styles.selectButtonText}>
            {tier.id === 'explorer' ? 'Get Started' : 'Choose Plan'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>Invest in your dealflow. Cancel anytime.</Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Monthly</Text>
          <TouchableOpacity
            style={styles.toggle}
            onPress={() => setPlanType(planType === 'monthly' ? 'annual' : 'monthly')}
          >
            <View style={[styles.toggleTrack, planType === 'annual' && styles.toggleTrackActive]}>
              <Animated.View
                style={[
                  styles.toggleThumb,
                  planType === 'annual' && styles.toggleThumbAnnual,
                ]}
              />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.toggleLabel}>Annual</Text>
            <Text style={styles.toggleSave}>Save up to 35%</Text>
          </View>
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <View style={styles.proofItem}>
            <TrendingUp size={24} color="#C9A84C" />
            <Text style={styles.proofText}>$2.4M+ raised</Text>
          </View>
          <View style={styles.proofItem}>
            <Users size={24} color="#C9A84C" />
            <Text style={styles.proofText}>340+ active investors</Text>
          </View>
          <View style={styles.proofItem}>
            <Star size={24} color="#C9A84C" />
            <Text style={styles.proofText}>127 deals closed</Text>
          </View>
        </View>

        {/* Urgency Banner */}
        <Animated.View style={[styles.urgencyBanner, { opacity: fadeIns[0] }]}>
          <Text style={styles.urgencyText}>
            🔥 Early Adopter Pricing — Connector at $49 locks in forever. Price increases to $79 on June 12, 2026.
          </Text>
        </Animated.View>

        {/* Tier Cards */}
        <View style={styles.tiersContainer}>
          {tiers.map(renderTierCard)}
        </View>

        {/* FAQ */}
        <View style={styles.faq}>
          <Text style={styles.faqTitle}>Common Questions</Text>
          <Text style={styles.faqItem}>• Can I switch plans later? → Yes, anytime.</Text>
          <Text style={styles.faqItem}>• Is there a commitment? → No, cancel anytime.</Text>
          <Text style={styles.faqItem}>• Do you offer refunds? → 14‑day money‑back guarantee.</Text>
          <Text style={styles.faqItem}>• Are there hidden fees? → No, all fees are transparent.</Text>
        </View>
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
    paddingBottom: 60,
  },
  header: {
    alignItems: 'center',
    padding: 32,
  },
  headerTitle: {
    fontSize: 40,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#8A94A6',
    marginTop: 8,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  toggleLabel: {
    fontSize: 18,
    color: '#F0F4FF',
    marginHorizontal: 16,
  },
  toggle: {
    padding: 10,
  },
  toggleTrack: {
    width: 60,
    height: 32,
    backgroundColor: '#1E2D45',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  toggleTrackActive: {
    backgroundColor: '#C9A84C',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
  },
  toggleThumbAnnual: {
    transform: [{ translateX: 28 }],
  },
  toggleSave: {
    color: '#22C55E',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  socialProof: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 24,
    marginBottom: 24,
  },
  proofItem: {
    alignItems: 'center',
  },
  proofText: {
    color: '#8A94A6',
    fontSize: 14,
    marginTop: 8,
  },
  urgencyBanner: {
    backgroundColor: '#C9A84C20',
    borderWidth: 1,
    borderColor: '#C9A84C',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  urgencyText: {
    color: '#C9A84C',
    fontSize: 16,
    textAlign: 'center',
  },
  tiersContainer: {
    paddingHorizontal: 20,
  },
  tierCard: {
    backgroundColor: '#0F1623',
    borderRadius: 28,
    padding: 28,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1E2D45',
    position: 'relative',
  },
  recommendedCard: {
    borderColor: '#22C55E',
    borderWidth: 2,
    backgroundColor: '#0F1623',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -16,
    alignSelf: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recommendedBadgeText: {
    color: '#080C14',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tierName: {
    fontSize: 32,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 28,
    color: '#8A94A6',
    marginRight: 4,
  },
  price: {
    fontSize: 64,
    fontFamily: 'ClashDisplay-Bold',
  },
  period: {
    fontSize: 20,
    color: '#8A94A6',
    marginLeft: 8,
  },
  originalPrice: {
    marginTop: 8,
  },
  originalPriceText: {
    fontSize: 24,
    color: '#8A94A6',
    textDecorationLine: 'line-through',
  },
  savings: {
    color: '#22C55E',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '600',
  },
  features: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#8A94A6',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  selectButton: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  selectedButton: {
    borderWidth: 3,
    borderColor: '#F0F4FF',
  },
  selectButtonText: {
    color: '#080C14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  faq: {
    padding: 32,
    backgroundColor: '#0F1623',
    marginHorizontal: 20,
    borderRadius: 24,
    marginTop: 24,
  },
  faqTitle: {
    fontSize: 24,
    color: '#F0F4FF',
    marginBottom: 16,
    fontFamily: 'ClashDisplay-Bold',
  },
  faqItem: {
    color: '#8A94A6',
    fontSize: 16,
    marginBottom: 12,
  },
});

export default PricingScreen;