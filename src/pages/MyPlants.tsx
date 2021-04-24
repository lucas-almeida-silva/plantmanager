import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

import { loadPlant, Plant, removePlant, StoragedPlant } from '../libs/storage';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import waterdropImage from '../assets/waterdrop.png';

export function MyPlants() {
  const [myPlants, setMyPlants] = useState<StoragedPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWatered] = useState<string | null>();

  const navigation = useNavigation();

  useEffect(() => {
    async function loadStoragePlants() {
      const plantsStoraged = await loadPlant();

      if (plantsStoraged.length) {
        const nextTime = getDateTimeDistance(
          plantsStoraged[0].dateTimeNotification,
          new Date()
        );

        setNextWatered(
          `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`
        );
      }

      setMyPlants(plantsStoraged);
      setLoading(false);
    }

    loadStoragePlants();
  }, []);

  function getDateTimeDistance(initialDate: Date, finalDate: Date) {
    const dateTimeDistanceFormated = formatDistance(
      new Date(initialDate).getTime(),
      new Date(finalDate).getTime(),
      { locale: ptBR }
    );

    return dateTimeDistanceFormated;
  }

  function handlePlantSelect(plant: Plant) {
    navigation.navigate('PlantSave', { plant });
  }

  function handleRemove(plant: StoragedPlant) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel'
      },
      {
        text: 'Sim 😥',
        onPress: async () => {
          try {
            await removePlant(plant.id);

            const newPlantsArray = myPlants.filter(item => item.id !== plant.id);

            setMyPlants(newPlantsArray)

            setNextWatered(() => {
              if(newPlantsArray.length) {
                const nextTime = getDateTimeDistance(
                  newPlantsArray[0].dateTimeNotification, 
                  new Date()
                );

                return `Não esqueça de regar a ${newPlantsArray[0].name} à ${nextTime}.`
              } else {
                return null;
              }
            });

          } catch (error) {
            Alert.alert('Não foi possível remover! 😥')
          }
        }
      }
    ])
  }

  if (loading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <Header />

      {nextWaterd && (
        <View style={styles.spotlight}>
          <Image
            source={waterdropImage}
            style={styles.spotlightImage}
          />
          <Text style={styles.spotlightText}>
            {nextWaterd}
          </Text>
        </View>
      )}

      <View style={{ ...styles.plants, marginTop: !nextWaterd ? 20 : 0 }}>
        <Text style={styles.plantTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={myPlants}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={{
                name: item.name,
                photo: item.photo,
                hour: item.hour
              }}
              onPress={() => handlePlantSelect(item)}
              handleRemove={() => handleRemove(item)}
            />
          )}
          ListEmptyComponent={(
            <View style={styles.emptyPlantsContainer}>
              <Text style={styles.emptyPlantsText}>Nenhum lembrete agendado</Text>
            </View>
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
    // paddingTop: 50,
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
  },
  emptyPlantsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  emptyPlantsText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.text,
  }
});