import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import FounderSignupScreen from './screens/FounderSignupScreen';
import PendingReviewScreen from './screens/PendingReviewScreen';
import InvestorSignupScreen from './screens/InvestorSignupScreen';
import PaymentScreen from './screens/PaymentScreen';
import InvestorDiscoveryScreen from './screens/InvestorDiscoveryScreen';
import MatchRequestScreen from './screens/MatchRequestScreen';
import PricingScreen from './screens/PricingScreen';
import DealRoomScreen from './screens/DealRoomScreen';
import NotificationsScreen from './screens/NotificationsScreen';

// Placeholder screens
function SplashScreen({ navigation }) {
  setTimeout(() => {
    navigation.replace('Onboarding');
  }, 1800);
  return (
    <View style={styles.splashContainer}>
      <Text style={styles.splashLogo}>Pitch In</Text>
      <Text style={styles.splashTagline}>Where the right money meets the right idea.</Text>
    </View>
  );
}

function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.onboardingTitle}>Handpicked startups. Real investors.</Text>
      <Text style={styles.onboardingSubtitle}>Swipe to continue</Text>
    </View>
  );
}

function RoleSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.roleTitle}>I am a...</Text>
      <View style={styles.roleButtons}>
        <TouchableOpacity style={styles.roleButton} onPress={() => navigation.navigate('FounderSignup')}>
          <Text style={styles.roleButtonText}>Founder</Text>
          <Text style={styles.roleButtonSubtext}>Looking for investment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.roleButton} onPress={() => navigation.navigate('InvestorSignup')}>
          <Text style={styles.roleButtonText}>Investor</Text>
          <Text style={styles.roleButtonSubtext}>Looking for deals</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="FounderSignup" component={FounderSignupScreen} />
        <Stack.Screen name="PendingReview" component={PendingReviewScreen} />
        <Stack.Screen name="InvestorSignup" component={InvestorSignupScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="InvestorDiscovery" component={InvestorDiscoveryScreen} />
        <Stack.Screen name="MatchRequest" component={MatchRequestScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />
        <Stack.Screen name="DealRoom" component={DealRoomScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#080C14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#C9A84C',
    fontFamily: 'ClashDisplay-Bold',
  },
  splashTagline: {
    fontSize: 16,
    color: '#8A94A6',
    marginTop: 12,
    fontFamily: 'DM Sans',
  },
  container: {
    flex: 1,
    backgroundColor: '#080C14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  onboardingTitle: {
    fontSize: 32,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    textAlign: 'center',
  },
  onboardingSubtitle: {
    fontSize: 18,
    color: '#8A94A6',
    marginTop: 16,
  },
  roleTitle: {
    fontSize: 40,
    color: '#F0F4FF',
    fontFamily: 'ClashDisplay-Bold',
    marginBottom: 48,
  },
  roleButtons: {
    width: '100%',
    gap: 24,
  },
  roleButton: {
    backgroundColor: '#0F1623',
    borderWidth: 2,
    borderColor: '#1E2D45',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
  roleButtonText: {
    fontSize: 32,
    color: '#C9A84C',
    fontFamily: 'ClashDisplay-Bold',
  },
  roleButtonSubtext: {
    fontSize: 18,
    color: '#8A94A6',
    marginTop: 8,
  },
});
