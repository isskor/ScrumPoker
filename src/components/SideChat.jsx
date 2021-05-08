import React, { useEffect, useRef, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { db, auth } from '../firebase';
import firebase from 'firebase';
import { selectRoomId } from '../features/appSlice';
import { useAuthState } from 'react-firebase-hooks/auth';
import Message from './Message';
import styled from 'styled-components';

const SideChat = () => {
  const roomId = useSelector(selectRoomId);
  const [user] = useAuthState(auth);
  const chatRef = useRef(null);
  const [roomMessages, loading] = useCollection(
    roomId &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
  );
  const [text, setText] = useState('');

  const handleMessage = (e) => {
    e.preventDefault();
    setText('');
    db.collection('rooms').doc(roomId).collection('messages').add({
      message: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.displayName,
      userImage: user.photoURL,
    });
  };

  useEffect(() => {
    chatRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages, loading]);

  return (
    <>
      <Chat>
        <div className='ChatWrapper'>
          {roomMessages?.docs.map((m) => {
            const { message, timestamp, user } = m.data();
            return (
              <Message
                message={message}
                timestamp={timestamp}
                user={user}
                key={m.id}
              />
            );
          })}
          <div ref={chatRef}></div>
        </div>
      </Chat>
      <ChatForm onSubmit={handleMessage}>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Chat message'
        />
      </ChatForm>
    </>
  );
};

export default SideChat;
const Chat = styled.div`
  height: 100%;
  background: rgb(255, 255, 255, 0.5);
  overflow-y: scroll;
  width: 100%;
  .ChatWrapper {
    padding-bottom: 3rem;
  }
`;
const ChatForm = styled.form`
  input {
    width: calc(100% - 2rem);
    background: rgb(255, 255, 255, 0.5);
    padding: 1rem;
    border: none;
    border-top: 1px solid rgb(0, 0, 0, 0.2);
    border-radius: 0 0 1rem 1rem;
    outline: none;
  }
`;
