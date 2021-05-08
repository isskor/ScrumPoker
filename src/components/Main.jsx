import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectRoomId } from '../features/appSlice';
import ChatInput from './ChatInput';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { db, auth } from '../firebase';
import Message from './Message';

import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import PokerCards from './PokerCards';
import ShowSelectedCards from './ShowSelectedCards';
import HiddenCards from './HiddenCards';
import SideList from './SideList';
import Task from './Task';
import TaskInput from './TaskInput';

const deck = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', 'coffee'];

function Chat() {
  const chatRef = useRef(null);
  const roomId = useSelector(selectRoomId);
  const [roomMaster, setRoomMaster] = useState(null);
  const [user] = useAuthState(auth);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userSelect, setUserSelect] = useState(null);
  const [userSelectId, setUserSelectId] = useState(null);
  const [show, setShow] = useState(false);

  const [users, loadingUsers, errorUser] = useCollection(
    db.collection('rooms').doc(roomId).collection('users')
  );

  // check if user is roomMaster
  useEffect(() => {
    const master = users?.docs.filter((u) => u.data().master);

    if (master?.length > 0 && master[0].data().uid === user.uid) {
      setRoomMaster(true);
    } else {
      setRoomMaster(false);
    }
  }, [user, users]);

  // get room details
  const [roomDetails, loading2] = useDocument(
    roomId && db.collection('rooms').doc(roomId)
  );

  // get room tasks
  const [roomTasks, loading] = useCollection(
    roomId &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .orderBy('timestamp', 'asc')
  );
  const [roomAnswers, answersLoading, error2] = useCollection(
    currentQuestion &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .doc(currentQuestion.id)
        .collection('answers')
        .orderBy('timestamp', 'asc')
  );

  const [showRoomAnswers, showRoomAnswersLoading, showError] = useCollection(
    currentQuestion &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .doc(currentQuestion.id)
        .collection('showAnswers')
        .orderBy('timestamp', 'asc')
  );

  // console.log('loading', loading);
  useEffect(() => {
    chatRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomId, loading2]);

  useEffect(() => {
    if (roomTasks?.docs.length > 0) {
      let last = roomTasks.docs.pop();
      // set new question
      setCurrentQuestion({ ...last.data(), id: last.id });
      // reset users selection
      setUserSelect(null);
      setUserSelectId(null);
      setShow(false);
    }
  }, [roomTasks]);

  // add selection to current task
  const handleUserSelect = (value) => {
    setUserSelect(value);
    if (userSelectId) {
      // user have already answered update users answer
      db.collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .doc(currentQuestion.id)
        .collection('answers')
        .doc(userSelectId)
        .update({ answer: value });
    } else {
      // user have not answered yet, add a new answer
      db.collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .doc(currentQuestion.id)
        .collection('answers')
        .add({
          answer: value,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: user.displayName,
          userId: user.uid,
          userImage: user.photoURL,
        })
        .then((res) => setUserSelectId(res.id));
    }
  };

  const handleShowAnswers = () => {
    const avg = parseFloat(
      (
        roomAnswers.docs
          .map((a) => a.data())
          .reduce((acc, cur) => acc + cur.answer, 0) / roomAnswers.docs.length
      ).toFixed(2)
    );
    if (roomAnswers.docs.length > 0) {
      db.collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .doc(currentQuestion.id)
        .collection('showAnswers')
        .add({
          showAnswers: roomAnswers.docs.map((d) => d.data()),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });

      db.collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .doc(currentQuestion.id)
        .update({
          score: avg,
        })
        .then(() => {
          setShow(true);
        });
    }
  };
  console.log(show);
  const handleRedo = async () => {
    let task = currentQuestion.task;

    // add again
    db.collection('rooms').doc(roomId).collection('tasks').add({
      task: task,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.displayName,
    });
  };

  return (
    <Container>
      {!roomId && <h1>Create a room or join one!</h1>}
      {roomId && roomDetails && !roomDetails.exists && (
        <h1>No Room Found, Create One!</h1>
      )}
      {roomDetails && roomDetails?.exists && (
        <>
          <Header>
            <HeaderInput>
              {roomMaster && (
                <>
                  <TaskInput roomId={roomId} />
                  <div className='showAnswer'>
                    {roomAnswers?.docs.length > 0 && (
                      <>
                        {!show ? (
                          <button onClick={handleShowAnswers}>
                            Show Answers
                          </button>
                        ) : (
                          <button onClick={handleRedo}>Redo Task</button>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
            </HeaderInput>
          </Header>

          <Content>
            <Task task={currentQuestion} />
            <Cards>
              {showRoomAnswers && (
                <>
                  <ShowSelectedCards
                    answers={showRoomAnswers?.docs[0]?.data().showAnswers}
                  />
                </>
              )}
              {roomAnswers &&
                !(showRoomAnswers?.docs[0]?.data()?.showAnswers.length > 0) && (
                  <HiddenCards hiddenAnswers={roomAnswers.docs.length} />
                )}
              {currentQuestion &&
                !(showRoomAnswers?.docs[0]?.data()?.showAnswers.length > 0) && (
                  <PokerCards
                    deck={deck}
                    handleUserSelect={handleUserSelect}
                    userSelect={userSelect}
                  />
                )}
            </Cards>
          </Content>
          {/* <div className='list'>
            <SideList
              list={roomTasks?.docs}
              setCurrentQuestion={setCurrentQuestion}
            />
          </div> */}
        </>
      )}
    </Container>
  );
}
export default Chat;

const Container = styled.div`
  flex: 0.7;
  flex-grow: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 160px 1fr;
  @media (max-width: 768px) {
    margin-top: 3rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 20px;
  grid-column: 1;
  width: 100%;
  justify-self: center;
`;

const HeaderInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .showAnswer {
    margin-top: 1rem;
    align-self: center;
    min-height: 50px;
    button {
      padding: 1em 2em;
      border: none;
      outline: none;
      font-size: 1rem;
      border-radius: 1rem;
      background: white;
      box-shadow: 0 0 30px rgb(0, 0, 0, 20%);
      cursor: pointer;
      transition: all 0.6s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 15px 20px rgb(0, 0, 0, 0.3);
      }
    }
  }
`;

const Content = styled.main`
  grid-column: 1;
  justify-self: center;
  width: 100%;
  height: calc(100vh - 180px);
`;
const Cards = styled.div`
  height: calc(100vh - 340px);
  display: grid;
  grid-template-rows: repeat(3, 33%);
`;
