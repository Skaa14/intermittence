export type MockPickerCallback = (event: any, date?: Date) => void;

export const mockPickerCallbacksByTestID: Record<string, MockPickerCallback> = {};

export const resetPickerCallbacks = () => {
  Object.keys(mockPickerCallbacksByTestID).forEach(
    (key) => delete mockPickerCallbacksByTestID[key]
  );
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
