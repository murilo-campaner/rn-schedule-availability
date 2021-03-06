import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
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
import moment from 'moment';

interface ScheduleAvailabilityProps {
  disabled?: boolean;
  daysOfWeek?: string[];
  onChange?: (data: { hasError: any; values: any[] }) => any;
  initialValues?: any;
}

const defaultWeekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const ScheduleAvailability = (
  {
    disabled = false,
    daysOfWeek = defaultWeekDays,
    onChange = () => {},
    initialValues = {},
  }: ScheduleAvailabilityProps,
  ref: any
) => {
  const isMounted = useRef(false);
  const [inputs, setInputs] = useState(daysOfWeek.map(() => [] as any));

  const handleSubmit = useCallback(() => {
    let hasError = false;
    const values = inputs.map((day: any) => {
      const times = day.map((input: any) => {
        if (input.ref.current) {
          const data = input.ref.current.getValue();
          hasError = hasError || data.errors.length > 0;
          return data;
        }
        return null;
      });
      return times;
    });

    return {
      hasError,
      values,
    };
  }, [inputs]);

  const handleChanges = useCallback(() => {
    const values = handleSubmit();
    onChange(values);
  }, [handleSubmit, onChange]);

  const handleAddInput = useCallback(
    (dayIndex: number, initialValue: any = null) => {
      setInputs((prevState) => {
        const inputsList = [...prevState];
        inputsList[dayIndex].push(
          <TimeInput
            ref={createRef()}
            initialValue={initialValue}
            onChange={handleChanges}
            key={`${dayIndex}_${Math.random()}`}
          />
        );
        return inputsList;
      });
      // Dont call handleChange on firstMount
      if (isMounted.current) {
        handleChanges();
      }
    },
    [handleChanges]
  );

  const handleRemoveInput = useCallback(
    (dayIndex: number, inputIndex: number) => {
      setInputs((prevState: any) => {
        const inputsList = [...prevState];
        if (!inputsList[dayIndex] || !inputsList[dayIndex][inputIndex]) {
          return prevState;
        }
        inputsList[dayIndex].splice(inputIndex, 1);
        return inputsList;
      });
      handleChanges();
    },
    [handleChanges]
  );

  // const mergeRanges = (timesList: [any]) => {
  //   // sort by start times, slice will return a shallow copy of the array, not affecting original array
  //   const sortedMeetings = timesList.slice().sort((a: any, b: any) => {
  //     return a.startTime > b.startTime ? 1 : -1;
  //   });

  //   // initialize mergedMeetings with the earliest meeting
  //   const mergedMeetings = [sortedMeetings[0]];

  //   for (let i = 1; i < sortedMeetings.length; i++) {
  //     const currentMeeting = sortedMeetings[i];
  //     const lastMergedMeeting = mergedMeetings[mergedMeetings.length - 1];

  //     // if the current and last meetings overlap, use the latest end time
  //     // objects, and arrays (which are objects) all are passed by reference. thus change will be recorded.
  //     if (currentMeeting.startTime <= lastMergedMeeting.endTime) {
  //       lastMergedMeeting.endTime = Math.max(
  //         lastMergedMeeting.endTime,
  //         currentMeeting.endTime
  //       );

  //       // add the current meeting since it doesn't overlap
  //     } else {
  //       mergedMeetings.push(currentMeeting);
  //     }
  //   }

  //   return mergedMeetings;
  // };

  const renderWeekDay = useCallback(
    ({ item: day, index: dayIndex }: { item: string; index: number }) => {
      const isLastItem = dayIndex === daysOfWeek.length - 1;
      const runtimeStyle = {
        borderLeftWidth: isLastItem ? 1 : 0,
        borderRightWidth: isLastItem ? 0 : 1,
      };
      return (
        <View style={[styles.weekDayView, runtimeStyle]}>
          <Text style={styles.weekDayTitle}>{day}</Text>
          <View style={styles.weekDayInputs}>
            {inputs[dayIndex].map((input: any, index: number) =>
              React.cloneElement(input, {
                key: input.key,
                onRemovePress: () => handleRemoveInput(dayIndex, index),
              })
            )}
          </View>
          <View style={styles.timeTextInputAddBtnWrapper}>
            <TouchableOpacity
              style={styles.timeTextInputAddBtn}
              onPress={() => handleAddInput(dayIndex)}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Text style={styles.timeTextInputAddIcon}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [handleAddInput, inputs, handleRemoveInput, daysOfWeek]
  );

  useEffect(() => {
    if (!isMounted.current) {
      if (Array.isArray(initialValues) && initialValues.length > 0) {
        initialValues.forEach((dayList: any[], dayIndex: number) => {
          dayList.forEach((input) => {
            const value =
              dayList.length === 0
                ? null
                : `${input.startTime} - ${input.endTime}` || null;
            handleAddInput(dayIndex, value);
          });
        });
      }
      isMounted.current = true;
    }
  }, [inputs, handleChanges, initialValues, handleAddInput]);

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }));

  const disabledOpacity = disabled ? 0.5 : 1;

  return (
    <View
      style={[styles.wrapper, { opacity: disabledOpacity }]}
      pointerEvents={disabled ? 'none' : 'auto'}
    >
      <Carousel
        data={daysOfWeek}
        activeSlideAlignment="center"
        renderItem={renderWeekDay}
        itemWidth={Dimensions.get('screen').width / 1.5}
        sliderWidth={Dimensions.get('screen').width}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        containerCustomStyle={styles.carouselContainer}
      />
    </View>
  );
};

