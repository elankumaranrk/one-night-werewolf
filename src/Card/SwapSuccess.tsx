import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

type Props = {
  open: boolean;
  setOpen: (arg: boolean) => void;
};

export default function SwapSuccess(props: Props) {
  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    props.setOpen(false);
  };

  return (
    <div>
      <Snackbar open={props.open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
          Card swap was successful
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
