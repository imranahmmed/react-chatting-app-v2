import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SimpleDialog from '../components/SimpleDialog'
import { AiOutlineCamera } from 'react-icons/ai'

export default function SimpleDialogDemo({ handleMsgImageChange, handleDialogClose, handleDialogOpen, dialogOpen }) {
    return (
        <div>
            <AiOutlineCamera onClick={handleDialogOpen} />
            <SimpleDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                handleMsgImageChange={handleMsgImageChange}
            />
        </div>
    );
}