import styled from 'styled-components';
import React from 'react';

const SideList = ({ list, setCurrentQuestion }) => {
  return (
    <StyledSideList>
      {list && list.length > 0 && (
        <>
          {list.map((listItem) => (
            <StyledListItem key={listItem.id}>
              <div className='avgScore'>
                <span>Avg</span>
                <span className='score'> {listItem.data().score}</span>
              </div>
              <p>{listItem.data().message}</p>
            </StyledListItem>
          ))}
        </>
      )}
    </StyledSideList>
  );
};

export default SideList;

const StyledSideList = styled.div`
  margin-right: 1rem;
  background: white;
  border-radius: 1rem;
  overflow-y: scroll;
  height: calc(100vh - 220px);
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
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
