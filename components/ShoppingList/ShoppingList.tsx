import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, FlatList, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import FoodItem from '../FoodItem/FoodItem';
import { ReText, timing } from 'react-native-redash';
import { AntDesign } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { Value, useCode, set, cond, eq, Clock, add, stopClock, startClock, clockRunning, createAnimatedComponent, interpolate, Extrapolate, block, greaterThan, sub } = Animated;

const AnimatedTextInput = createAnimatedComponent(TextInput);
const AnimatedFoodItem = createAnimatedComponent(FoodItem);
const AnimatedBlurView = createAnimatedComponent(BlurView);

type Food = {
    imageUri: string,
    name: string,
    price: number,
    id: number
}
const foods: Array<Food> = [
    {id: 1, name: "Zucchini", price: 1, imageUri: "https://bmexdi064h-flywheel.netdna-ssl.com/wp-content/uploads/2016/09/Chocolate-Pecan-Zucchini-Bread-17-2.jpg"},
    {id: 2, name: "Squash", price: 2, imageUri: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/types-of-squash-1296x728-kabocha.jpg?w=1155&h=1528"},
    {id: 3, name: "Carrots", price: 5, imageUri: "https://www.jessicagavin.com/wp-content/uploads/2019/02/carrots-7-600x900.jpg"},
    {id: 4, name: "Tomatoes", price: 3, imageUri: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg?w=1155&h=1528"},
    {id: 5, name: "Grapes", price: 4, imageUri: "https://images-na.ssl-images-amazon.com/images/I/61uhuojj0eL._SX425_.jpg"},
    {id: 6, name: "Zucchini", price: 1, imageUri: "https://bmexdi064h-flywheel.netdna-ssl.com/wp-content/uploads/2016/09/Chocolate-Pecan-Zucchini-Bread-17-2.jpg"},
    {id: 7, name: "Squash", price: 2, imageUri: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/types-of-squash-1296x728-kabocha.jpg?w=1155&h=1528"},
    {id: 8, name: "Carrots", price: 5, imageUri: "https://www.jessicagavin.com/wp-content/uploads/2019/02/carrots-7-600x900.jpg"},
    {id: 9, name: "Tomatoes", price: 3, imageUri: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/AN_images/tomatoes-1296x728-feature.jpg?w=1155&h=1528"},
    {id: 10, name: "Grapes", price: 4, imageUri: "https://images-na.ssl-images-amazon.com/images/I/61uhuojj0eL._SX425_.jpg"}
];

const HEADER_MIN_HEIGHT = 75;
const HEADER_MAX_HEIGHT = 200;
const SCROLL_VALUE      = 150;
const HEADER_MARGIN_TOP = 50;

const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const MODAL_HEIGHT = 325;

type PickupViewProps = {
    backgroundColor: string,
    date: string
}

const PickupView = ({backgroundColor, date}: PickupViewProps) => {
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
        outputRange: [-38.5, 0],
        extrapolate: Extrapolate.CLAMP
    });

    const extraMarginTop = interpolate(priceMarginTop, {
        inputRange: [-38.5, -30],
        outputRange: [-5, 0],
        extrapolate: Extrapolate.CLAMP
    });

    const subtitleMarginTop = interpolate(scrollOffset, {
        inputRange: [0, .2 * SCROLL_VALUE],
        outputRange: [0, -50],
        extrapolate: Extrapolate.CLAMP
    })

    const subtitleOpacity = interpolate(scrollOffset, {
        inputRange: [0, .17 * SCROLL_VALUE],
        outputRange: [1, 0],
        extrapolate: Extrapolate.CLAMP
    })

    const loc  = "DCRC";
    
    const testValue = new Value<number>(1);

    const calculableQuantities = {

    }

    let displayQuantities = {

    }

    const totalPrice = new Value<number>(0);

    const isModalOpen = new Value<0|1>(0);
    const modalOpacity = new Value<number>(0);
    const modalZIndex = new Value<0|200>(0);
    const modalAnimationProgress = new Value<number>(SCREEN_HEIGHT);

    useCode(
        cond(eq(isModalOpen, 1),
            [set(modalOpacity, 1), set(modalZIndex, 200), set(modalAnimationProgress, timing({
                from: 0,
                to: 1,
                easing: Easing.ease,
                duration: 250
            }))],
            [set(modalAnimationProgress, timing({
                from: 1,
                to: 0,
                easing: Easing.ease,
                duration: 250
            }))]
        ), [isModalOpen]
    )

    const modalTop = interpolate(modalAnimationProgress, {
        inputRange: [0, 1],
        outputRange: [SCREEN_HEIGHT, SCREEN_HEIGHT - MODAL_HEIGHT],
        extrapolate: Extrapolate.CLAMP
    });

    const blurIntensity = interpolate(modalAnimationProgress, {
        inputRange: [0, .75, 1],
        outputRange: [0, 50, 95],
        extrapolate: Extrapolate.CLAMP
    })

    const blurZIndex = interpolate(modalAnimationProgress, {
        inputRange: [0, 1],
        outputRange: [0, 200]
    });

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={() => alert("68215")}>
                <Animated.View style={[styles.card, {backgroundColor}, {height: headerHeight}, {marginTop: headerMarginTop}, {borderRadius: cardBorderRadius}, {width: headerWidth}, {shadowRadius: shadowRadius, elevation: shadowRadius}, {zIndex: 4}]}>
                    <Animated.Text style={[styles.pickupdate, {paddingTop: datePaddingTop}]}>{date}</Animated.Text>
                    <Animated.Text style={[styles.cardsubtitle, {padding: 5, marginTop: subtitleMarginTop, opacity: subtitleOpacity}]}>
                        This pickup is brought to you by the Mid-Ohio Food Bank. Tap here for your code.
                    </Animated.Text>
                    <Animated.View style={styles.pickupinfo}>
                        <Animated.Text style={[styles.cardsubtitle, {opacity: excessCardInfoOpacity}]}>Pickup Location:</Animated.Text>
                        <Animated.View style={styles.pickupbottom}>
                            <Animated.Text style={[styles.pickuploc, {opacity: excessCardInfoOpacity}]}>{loc}</Animated.Text>
                            <Animated.View style={[styles.pickupBottomRight, {marginTop: priceMarginTop}]}>
                                <Animated.Text style={[styles.pickupprice, {textAlign: "right", flexGrow: 1, marginRight: -15, top: extraMarginTop}]}>$</Animated.Text>
                                <AnimatedTextInput style={[styles.pickupprice, {top: extraMarginTop}]} text={totalPrice} editable={false}/>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </TouchableWithoutFeedback>
            <Animated.ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} onScroll={onScroll} scrollEventThrottle={1} style={{paddingTop: 60, zIndex: 100}}>
                {foods.map(food => {
                    if(!calculableQuantities[food.id]) { calculableQuantities[food.id] = 0 }
                    if(!displayQuantities[food.id]) { displayQuantities[food.id] = new Value(0)}

                    return (
                        <View style={styles.foodItemContainer} key={food.id}>
                            <Image source={{uri: food.imageUri}} style={styles.image}/>
                            <Text style={styles.foodInfo}>{food.name} (${food.price} per lb)</Text>
                            <View style={styles.right}></View>
                            <TouchableWithoutFeedback onPress={() => {
                                let q = displayQuantities[food.id];
                                if(calculableQuantities[food.id] > 0) {
                                    q.setValue(add(q, -1));
                                    calculableQuantities[food.id]--;
                                    totalPrice.setValue(sub(totalPrice, food.price));
                                }
                            }}>
                                <AntDesign name="minuscircleo" size={20} color="black"/>
                            </TouchableWithoutFeedback>
                            <AnimatedTextInput style={[styles.foodInfo, {padding: 0}]} text={displayQuantities[food.id]} editable={false}/>
                            <TouchableWithoutFeedback onPress={() => {
                                calculableQuantities[food.id]++;
                                let q = displayQuantities[food.id];
                                q.setValue(add(q, 1));
                                totalPrice.setValue(add(totalPrice, food.price));
                            }}>
                                <AntDesign name="pluscircleo" size={20} color="black" style={styles.righticon}/>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                })}
                <View style={{height: 30}}></View>
                <TouchableWithoutFeedback onPress={() => {isModalOpen.setValue(1)}}>
                    <View style={[styles.paymentButton, {borderWidth: 3, borderColor: backgroundColor}]}>
                        <Text style={[styles.paymentText, {color: backgroundColor}]}>Pay Now</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{height: 75}}></View>
            </Animated.ScrollView>
            <TouchableWithoutFeedback onPress={() => {
                isModalOpen.setValue(0);
            }}>
                <AnimatedBlurView style={{height: SCREEN_HEIGHT, width: SCREEN_WIDTH, position: "absolute", top: 0, left: 0, zIndex: blurZIndex, opacity: modalOpacity}} intensity={blurIntensity} tint={"light"}/>
            </TouchableWithoutFeedback>
            <Animated.View style={[mst.modalContainer, {opacity: modalOpacity, backgroundColor, zIndex: modalZIndex, top: modalTop}]}>
                <View style={mst.modalTop}>
                    <View style={{display: "flex", flexDirection: "row", flexGrow: 1}}>
                        <Text style={mst.modalHeader}>Pay Now - $</Text>
                        <AnimatedTextInput style={[{color: "white", fontSize: 35, flexGrow: 1, marginLeft: "-31%", marginTop: 20}]} text={totalPrice} editable={false}/>
                    </View>
                    <TouchableWithoutFeedback onPress={() => {
                        isModalOpen.setValue(0);
                    }}>
                        <AntDesign name="closecircleo" size={35} color="white" style={{paddingTop: 20, paddingRight: 20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <Text style={mst.modalBody}>
                    Select one or more payment methods to use. You are approved for a
                    $30 microloan.
                </Text>
                <View style={mst.row}>
                    <View style={mst.payment}>
                        <Text style={[mst.name, {color: backgroundColor}]}>
                            Microloan
                        </Text>
                    </View>
                    <View style={mst.payment}>
                        <Text style={[mst.name, {color: backgroundColor}]}>
                            EBT
                        </Text>
                    </View>
                </View>
                <View style={mst.row}>
                    <View style={mst.payment}>
                        <Text style={[mst.name, {color: backgroundColor}]}>
                            Credit
                        </Text>
                    </View>
                    <View style={mst.payment}>
                        <Text style={[mst.name, {color: backgroundColor}]}>
                            Check
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </View>
    )
}

const mst = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        width: SCREEN_WIDTH,
        height: MODAL_HEIGHT
    },
    modalHeader: {
        paddingTop: 20,
        paddingLeft: 20,
        fontSize: 35,
        color: "white",
        flexGrow: 1
    },
    modalTop: {
        display: "flex",
        flexDirection: "row"
    },
    modalBody: {
        color: "white",
        fontSize: 18,
        padding: 20,
        fontFamily: "intermed"
    },
    row: {
        display: "flex",
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20
    },
    payment: {
        backgroundColor: "white",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "45%",
        height: 65,
        padding: 10
    },
    name: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: "intermed"
    }
})

