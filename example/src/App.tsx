import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import RnScheduleAvailability from 'rn-schedule-availability';

export default function App() {
  return (
    <View style={styles.container}>
      <RnScheduleAvailability />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
