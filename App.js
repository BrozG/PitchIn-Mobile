import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import AppLoading from 'expo-app-loading';

// Import screens
import LoadingScreen from './screens/LoadingScreen';
import AuthScreen from './screens/AuthScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import FounderSignupScreen from './screens/FounderSignupScreen';
import PendingReviewScreen from './screens/PendingReviewScreen';
import InvestorSignupScreen from './screens/InvestorSignupScreen';
import PaymentScreen from './screens/PaymentScreen';
import InvestorDiscoveryScreen from './screens/InvestorDiscoveryScreen';
import MatchRequestScreen from './screens/MatchRequestScreen';
import PricingScreen from './screens/PricingScreen';
import DealRoomScreen from './screens/DealRoomScreen';
import NotificationsScreen from './screens/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
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
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
