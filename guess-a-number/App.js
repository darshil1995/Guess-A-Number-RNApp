import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";

import Header from "./components/Header";
import StartGameScreen from "./screens/StartGameScreen";
import GameScreen from "./screens/GameSceen";
import GameOverScreen from "./screens/GameOverScreen";

import * as Font from "expo-font";
import { AppLoading } from "expo";

const FetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [guessRounds, setGuessRounds] = useState(0); //Number of rounds it took to guess the number
  const [DataLoaded, setDataLoaded] = useState(false);

  if (!DataLoaded) {
    return (
      <AppLoading
        startAsync={FetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  const configureNewGameHandler = () => {
    setGuessRounds(0); //When a new game start it must be reset to 0
    setUserNumber(null);
  };

  const StartGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
  };

  const GameOverHandler = (numberofRounds) => {
    setGuessRounds(numberofRounds);
  };

  let content = <StartGameScreen onStartGame={StartGameHandler} />;

  //Checkks if there is a user number and whether the guess round is less than 0 to open GameScreen
  if (userNumber && guessRounds <= 0) {
    content = (
      <GameScreen userChoice={userNumber} onGameOver={GameOverHandler} />
    );
  } else if (guessRounds > 0) {
    content = (
      <GameOverScreen
        onRestart={configureNewGameHandler}
        roundsNumber={guessRounds}
        userNumber={userNumber}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Guess a Number" />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
