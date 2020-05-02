import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  createStyles,
  makeStyles,
  withStyles,
  Theme,
} from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import React from "react";
import useRemoteData from '../useRemoteData'
import { Avatar } from "@material-ui/core";
import { UserContext } from "../Authentication";

type User = {
  name: string;
  id: string;
  photo: string;
  status: string;
};

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "$ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  })
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth:240
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
    },
    chip: {
      minWidth: 240,
      margin: '8px 0px',
    },
    avatar: {
      marginRight: 12,
    },
    label: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

type Props = {
  players: string[];
  setPlayers: (arg: any) => void;
  open: boolean;
  onClose: () => void;
  onGenerate: () => void;
};

export default function CreateGame({
  players,
  setPlayers,
  open,
  onClose,
  onGenerate,
}: Props) {
  const currentUser = React.useContext(UserContext);
  const { users } = useRemoteData(currentUser);
  const classes = useStyles();

  const updatePlayers = (id: string) => {
    if (players.indexOf(id) >= 0) {
      setPlayers([...players.filter((it) => it !== id)]);
    } else {
      setPlayers([...players, id]);
    }
  };

  if(!users) {
    return null;
  }
  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Create Game</DialogTitle>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <div className={classes.chips}>
            {Object.keys(users).map((key, idx) => (
              <FormControlLabel
                className={classes.chip}
                key={key}
                control={
                  <Checkbox
                    color={"secondary"}
                    key={idx}
                    checked={players.indexOf(key) >= 0}
                    onChange={() => updatePlayers(key)}
                    inputProps={{ "aria-label": "primary checkbox" }}
                  />
                }
                label={
                  <span className={classes.label}>
                    {users[key].active ? (
                      <StyledBadge
                        showZero
                        className={classes.avatar}
                        overlap="circle"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot">
                        <Avatar alt={users[key].name} src={users[key].photo} />
                      </StyledBadge>
                    ) : (
                      <Avatar  className={classes.avatar} alt={users[key].name} src={users[key].photo} />
                    )}
                    {users[key].name}{" "}
                  </span>
                }
              />
            ))}
          </div>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onGenerate} color="primary" autoFocus>
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
}
