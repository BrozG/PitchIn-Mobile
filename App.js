import React, { useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, PlayfairDisplay_400Regular, PlayfairDisplay_600SemiBold, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';

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
  // Ensure the native splash screen stays visible until we hide it explicitly
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        // Log but don't crash the app if the call fails
        console.warn('Error preventing splash auto hide:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
  });

  // When fonts are loaded, hide the splash screen after the root view has laid out
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    // Render nothing while loading (native splash stays visible)
    return null;
  }

  return (
    <NavigationContainer>
      <View style={styles.container} onLayout={onLayoutRootView}>
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
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});