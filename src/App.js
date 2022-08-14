import './App.css';
import * as brain from 'brain.js';
import React, { useState, useEffect, useRef } from 'react';
function App() {
  const net = new brain.recurrent.LSTMTimeStep(
    {
      hiddenLayers: [30],
      errorThresh: 0.0001,
      learningRate: 0.03,
      activation: 'sigmoid',

    }
  )

  let [pattern, setPattern] = useState([]);
  const [scoreCasino, setScoreCasino] = useState(0);
  const [scoreAI, setScoreAI] = useState(0);
  var [gameCount, setGameCount] = useState(0);
  let choosenByCasino = "";
  const [choosenByAI, setChoosenByAI] = useState(0);
  const [winner, setWinner] = useState("");
  const patternLength = 10;
  var [roundedCasinoWillChoose, setRoundedCasinoWillChoose] = useState(0);
  const [forcast, setForcast] = useState(0);

  const casinoInput = (e) => {
    choosenByCasino = e.target.value;
    console.log(`PREVIOUS CHOOSEN BY CASINO: ${choosenByCasino}`);
    setGameCount(gameCount + 1);
    whatShouldAiAnswer();
    winningCount();
  }
  useEffect(() => {
    prepareData()
  }, [])


  const prepareData = () => {
    if (pattern.length < 1) {
      let num = [];
      for (let index = 1; index <= 13; index++) {
        num.push(Math.floor(Math.random() * 3) + 1)
      }
      setPattern(num);
    }
  }


  const updatePattern = () => {
    if (gameCount !== 0) {
      pattern.shift();
      setPattern([...pattern, Number.parseInt(choosenByCasino)])
      console.log(pattern);
    }
  }

  function whatShouldAiAnswer() {
    prepareData();
    net.train([pattern], { iterations: 2000, log: true });
    const casinoWillChoose = net.run(pattern);
    setForcast(Math.round(net.forecast(pattern, 1)));
    updatePattern();
    setRoundedCasinoWillChoose(Math.round(casinoWillChoose));
    // console.log('CASINO WILL CHOOSE -- PREDICTION: ' + roundedCasinoWillChoose);
    setChoosenByAI(roundedCasinoWillChoose)
  }

  const winningCount = () => {
    if (forcast == choosenByCasino) {
      setWinner('You Win');
      setScoreAI(scoreAI + 1);
    } else {
      setWinner('You Lost');
      setScoreCasino(scoreCasino + 1);
    }
  }
  const svgId = document.getElementById('#svgRef');
  // svgId.innerHTML = brain.utilities.toSVG(net);

  return (
    <>
      <h2 className="heading_two">AI FOR DOZEN PREDICTION</h2>
      <section className="button__wrapper">
        <button onClick={casinoInput} value='1' className="button__one">DOZEN 1</button>
        <button onClick={casinoInput} value='2' className="button__two">DOZEN 2</button>
        <button onClick={casinoInput} value='3' className="button__three">DOZEN 3</button>
      </section>
      <div id="algoId"></div>
      <div className="prediction__wrapper">
        <h2 className="heading_two">PREDICTION</h2>
        {/* <p className="center_text">{choosenByAI}</p> */}
        <p className="center_text">FORCAST : {forcast}</p>
        <p className={`center_text ${winner == 'You Win' ? 'win' : 'loss'}`}>
          {winner}
        </p>
        <div className="game_count">
          <div className="game_item">
            <p>Total Games</p>
            <p>{gameCount}</p>

          </div>
          <div className="game_item">

            <p>AI Scored</p>
            <p>{scoreAI}</p>
          </div>
          <div className="game_item">

            <p>Casino Scored</p>
            <p>{scoreCasino}</p>
          </div>

        </div>

      </div>
    </>
  );
}

export default App;
