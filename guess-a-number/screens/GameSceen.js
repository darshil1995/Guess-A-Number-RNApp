import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import Card from "../components/Card";
import NumberContainer from "../components/NumberContainer";

import DefaultStyles from "../constants/dafault-styles";
import MainButon from "../components/MainButton";
import { Ionicons } from "@expo/vector-icons";
import BodyText from "../components/BodyText";
import { ScreenOrientation } from "expo";

//Generating Random Numbers between min & max excluding already got number
const GenerateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;

  if (rndNum === exclude) {
    return GenerateRandomBetween(min, max.exclude);
  } else {
    return rndNum;
  }
};

//For ScrollView
// const renderListItems = (value,numberofRounds) => {
//   return (
//     <View key={value} style={styles.listItem}>
//       <BodyText>#{numberofRounds}</BodyText>
//       <BodyText>{value}</BodyText>
//     </View>
//   );
// };

//For Displaying the lists in FlatLists
const renderListItems = (listlength, itemData) => {
  return (
    <View style={styles.listItem}>
      <BodyText>#{listlength - itemData.index}</BodyText>
      <BodyText>{itemData.item}</BodyText>
    </View>
  );
};

const GameScreen = (props) => {

  // ScreenOrientation.lockAsync(ScreenOrientation.OrientationBlock.PORTRAIT);

  const initialGuess = GenerateRandomBetween(1, 100, props.userChoice);
  const [CurrentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]); //For listing alreay guessed numbers
  const [avvailableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [avvailableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  const currentlow = useRef(1); //UseRef makes sure the components will not  re render  when the value of this chnages
  const currentHigh = useRef(100);

  const { userChoice, onGameOver } = props; //Array Destructuring for declaring prop args

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };

    Dimensions.addEventListener("change", updateLayout);

    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  //UseEffect : First arg is the function that executes whenever the variable in the array mentioned changes.
  useEffect(() => {
    if (CurrentGuess === userChoice) {
      onGameOver(pastGuesses.length);
    }
  }, [CurrentGuess, userChoice, onGameOver]); // Second Arg is the array of the variable it is depending on

  const nextGuessHandler = (direction) => {
    //Check if the guess is lower and pressed greater button  by the user or viceVersa
    if (
      (direction === "lower" && CurrentGuess < props.userChoice) ||
      (direction === "greater" && CurrentGuess > props.userChoice)
    ) {
      Alert.alert("Don't lie!", "Yoy know that this is wrong...", [
        { text: "Sorry", style: "cancel" },
      ]);
      return;
    }
    if (direction === "lower") {
      currentHigh.current = CurrentGuess;
    } else {
      currentlow.current = CurrentGuess + 1;
    }
    const nextnumber = GenerateRandomBetween(
      currentlow.current,
      currentHigh.current,
      CurrentGuess
    );
    setCurrentGuess(nextnumber);
    setPastGuesses((currePastguesses) => [
      nextnumber.toString(),
      ...currePastguesses,
    ]);
    // setrounds((curRounds) => curRounds + 1); //Increment rounds with each next guess
  };

  let listContainerStyle = styles.listContainer;

  if (avvailableDeviceWidth < 350) {
    listContainerStyle = listContainerbig;
  }

  if (avvailableDeviceHeight < 500) {
    return (
      <View style={styles.screen}>
        <Text style={DefaultStyles.bodytext}>Oponnent's Guess</Text>
        <View style={styles.controls}>
          <MainButon onPress={nextGuessHandler.bind(this, "lower")}>
            <Ionicons name="md-remove" size={24} color="white" />
          </MainButon>
          <NumberContainer>{CurrentGuess}</NumberContainer>
          {/*Used binding to make a pre guuess of the argument we need to use */}
          <MainButon onPress={nextGuessHandler.bind(this, "greater")}>
            <Ionicons name="md-add" size={24} color="white" />
          </MainButon>
        </View>

        <View style={listContainerStyle}>
          <FlatList
            keyExtractor={(item) => item}
            data={pastGuesses}
            renderItem={renderListItems.bind(this, pastGuesses.length)}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={DefaultStyles.bodytext}>Oponnent's Guess</Text>
      <NumberContainer>{CurrentGuess}</NumberContainer>
      <Card style={styles.buttonContainer}>
        <MainButon onPress={nextGuessHandler.bind(this, "lower")}>
          <Ionicons name="md-remove" size={24} color="white" />
        </MainButon>
        {/*Used binding to make a pre guuess of the argument we need to use */}
        <MainButon onPress={nextGuessHandler.bind(this, "greater")}>
          <Ionicons name="md-add" size={24} color="white" />
        </MainButon>
      </Card>
      <View style={listContainerStyle}>
        {/* <ScrollView contentContainerStyle={styles.list}>
          {pastGuesses.map((guess,index) => renderListItems(guess,pastGuesses.length-index))}
        </ScrollView> */}
        <FlatList
          keyExtractor={(item) => item}
          data={pastGuesses}
          renderItem={renderListItems.bind(this, pastGuesses.length)}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: Dimensions.get("window").height > 600 ? 20 : 10,
    justifyContent: "space-around",
    width: 400,
    maxWidth: "90%",
  },
  listContainer: {
    flex: 1,
    width: "80%",
  },
  listContainerbig: {
    flex: 1,
    width: "80%",
  },
  list: {
    flexGrow: 1,
    // alignItems: "center",
    justifyContent: "flex-start",
  },
  listItem: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    alignItems: "center",
  },
});

export default GameScreen;
