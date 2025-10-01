import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const sendNewExpenseNotification = async (merchant: string, amount: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✅ New Expense Added",
      body: `An expense of ${amount.toFixed(2)} at ${merchant} has been automatically added from an SMS.`,
      data: { screen: 'Dashboard' },
    },
    trigger: null,
  });
};
