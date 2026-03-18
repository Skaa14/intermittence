import { act } from "@testing-library/react-native";

export const flushAsync = () => act(async () => {});
