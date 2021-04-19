import React from 'react';
import {
  SafeAreaView, 
  Text, 
  Image, 
  StyleSheet 
} from 'react-native';

import { Button } from '../components/Button';

import colors from '../../styles/colors';
import wateringImage from '../assets/watering.png';

export function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Gerencie {'\n'} 
        suas plantas {'\n'}
        de forma fácil
      </Text>

      <Image source={wateringImage} />
      
      <Text style={styles.subtitle}>
        Não esqueça mais de regar suas plantas. 
        Nós cuidados de lembrar você sempre que precisar
      </Text>

      <Button title={'>'} />
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.heading,
    marginTop: 40
  },
  image: {
    width: 292,
    height: 284
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 20,
    color: colors.heading
  },
  button: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 10,
    height: 56,
    width: 56
  },
  buttonText: {
    color: colors.white,
    fontSize: 24
  }
});