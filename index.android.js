/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

import { DefRouter } from './components/router';
import { LoginPage } from './components/loginLayout';
export default class Qusais extends Component {
  render() {
    return (
<View style={styles.container}>
  <DefRouter style={styles.nav} />
</View>
    );
  }
}

const styles = StyleSheet.create({
  nav: {
      flex: 1
    },
   container: {
  flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#F5FCFF',
   },
  // welcome: {
  //   fontSize: 20,
  //   textAlign: 'center',
  //   margin: 10,
  // },
  // instructions: {
  //   textAlign: 'center',
  //   color: '#333333',
  //   marginBottom: 5,
  // },
});

AppRegistry.registerComponent('Qusais', () => Qusais);
