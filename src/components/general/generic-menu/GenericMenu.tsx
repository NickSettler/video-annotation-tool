import {
  ButtonProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from '@mui/material';
import { JSX, ReactNode, useState, MouseEvent } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

export type TGenericMenuAction = {
  label: string;
  icon?: SvgIconComponent;
  action(): void;
};

export type TGenericMenuProps = {
  children: ReactNode;
  actions: Array<TGenericMenuAction>;
  isDense?: boolean;
  size?: ButtonProps['size'];
};

export const GenericMenu = ({
  children,
  actions,
  isDense,
  size,
}: TGenericMenuProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick} size={size}>
        {children}
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuList dense={isDense} disablePadding>
          {actions.map(({ label, icon: ActionIcon, action }) => (
            <MenuItem key={label} onClick={action}>
              {ActionIcon && (
                <ListItemIcon>
                  <ActionIcon fontSize={'small'} />
                </ListItemIcon>
              )}
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};