export default PickupView;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        // height: 200,
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
        paddingTop: 10,
    },
    pickupinfo: {
        flex: 1,
        justifyContent: "flex-end",
        paddingLeft: 10,
    },
    cardsubtitle: {
        fontSize: 15,
        color: "white",
        paddingLeft: 10,
    },
    pickupbottom: {
        display: "flex",
        flexDirection: "row",
        paddingBottom: 10,
    },
    pickupprice: {
        fontSize: 35,
        color: "white",
        paddingRight: 15,
    },
    pickuploc: {
        paddingLeft: 10,
        fontSize: 35,
        color: "white",
    },
    foodItemContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        paddingLeft: "3.5%",
        paddingRight: "3.5%",
        margin: "auto",
        alignItems: "center",
        paddingBottom: "5.5%"
    },
    foodInfo: {
        color: "black",
        fontFamily: "interthick",
        fontSize: 17.5,
        paddingLeft: "3.5%"
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8
    },
    right: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    righticon: {
        paddingLeft: 12.5
    },
    pickupBottomRight: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        // flexGrow: 1,
        alignSelf: "flex-end",
        paddingRight: "30%"
    },
    paymentButton: {
        borderRadius: 26,
        width: "92.5%",
        marginLeft: "auto",
        marginRight: "auto",
        height: 70,
        marginTop: -50,
        display: "flex",
        alignItems: "center"
    },
    paymentText: {
        fontSize: 35,
        textAlign: "center",
        paddingTop: 70 / 8
    }
});