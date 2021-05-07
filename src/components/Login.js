import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import styled from 'styled-components';
import { db, auth, provider } from '../firebase';
import { useDispatch } from 'react-redux';
import { enterRoom } from '../features/appSlice';
import firebase from 'firebase';
function Login() {
  // const signIn = (e) => {
  //   e.preventDefault();
  //   auth.signInWithPopup(provider).catch((error) => alert(error.message));
  // };
  const [room, setRoom] = useState('');
  const [createRoom, setCreateRoom] = useState('');
  const [roomExist, setRoomExist] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinRoom = (e) => {
    e.preventDefault();
    console.log('try');
    // console.log(db.collection('rooms').add);
    setLoading(true);
    setError(null);
    db.collection('rooms')
      .doc(room)
      .get()
      .then((doc, err) => {
        if (doc.exists) {
          console.log('doc exist', doc.exists);
          firebase
            .auth()
            .signInAnonymously()
            .then(() => {
              // Signed in..
              console.log('signed in');
              setLoading(false);
              setRoomExist(true);
            })
            .catch((error) => {
              var errorCode = error.code;
              console.log(errorCode);
              var errorMessage = error.message;
              console.log(errorMessage);
              // ...
            });
        } else {
          setLoading(false);
          setError('Room not found');
        }
        console.log(doc);
      });
  };

  const handleDisplayName = (e) => {
    e.preventDefault();
    setLoading(true);
    const user = firebase.auth().currentUser;
    if (user) {
      user
        .updateProfile({ displayName })
        .then(() => {
          console.log(user.displayName);
          db.collection('rooms').doc(room).collection('users').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
            uid: user.uid,
          });
          setLoading(false);
          dispatch(enterRoom({ roomId: room }));
        })
        .catch((err) => console.log(err));
    }
  };

  const addChannel = (e) => {
    e.preventDefault();
    // console.log(db.collection('rooms').add);
    setLoading(true);
    if (createRoom) {
      db.collection('rooms')
        .add({
          name: createRoom,
        })
        .then(async (res) => {
          if (res.id) {
            firebase
              .auth()
              .signInAnonymously()
              .then(() => {
                // Signed in..
                console.log('signed in');
                // setRoomExist(true);

                const user = firebase.auth().currentUser;
                user.updateProfile({ displayName }).then(() => {
                  console.log(user.displayName);
                  db.collection('rooms').doc(res.id).collection('users').add({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    user: user.displayName,
                    master: true,
                    uid: user.uid,
                    userImage: user.photoURL,
                  });
                  setLoading(false);
                  dispatch(enterRoom({ roomId: res.id }));
                  console.log(user);
                });
              })
              .catch((error) => {
                var errorCode = error.code;
                console.log(errorCode);
                var errorMessage = error.message;
                console.log(errorMessage);
                // ...
              });
          }
        });
    }
  };

  return (
    <LoginContainer>
      <LoginInnerContainer>
        {!roomExist && (
          <>
            <JoinForm onSubmit={joinRoom}>
              <h1>Join A room</h1>
              <label htmlFor='joinRoomId'>Enter Room Id</label>
              <input
                name='joinRoomId'
                type='text'
                value={room}
                placeholder='Enter Room ID'
                onChange={(e) => setRoom(e.target.value)}
              />
              <button type='submit' disabled={loading}>
                {!loading ? 'Join' : 'Loading'}
              </button>
              {error && <p>{error}</p>}
            </JoinForm>
            <CreateForm onSubmit={addChannel}>
              <h1>Create A room</h1>
              <label htmlFor='room_name'>Enter Room Name</label>
              <input
                name='room_name'
                type='text'
                value={createRoom}
                placeholder='Enter Room Name'
                onChange={(e) => setCreateRoom(e.target.value)}
              />
              <label htmlFor='display_name'>Enter your Display Name</label>
              <input
                name='display_name'
                type='text'
                value={displayName}
                placeholder='Enter Display name'
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <button type='submit' disabled={loading}>
                {!loading ? 'Create' : 'Loading'}
              </button>
            </CreateForm>
          </>
        )}
        {roomExist && (
          <>
            <DisplayNameForm onSubmit={handleDisplayName}>
              <h1>Enter your display name</h1>
              <input
                type='text'
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <button type='submit' disabled={loading}>
                {!loading ? 'Submit' : 'Loading'}Submit
              </button>
            </DisplayNameForm>
          </>
        )}
      </LoginInnerContainer>
    </LoginContainer>
  );
}

export default Login;

const LoginContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
`;

const LoginInnerContainer = styled.div`
  /* padding: 0 50px; */
  text-align: center;
  display: flex;
  gap: 2rem;

  input {
    padding: 1rem;
    border: none;
    outline: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
  }
  button {
    padding: 1em 2em;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    outline: none;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    cursor: pointer;
  }
`;

const JoinForm = styled.form`
  padding: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color: rgb(255, 255, 255, 0.3);
  border-radius: 10px;

  h1 {
    margin-bottom: 2rem;
  }
  p {
    color: red;
  }
`;
const CreateForm = styled(JoinForm)``;
const DisplayNameForm = styled(JoinForm)``;
