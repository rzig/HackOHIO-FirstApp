import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';

const { Value, useCode, set, cond, eq, Clock, add, stopClock, startClock, clockRunning, createAnimatedComponent, interpolate, Extrapolate, block } = Animated;

const Card = ({style, onPress}) => {

    return (
        <TapGestureHandler onHandlerStateChange={onPress}>
            <Animated.View style={[style, {zIndex: 4}]}>
                <Text>Hi</Text>
            </Animated.View>
        </TapGestureHandler>
    )
}

const HEADER_MIN_HEIGHT = 75;
const HEADER_MAX_HEIGHT = 200;
const SCROLL_VALUE      = 150;
const HEADER_MARGIN_TOP = 50;

const SCREEN_WIDTH = Dimensions.get("screen").width;

const PickupView = () => {
    const scrollOffset = new Value(0);

    const headerHeight = interpolate(scrollOffset, {
        inputRange: [HEADER_MARGIN_TOP, SCROLL_VALUE],
        outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        extrapolate: Extrapolate.CLAMP
    });

    const headerMarginTop = interpolate(scrollOffset, {
      inputRange: [0, HEADER_MARGIN_TOP, SCROLL_VALUE],
      outputRange: [HEADER_MARGIN_TOP, 0, 0],
      extrapolate: Extrapolate.CLAMP
    });

    const cardBorderRadius = interpolate(scrollOffset, {
      inputRange: [0, SCROLL_VALUE],
      outputRange: [20, 0],
      extrapolate: Extrapolate.CLAMP
    });

    const headerWidth = interpolate(scrollOffset, {
      inputRange: [0, SCROLL_VALUE * .9],
      outputRange: [.85 * SCREEN_WIDTH, SCREEN_WIDTH],
      extrapolate: Extrapolate.CLAMP
    });

    const shadowRadius = interpolate(scrollOffset, {
        inputRange: [0, SCROLL_VALUE],
        outputRange: [12, 0],
        extrapolate: Extrapolate.CLAMP
    });

    const isModalOpen = new Value<0|1>(0);

    const onScroll = Animated.event([
        {
            nativeEvent: {contentOffset: {y: scrollOffset}}
        }
    ], {useNativeDriver: true});


    return (
        <View style={styles.container}>
            <Card 
                style={[styles.card, {height: headerHeight}, {marginTop: headerMarginTop}, {borderRadius: cardBorderRadius}, {width: headerWidth}, {shadowRadius: shadowRadius, elevation: shadowRadius}]}
                onPress={() => {
                    isModalOpen.setValue(new Value(1));
                }}
            />
            <Animated.ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={1} style={{flex: 1, paddingTop: 100}}>
                <View style={styles.listitem}><Text>1</Text></View>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
                <View style={styles.listitem}/>
            </Animated.ScrollView>
        </View>
    )
}

export default PickupView;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 200,
        flex: 1
    },
    card: {
        borderRadius: 20,
        width: "100%",
        height: 200,
        backgroundColor: "#E88B76",
        marginLeft: "auto",
        marginRight: "auto",
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 0,
        },
        shadowOpacity: 0.26,
    },
    listitem: {
        borderBottomColor: "#333",
        borderBottomWidth: 2,
        height: 75,
        width: "100%"
    },
});