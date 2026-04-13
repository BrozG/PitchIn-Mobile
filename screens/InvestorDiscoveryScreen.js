import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import FounderCard from '../components/FounderCard';
import { Lock, TrendingUp, AlertCircle, Crown } from 'lucide-react-native';

const InvestorDiscoveryScreen = ({ navigation }) => {
  const [founders, setFounders] = useState([
    {
      id: '1',
      companyName: 'TechStart Inc',
      industry: 'Fintech',
      stage: 'Seed',
      amountRaising: 500000,
      oneLinePitch: 'Revolutionizing payments for SMEs with AI‑powered fraud detection.',
      matchScore: 85,
      viewed: false,
    },
    {
      id: '2',
      companyName: 'HealthAI',
      industry: 'Healthtech',
      stage: 'Series A',
      amountRaising: 2000000,
      oneLinePitch: 'AI‑powered diagnostics platform reducing misdiagnosis by 40%.',
      matchScore: 72,
      viewed: false,
    },
    {
      id: '3',
      companyName: 'EduFlow',
      industry: 'EdTech',
      stage: 'Pre‑Seed',
      amountRaising: 150000,
      oneLinePitch: 'Personalized learning paths for K‑12 using adaptive algorithms.',
      matchScore: 91,
      viewed: false,
    },
    {
      id: '4',
      companyName: 'ClimateGrid',
      industry: 'Climate',
      stage: 'Seed',
      amountRaising: 800000,
      oneLinePitch: 'Carbon tracking and offset platform for enterprises.',
      matchScore: 68,
      viewed: false,
    },
  ]);
  const [tier, setTier] = useState('free'); // free, connector, partner
  const [profilesViewed, setProfilesViewed] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const viewed = founders.filter(f => f.viewed).length;
    setProfilesViewed(viewed);
    if (tier === 'free' && viewed >= 3) {
      setLimitReached(true);
    }
  }, [founders]);

  const handleSwipeLeft = (founder) => {
    Alert.alert('Passed', `You passed on ${founder.companyName}`);
    // Remove from list or mark as passed
    setFounders(prev => prev.filter(f => f.id !== founder.id));
  };

  const handleSwipeRight = (founder) => {
    Alert.alert('Saved', `Saved ${founder.companyName} to your list`);
    // Save logic
  };

  const handleTap = (founder) => {
    if (limitReached && tier === 'free') {
      Alert.alert(
        'Limit Reached',
        'You have viewed 3 profiles this week. Upgrade to never miss a deal.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => navigation.navigate('Pricing') },
        ]
      );
      return;
    }
    navigation.navigate('FounderProfile', { founder });
  };

  const renderRightActions = (progress, dragX, founder) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => handleSwipeLeft(founder)}>
        <Animated.View style={[styles.swipeAction, styles.swipePass, { transform: [{ scale }] }]}>
          <Text style={styles.swipeActionText}>Pass</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress, dragX, founder) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={() => handleSwipeRight(founder)}>
        <Animated.View style={[styles.swipeAction, styles.swipeSave, { transform: [{ scale }] }]}>
          <Text style={styles.swipeActionText}>Save</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover</Text>
          <Text style={styles.headerSubtitle}>Swipe left to pass, right to save</Text>
        </View>
        <TouchableOpacity style={styles.upgradeBadge} onPress={() => navigation.navigate('Pricing')}>
          <Crown size={20} color="#C9A84C" />
          <Text style={styles.upgradeText}>{tier === 'free' ? 'Upgrade' : tier}</Text>
        </TouchableOpacity>
      </View>

      {/* Free tier limit indicator */}
      {tier === 'free' && (
        <View style={styles.limitCard}>
          <View style={styles.limitHeader}>
            <Lock size={20} color="#EF4444" />
            <Text style={styles.limitTitle}>Free Tier Limit</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(profilesViewed / 3) * 100}%` }]} />
          </View>
          <Text style={styles.limitText}>
            {profilesViewed}/3 profiles viewed this week • Resets in 4 days
          </Text>
          {limitReached && (
            <View style={styles.limitAlert}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.limitAlertText}>
                You missed 14 founders this week. Upgrade to never miss a deal.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Founder Cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {founders.map((founder) => (
          <Swipeable
            key={founder.id}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, founder)}
            renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, founder)}
            onSwipeableRightOpen={() => handleSwipeRight(founder)}
            onSwipeableLeftOpen={() => handleSwipeLeft(founder)}
          >
            <FounderCard
              founder={founder}
              tier={tier}
              onSwipeLeft={() => handleSwipeLeft(founder)}
              onSwipeRight={() => handleSwipeRight(founder)}
              onTap={() => handleTap(founder)}
            />
          </Swipeable>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Text style={styles.navButtonText}>Discover</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Saved')}>
          <Text style={styles.navButtonText}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Matches')}>
          <Text style={styles.navButtonText}>Matches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('DealRooms')}>
          <Text style={styles.navButtonText}>Deal Rooms</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8A94A6',
    marginTop: 4,
  },
  upgradeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2D45',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  upgradeText: {
    color: '#C9A84C',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  limitCard: {
    backgroundColor: '#1E2D45',
    marginHorizontal: 24,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  limitTitle: {
    color: '#EF4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#3A3A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  limitText: {
    color: '#8A94A6',
    fontSize: 14,
    marginTop: 8,
  },
  limitAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#EF444420',
    borderRadius: 12,
  },
  limitAlertText: {
    color: '#EF4444',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    borderRadius: 24,
    marginVertical: 12,
  },
  swipePass: {
    backgroundColor: '#EF4444',
  },
  swipeSave: {
    backgroundColor: '#22C55E',
  },
  swipeActionText: {
    color: '#080C14',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0F1623',
    borderTopWidth: 1,
    borderTopColor: '#1E2D45',
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  navButtonText: {
    color: '#8A94A6',
    fontSize: 16,
  },
});

export default InvestorDiscoveryScreen;