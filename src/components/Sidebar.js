import { useRef, useState } from 'react';
import styled from 'styled-components';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDispatch, useSelector } from 'react-redux';
import { enterRoom, selectRoomId } from '../features/appSlice';

function Sidebar() {
  const roomId = useSelector(selectRoomId);
  const [authUser] = useAuthState(auth);
  const [channels, loading, error] = useCollection(db.collection('rooms'));

  const [roomDetails, loading2] = useDocument(
    roomId && db.collection('rooms').doc(roomId)
  );

  const [users, loadingUsers, errorUser] = useCollection(
    db.collection('rooms').doc(roomId).collection('users')
  );

  const [roomMessages, loading3] = useCollection(
    roomId &&
      db
        .collection('rooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
  );

  console.log('users---', users?.docs[0].data());
  console.log(roomDetails?.data());
  console.log('authuser', authUser);
  console.log('authuser', authUser);

  const checkMaster = () => {
    let master = users?.docs.filter((u) => {
      console.log(u.data().master);
      return u.data().master && u.data().uid === authUser.uid;
    });
    console.log('master', master);
    return master?.length > 0 ? true : false;
  };
  console.log(checkMaster());

  const giveMaster = async (docId) => {
    console.log(authUser.uid);
    console.log(docId);
    const currentMasterDoc = await db
      .collection('rooms')
      .doc(roomId)
      .collection('users')
      .where('master', '==', true)
      .get();
    const newMaster = await db
      .collection('rooms')
      .doc(roomId)
      .collection('users')
      .doc(docId)
      .update({ master: true });
    // console.log(currentMasterDoc.docs[0]);
    // console.log(newMaster.docs[0].ref);

    currentMasterDoc.docs[0].ref.update({ master: false });
    // newMaster.docs[0].ref.update({ master: true });
  };
  const [copied, setCopied] = useState(false);
  function copyToClipboard(e) {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(enterRoom({ roomId: null }));
    auth.signOut();
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarInfo>
          <h3>
            <FiberManualRecordIcon />
            {authUser.displayName}
          </h3>
          <button onClick={handleLogout}>Sign Out</button>
        </SidebarInfo>
      </SidebarHeader>
      {/* <div onClick={join}>join</div> */}
      <RoomInfo>
        {roomDetails && (
          <>
            <h3>Room {roomDetails.data().name}</h3>
            <p>Share Room Id for invites</p>

            <h4>ID: {roomDetails?.id}</h4>

            <button
              onClick={copyToClipboard}
              className={copied ? 'copied' : ''}
            >
              {copied ? 'Copied! ' : 'Copy to clipboard'}
            </button>
          </>
        )}
      </RoomInfo>
      <Members>
        <h3>Members</h3>
        <ul>
          {users?.docs.map((user) => (
            <li key={user.id}>
              <span>
                {user.data().user} {user.data().master ? '- MASTER' : ''}
              </span>
              {!user.data().master && checkMaster() && (
                <button onClick={() => giveMaster(user.id)}>Give Master</button>
              )}
            </li>
          ))}
        </ul>
      </Members>
    </SidebarContainer>
  );
}

export default Sidebar;
const SidebarContainer = styled.div`
  /* background-color: var(--slack-color); */
  color: #e8e8e8;
  flex: 0.3;
  max-width: 260px;
  padding-left: 1rem;
`;

const SidebarHeader = styled.div`
  display: flex;
  border-bottom: 1px solid gray;
  /* opacity: 0.6; */
  padding: 13px;
  margin-top: 30px;
  background-color: white;
  color: black;
  border-radius: 1rem;

  > .MuiSvgIcon-root {
    padding: 8px;
    color: #49274b;
    font-size: 18px;
    background-color: white;
    border-radius: 50%;
  }
`;
const SidebarInfo = styled.div`
  width: 100%;
  > h3 {
    display: flex;
    font-size: 1.1rem;
    font-weight: 400;
    align-items: center;
  }

  > h3 > .MuiSvgIcon-root {
    font-size: 14px;
    margin-top: 1px;
    margin-right: 2px;
    color: green;
  }
  button {
    margin-top: 0.5rem;
    padding: 0.5em 0.75em;
    display: block;
    margin-left: auto;
    border: none;
    outline: none;
    cursor: pointer;
  }
`;
const RoomInfo = styled.div`
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: white;
  border-radius: 1.4rem;
  color: black;
  display: flex;
  flex-wrap: wrap;

  & > * {
    padding-bottom: 1rem;
  }
  button {
    flex: 1;
    border: none;
    outline: none;
    font-size: 1rem;
    border-radius: 1rem;
    padding: 1em 1.5em;
    display: block;
    margin: 0 auto;
    cursor: pointer;
    background: linear-gradient(145deg, #b6c7ff, #99a7e4);
    box-shadow: 2px 2px 5px #919ed7, -2px -2px 5px #c4d6ff;
    color: white;
    font-weight: 700;
  }
  .copied {
    background: #aabafd;
    box-shadow: inset 20px 20px 60px #919ed7, inset -20px -20px 60px #c4d6ff;
  }
`;
const Members = styled.div`
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: white;
  border-radius: 1.4rem;
  color: black;
  h3 {
    padding-bottom: 1rem;
  }
  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 0.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      button {
        border: none;
        outline: none;
        padding: 0.5rem;
        border-radius: 1rem;
        background: #c2dcff;
        cursor: pointer;
        &:hover {
          box-shadow: 0 0 10px rgb(0, 0, 0, 20%);
        }
      }
    }
  }
`;
