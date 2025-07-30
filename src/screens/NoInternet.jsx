import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import LottieView from 'lottie-react-native';

const NoInternetScreen = ({ navigation, onRetry, style }) => {
  const handleRetry = () => {
    console.log('Retry clicked');
    if (onRetry) {
      onRetry();
    }
  };


  return (
    <SafeAreaView style={[styles.container, style]}>
      <LottieView
        source={require('../../assets/animation/No Connection.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Text style={styles.title}>Internet Down!</Text>
      <Text style={styles.subtitle}>Kindly check your internet</Text>

      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryText}>Okay</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity onPress={handleHome}>
        <Text style={styles.homeText}>Home</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  lottie: {
    width: 220,
    height: 220,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#fbbf24',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 16,
  },
  retryText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  homeText: {
    color: '#388e3c',
    fontSize: 16,
    fontWeight: '500',
  },
});
