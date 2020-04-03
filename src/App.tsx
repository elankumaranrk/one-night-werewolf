import { colors } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import LockIcon from "@material-ui/icons/Lock";
import React from "react";
import withFBAuth, { WrappedComponentProps } from "react-with-firebase-auth";
import App from "./Game";
import { SignIn, UserContext } from "./Authentication";
import * as fbApp from "./Firebase";

const theme = createMuiTheme({
  overrides: {
    MuiAvatar: {
      colorDefault: {
        backgroundColor: "#263668"
      }
    },
    MuiDialog: {
      paper: {
        color: "#fff",
        backgroundColor: "#263668"
      }
    },
    MuiFormLabel: {
      root: {
        color: colors.yellow[400]
      }
    },
    MuiInputBase: {
      formControl: {
        color: colors.yellow[400],
        borderBottom: `1px solid ${colors.yellow[100]}`
      }
    },
    MuiSelect: {
      icon: {
        color: colors.yellow[400]
      }
    },
    MuiChip: {
      colorPrimary: {
        color: "#fff"
      }
    }
  },
  palette: {
    primary: colors.yellow,
    secondary: colors.yellow,
    action: {
      disabled: "#999",
      disabledBackground: "#49557d"
    }
  }
});

function FirebaseApp({
  signInWithGoogle,
  signOut,
  user
}: WrappedComponentProps) {
  if (!user) return <SignIn signInWithGoogle={signInWithGoogle} />;

  return (
    <ThemeProvider theme={theme}>
      <div className="flex-center">
        <header>
          <Button
            color="secondary"
            onClick={signOut}
            style={{ width: 320, margin: 8 }}
            startIcon={<LockIcon />}>
            Sign Out
          </Button>
          <h1>
            <span>One Night Werewolf</span>
          </h1>
        </header>

        <React.Fragment>
          <UserContext.Provider value={user}>
            <App />
          </UserContext.Provider>
        </React.Fragment>
      </div>
    </ThemeProvider>
  );
}

export default withFBAuth(fbApp)(FirebaseApp);
