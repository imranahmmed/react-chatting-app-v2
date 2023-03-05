import React, { useState, useEffect } from 'react';
import { getDatabase, set, push, ref, onValue, update } from 'firebase/database';

function NewMassages() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [readCount, setReadCount] = useState(0);
    const db = getDatabase()

    useEffect(() => {
        const messageRef = ref(db, "singleMassege");
        onValue(messageRef, (snapshot) => {
            const message = snapshot.val();
            console.log(message)

            if (message.read) {
                setUnreadCount(count => count + 1);
            }else{
                setReadCount(count => count + 1)
            }
        });
        // Clean up the listener when the component unmounts
        return () => {
            messageRef.off('child_added');
        };
    }, []);

    return (
        <div>
            <p>Unread messages: {unreadCount}</p>
            <p>Read messages: {readCount}</p>
        </div>
    );
}

export default NewMassages;