const TimeInput = forwardRef(
  (
    { onRemovePress = () => {}, initialValue = null, onChange = () => {} }: any,
    ref: any
  ) => {
    const [value, setValue] = useState(initialValue);
    const [oldValue, setOldValue] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const inputPlaceholder = initialValue ? initialValue : '08:00 - 18:00';

    useImperativeHandle(ref, () => ({
      getValue: () => {
        let startTime, endTime;
        if (value) {
          [startTime, endTime] = value
            .split('-')
            .map((time: string) => time.trim());
        }

        return {
          startTime: startTime || null,
          endTime: endTime || null,
          errors,
        };
      },
    }));

    const handleFocus = useCallback(() => {
      if (value === initialValue) {
        setOldValue(value);
        setValue('');
      }
    }, [value, initialValue]);

    const handleBlur = useCallback(() => {
      if (value === '') {
        setValue(oldValue);
        return;
      }
    }, [value, oldValue]);

    const validateField = useCallback((text: string = '') => {
      const [initialTime, endTime] = text.split(' - ');
      const momentInitialTime = moment(initialTime, 'HH:mm');
      const momentEndTime = moment(endTime, 'HH:mm');

      let inputErrors = [];
      if (!momentInitialTime.isValid()) {
        inputErrors.push('A data inicial é inválida');
      } else if (!momentEndTime.isValid()) {
        inputErrors.push('A data final é inválida');
      } else if (momentInitialTime.isAfter(momentEndTime)) {
        inputErrors.push('A data inicial não pode ser posterior à data final');
      }

      setErrors(inputErrors.length ? inputErrors : []);

      return inputErrors;
    }, []);

    const handleChangeText = useCallback(
      (text: string) => {
        setValue(text);
        onChange(text);
      },
      [onChange]
    );

    useEffect(() => {
      validateField(value);
    }, [validateField, value]);

    return (
      <View style={styles.timeTextInputWrapper}>
        <TextInputMask
          style={[
            styles.timeTextInput,
            styles.timeTextInputShadow,
            errors.length > 0 && styles.timeTextInputError,
          ]}
          type="custom"
          options={{
            mask: '99:99 - 99:99',
          }}
          value={value}
          onChangeText={handleChangeText}
          refInput={ref}
          placeholder={inputPlaceholder}
          keyboardType="number-pad"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <TouchableOpacity
          onPress={onRemovePress}
          style={styles.timeTextInputRemoveBtn}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text style={styles.timeTextInputRemoveBtnIcon}>-</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {},
  carouselContainer: {
    minHeight: 200,
    flexGrow: 0,
    backgroundColor: 'rgba(84, 188, 120, 0.1)',
  },
  weekDayView: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: '#E6E6E6',
    borderRightWidth: 1,
    flexGrow: 1,
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
  timeTextInputError: {
    shadowColor: '#B93F3F',
    borderLeftColor: '#B93F3F',
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
  timeTextInputAddBtnWrapper: {
    marginTop: 8,
    display: 'flex',
    alignItems: 'center',
  },
  timeTextInputAddBtn: {
    backgroundColor: '#54BC78',
    width: 22,
    height: 22,
    borderRadius: 11,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeTextInputAddIcon: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default forwardRef(ScheduleAvailability);
