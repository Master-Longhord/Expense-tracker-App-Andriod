import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  AddExpense: undefined;
};

export type AppNavigatorProps = NativeStackNavigationProp<RootStackParamList>;