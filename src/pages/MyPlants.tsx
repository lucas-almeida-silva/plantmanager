import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet
} from 'react-native';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import { loadPlant, Plant, StoragePlant } from '../libs/storage';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

import waterdropImage from '../assets/waterdrop.png';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<StoragePlant[]>([]); 
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWatered] = useState<string>();

  useEffect(() => {
    async function loadStoragePlants() {
      const plantsStoraged = await loadPlant();

      setMyPlants(plantsStoraged);

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWatered(
        `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`
      );
    }

    loadStoragePlants();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image
          source={waterdropImage}
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <PlantCardSecondary 
              data={{
                name: item.name,
                photo: item.photo,
                hour: item.hour
              }} 
            />
          )}
          showsVerticalScrollIndicator={false}
          style={styles.nextWatereds}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
  nextWatereds: {
    flex: 1, 
    marginBottom: 10,
  }
});