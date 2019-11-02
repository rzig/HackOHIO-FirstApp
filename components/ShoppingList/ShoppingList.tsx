import React, { useState } from 'react';
import { View, Image, StyleSheet, Text, ScrollView, FlatList, Dimensions, TouchableWithoutFeedback, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import { TapGestureHandler } from 'react-native-gesture-handler';
import FoodItem from '../FoodItem/FoodItem';
import { ReText } from 'react-native-redash';
import { AntDesign } from '@expo/vector-icons';

const { Value, useCode, set, cond, eq, Clock, add, stopClock, startClock, clockRunning, createAnimatedComponent, interpolate, Extrapolate, block, greaterThan } = Animated;

const AnimatedTextInput = createAnimatedComponent(TextInput);
const AnimatedFoodItem = createAnimatedComponent(FoodItem);

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

type PickupViewProps = {
    backgroundColor: string
}

const PickupView = ({backgroundColor}: PickupViewProps) => {
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
    const loc  = "DCRC";
    const price = "$12.40";
    
    const testValue = new Value<number>(1);

    const calculableQuantities = {

    }

    let displayQuantities = {

    }

    return (
        <View style={styles.container}>
            <TapGestureHandler onHandlerStateChange={() => {testValue.setValue(10)}}>
                <Animated.View style={[styles.card, {backgroundColor}, {height: headerHeight}, {marginTop: headerMarginTop}, {borderRadius: cardBorderRadius}, {width: headerWidth}, {shadowRadius: shadowRadius, elevation: shadowRadius}, {zIndex: 4}]}>
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
                <AnimatedTextInput text={testValue}/>
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
                                }
                            }}>
                                <AntDesign name="minuscircleo" size={20} color="black"/>
                            </TouchableWithoutFeedback>
                            <AnimatedTextInput style={[styles.foodInfo, {padding: 0}]} text={displayQuantities[food.id]} onChangeText={(text) => {
                                calculableQuantities[food.id] = parseInt(text);
                            }}/>
                            <TouchableWithoutFeedback onPress={() => {
                                calculableQuantities[food.id]++;
                                let q = displayQuantities[food.id];
                                q.setValue(add(q, 1));
                            }}>
                                <AntDesign name="pluscircleo" size={20} color="black" style={styles.righticon}/>
                            </TouchableWithoutFeedback>
                        </View>
                    )
                })}
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
        flexGrow: 1,
        textAlign: "right",
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
    }
});