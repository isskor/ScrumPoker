import { useState } from 'react';
import styled from 'styled-components';
import { auth, db } from '../firebase';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function TaskInput({ roomId }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState('');
  const createTask = (e) => {
    e.preventDefault();
    if (!roomId) return;

    db.collection('rooms').doc(roomId).collection('tasks').add({
      task: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.displayName,
      userImage: user.photoURL,
    });

    setInput('');
  };

  return (
    <>
      <TaskInputContainer>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'Enter and Submit for New Task or Question'}
          />
          <button type='submit' onClick={createTask}>
            Submit
          </button>
        </form>
      </TaskInputContainer>
    </>
  );
}

export default TaskInput;
const TaskInputContainer = styled.div`
  border-radius: 20px;
  margin-top: 2rem;
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
    background: rgb(255, 255, 255, 0.5);
    border: none;
    color: white;
    outline: none;
    font-size: 1rem;
    border-radius: 0 1rem 1rem 0;
    padding: 1em;
    cursor: pointer;
  }
`;
