import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  "@global": {
    body: {
      margin: 0,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    ".w-100": {
      width: "100%",
    },
    ".d-flex": {
      display: "flex",
    },
    ".grow": {
      flexGrow: 1,
    },

    ".inventorycard": {
      width: '18rem' , 
      margin: "2rem", 
      display: "inline-block"
    },

    ".Orangewarning": {
      color: "orange",
      opacity: 0.75
    },

    ".rightbutton": {
      textAlign: "left",
    },

    ".Greenwarning": {
      color: "green",
      opacity: 0.75
    },


    ".Redwarning": {
      color: "red",
      opacity: 0.75
    },

    ".font-weight-bold": {
      fontWeight: "500 !important",
    },

    ".p-auto": { padding: "auto" },
    ...[0, 1, 2, 3, 4, 5].reduce(function (obj, i) {
      obj[`.p-${i}`] = { padding: theme.spacing(i) };
      return obj;
    }, {}),
    ...[0, 1, 2, 3, 4, 5].reduce(function (obj, i) {
      obj[`.pl-${i}`] = { paddingLeft: theme.spacing(i) };
      return obj;
    }, {}),
    ...[0, 1, 2, 3, 4, 5].reduce(function (obj, i) {
      obj[`.pr-${i}`] = { paddingRight: theme.spacing(i) };
      return obj;
    }, {}),
    ...[0, 1, 2, 3, 4, 5].reduce(function (obj, i) {
      obj[`.pb-${i}`] = { paddingBottom: theme.spacing(i) };
      return obj;
    }, {}),
    ...[0, 1, 2, 3, 4, 5].reduce(function (obj, i) {
      obj[`.px-${i}`] = {
        paddingLeft: theme.spacing(i),
        paddingRight: theme.spacing(i),
      };
      return obj;
    }, {}),
    ...[0, 1, 2, 3, 4, 5].reduce(function (obj, i) {
      obj[`.py-${i}`] = {
        paddingTop: theme.spacing(i),
        paddingBottom: theme.spacing(i),
      };
      return obj;
    }, {}),
  },
});

const GlobalStyles = () => null;

export default withStyles(styles, { withTheme: true })(GlobalStyles);
