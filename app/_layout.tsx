import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from '@tamagui/config/v4'
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const CLERK_PUBLISHABLE_KEY =process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache ={
   async getToken(key : string) {
      try {
         return SecureStore.getItemAsync(key);
      } catch(err) {
         return;
      }
   },
   async saveToken(key : string,value :string){
      try {
         return SecureStore.setItemAsync(key,value);
      } catch (err) {
         return;
      }
   },
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
   <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
         <RootLayoutNav />
   </ClerkProvider>
  );
}

function RootLayoutNav() {
  const config = createTamagui(defaultConfig)
  const router = useRouter();
  const { isLoaded, isSignedIn} = useAuth();

   useEffect (() => {
      if (isLoaded && !isSignedIn) {
         router.push('/(modals)/login')
      }
   },[isLoaded])

  return (
   <TamaguiProvider config={config}>
      <SafeAreaProvider>
         <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(modals)/login" options={{
                  title : 'Log in or sign up',
                  presentation : 'modal',
                  headerLeft : () => (
                     <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='close-outline'/>
                     </TouchableOpacity>
                  )
               }}
            />
            <Stack.Screen name="listing/[id]" options={{ headerTitle : ''}}/>
            <Stack.Screen name="(modals)/booking" options={{
                  presentation : 'transparentModal',
                  animation: 'fade',
                  headerLeft : () => (
                     <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name='close-outline'/>
                     </TouchableOpacity>
                  )
               }}
            />
         </Stack>
      </SafeAreaProvider>
   </TamaguiProvider>
  );
}
