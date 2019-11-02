import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShoppingList from './components/ShoppingList';

export default function App() {
  return (
    <View style={styles.container}>
      <ShoppingList/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
