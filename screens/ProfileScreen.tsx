import React from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button, Text, useTheme} from 'react-native-paper';

export default function ProfileScreen({navigation}: any) {
  const theme = useTheme();

  const [logoutLoading, setLogoutLoading] = React.useState(false)

  async function handleLogout() {
    setLogoutLoading(true)
    try {
        await auth().signOut()
        setLogoutLoading(false)
        navigation.navigate("Home")
    } catch (error: any) {
        console.error(error);
        setLogoutLoading(false);
    }
  }
  return (
    <View
      style={{
        backgroundColor: theme.colors.secondaryContainer,
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center'
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text style={{
            fontSize: 30,
            fontWeight: 400
        }}>Profile Screen</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingVertical: 10
        }}>
            <Button loading={logoutLoading} onPress={handleLogout} mode='contained'>
                Logout
            </Button>
      </View>
    </View>
  );
}
