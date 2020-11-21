import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import RnScheduleAvailability from 'rn-schedule-availability';

export default function App() {
  const daysOfWeek = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ];

  return (
    <View style={styles.container}>
      <RnScheduleAvailability disabled={false} daysOfWeek={daysOfWeek} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
