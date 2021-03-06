import { shuffle } from "lodash";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { openFullscreen, closeFullscreen } from "./fullscreen";
import { movies } from "./movies";
import { timesUpFr } from "./timesUpFr";
import { gamewords } from "./gamewords";

const parseGameWords = () => {
  const all = {};
  Object.keys(gamewords).forEach((key) => {
    Object.entries(gamewords[key]).forEach(([key2, data]) => {
      all[`${key} - ${key2}`] = data;
    });
  });

  console.log(all);
  return {
    gameWordsData: all,
    gameWordsNames: Object.keys(all).reduce(
      (acc, curr) => ({ ...acc, [curr]: curr }),
      {}
    ),
  };
};

const { gameWordsData, gameWordsNames } = parseGameWords();

const deckData = {
  movies,
  timesUpFr,
  ...gameWordsData,
};

const deckNames = {
  movies: "movies",
  timesUpFr: "time's up (fr)",
  ...gameWordsNames,
};

const decks = Object.values(deckNames);

const CARDS = Object.entries(deckNames).reduce(
  (acc, [key, val]) => ({ ...acc, [val]: deckData[key] }),
  {}
);

const App = () => {
  const [started, setStarted] = useState(false);
  const start = () => setStarted(true);
  const end = () => setStarted(false);
  const [cards, setCards] = useState([]);

  const startGame = (deck) => {
    setCards(shuffle(CARDS[deck]));
    start();
  };

  return started ? (
    <Game end={end} cards={cards} />
  ) : (
    <Home start={startGame} />
  );
};

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Decks = ({ onChange, selected }) => {
  return (
    <select value={selected} onChange={onChange}>
      {decks.map((deck) => (
        <option key={deck} value={deck}>
          {deck.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

const Home = ({ start }) => {
  const [deck, setDeck] = useState(decks[0]);

  return (
    <HomeContainer>
      <h1>HEADS UP</h1>
      <Decks selected={deck} onChange={(e) => setDeck(e.target.value)} />
      <button onClick={openFullscreen}>Go full screen</button>
      <button onClick={closeFullscreen}>Close full screen</button>
      <button onClick={() => start(deck)}>Start</button>
    </HomeContainer>
  );
};

const Results = ({ cards, end }) => {
  return (
    <>
      <ul>
        {cards.map(({ complete, name }) => {
          return (
            <li style={{ color: complete ? "green" : "red" }} key={name}>
              {name}
            </li>
          );
        })}
      </ul>
      <button onClick={end}>End</button>
    </>
  );
};

const Game = ({ end, cards }) => {
  const [done, setDone] = useState(false);
  const [previous, setPrevious] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [name, setName] = useState("");
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    let interval = null;
    if (seconds === 0) {
      setDone(true);
    }
    interval = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    const nextCard = cards[cardIndex];
    if (!nextCard) {
      setDone(true);
    } else {
      setName(cards[cardIndex]);
    }
  }, [cards, cardIndex]);

  const pass = () => {
    setPrevious([...previous, { name, complete: false }]);
    setCardIndex(cardIndex + 1);
  };

  const accept = () => {
    setPrevious([...previous, { name, complete: true }]);
    setCardIndex(cardIndex + 1);
  };

  if (done) {
    return (
      <Results
        end={end}
        cards={[...previous, { name: cards[cardIndex], complete: false }]}
      />
    );
  }

  return (
    <UI time={seconds} card={cards[cardIndex]} pass={pass} accept={accept} />
  );
};

const UIContainer = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
`;

const BaseButton = styled.button`
  flex: 1;
  margin-top: 0;
  margin-bottom: 0;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PassButton = styled(BaseButton)`
  background: red;
`;

const AcceptButton = styled(BaseButton)`
  background: green;
`;

const MainContainer = styled.div`
  flex: 2;
  flex-direction: column;
  display: flex;
  align-items: center;
`;

const Clock = ({ time }) => {
  return <h3>{time}</h3>;
};

const UI = ({ pass, accept, card, time }) => {
  return (
    <UIContainer>
      <PassButton onClick={pass}>Pass</PassButton>
      <MainContainer>
        <Clock time={time} />
        <Card name={card} />
      </MainContainer>
      <AcceptButton onClick={accept}>Got it!</AcceptButton>
    </UIContainer>
  );
};

const Card = ({ name }) => {
  return <h1>{name}</h1>;
};

export default App;
