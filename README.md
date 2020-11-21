# RnScheduleAvailability

Component used to schedule times of week

## Installation

```sh
npm install rn-schedule-availability
```

## Usage

```js
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

  return (
    <View style={styles.container}>
      <RnScheduleAvailability
        disabled={false}
        daysOfWeek={daysOfWeek}
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
