import React, { Component } from 'react';
import {
    ActivityIndicator,
    Button,
    Image,
    StyleSheet,
    Text,
    TouchableHighlight,
    ScrollView,
    View,
} from 'react-native';

import Assessment from "../stores/QstnrStore";

//import {HeaderLogo} from './loginLayout'

const styles = StyleSheet.create({
    qBox: {
        //width: 100,
        //height: 100,
        borderWidth: 1,
        borderColor: '#234243',
        borderStyle: 'solid',
        marginBottom : 10
    },
    qBtnGrp:{
        //flexDirection: 'row',
        justifyContent: 'space-between'
    },
    qTitleBox:{
        padding:3
    },
    qTitle:{
        fontWeight : 'bold'
    },
    qBtn:{
        //flex: 1,
        marginBottom : 5,
        borderWidth:1,
        borderColor:'#ddd',
        padding : 5
    },
    questList:{
    }
});


class AssQuestion extends Component{
    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question
        };
    }
    onPressLearnMore(){

    }
    renderButtons(){
        return (this.props.question.o.map((o,i) => {
            return(

                <TouchableHighlight
                    key={i}
                    onPress={this.onPressLearnMore}
                    style={styles.qBtn}
                    accessibilityLabel="Learn more about this purple button"
                    >
                    <Text>{o.title}</Text>
                </TouchableHighlight>
            )
        }))
    }
    goFullScreen(){
        this.props.navigator.push({
            name : 'DoAnswerFS',
            qUuid : this.props.question.uuid
        })
    }
    render(){
        return(
            <View style={styles.qBox}>
                <View  style={styles.qTitleBox} >
                    <Text onPress={this.goFullScreen.bind(this)} style={styles.qTitle}>{this.props.question.q}</Text>
                </View>
                <View style={styles.qBtnGrp}>
                    {this.renderButtons()}
                </View>
            </View>
        )
    }
}



export class AssOverview extends Component {
    navigate(d){
      this.props.navigator.push({
        name:d
      })
    }
    renderAssQuestions(){
        //console.log(this.props)
        return (
            Assessment.getAll().map((q,i) => {
                return (
                    <AssQuestion key={i} navigator={this.props.navigator} question={q} />
                )
            })
        )
    }
    render(){
    this.props.navigator.getCurrentRoutes()
        return(
            <View>
                <ScrollView style={styles.questList}>
                    {this.renderAssQuestions()}
                </ScrollView>
            </View>
        )
    }
}
