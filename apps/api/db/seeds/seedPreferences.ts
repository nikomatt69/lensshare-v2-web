import { prisma } from '../seed';

const seedPreferences = async (): Promise<number> => {
  const preferences = await prisma.preference.createMany({
    data: [
      {
        highSignalNotificationFilter: true,
        id: '0x0d',
        isPride: true
      },
      {
        highSignalNotificationFilter: true,
        id: '0x06',
        isPride: true
      },
      {
        highSignalNotificationFilter: true,
        id: '0x933b',
        isPride: true
      }
    ]
  });

  return preferences.count;
};

export default seedPreferences;
