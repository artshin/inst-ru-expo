import React from 'react'
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import HomeScreen from '@app/Containers/Home'
import SearchScreen from '@app/Containers/Search'
import LikesScreen from '@app/Containers/Likes'
import ProfileScreen from '@app/Containers/Profile'
import SettingsScreen from '@app/Containers/Settings'
import BreachScrean from '@app/Containers/Breach'
import Colors from '@app/Utils/Colors'
import RootScreen from '@app/Containers/Root'

const TabStack = createBottomTabNavigator<InstTabStackParamList>()
const RootStack = createNativeStackNavigator<RootStackParamList>()

function TabStackScreen() {
  const tabBarIcon = ({
    route,
    focused,
    color,
    size,
  }: {
    route: RouteProp<ParamListBase, string>
    focused: boolean
    color: string
    size: number
  }) => {
    const props = { size, color }

    if (route.name === 'Home') {
      return <Ionicons name={'home-outline'} {...props} />
    } else if (route.name === 'Search') {
      return <Ionicons name={'search'} {...props} />
    } else if (route.name === 'Likes') {
      return <Ionicons name={'heart'} {...props} />
    } else if (route.name === 'Profile') {
      return <Ionicons name={'person-outline'} {...props} />
    }
  }

  return (
    <TabStack.Navigator
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarIcon: (props) => tabBarIcon({ ...props, route }),
        tabBarActiveTintColor: Colors.green,
        headerShown: false,
      })}
    >
      <TabStack.Screen name={'Home'} component={HomeScreen} />
      <TabStack.Screen name={'Search'} component={SearchScreen} />
      <TabStack.Screen name={'Likes'} component={LikesScreen} />
      <TabStack.Screen name={'Profile'} component={ProfileScreen} />
    </TabStack.Navigator>
  )
}

function RootStackScreen() {
  const screenOptions = () => ({ headerShown: false })

  return (
    <RootStack.Navigator
      screenOptions={screenOptions}
      initialRouteName={'Root'}
    >
      <RootStack.Group>
        <RootStack.Screen name={'Inst'} component={TabStackScreen} />
        <RootStack.Screen name={'Settings'} component={SettingsScreen} />
        <RootStack.Screen
          name={'Breach'}
          component={BreachScrean}
          options={{ headerShown: true }}
        />
        <RootStack.Screen name={'Root'} component={RootScreen} />
      </RootStack.Group>
      {/* <RootStack.Group screenOptions={{ presentation: "modal" }}>
        <RootStack.Screen name="MyModal" component={ModalScreen} />
      </RootStack.Group> */}
    </RootStack.Navigator>
  )
}

export default function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStackScreen />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
