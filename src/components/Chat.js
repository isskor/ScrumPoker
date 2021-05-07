import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
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

const deck = [0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, '?', 'coffee'];

function Chat() {
  const chatRef = useRef(null);
  const roomId = useSelector(selectRoomId);
  const [roomMaster, setRoomMaster] = useState(null);
  const [user] = useAuthState(auth);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userSelect, setUserSelect] = useState(null);
  const [userSelectId, setUserSelectId] = useState(null);

  console.log(user);

  const [users, loadingUsers, errorUser] = useCollection(
    db.collection('rooms').doc(roomId).collection('users')
  );

  // check if user is roomMaster
  useEffect(() => {
    const master = users?.docs.filter((u) => u.data().master);

    if (master?.length > 0 && master[0].data().uid === user.uid) {
      console.log('MASTER USER');
      setRoomMaster(true);
    } else {
      setRoomMaster(false);
    }
  }, [user, users]);

  // get room details
  const [roomDetails, loading2] = useDocument(
    roomId && db.collection('rooms').doc(roomId)
  );

  // get room messages
  const [roomMessages, loading] = useCollection(
    roomId &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
  );
  const [roomAnswers, answersLoading, error2] = useCollection(
    currentQuestion &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(currentQuestion.id)
        .collection('answers')
        .orderBy('timestamp', 'asc')
  );

  const [showRoomAnswers, showRoomAnswersLoading, showError] = useCollection(
    currentQuestion &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(currentQuestion.id)
        .collection('showAnswers')
        .orderBy('timestamp', 'asc')
  );

  // console.log('loading', loading);
  useEffect(() => {
    chatRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomId, loading2]);

  useEffect(() => {
    if (roomMessages?.docs.length > 0) {
      let last = roomMessages.docs.pop();
      console.log(last);
      // set new question
      setCurrentQuestion({ ...last.data(), id: last.id });
      // reset users selection
      setUserSelect(null);
      setUserSelectId(null);
    }
  }, [roomMessages]);

  // add selection to current task
  const handleUserSelect = (value) => {
    setUserSelect(value);
    if (userSelectId) {
      // user have already answered update users answer
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(currentQuestion.id)
        .collection('answers')
        .doc(userSelectId)
        .update({ answer: value });
    } else {
      // user have not answered yet, add a new answer
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
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
  console.log('currentquestion', currentQuestion);

  const handleShowAnswers = () => {
    if (roomAnswers.docs.length > 0) {
      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(currentQuestion.id)
        .collection('showAnswers')
        .add({
          showAnswers: roomAnswers.docs.map((d) => d.data()),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then((res) => console.log('res', res));

      db.collection('rooms')
        .doc(roomId)
        .collection('messages')
        .doc(currentQuestion.id)
        .update({
          score:
            roomAnswers.docs
              .map((a) => a.data())
              .reduce((acc, cur) => acc + cur.answer, 0) /
            roomAnswers.docs.length,
        })
        .then((res) => console.log(res));
    }
  };

  console.log('SHOW ROOM ANSWERS', showRoomAnswers);
  console.log('roommessages', roomMessages?.docs);
  return (
    <ChatContainer>
      {!roomId && <h1>Create a room or join one!</h1>}
      {roomId && roomDetails && !roomDetails.exists && (
        <h1>No Room Found, Create One!</h1>
      )}
      {roomDetails && roomDetails?.exists && roomMessages && (
        <>
          <Header>
            <HeaderLeft>
              {roomMaster && (
                <>
                  <ChatInput
                    chatRef={chatRef}
                    channelName={roomDetails?.data().name}
                    channelId={roomId}
                  />
                  <div className='showAnswer'>
                    {roomAnswers?.docs.length > 0 && (
                      <button onClick={handleShowAnswers}>Show Answers</button>
                    )}
                  </div>
                </>
              )}
            </HeaderLeft>
          </Header>

          <Content>
            <div className='main'>
              <ChatMessages>
                {currentQuestion && (
                  <Message
                    message={currentQuestion.message}
                    timestamp={currentQuestion.timestamp}
                  />
                )}
              </ChatMessages>
              <Cards>
                {showRoomAnswers && (
                  <>
                    <ShowSelectedCards
                      answers={showRoomAnswers?.docs[0]?.data().showAnswers}
                    />
                  </>
                )}
                {roomAnswers &&
                  !(
                    showRoomAnswers?.docs[0]?.data()?.showAnswers.length > 0
                  ) && <HiddenCards hiddenAnswers={roomAnswers.docs.length} />}
                {currentQuestion &&
                  !(
                    showRoomAnswers?.docs[0]?.data()?.showAnswers.length > 0
                  ) && (
                    <PokerCards
                      deck={deck}
                      handleUserSelect={handleUserSelect}
                      userSelect={userSelect}
                    />
                  )}
              </Cards>
            </div>
            <div className='list'>
              <SideList
                list={roomMessages?.docs}
                setCurrentQuestion={setCurrentQuestion}
              />
            </div>
          </Content>
        </>
      )}
    </ChatContainer>
  );
}
export default Chat;

const ChatBottom = styled.div`
  /* padding-bottom: 200px; */
`;

const ChatContainer = styled.div`
  /* margin-top: 50px; */
  flex: 0.7;
  flex-grow: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const HeaderLeft = styled.div`
  /* width: 70%; */
  flex: 0.82;
  display: flex;
  flex-direction: column;
  .showAnswer {
    margin-top: 2rem;
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

const ChatMessages = styled.div``;
const Content = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 350px);
  .list {
    flex: 0.18;
  }
  .main {
    flex: 0.82;
  }
`;
const Cards = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: repeat(3, 30%);
  /* justify-content: center; */
`;
