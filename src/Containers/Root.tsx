import React from 'react'
import { Button, Layout, Text } from '@ui-kitten/components'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList, 'Root'>

export default function RootScreen({ navigation }: Props) {
  const onBreachButtonPress = () => navigation.push('Breach')

  const onInstButtonPress = () => navigation.push('Inst')

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
      }}
    >
      <Layout style={{ padding: 16 }} level="1">
        <Text category={'h1'} style={{ marginBottom: 16, textAlign: 'center' }}>
          Aquinas
        </Text>
        <Button style={{}} onPress={onBreachButtonPress}>
          BREACH THE GAME
        </Button>

        <Button style={{ marginTop: 16 }} onPress={onInstButtonPress}>
          INST
        </Button>
      </Layout>
    </SafeAreaView>
  )
}
