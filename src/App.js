import React, { useState ,useEffect } from 'react'
import './App.css'
import Post from './Post'
import {auth, db} from './Firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import Imageupload from './Imageupload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles()
  const [modalStyle] = useState(getModalStyle)
  const [openSignIn, setOpenSignIn] = useState(false)
  const [posts, setPosts] =useState([]);
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() =>{
    const unsubscribe = auth.onAuthStateChanged((authUser) =>{
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null)
      }
    })
    return () =>{
      unsubscribe();
    }
  }, [user, username]);

    useEffect(() =>{
      db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({
          id:doc.id,
          post:doc.data()
        })));
      })
    }, [])

    const signUp = (event) => {
        event.preventDefault();
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName:username
          })
        })
        .catch((error) => alert(error.message))
    }

    const signIn = (event) => {
      event.preventDefault();

      auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false)
    }

    return (
    <div className="app" >
     <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_sign">
          <center>
            <img className="app_header_image"
              src= "https://www.pngkey.com/png/full/28-287308_instagram-logo-text-white.png" 
              alt="logo"
            />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              
              <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
          
        </div> 
      </Modal>

      <Modal 
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
       <div style={modalStyle} className={classes.paper}>
          <form className="app_sign">
          <center>
            <img className="app_header_image"
              src= "https://www.pngkey.com/png/full/28-287308_instagram-logo-text-white.png" 
              alt="logo"
            />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
            <Input
              placeholder="password"
              type="password"
              val-ue={password}
              onChange={(e) => setPassword(e.target.value)}
              />
              
              <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
          
        </div> 
      </Modal>
      
      
      <div className="app_header">
        <img className="app_header_image"
        src= "https://www.pngkey.com/png/full/28-287308_instagram-logo-text-white.png" 
        alt="logo"
        />
        {user  ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>    
        ):(
          <div className="app_login">
          <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>   
          <Button onClick={() => setOpen(true)}>Sign Up</Button>   
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {
            posts.map(({id, post}) =>(
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app_postsRight">
         <InstagramEmbed
  url='https://instagr.am/p/Zw9o4/'
  clientAccessToken='123|456'
  maxWidth={320}
  hideCaption={false}
  containerTagName='div'
  protocol=''
  injectScript
  onLoading={() => {}}
  onSuccess={() => {}}
  onAfterRender={() => {}}
  onFailure={() => {}}
/>
        </div> 
      </div>   

      


      {user?.displayName ? (
        <Imageupload username={user.displayName} />
      ): (
        <h3 className="display_Login">Sorry you need to Login to Upload</h3>
      )}
     
    </div>
  )
}

export default App;