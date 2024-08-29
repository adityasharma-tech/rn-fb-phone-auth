import React from 'react';
import {View} from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import OTPTextView from 'react-native-otp-textinput';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';

export default function HomeScreen({navigation}: any) {
  const theme = useTheme();

  const [otp, setOtp] = React.useState<string>(''); // Otp Input Value
  const [phoneNumber, setPhoneNumber] = React.useState<string>(''); // phoneNumber Input value
  const [error, setError] = React.useState<Error|null>(null); // Any Error

  // for loading
  const [sendButtonLoading, setSendButtonLoading] = React.useState(false)
  const [verifyButtonLoading, setVerifyButtonLoading] = React.useState(false)

  const [otpSent, setOtpSent] = React.useState<boolean>(false);
  const [confirm, setConfirm] = React.useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  async function handleOtpSend(){
    if(phoneNumber.trim()==""){
      setError(new Error("Phone number is required."))
      return;
    }
    setSendButtonLoading(true);
    try {
      setError(null);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber.trim());
      setOtpSent(true);
      setConfirm(confirmation);
    } catch (error:any) {
      setError(error||new Error("Some Error occured"))
    } finally {
      setSendButtonLoading(false);
    }
  }
  async function handleOtpVerify(){
    if(otp.trim()=="") {
      setError(new Error("Please fill the otp."))
      return;
    }
    else {
      setVerifyButtonLoading(true)
      setError(null)
      try {
        await confirm?.confirm(otp);
      } catch (error: any) {
        setError(error || new Error("Invalid Otp."))
      } finally {
        setVerifyButtonLoading(false);
      }
    }
  }

  // Handle login
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user) {
      console.log("@onAuthStateChanged.user:", user);
      navigation.navigate("Profile")
    }
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <View
      style={{
        backgroundColor: theme.colors.primary,
        height: '100%',
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <View
        style={{
          backgroundColor: theme.colors.primaryContainer,
          paddingHorizontal: 30,
          paddingBottom: 30,
          paddingTop: 10,
          borderRadius: 15,
        }}>
        <Text
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.secondary,
            marginVertical: 10,
          }}>
          Phone Auth
        </Text>
        <TextInput
        disabled={otpSent}
        onChangeText={(text)=>setPhoneNumber(text)}
          label={'Phone Number'}
          inputMode="tel"
          mode="outlined"
          style={{
            backgroundColor: theme.colors.secondaryContainer,
          }}
        />
        <View
          style={{
            marginVertical: 20,
          }}>
          {
            otpSent ? <OTPTextView
            offTintColor={theme.colors.outlineVariant}
            tintColor={theme.colors.primary}
            containerStyle={{
              maxWidth: '100%',
              overflow: 'hidden',
            }}
            textInputStyle={{
              width: 'auto',
              borderBottomWidth: 2,
              borderWidth: 2,
              borderRadius: 5,
            }}
            inputCount={6}
            handleTextChange={text => setOtp(text)}
          /> : null}
        </View>
        {error ? <View style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          backgroundColor: theme.colors.errorContainer,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: theme.colors.error
        }}>
          <Text style={{
            color: theme.colors.error
          }}>{error?.message}</Text>
        </View>:null}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Button
          disabled={otpSent}
          loading={sendButtonLoading}
          onPress={handleOtpSend}
            mode="contained"
            style={{
              marginTop: 20,
            }}>
            {otpSent ? "Resend" : "Send Otp"}
          </Button>
          
          <Button
          onPress={handleOtpVerify}
          loading={verifyButtonLoading}
          disabled={!otpSent}
            mode="outlined"
            style={{
              marginTop: 20,
              marginLeft: 5
            }}>
            Verify Otp
          </Button>
        </View>
      </View>
    </View>
  );
}
