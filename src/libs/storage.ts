import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface Plant {
  id: string;
  name: string,
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number,
    repeat_every: string;
  },
  dateTimeNotification: Date;
}

export interface StoragePlant extends Plant {
  hour: string;
}

interface StoragePlantPros {
  [key: string]: {
    data: Plant;
  }
}

export async function savePlant(plant: Plant): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@PlantManager:plants');
    const oldPlants = data ? JSON.parse(data) as StoragePlantPros : {};

    const newPlant = {
      [plant.id]: {
        data: plant
      }
    } 

    await AsyncStorage.setItem(
      '@PlantManager:plants',
       JSON.stringify({ ...newPlant, ...oldPlants })
    );

  } catch(error) {
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<StoragePlant[]> {
  try {
    const data = await AsyncStorage.getItem('@PlantManager:plants');
    const plants = data ? JSON.parse(data) as StoragePlantPros : {};

    const plantsSorted = Object
      .keys(plants)
      .map(key => {
        return {
          ...plants[key].data,
          hour: format(new Date(plants[key].data.dateTimeNotification), 'HH:mm')
        }
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
          Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      );

    return plantsSorted;

  } catch(error) {
    throw new Error(error);
  }
}