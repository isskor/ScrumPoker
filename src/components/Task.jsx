import React from 'react';
import styled from 'styled-components';

function Task({ task }) {
  return task ? (
    <TaskContainer>
      <p>{task.task}</p>
    </TaskContainer>
  ) : (
    ''
  );
}

export default Task;

const TaskContainer = styled.div`
  display: flex;
  align-items: center;
  /* margin: 20px 0; */
  min-height: 128px;
  padding: 0 2rem;
  justify-content: center;
  p {
    font-size: 1.5rem;
    color: white;
    padding: 1rem;
    background: rgb(0, 0, 0, 0.1);
    border-radius: 1rem;
  }
`;
