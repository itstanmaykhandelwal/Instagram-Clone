import { Button } from '@material-ui/core'
import React, { useState } from 'react';
import {storage, db} from './Firebase';
import firebase from 'firebase';
import './imageupload.css'

function Imageupload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0); 
    const [caption, setCaption] = useState(""); 

    const handleChange = (e) =>{
        if(e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                // Progress Function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) =>{
                // Error Function
                alert(error.message);
            },
            () => {
                // Complete Function
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    // post image inside Db
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )
    }
    
    return (
        <div className="imageupload">
        <progress className="progress" value={progress} max="100" />
            <input type="text" placeholder="Enter a Caption..." onChange={event => setCaption(event.target.value)} />
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default Imageupload
