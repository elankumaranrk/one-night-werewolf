import Chip from "@material-ui/core/Chip";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogContent from '@material-ui/core/DialogContent';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";
import { firebaseApp } from "../Firebase";

type User = {
  name: string;
  id: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    chip: {
      margin: 2
    },
    noLabel: {
      marginTop: theme.spacing(3)
    }
  })
);

type Props = {
  players: string[]
  setPlayers: (arg:any) => void;
  open: boolean;
  onClose: () =>void;
  onGenerate: () => void
}


export default function CreateGame({players, setPlayers, open, onClose, onGenerate}: Props) {
  const [users, setUsers] = React.useState<User[]>([]);

  React.useEffect(() => {
    const temp: User[] = [];
    firebaseApp
      .firestore()
      .collection("users")
      .onSnapshot(snapshot => {
        snapshot.docs.forEach(user => {
          temp.push({
            id: user.id,
            name: user.data().name
          });
        });
      });
    setUsers(temp);
  }, []);
  const classes = useStyles();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="simple-dialog-title">Create Game</DialogTitle>
     <DialogContent style={{width: 320, height: 120}}>
     <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">Select Players</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={players}
          onChange={setPlayers}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip
                  key={value}
                  label={users.find(u => u.id === value)?.name}
                  className={classes.chip}
                />
              ))}
            </div>
          )}
          MenuProps={MenuProps}>
          {users.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
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
