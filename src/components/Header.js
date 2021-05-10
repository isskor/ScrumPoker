import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLeftSidebar,
  selectRightSidebar,
  toggleLeft,
  toggleRight,
} from '../features/controllerSlice';
function Header() {
  const [user] = useAuthState(auth);

  const signOut = () => {
    auth.signOut();
  };

  const leftSidebar = useSelector(selectLeftSidebar);
  const rightSidebar = useSelector(selectRightSidebar);
  const dispatch = useDispatch();
  console.log(leftSidebar);
  const handleToggle = () => {
    dispatch(toggleLeft(!leftSidebar));
    // dispatch(toggleRight(false));
  };
  const handleToggle2 = () => {
    dispatch(toggleRight(!rightSidebar));
    // dispatch(toggleLeft(false));
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <button onClick={handleToggle}>{leftSidebar ? 'x' : 'i'}</button>
      </HeaderLeft>
      <HeaderRight>
        <button onClick={handleToggle2}>
          {rightSidebar ? (
            'x'
          ) : (
            <>
              <span className='one'></span>
              <span className='two'></span>
              <span className='three'></span>
            </>
          )}
        </button>
      </HeaderRight>
    </HeaderContainer>
  );
}

export default Header;

const HeaderContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  background-color: transparent;
  color: white;
  z-index: 100;
  button {
    width: 50px;
    height: 50px;
    font-size: 2rem;
    color: gray;
    border: none;
    outline: none;
    background: rgb(255, 255, 255, 0.7);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    align-items: center;
  }
  .one {
    display: inline-block;
    width: 25px;
    height: 2px;
    background: gray;
  }
  .two {
    display: inline-block;
    width: 20px;
    height: 2px;
    background: gray;
  }
  .three {
    display: inline-block;
    width: 30px;
    height: 2px;
    background: gray;
  }
`;

const HeaderLeft = styled.div`
  margin-left: 20px;
`;

const HeaderRight = styled.div`
  margin-right: 20px;
  button {
    align-items: center;
  }
`;
