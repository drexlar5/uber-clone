import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const BottomButton = (props) => {
    return (
      <View style={styles.bottomButton}>
        <TouchableOpacity onPress={() => props.onPressFunction()}>
          <View>
            <Text style={styles.bottomButtonText}>{props.buttonText}</Text>
            {props.children}
          </View>
        </TouchableOpacity>
      </View>
    );
}

BottomButton.propTypes = {
  onPressFunction: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: "black",
    marginTop: "auto",
    margin: 20,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    alignSelf: "center"
  },
  bottomButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "600"
  }
});

module.exports = BottomButton;