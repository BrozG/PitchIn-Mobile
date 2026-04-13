import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { Bell, CheckCircle, XCircle, Zap, Users, DollarSign, Clock } from 'lottie-react-native';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'match',
      title: 'Match Accepted!',
      description: 'Alex Johnson accepted your match request. Deal Room is now open.',
      time: '10 min ago',
      read: false,
      icon: CheckCircle,
      color: '#22C55E',
    },
    {
      id: '2',
      type: 'new_founder',
      title: 'New Founder Added',
      description: '3 new founders added today — Partner investors got 48hr early access.',
      time: '2 hours ago',
      read: false,
      icon: Users,
      color: '#C9A84C',
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Match Request Expiring',
      description: 'Your match request with HealthAI expires in 2 days.',
      time: '1 day ago',
      read: true,
      icon: Clock,
      color: '#EF4444',
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Successful',
      description: 'Your $25 founder fee has been processed. Your profile is now active.',
      time: '2 days ago',
      read: true,
      icon: DollarSign,
      color: '#3B82F6',
    },
    {
      id: '5',
      type: 'upgrade',
      title: 'Upgrade Opportunity',
      description: 'You missed 14 founders this week. Upgrade to never miss a deal.',
      time: '3 days ago',
      read: true,
      icon: Zap,
      color: '#8B5CF6',
    },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotification = (item) => {
    const Icon = item.icon;
    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Icon size={24} color={item.color} />
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationDescription}>{item.description}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount} unread • {notifications.length} total
          </Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
          <Text style={styles.clearButtonText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C9A84C" />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={80} color="#8A94A6" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              You’re all caught up! New match requests and updates will appear here.
            </Text>
          </View>
        ) : (
          notifications.map(renderNotification)
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.footerButtonText}>Notification Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Help')}>
          <Text style={styles.footerButtonText}>Help Center</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D45',
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
  clearButton: {
    backgroundColor: '#1E2D45',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#C9A84C',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 28,
    color: '#F0F4FF',
    marginTop: 24,
    fontFamily: 'ClashDisplay-Bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#8A94A6',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 26,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#0F1623',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E2D45',
  },
  unreadCard: {
    borderColor: '#C9A84C',
    backgroundColor: '#0F1623',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 20,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#C9A84C',
    marginLeft: 8,
  },
  notificationDescription: {
    fontSize: 16,
    color: '#8A94A6',
    lineHeight: 22,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 14,
    color: '#8A94A6',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#0F1623',
    borderTopWidth: 1,
    borderTopColor: '#1E2D45',
    paddingVertical: 20,
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerButtonText: {
    color: '#8A94A6',
    fontSize: 16,
  },
});

export default NotificationsScreen;