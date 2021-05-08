import React from 'react';
import styled from 'styled-components';

function Message({ message, timestamp, user, userImage }) {
  return (
    <MessageContainer>
      <MessageInfo>
        <MessageHeader>
          <span>{new Date(timestamp?.toDate()).toUTCString()}</span>
          <p>{user}:</p>
        </MessageHeader>
        <p className='message'>{message}</p>
      </MessageInfo>
    </MessageContainer>
  );
}

export default Message;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 10px;
`;

const MessageInfo = styled.div`
  border-radius: 8px;
  padding: 5px;
  padding-left: 10px;
  background-color: rgb(255, 255, 255, 0.5);

  > p {
    flex: 100%;
    grid-column: span 2;
    align-self: center;
  }
  .message {
    font-size: 0.9rem;
  }
`;

const MessageHeader = styled.div`
  /* display: flex; */
  span {
    font-size: 0.6rem;
  }
`;
