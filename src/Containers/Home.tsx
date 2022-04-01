import Colors from '@app/Utils/Colors'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import {
  FlatList,
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type Section = {
  id: string
  title: string
}

type Media = {
  id: string
  title: string
}

export default function HomeScreen() {
  const sections: Section[] = [
    { id: 'foo1', title: 'Рекомендации' },
    { id: 'foo2', title: 'Подписки ' },
    { id: 'foo3', title: 'Друзья ' },
    { id: 'foo4', title: 'Блогеры' },
    { id: 'foo5', title: 'Магазины' },
    { id: 'foo6', title: 'Музыка' },
  ]

  const media: Media[] = [
    { id: 'foo1', title: 'Рекомендации' },
    { id: 'foo2', title: 'Подписки ' },
    { id: 'foo3', title: 'Друзья ' },
    { id: 'foo4', title: 'Блогеры' },
    { id: 'foo5', title: 'Магазины' },
    { id: 'foo6', title: 'Музыка' },
  ]

  const flatListRef = useRef<FlatList>(null)
  const [selectedSection, setSelectedSection] = useState<Section>(sections[0])
  const onSelectSection = (item: Section, index: number) => {
    setSelectedSection(item)
    flatListRef?.current?.scrollToIndex({ index, animated: true })
  }
  const [mediaLayout, setMediaLayout] = useState<{
    width: number
    height: number
  } | null>(null)

  const renderSection = ({ item, index }: { item: Section; index: number }) => {
    return (
      <TouchableOpacity
        style={{
          display: 'flex',
          justifyContent: 'center',
          paddingHorizontal: 4,
        }}
        onPress={() => onSelectSection(item, index)}
      >
        <Text
          style={{
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 16,
            overflow: 'hidden',
            fontWeight: '500',
            color: item.id === selectedSection.id ? Colors.white : Colors.black,
            backgroundColor:
              item.id === selectedSection.id ? Colors.green : Colors.white,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderMedia = ({ item, index }: { item: Media; index: number }) => {
    return (
      <View
        style={{
          display: 'flex',
          width: mediaLayout?.width,
          height: mediaLayout?.height,
        }}
      >
        <Image
          style={{ flex: 1 }}
          source={{
            uri: 'https://drscdn.500px.org/photo/1045792342/q%3D80_m%3D2000/v2?sig=cc6fc2db0b48ba23be045bd1d2e0c4e283bce0b5e06948befe68219a9b0bbc78',
          }}
        />
      </View>
    )
  }

  const onMediaContainerLayout = (event: LayoutChangeEvent) =>
    setMediaLayout({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    })

  let onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!mediaLayout) {
      return
    }

    let pageNumber = Math.min(
      Math.max(
        Math.floor(e.nativeEvent.contentOffset.x / mediaLayout?.width + 0.5) +
          1,
        0
      ),
      media.length
    )
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
      edges={['top']}
    >
      <View
        style={{
          display: 'flex',
          height: '10%',
        }}
      >
        <FlatList
          ref={flatListRef}
          horizontal
          data={sections}
          renderItem={renderSection}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginLeft: 16,
            paddingRight: 16,
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
      <View onLayout={onMediaContainerLayout} style={{ flex: 1 }}>
        {mediaLayout && (
          <FlatList
            horizontal
            pagingEnabled
            data={media}
            renderItem={renderMedia}
            keyExtractor={(item) => item.id}
            onMomentumScrollEnd={onScrollEnd}
            bounces={false}
          />
        )}
      </View>
    </SafeAreaView>
  )
}
