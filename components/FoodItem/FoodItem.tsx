import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TextInput, TouchableWithoutFeedback } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const { cond, eq, add, sub, greaterThan, set, createAnimatedComponent } = Animated;

const AnimatedTextInput = createAnimatedComponent(TextInput);

type FoodItemProps = {
    imageUri: string,
    quantity: Animated.Value<number>,
    name: string,
    price: number
}

class FoodItem extends React.Component<FoodItemProps> {
    render() {
        const {imageUri, quantity, price, name} = this.props;
        return (
            <View style={styles.foodItemContainer}>
                <Image source={{uri: imageUri}} style={styles.image}/>
                <Text style={styles.foodInfo}>{name} (${price} per lb)</Text>
                <View style={styles.right}></View>
                <TapGestureHandler onHandlerStateChange={() => {
                    //cond(greaterThan(quantity, 0), set(quantity, add(quantity, -1)));
                }}>
                    <AntDesign name="minuscircleo" size={20} color="black"/>
                </TapGestureHandler>
                <AnimatedTextInput style={[styles.foodInfo, {padding: 0}]} value={quantity}/>
                <TapGestureHandler onHandlerStateChange={() => {
                    //cond(greaterThan(quantity, 0), set(quantity, add(quantity, -1)));
                }}>
                    <AntDesign name="pluscircleo" size={20} color="black" style={styles.righticon}/>
                </TapGestureHandler>
            </View>
        )
    }
}

export default FoodItem;

const styles = StyleSheet.create({
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
        borderRadius: 16
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