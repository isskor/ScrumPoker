import styled from 'styled-components';
import React from 'react';

const HiddenCards = ({ hiddenAnswers }) => {
  let cards = [];
  for (let i = 0; i < hiddenAnswers; i++) {
    cards.push(<DeckCard key={i}></DeckCard>);
  }
  return cards.length > 0 ? <DeckList>{hiddenAnswers && cards}</DeckList> : '';
};

export default HiddenCards;

const DeckList = styled.div`
  display: flex;
  gap: 1rem;
  width: 80%;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
`;
const DeckCard = styled.div`
  background: white;
  width: 90px;
  height: 120px;
  /* padding: 2em; */
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 2.4rem;
  }

  &.selected {
    background: #9191ec;
  }
`;
