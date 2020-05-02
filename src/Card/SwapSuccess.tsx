import React from "react";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Slide, { SlideProps } from '@material-ui/core/Slide';
type TransitionProps = Omit<SlideProps, 'direction'>;

type Props = {
  open: boolean;
  setOpen: (arg: boolean) => void;
};

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up" />;
}

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
    <div style={{fontSize:'24px'}}>
      <Snackbar TransitionComponent={TransitionUp}  anchorOrigin={{vertical: 'top', horizontal:'center'}} open={props.open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert  elevation={6} variant="filled" onClose={handleClose} severity="success">
          <div  className="flex-center">Card swap was successful</div>
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
