import { useState } from "react";
import { LayoutAnimation } from "react-native";

export function useAnimatedToggle(initial = false): [boolean, () => void] {
  const [expanded, setExpanded] = useState(initial);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return [expanded, toggle];
}
