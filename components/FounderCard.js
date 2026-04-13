import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Heart, Lock, Eye, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FounderCard = ({ founder, tier = 'free', onSwipeLeft, onSwipeRight, onTap }) => {
  const [blurred, setBlurred] = useState(tier === 'free' && founder.viewed);
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleTap = () => {
    if (tier === 'free' && !founder.viewed) {
      // Mark as viewed (limit 3 per week)
      founder.viewed = true;
      setBlurred(true);
    }
    onTap && onTap(founder);
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleTap}
        style={styles.touchable}
      >
        <View style={styles.cardInner}>
          {/* Company Header */}
          <View style={styles.header}>
            <Text style={styles.companyName}>{founder.companyName}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#2563eb20' }]}>
                <Text style={[styles.badgeText, { color: '#60a5fa' }]}>{founder.industry}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#05966920' }]}>
                <Text style={[styles.badgeText, { color: '#34d399' }]}>{founder.stage}</Text>
              </View>
            </View>
          </View>

          {/* Amount Raising */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Raising</Text>
            <Text style={styles.amount}>${founder.amountRaising.toLocaleString()}</Text>
          </View>

          {/* One-line Pitch */}
          <Text style={styles.pitch} numberOfLines={2}>
            "{founder.oneLinePitch}"
          </Text>

          {/* Match Score */}
          <View style={styles.matchSection}>
            <TrendingUp size={16} color="#C9A84C" />
            <Text style={styles.matchLabel}>Match Score</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{founder.matchScore}%</Text>
            </View>
          </View>

          {/* Contact Info (blurred for free) */}
          {tier === 'free' && (
            <BlurView intensity={blurred ? 80 : 0} style={styles.blurOverlay}>
              <View style={styles.lockContainer}>
                <Lock size={32} color="#C9A84C" />
                <Text style={styles.lockText}>
                  {blurred ? 'Profile viewed' : 'Upgrade to view contact'}
                </Text>
              </View>
            </BlurView>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={onSwipeLeft}>
              <Text style={styles.actionButtonText}>Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={onSwipeRight}>
              <Heart size={20} color="#080C14" />
              <Text style={styles.actionButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.matchButton]} onPress={() => onTap && onTap(founder)}>
              <Eye size={20} color="#080C14" />
              <Text style={styles.actionButtonText}>Match</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width - 40,
    backgroundColor: '#0F1623',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E2D45',
    marginVertical: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  touchable: {
    flex: 1,
  },
  cardInner: {
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
  companyName: {
    fontSize: 28,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 16,
    color: '#8A94A6',
    marginRight: 8,
  },
  amount: {
    fontSize: 36,
    color: '#C9A84C',
    fontFamily: 'ClashDisplay-Bold',
  },
  pitch: {
    fontSize: 18,
    color: '#8A94A6',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 24,
  },
  matchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  matchLabel: {
    fontSize: 16,
    color: '#8A94A6',
    marginLeft: 8,
    flex: 1,
  },
  scoreCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C9A84C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    color: '#080C14',
    fontSize: 18,
    fontWeight: 'bold',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
  lockContainer: {
    alignItems: 'center',
    padding: 20,
  },
  lockText: {
    color: '#C9A84C',
    fontSize: 18,
    marginTop: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 6,
  },
  passButton: {
    backgroundColor: '#1E2D45',
  },
  saveButton: {
    backgroundColor: '#22C55E',
  },
  matchButton: {
    backgroundColor: '#C9A84C',
  },
  actionButtonText: {
    color: '#080C14',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default FounderCard;