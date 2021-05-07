import React from 'react';
import styled from 'styled-components';
import coffee from '../images/—Pngtree—creative flat coffee cup silhouette_5569828.png';
const ShowSelectedCards = ({ answers }) => {
  if (answers?.length > 0)
    return (
      <>
        <DeckList>
          {answers.map((show, i) => {
            return (
              <DeckCard key={i}>
                {show.answer ? (
                  <img src={coffee} alt='coffee' />
                ) : (
                  <span>{show.answer}</span>
                )}
                <p>{show.user}</p>
              </DeckCard>
            );
          })}
        </DeckList>
        <Average>
          <p>Average Score</p>
          <p>
            {answers.reduce((acc, cur) => acc + cur.answer, 0) / answers.length}
          </p>
        </Average>
      </>
    );
  else return null;
};

export default ShowSelectedCards;

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
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 3rem;
    padding-bottom: 1rem;
  }
  img {
    width: 100%;
  }

  p {
    font-size: 1.5rem;
    text-align: center;
    padding-bottom: 1rem;
  }
`;

const Average = styled.div`
  /* margin: 5rem auto 0; */
  text-align: center;
  p {
    font-size: 2rem;
    color: #404444;
  }
`;
