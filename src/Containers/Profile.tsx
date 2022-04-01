import React from 'react'
import { Button } from '@ui-kitten/components'
import { View } from 'react-native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

type Props = NativeStackScreenProps<RootStackParamList, 'Root'>

export default function HomeScreen({ navigation }: Props) {
  const onExit = () => {
    navigation.popToTop()
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 24,
      }}
    >
      <Button style={{ paddingHorizontal: 16 }} onPress={onExit}>
        {'Exit'}
      </Button>
    </View>
  )
}
