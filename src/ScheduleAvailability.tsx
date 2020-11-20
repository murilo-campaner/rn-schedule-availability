import React, {
  createRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';

import Carousel from 'react-native-snap-carousel';
import { TextInputMask } from 'react-native-masked-text';

interface ScheduleAvailabilityProps {
  disabled?: boolean;
  daysOfWeek?: string[];
}

const ScheduleAvailability = ({
  disabled = false,
  daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
}: ScheduleAvailabilityProps) => {
  const [inputs, setInputs] = useState(
    daysOfWeek.map(() => [<TimeInput ref={createRef()} />])
  );

  const handleAddInput = useCallback((dayIndex: number) => {
    setInputs((prevState) => {
      const inputsList = [...prevState];
      inputsList[dayIndex] = [
        ...inputsList[dayIndex],
        <TimeInput ref={createRef()} initialValue="" />,
      ];
      return inputsList;
    });
  }, []);

  const handleRemoveInput = useCallback(
    (dayIndex: number, inputIndex: number) => {
      setInputs((prevState) => {
        const inputsList = [...prevState];
        if (!inputsList[dayIndex] || !inputsList[dayIndex][inputIndex]) {
          return prevState;
        }

        inputsList[dayIndex].splice(inputIndex, 1);
        return inputsList;
      });
    },
    []
  );

  const handleSubmit = useCallback(() => {
    const values = inputs.map((day: any) => {
      return day.map((input: any) => input.ref.current.getValue());
    });
    console.log(values);
    return values;
  }, [inputs]);

  const renderWeekDay = useCallback(
    ({ item: day, index: dayIndex }: { item: string; index: number }) => {
      const isLastItem = dayIndex === daysOfWeek.length - 1;
      const runtimeStyle = { borderLeftWidth: isLastItem ? 1 : 0 };
      return (
        <View style={[styles.weekDayView, runtimeStyle]}>
          <Text style={styles.weekDayTitle}>{day}</Text>
          <View style={styles.weekDayInputs}>
            {inputs[dayIndex].map((input, index) =>
              React.cloneElement(input, {
                key: `${dayIndex}_${index}`,
                onRemovePress: () => handleRemoveInput(dayIndex, index),
              })
            )}
          </View>
          <TouchableOpacity onPress={() => handleAddInput(dayIndex)}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [handleAddInput, inputs, handleRemoveInput, daysOfWeek]
  );

  return (
    <View style={styles.wrapper} pointerEvents={disabled ? 'none' : 'auto'}>
      <View style={styles.carouselWrapper}>
        <Carousel
          data={daysOfWeek}
          activeSlideAlignment="start"
          renderItem={renderWeekDay}
          itemWidth={Dimensions.get('screen').width / 1.5}
          sliderWidth={Dimensions.get('screen').width}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
        />
      </View>
      <TouchableOpacity onPress={handleSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const TimeInput = forwardRef(
  (
    { onRemovePress = () => {}, initialValue = '08:00 - 18:00' }: any,
    ref: any
  ) => {
    const [value, setValue] = useState(initialValue);
    // const [oldValue, setOldValue] = useState('');

    useImperativeHandle(ref, () => ({
      getValue: () => {
        const [startTime, endTime] = value
          .split('-')
          .map((time: string) => time.trim());
        return {
          startTime,
          endTime,
        };
      },
    }));

    // const handleFocus = useCallback(() => {
    //   if (value === initialValue) {
    //     setOldValue(value);
    //     setValue('');
    //   }
    // }, [value, initialValue]);

    // const handleBlur = useCallback(() => {
    //   if (value === '') {
    //     setValue(oldValue);
    //   }
    // }, [value, oldValue]);

    return (
      <View style={styles.timeTextInputWrapper}>
        <TextInputMask
          style={[styles.timeTextInput, styles.timeTextInputShadow]}
          type="custom"
          options={{
            mask: '99:99 - 99:99',
          }}
          value={value}
          onChangeText={setValue}
          refInput={ref}
          placeholder="08:00 - 18:00"
          // onFocus={handleFocus}
          // onBlur={handleBlur}
        />
        <TouchableOpacity
          onPress={onRemovePress}
          style={styles.timeTextInputRemoveBtn}
        >
          <Text style={styles.timeTextInputRemoveBtnIcon}>-</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {},
  carouselWrapper: {},
  weekDayView: {
    minHeight: 200,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(84, 188, 120, 0.1)',
  },
  weekDayTitle: {
    fontSize: 14 / PixelRatio.getFontScale(),
    textAlign: 'center',
    color: '#6F6F6F',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  weekDayInputs: {},
  timeTextInputWrapper: {
    position: 'relative',
  },
  timeTextInput: {
    height: 40,
    backgroundColor: '#FFF',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    paddingHorizontal: 8,
    marginVertical: 8,
    borderLeftColor: '#54BC78',
    borderLeftWidth: 3,
  },
  timeTextInputShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    elevation: 5,
  },
  timeTextInputRemoveBtn: {
    top: '50%',
    marginTop: -8,
    right: 8,
    position: 'absolute',
    backgroundColor: '#B93F3F',
    width: 16,
    height: 16,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 1,
  },
  timeTextInputRemoveBtnIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ScheduleAvailability;
