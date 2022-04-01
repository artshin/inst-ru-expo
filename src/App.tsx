import React from 'react'
import { registerRootComponent } from 'expo'
import Navigation from '@app/Navigation/index'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import { ApplicationProvider } from '@ui-kitten/components'
import * as eva from '@eva-design/eva'

function App() {
  return (
    <View style={{ flex: 1 }}>
      <ApplicationProvider {...eva} theme={eva.light}>
        <Navigation />
        <StatusBar style="dark" />
      </ApplicationProvider>
    </View>
  )
}

export default registerRootComponent(App)
