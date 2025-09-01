import React from 'react'
import { useWarmUpBrowser } from '@/hooks/useWarmUpBrowser';
import { Input, Text, View, XStack } from 'tamagui';
import { defaultStyles } from '@/constants/Styles';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

enum Strategy {
   Google = 'oauth_google',
   Apple = 'oauth_apple',
   Facebook = 'oauth8facebook',
}

export default function Login() {
   useWarmUpBrowser();

   const router = useRouter();

   const {startOAuthFlow : googleAuth} = useOAuth({strategy : 'oauth_google'});
   const {startOAuthFlow : appleAuth} = useOAuth({strategy : 'oauth_apple'});
   const {startOAuthFlow : facebookAuth} = useOAuth({strategy : 'oauth_facebook'});

   const onSelectAuth = async(strategy : Strategy) => {
      const selectedAuth = {
         [Strategy.Google] : googleAuth,
         [Strategy.Apple] : appleAuth,
         [Strategy.Facebook] : facebookAuth,
      } [strategy];

      try {
         const { createdSessionId, setActive} = await selectedAuth();
         
            if (createdSessionId) {
               setActive!({session : createdSessionId});
               router.back();
            } 
         } catch (err) {
            console.error('OAuth error: ', err)
         }
   }


   return (
      <View flex={1} padding={26} backgroundColor="#fff" >
         <Input
            autoCapitalize='none'
            placeholder='Email'
            style={[defaultStyles.inputField]}
            marginBottom={30}
         />
         <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>Continuer</Text>
         </TouchableOpacity>

         <XStack justifyContent="center" alignItems="center" space={10} marginVertical={30}>
            <View height={2} flex={1} backgroundColor={Colors.grey}/>
            <Text  fontWeight="700" color={Colors.grey}>or</Text>
            <View height={2} flex={1} backgroundColor={Colors.grey}/>
         </XStack>

         <View gap={20}>
            <TouchableOpacity style={styles.btnOutline}>
               <Ionicons name='call-outline' size={24} style={defaultStyles.btnIcon}/>
               <Text style={styles.btnOutlineText}>Continue with Phone</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Apple)}>
               <FontAwesome5 name='apple' size={24} style={defaultStyles.btnIcon}/>
               <Text style={styles.btnOutlineText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Google)}>
               <FontAwesome5 name='google' size={24} style={defaultStyles.btnIcon}/>
               <Text style={styles.btnOutlineText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnOutline} onPress={() => onSelectAuth(Strategy.Facebook)}>
               <FontAwesome5 name='facebook' size={24} style={defaultStyles.btnIcon}/>
               <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
            </TouchableOpacity>
         </View>
      </View>

   )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 26,
  },

  seperatorView: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    fontFamily: 'mon-sb',
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'mon-sb',
  },
});