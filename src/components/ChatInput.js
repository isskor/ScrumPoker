import { Button } from '@material-ui/core';
import { useState } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

function ChatInput({ channelName, channelId, chatRef }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const sendMessage = (e) => {
    e.preventDefault();
    if (!channelId) return;

    db.collection('rooms').doc(channelId).collection('messages').add({
      message: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.displayName,
      userImage: user.photoURL,
    });

    chatRef?.current?.scrollIntoView({ behavior: 'smooth' });

    setInput('');
  };

  const [users, loading] = useCollection(
    channelId &&
      db
        .collection('rooms')
        .doc(channelId)
        .collection('users')
        .orderBy('timestamp', 'asc')
  );

  // const joinChannel = () => {
  //   db.collection('rooms').doc(channelId).collection('users').add({
  //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //     user: user.uid,
  //     // user: user.displayName,
  //     userImage: user.photoURL,
  //   });
  // };
  // console.log(user);
  // if (users) console.log('users', users?.docs);

  return (
    <>
      <ChatInputContainer>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'Enter Task or Question'}
          />
          <button type='submit' onClick={sendMessage}>
            Submit
          </button>
        </form>
      </ChatInputContainer>
    </>
  );
}

export default ChatInput;
const ChatInputContainer = styled.div`
  border-radius: 20px;

  > form {
    position: relative;
    display: flex;
    justify-content: center;
  }

  > form > input {
    bottom: 30px;
    width: 70%;
    border: 1px solid gray;
    border-radius: 1rem 0 0 1rem;
    border: none;
    outline: none;
    padding: 20px;
  }
  button {
    background: white;
    border: none;
    outline: none;
    font-size: 1rem;
    border-radius: 0 1rem 1rem 0;
    padding: 1em;
    cursor: pointer;
  }
`;
