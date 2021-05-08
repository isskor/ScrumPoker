import React from 'react';
import styled from 'styled-components';
import coffee from '../images/—Pngtree—creative flat coffee cup silhouette_5569828.png';
const PokerCards = ({ deck, userSelect, handleUserSelect }) => {
  return (
    <DeckList>
      {deck.map((d) => (
        <DeckCard
          onClick={() => handleUserSelect(d)}
          className={d === userSelect && 'selected'}
          key={d}
        >
          {d === 'coffee' ? (
            <img src={coffee} alt='coffee' />
          ) : (
            <span>{d}</span>
          )}
        </DeckCard>
      ))}
    </DeckList>
  );
};

export default PokerCards;

const DeckList = styled.div`
  grid-row: 3;
  display: flex;
  gap: 1rem;
  /* width: 80%; */

  /* margin: 0 auto; */
  flex-wrap: wrap;
  justify-content: center;
`;
const DeckCard = styled.div`
  background: white;
  width: 10%;
  max-width: 60px;
  /* height: 90px; */
  height: clamp(60px, 50%, 90px);
  /* padding: 2em; */
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: 0 0 30px rgb(167, 124, 247);
  }
  @media (min-width: 768px) {
    height: 90px;
  }
  span {
    /* font-size: 2rem; */
    font-size: clamp(1rem, 2.5vw, 2rem);
  }

  &.selected {
    background: #9191ec;
  }
  img {
    width: 100%;
  }
`;
