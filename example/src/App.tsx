import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import RnScheduleAvailability from 'rn-schedule-availability';

const daysOfWeek = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
];

export default function App() {
  const scheduleRef = React.createRef<any>();

  const handleSubmit = React.useCallback(() => {
    if (scheduleRef.current) {
      const schedules = scheduleRef.current.submit();
      console.log(schedules);
    }
  }, [scheduleRef]);

  const intialValues = [
    [
      { startTime: '12:31', endTime: '23:12', week_day: 1 },
      { startTime: '12:34', endTime: '23:15', week_day: 1 },
    ],
    [{ startTime: '08:00', endTime: '18:00', week_day: 2 }],
    [{ startTime: '08:00', endTime: '18:00', week_day: 3 }],
    [{ startTime: '08:00', endTime: '18:00', week_day: 4 }],
    [{ startTime: '08:00', endTime: '18:00', week_day: 5 }],
    [{ startTime: '08:00', endTime: '18:00', week_day: 6 }],
    [{ startTime: '08:00', endTime: '18:00', week_day: 7 }],
  ];

  return (
    <View style={styles.container}>
      <RnScheduleAvailability
        initialValues={intialValues}
        disabled={false}
        daysOfWeek={daysOfWeek}
        // onChange={console.log}
        ref={scheduleRef}
      />
      <Button onPress={handleSubmit} title="Submit" />
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
