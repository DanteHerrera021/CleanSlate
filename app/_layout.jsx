// app/_layout.js
import { useEffect } from "react";
import { Slot } from "expo-router";
import * as SystemUI from "expo-system-ui";
import colors from "../constants/colors";

export default function Layout() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.secondary);
  }, []);

  return <Slot />;
}
