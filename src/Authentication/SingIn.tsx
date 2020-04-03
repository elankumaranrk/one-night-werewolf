import React, { ReactElement } from "react";
import clsx from "clsx";
import GoogleButton from "react-google-button";
import { makeStyles, createStyles } from "@material-ui/core";

interface Props {
  className?: string;
  signInWithGoogle?: (event: React.MouseEvent) => void;
}

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      height: '100vh'
    },
    pretitle: {
      fontWeight: 100
    },
    title: {
      fontWeight: 300
    },
    subtitle: {
      marginTop: theme.spacing(8),
      opacity: 0.5
    }
  })
);

function SingIn(props: Props): ReactElement {
  const classes = useStyles();
  const { className, signInWithGoogle } = props;
  return (
    <div className={clsx(classes.root, className)}>
      <h1 className={classes.pretitle}>
         <span className={classes.title}>One Night Werewolf</span>
      </h1>
      <GoogleButton type="light" onClick={signInWithGoogle} />
      <span className={classes.subtitle}>Sign in to play with your friends </span>
    </div>
  );
}

export default SingIn;
