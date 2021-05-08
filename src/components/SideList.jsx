import styled from 'styled-components';
import React, { useState } from 'react';
import SideChat from './SideChat';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { selectRoomId } from '../features/appSlice';
import { db } from '../firebase';
import { selectRightSidebar } from '../features/controllerSlice';

const SideList = ({ list }) => {
  const [tab, setTab] = useState(1);
  const roomId = useSelector(selectRoomId);
  const [roomTasks, loading] = useCollection(
    roomId &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('tasks')
        .orderBy('timestamp', 'asc')
  );

  const rightSide = useSelector(selectRightSidebar);

  return (
    <ListContainer open={rightSide ? true : false}>
      <div className='wrapper'>
        <Tabs>
          <TabButton onClick={() => setTab(1)}>Task List</TabButton>
          <TabButton chat={true} onClick={() => setTab(2)}>
            Chat
          </TabButton>
        </Tabs>
        <StyledSideList>
          {tab === 1 ? (
            <div className='taskList'>
              {roomTasks && roomTasks?.docs?.length > 0 && (
                <>
                  {roomTasks.docs.map((listItem) => (
                    <StyledListItem key={listItem.id}>
                      <div className='avgScore'>
                        <span>Avg</span>
                        <span className='score'> {listItem.data().score}</span>
                      </div>
                      <p>{listItem.data().task}</p>
                    </StyledListItem>
                  ))}
                </>
              )}
            </div>
          ) : (
            <SideChat />
          )}
        </StyledSideList>
      </div>
    </ListContainer>
  );
};

export default SideList;
const ListContainer = styled.div`
  flex: 0.3;

  display: ${(props) => (props.open ? 'block' : 'none')};
  @media (max-width: 768px) {
    display: none;
    display: ${(props) => (props.open ? 'block' : 'none')};
    position: fixed;
    background: linear-gradient(
      90deg,
      rgba(188, 196, 251, 1) 0%,
      rgba(148, 200, 233, 1) 100%
    );
    width: 100%;
    height: 100%;
    z-index: 20;
    right: 0;
    padding-top: 2rem;
    /* padding-right: 5rem; */
  }
  @media (min-width: 768px) {
    max-width: 280px;
    margin: 0;
    margin-top: 3rem;
  }

  .wrapper {
    margin: 0 auto;
    max-width: 80%;
    padding-top: 2rem;
  }
`;

const StyledSideList = styled.div`
  border-radius: 1rem;
  height: calc(100vh - 220px);
  .taskList {
    overflow-y: scroll;
    background: rgb(255, 255, 255, 0.5);
    height: 100%;
    border-radius: 0 0 1rem 1rem;
  }
  & ::-webkit-scrollbar {
    width: 5px;
  }
  & ::-webkit-scrollbar-track {
    background: transparent;
  }
  & ::-webkit-scrollbar-thumb {
    background: #64a0fc;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const StyledListItem = styled.div`
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;

  .avgScore {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5rem;
    background-color: #93a5f5;
    color: white;
    border-radius: 0.5rem;
    .score {
      font-size: 1.1rem;
    }
  }
  p {
    max-width: 22ch;
    word-wrap: break-word;
  }
`;

const Tabs = styled.div`
  display: flex;
  width: 100%;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1em;
  border: none;
  outline: none;
  background: rgb(255, 255, 255, 0.5);
  border-bottom: 1px solid rgb(0, 0, 0, 0.2);
  border-left: ${(props) => (props.chat ? '1px solid rgb(0,0,0,20%)' : 'none')};
  border-radius: ${(props) => (props.chat ? '0 1rem 0 0 ' : '1rem 0 0 0')};
`;
