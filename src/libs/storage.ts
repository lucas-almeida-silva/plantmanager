import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
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
}

export interface StoragedPlant extends Plant {
  dateTimeNotification: Date;
  hour: string;
}

interface StoragedPlantsPros {
  [key: string]: {
    data: Omit<StoragedPlant, 'hour'>;
    notificationId: string;
  }
}

export async function savePlant(plant: Omit<StoragedPlant, 'hour'>): Promise<void> {
  try {
    const nextTime = new Date(plant.dateTimeNotification);
    const now = new Date();

    const { times, repeat_every } = plant.frequency;
    if (repeat_every === 'week') {
      const interval = Math.trunc(7 / times);

      nextTime.setDate(now.getDate() + interval);
    } else {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000)
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Heey, 🌱',
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant
        },
      },
      trigger: {
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true,
      }
    });

    const data = await AsyncStorage.getItem('@PlantManager:plants');
    const plants = data ? JSON.parse(data) as StoragedPlantsPros : {};

    plants[plant.id] = {
      data: plant,
      notificationId
    }

    await AsyncStorage.setItem(
      '@PlantManager:plants',
      JSON.stringify(plants)
    );

  } catch (error) {
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<StoragedPlant[]> {
  try {
    const data = await AsyncStorage.getItem('@PlantManager:plants');
    const plants = data ? JSON.parse(data) as StoragedPlantsPros : {};

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

  } catch (error) {
    throw new Error(error);
  }
}

export async function removePlant(id: string): Promise<void> {
  const data = await AsyncStorage.getItem('@PlantManager:plants');
  const plants = data ? JSON.parse(data) as StoragedPlantsPros : {};

  await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

  delete plants[id];

  await AsyncStorage.setItem(
    '@PlantManager:plants',
    JSON.stringify(plants)
  );
}