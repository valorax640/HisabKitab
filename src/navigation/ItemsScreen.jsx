import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import CommonHeader from '../components/CommonHeader';

const ItemsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="Items" onEditPress={() => console.log('Edit pressed')} />
      <View style={styles.content}>
        <Text style={styles.text}>Items Screen Content</Text>
      </View>
    </SafeAreaView>
  )
}

export default ItemsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
})