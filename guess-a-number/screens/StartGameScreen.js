import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import BodyText from "../components/BodyText";
import TitleText from "../components/TitleText";
import MainButon from "../components/MainButton";

import Card from "../components/Card";
import Input from "../components/Input";
import NumberContainer from "../components/NumberContainer";
import Colors from "../constants/colors";

const StartGameScreen = (props) => {
  const [enteredValue, setEnteredValue] = useState(""); //*For managing Textinput value*/}
  const [Confirmed, setConfirmed] = useState(false); //*For managing User Confirms the value*/}
  const [selectedNumber, setSelectedNumber] = useState(); //*Once the user confirms, this will be the value*/}
  const [buttonWidth,setButtonWidth] = useState(Dimensions.get('window').width/4);


  useEffect(()=>{
    const updateLayout =() =>{
      setButtonWidth(Dimensions.get('window').width/4);
    };
    
      //For Orientationn Changes
      Dimensions.addEventListener('change',updateLayout);

      return()=>{
        Dimensions.removeEventListener('change',updateLayout);
      };
  })

  const NumberInutHandler = (inputText) => {
    //For Validating The entered text and setting the entere value accordingly
    setEnteredValue(inputText.replace(/[^0-9]/g, ""));
  };

  const ResetInputHandler = () => {
    //Resetting the consts
    setEnteredValue("");
    setConfirmed(false);
  };

  const confirmInputHandler = () => {
    //Once the User confirms the value set the confirmed value to true and entervalue empty.
    const chosenNumber = parseInt(enteredValue);
    if (isNaN(chosenNumber) || chosenNumber <= 0 || chosenNumber > 99) {
      Alert.alert("Invalid Number", "A number must be between 1 and 99.", [
        { text: "Okay", style: "destructive", onPress: ResetInputHandler },
      ]);
      return;
    }
    setConfirmed(true);
    setSelectedNumber(chosenNumber);
    setEnteredValue("");
    Keyboard.dismiss();
  };

  let confirmedOutput; //For Displaying a output of a selected number

  if (Confirmed) {
    confirmedOutput = (
      <Card style={styles.summaryContainer}>
        <Text>You Selected</Text>
        <NumberContainer>{selectedNumber}</NumberContainer>
        <MainButon onPress={() => props.onStartGame(selectedNumber)}>
          START GAME
        </MainButon>
      </Card>
    );
  }

  return (
    <ScrollView>
      {/* /*Use TouchableWithoutFeedback for keybboard dismiss when touched
      outside*/}
      <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={30}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.screen}>
            <TitleText style={styles.title}>Start a New Game!</TitleText>
            <Card style={styles.inputContainer}>
              <BodyText>Select a Number</BodyText>
              <Input
                style={styles.input}
                blurOnSubmit
                autoCapitalizar="none"
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={NumberInutHandler}
                value={enteredValue}
              />
              <View style={styles.buttonContainer}>
                <View style={{width:buttonWidth}}>
                  <Button
                    title="Reset"
                    onPress={ResetInputHandler}
                    color={Colors.accent}
                  />
                </View>
                <View style={{width:buttonWidth}}>
                  <Button
                    title="Confirm"
                    onPress={confirmInputHandler}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </Card>
            {confirmedOutput}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "open-sans-bold",
  },
  text: {
    fontFamily: "open-sans",
  },
  inputContainer: {
    width: "80%",
    maxWidth: "95%",
    minWidth: 300,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  // button: {
  //   // width: 100,
  //   width: Dimensions.get("window").width / 4,
  // },
  input: {
    width: 50,
    textAlign: "center",
    marginVertical:20
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default StartGameScreen;
