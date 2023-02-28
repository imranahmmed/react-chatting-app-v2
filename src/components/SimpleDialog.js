import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { AiOutlineCamera } from 'react-icons/ai'
import { BsFillImageFill } from 'react-icons/bs'
import InputBox from '../components/InputBox'

function SimpleDialog(props) {
    const { onClose, open, handleMsgImageChange } = props;

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <List sx={{ pt: 0, pb: 0 }}>
                <ListItem disableGutters>
                    <label>
                        <input type="file" hidden onChange={handleMsgImageChange} />
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    <BsFillImageFill />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={"Gallary"} />
                        </ListItemButton>
                    </label>
                </ListItem>

                <ListItem disableGutters onClick={handleListItemClick}>
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                <AiOutlineCamera />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={"Camera"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default SimpleDialog