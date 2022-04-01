import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Animated, Easing, TouchableOpacity, ViewStyle } from 'react-native'

export const HoverTouchable: FunctionComponent<{
  style?: ViewStyle
  hover?: boolean
  disabled?: boolean
  onPress: () => void
  onHoverEnter?: () => void
  onHoverLeave?: () => void
}> = ({
  onPress,
  onHoverEnter,
  onHoverLeave,
  disabled,
  children,
  style,
  hover = false,
}) => {
  const onMouseEnter = () => {
    !disabled && onHoverEnter?.()
  }

  const onMouseLeave = () => {
    !disabled && onHoverLeave?.()
  }

  const cursor = disabled ? 'not-allowed' : 'pointer'

  return (
    <TouchableOpacity
      hitSlop={{
        top: 15,
        bottom: 15,
        right: 10,
        left: 10,
      }}
      tabindex={'0'}
      accessibilityRole={'button'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onPress={onPress}
      style={{
        // @ts-ignore
        cursor,
        ...style,
      }}
    >
      <HoverView show={hover} />
      {children}
    </TouchableOpacity>
  )
}

const HoverView: FunctionComponent<{ show: boolean }> = ({ show }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current
  const duration = 20
  const outDuration = 150

  const open = () => {
    Animated.timing(opacityAnim, {
      useNativeDriver: true,
      toValue: 1,
      easing: Easing.in(Easing.ease),
      duration: duration,
    }).start()
  }

  const close = () => {
    Animated.timing(opacityAnim, {
      useNativeDriver: true,
      toValue: 0,
      easing: Easing.inOut(Easing.ease),
      duration: outDuration,
    }).start()
  }

  useEffect(() => {
    show ? open() : close()
  }, [show])

  return (
    <Animated.View
      style={[
        {
          zIndex: -1,
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          opacity: opacityAnim,
          backgroundColor: 'darkcyan',
        },
      ]}
    />
  )
}
