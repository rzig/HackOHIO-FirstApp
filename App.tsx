import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShoppingList from './components/ShoppingList/ShoppingList';
import * as Font from 'expo-font';
import Swiper from 'react-native-swiper'

export default class App extends React.Component {
  state = {
    fontsLoaded: false
  }
  async componentDidMount() {
    await Font.loadAsync({
      "interthick": require("./fonts/Inter-Black.otf"),
      "intermed": require("./fonts/Inter-Regular.otf")
    });
    this.setState({fontsLoaded: true});
  }

  render() {
    if(this.state.fontsLoaded) {
      return (
        <View style={styles.container}>
          <Swiper dotStyle={{display: "none"}} activeDotStyle={{display: "none"}}>
            <ShoppingList backgroundColor={"#E88B76"}/>
            <ShoppingList backgroundColor={"#4A68B5"}/>
            <ShoppingList backgroundColor={"#309C75"}/>
          </Swiper>
        </View>
      )
    } else {
      return (
        <Text>Loading...</Text>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
