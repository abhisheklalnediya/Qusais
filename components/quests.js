import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

//import {HeaderLogo} from './loginLayout'

const styles = StyleSheet.create({
  qBox: {
    //width: 100,
    height: 200,
    borderWidth: 1,
    borderColor: '#234243',
    borderStyle: 'solid',
    marginBottom : 10
  },
  questList:{
  }
});

class DrugQuest extends Component{
  render(){
    return(

      <View style={styles.qBox}>
        <Text>Did you took Drug1?</Text>
      </View>
    )
  }
}


export class Quests extends Component {
  render(){
    return(
      <View>
        <ScrollView style={styles.questList}>
          <DrugQuest />
          <DrugQuest />
          <DrugQuest />
          <DrugQuest />
          <DrugQuest />
          <DrugQuest />
        </ScrollView>
      </View>
    )
  }
}
