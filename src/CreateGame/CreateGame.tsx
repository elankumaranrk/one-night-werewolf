import Button from '@material-ui/core/Button';
import Dialog from './CreateGameDialog'
import React from 'react';


export default function SimpleDialogDemo({onCreate, disabled = false}: {onCreate: (args: string[]) => void, disabled?: boolean}) {
    const [open, setOpen] = React.useState(false);
    const [players, setPlayers] = React.useState<string[]>([]);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const handleGenerate = () => {
        setOpen(false);
        onCreate(players);
      };


    return (
      <div className="flex-wrap">
        <Button disabled={disabled} style={{margin:'8px', width:'320px'}} variant="outlined" color="secondary" onClick={handleOpen}>
          New Game
        </Button>
        <Dialog players={players} setPlayers={setPlayers} onGenerate={handleGenerate} open={open} onClose={handleClose} />
      </div>
    );
  }