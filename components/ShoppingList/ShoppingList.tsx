import React from 'react';
import { View, Image, StyleSheet, Text, ScrollView, FlatList, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';

const { Value, useCode, set, cond, eq, Clock, add, stopClock, startClock, clockRunning, createAnimatedComponent, interpolate, Extrapolate, block } = Animated;

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

    const datePaddingTop = interpolate(scrollOffset, {
        inputRange: [0, SCROLL_VALUE],
        outputRange: [10, 20],
        extrapolate: Extrapolate.CLAMP
    });

    const excessCardInfoOpacity = interpolate(scrollOffset, {
        inputRange: [0, SCROLL_VALUE / 4, SCROLL_VALUE / 2],
        outputRange: [1, .75, 0],
        extrapolate: Extrapolate.CLAMP
    });

    const priceMarginTop = interpolate(headerHeight, {
        inputRange: [HEADER_MIN_HEIGHT, HEADER_MIN_HEIGHT + 30],
        outputRange: [-38, 0],
        extrapolate: Extrapolate.CLAMP
    });

    const date = "Tuesday, May 4";
    const loc  = "LOC";
    const price = "$12.40"

    return (
        <View style={styles.container}>
            <TapGestureHandler onHandlerStateChange={() => {alert(headerHeight)}}>
                <Animated.View style={[styles.card, {height: headerHeight}, {marginTop: headerMarginTop}, {borderRadius: cardBorderRadius}, {width: headerWidth}, {shadowRadius: shadowRadius, elevation: shadowRadius}, {zIndex: 4}]}>
                    <Animated.Text style={[styles.pickupdate, {paddingTop: datePaddingTop}]}>{date}</Animated.Text>
                    <Animated.View style={styles.pickupinfo}>
                        <Animated.Text style={[styles.cardsubtitle, {opacity: excessCardInfoOpacity}]}>Pickup Location:</Animated.Text>
                        <Animated.View style={styles.pickupbottom}>
                            <Animated.Text style={[styles.pickuploc, {opacity: excessCardInfoOpacity}]}>{loc}</Animated.Text>
                            <Animated.Text style={[styles.pickupprice, {marginTop: priceMarginTop}]}>{price}</Animated.Text>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </TapGestureHandler>
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
        display: "flex"
    },
    listitem: {
        borderBottomColor: "#333",
        borderBottomWidth: 2,
        height: 75,
        width: "100%"
    },
    pickupdate: {
        fontSize: 35,
        color: "white",
        paddingLeft: 10,
        paddingTop: 10
    },
    pickupinfo: {
        flex: 1,
        justifyContent: "flex-end",
        paddingLeft: 10
    },
    cardsubtitle: {
        fontSize: 15,
        color: "white",
        paddingLeft: 10
    },
    pickupbottom: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: 10
    },
    pickupprice: {
        flexGrow: 1,
        textAlign: "right",
        fontSize: 35,
        color: "white",
        paddingRight: 15
    },
    pickuploc: {
        paddingLeft: 10,
        fontSize: 35,
        color: "white",
    }
});