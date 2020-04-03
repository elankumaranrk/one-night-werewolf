import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Roles from "../Roles";

const options = [...Object.keys(Roles)];

type Props = {
  children: React.ReactChild
  selected: string;
  onSelect: (role: string) => void;
};

export default function RolePicker({ onSelect, selected, children }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (item: string) => {
    setAnchorEl(null);
    onSelect(item);
  };

  return (
    <>
      <Button
        variant="text"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}>
       {children}
      </Button>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}>
        {options.map(option => (
          <MenuItem
            key={option}
            selected={option === selected}
            onClick={() => handleMenuItemClick(option)}>
            <ListItemIcon>
              <Avatar
                src={option === Roles.None ? '' : `images/cards/${option.toLowerCase()}.png`}
                style={{ width: 32, height: 32 }}>
                --
              </Avatar>
            </ListItemIcon>
            <Typography variant="inherit"> {option}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
