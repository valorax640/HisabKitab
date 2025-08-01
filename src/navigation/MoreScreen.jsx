import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import CommonHeader from '../components/CommonHeader';

const MoreScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CommonHeader title="More" onEditPress={() => console.log('Edit pressed')} />
      <View style={styles.content}>
        <Text style={styles.text}>More Screen Content</Text>
      </View>
    </SafeAreaView>
  )
}

export default MoreScreen

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