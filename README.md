# RnScheduleAvailability

Component used to schedule times of week

## Installation

```sh
npm install rn-schedule-availability
```

## Usage

```js
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
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
