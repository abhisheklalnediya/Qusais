import React, { Component } from 'react';
import {
    ActivityIndicator,
    Button,
    Image,
    Navigator,
    StyleSheet,
    Text,
    TouchableHighlight,
    ScrollView,
    View,
} from 'react-native';

import { 
    Container, 
    Content, 
    Body, 
    ListItem, 
    CheckBox,
    Right,
    Radio,

} from 'native-base';

import Utils from "../Utils"
import dispatcher from "../dispatcher/dispatcher";
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

const routes = [
    {name: 'AssOverviewH', index: 0},
];

class AssAnswerFs extends Component {
    constructor(props) {

        super(props);
        //console.log(this.props.qUuid)
        this.state = {
            question: Assessment.getByUUID(this.props.qUuid),
            answerOptions : []
        };
    }
    doOptionAnswer(p){
        console.log(p)
        this.setState({
            documented : true,
            valude : 1
        })
        this.setState({question : Assessment.getNextQuestion(this.state.question.uuid)})
    }
    radioClick(t){
        this.setState({answerOptions : [t]})
        return false
    }
    renderAnsSection(){
        if(this.state.question.ansType == 'o'){
            return (this.state.question.options.map((o,i) => {
                return(
                    <ListItem onPress={this.radioClick.bind(this, o.uuid)} key={i} selected={ this.state.answerOptions.includes(o.uuid) }>
                        <Text>{o.title}</Text>
                        <Right>
                            <Radio selected={this.state.answerOptions.includes(o.uuid) } />
                        </Right>
                    </ListItem>
                )
            }))
        }
        
    }
    render(){
        if(this.state.question){
            return(
                <View style={styles.qBox}>
                    <View  style={styles.qTitleBox} >
                        <Text style={styles.qTitle}>{this.state.question.title}</Text>
                    </View>
                    <View >
                        {this.renderAnsSection()}
                    </View>
                </View>
            )
        }else{
            return(
                <ListItem>
                        <CheckBox checked={true} />
                        <Body>
                            <Text>Daily Stand Up</Text>
                        </Body>
                    </ListItem>
                )
        }
    }
}


class AssQuestion extends Component{
    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question
        };
    }

    componentWillMount (){
        // Assessment.fetch('77457')
    }
    radioClick(answer){
        dispatcher.dispatch({
            type : "DOCUMENT_QUESTION",
            option : answer,
            question : this.state.question.uuid,
            questionnaire : this.state.question.questionnaire.uuid
        })
    }
    renderAnsSec(){
        if(this.state.question.ansType == 'o'){
            return (this.state.question.options.map((o,i) => {
                return(
                    <ListItem onPress={this.radioClick.bind(this, o.uuid)} key={i} selected={ o.uuid == this.state.question.answer }>
                            <Text>{o.title}</Text>
                            <Right>
                                <Radio selected={ o.uuid == this.state.question.answer } />
                            </Right>
                    </ListItem>
                )
            }))
        }
        else if(this.state.question.ansType == 'm'){
           
        }
        else if(this.state.question.ansType == 't'){
            
        }
        
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
                    <Text onPress={this.goFullScreen.bind(this)} style={styles.qTitle}>{this.state.question.title}</Text>
                </View>
                <View style={styles.qBtnGrp}>
                {this.renderAnsSec()}
                </View>
            </View>
        )
    }
}
class AssQstnrOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allQuestions : Assessment.getAllQuestions()
        };
    }
    navigate(d){
        this.props.navigator.push({
            name:d
        })
    }
    componentWillMount (){
    }
    renderAssQuestions(){
        return (
            this.state.allQuestions.map((q,i) => {
                return (
                    <AssQuestion key={i} navigator={this.props.navigator} question={q} />
                    //<Text key={i}>{q.title}</Text>
                )
            })
        )
    }
    render(){
        return(
            <View>
                <ScrollView style={styles.questList}>
                    {this.renderAssQuestions()}
                </ScrollView>
            </View>
        )
    }
}

class AssOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assessment : Assessment.getAssment()
        };
    }
    navigate(d){
        this.props.navigator.push({
            name:d
        })
    }
    componentWillMount (){
    }
    onPressAnswer(e){
        this.navigate('AssQstnrOverview')
    }
    styles = StyleSheet.create({
        qInfoRow : {
            flexDirection:'row',
            justifyContent: 'space-between',
            //alignItems: 'flex-end',
            backgroundColor: '#F5FCFF',
        },
        qInfoRowItem : {
            flex : 1
        }
    })
    renderAssQstnr(){
        var assessment = this.state.assessment
        function showQuestionnares(){
            return(
                assessment.questionnaires.map((q,i) => {
                    return (
                        <Text key={i}>{q.title}</Text>
                    )
                })
            )
        }
        return (
            <View>
                <View style={this.styles.qInfoRow}>
                    <Text style={this.styles.qInfoRowItem}>{assessment.accessKey.accesskey}</Text>
                    <Text style={this.styles.qInfoRowItem}>{Utils.assStatus(assessment).status}</Text>
                </View>
                <TouchableHighlight
                    onPress={this.onPressAnswer.bind(this)}
                    style={styles.qBtn}
                    accessibilityLabel="{o.title}"
                    >
                    <Text>Answer</Text>
                </TouchableHighlight>
                {showQuestionnares()}
            </View>
        )
    }
    render(){
        return(
            <View>
                <ScrollView style={styles.questList}>
                    {this.renderAssQstnr()}
                </ScrollView>
            </View>
        )
    }
}
export class AssIndex extends Component {
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            status : "Fetching Assessment Details.",
            inProgress : true
        };
    }
    componentWillMount (){
    }
    componentDidMount (){
        Assessment.fetch('679c3')
        Assessment.on('CHANGE', ()=>{
            this.setState({
                inProgress : false,
                status : "Be ready for Assessment"
            })
            this.navigate('AssOverview')
        })
    }
    navigate(d){
        this.assNavigator.push({
            name:d
        })
    }
    renderAssScene(routeOptions, assNavigator){
        if(!this.assNavigator && assNavigator){
            dispatcher.dispatch({
                action_type : "NAVIGATION",
                navigator : assNavigator
            })
            this.assNavigator = assNavigator
        }
        switch (routeOptions.name){
            case 'AssOverviewH':
                return(
                    <View>
                        <ScrollView style={styles.questList}>
                            <ActivityIndicator
                                animating={this.state.inProgress}
                                size="large"
                                />
                            <Text>{this.state.status}</Text>
                        </ScrollView>
                    </View> 
                )
            case "AssOverview":
                return (
                    <AssOverview navigator={assNavigator} />
                )
            case "AssQstnrOverview":
                return (
                    <AssQstnrOverview navigator={assNavigator} />
                )
            case "DoAnswerFS":
                return (
                    <AssAnswerFs {...routeOptions} navigator={assNavigator} />
                )
        }
    }
    render(){
        return(
            <Navigator
                ref={(nav) => { assNavigator = nav; }}
                initialRoute={routes[0]}
                initialRouteStack={routes}
                renderScene={this.renderAssScene.bind(this)}
                />
        )

    }
}
