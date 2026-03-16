import { fireEvent, screen, act } from "@testing-library/react-native";

export type MockPickerCallback = (event: any, date?: Date) => void;

export const mockPickerCallbacksByTestID: Record<string, MockPickerCallback> = {};

export const resetPickerCallbacks = () => {
  Object.keys(mockPickerCallbacksByTestID).forEach(
    (key) => delete mockPickerCallbacksByTestID[key]
  );
};

export const selectDatePicker = (btnTestID: string, pickerTestID: string, isoDate: string) => {
  fireEvent.press(screen.getByTestId(btnTestID));
  const callback = mockPickerCallbacksByTestID[pickerTestID];
  act(() => {
    callback({ type: "set" }, new Date(isoDate + "T00:00:00"));
  });
};

export const mockDateTimePickerFactory = () => {
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: (props: any) => {
      if (props.testID) {
        mockPickerCallbacksByTestID[props.testID] = props.onChange;
      }
      return (
        <View testID={props.testID ?? "datetime-picker"}>
          <Text testID="picker-value">{props.value?.toISOString()}</Text>
        </View>
      );
    },
  };
};
