import styled from 'styled-components';
import React from 'react';

const HiddenCards = ({ hiddenAnswers }) => {
  console.log(hiddenAnswers);

  let cards = [];
  console.log(cards);
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
  width: 120px;
  height: 160px;
  /* padding: 2em; */
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 3rem;
  }

  &.selected {
    background: #9191ec;
  }
`;
