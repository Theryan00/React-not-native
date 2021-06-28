import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";

const primary = "#000";
const secondary = "#f5f5f5";
const black = "#343a40";
const background = "#fff";
const darkBlack = "rgb(36, 40, 44)";
const warningLight = "rgba(253, 200, 69, .3)";
const warningMain = "rgba(253, 200, 69, .5)";
const warningDark = "rgba(253, 200, 69, .7)";

export const lightTheme = createMuiTheme({
  palette: {
    primary: { main: primary },
    secondary: { main: secondary },
    common: {
      black,
      darkBlack,
    },
    warning: {
      light: warningLight,
      main: warningMain,
      dark: warningDark,
    },
    background: {
      default: background,
    },
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    primary: { main: primary },
    secondary: { main: secondary },
    common: {
      black,
      darkBlack,
    },
    warning: {
      light: warningLight,
      main: warningMain,
      dark: warningDark,
    },
    background: {
      default: background,
    },
  },
});

//export default responsiveFontSizes(theme);
