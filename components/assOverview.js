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
} from 'native-base';

import Utils from "../Utils"
import dispatcher from "../dispatcher/dispatcher";
import Assessment from "../stores/QstnrStore";

//import {HeaderLogo} from './loginLayout'

// const styles = StyleSheet.create({
//     qBox: {
//         //width: 100,
//         //height: 100,
//         borderWidth: 1,
//         borderColor: '#234243',
//         borderStyle: 'solid',
//         marginBottom : 10
//     },
//     qBtnGrp:{
//         //flexDirection: 'row',
//         justifyContent: 'space-between'
//     },
//     qTitleBox:{
//         padding:3
//     },
//     qTitle:{
//         fontWeight : 'bold'
//     },
//     qBtn:{
//         //flex: 1,
//         marginBottom : 5,
//         borderWidth:1,
//         borderColor:'#ddd',
//         padding : 5
//     },
//     questList:{
//     }
// });

const routes = [
    {name: 'AssOverviewH', index: 0},


];

class AssAnswerFs extends Component {
    constructor(props) {

        super(props);
        //console.log(this.props.qUuid)
        this.state = {
            question: Assessment.getByUUID(this.props.qUuid)
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
    renderButtons(){

        return (this.state.question.o.map((o,i) => {
            return(
                <TouchableHighlight
                    key={i}
                    onPress={this.doOptionAnswer.bind(this, {o : o})}
                    style={styles.qBtn}
                    >
                    <Text>{o.title}</Text>
                </TouchableHighlight>
            )
        }))
    }
    render(){
        if(this.state.question){
            return(
                <View style={styles.qBox}>
                    <View  style={styles.qTitleBox} >
                        <Text style={styles.qTitle}>asd</Text>
                    </View>
                    <View style={styles.qBtnGrp}>
                        {this.renderButtons()}
                    </View>
                </View>
            )
        }else{
            return(<Text>Finish</Text>)
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
    onPressLearnMore(){

    }
    renderButtons(){
        return (this.state.question.options.map((o,i) => {
            return(
                <button
                    key={i}
                    onPress={this.onPressLearnMore}
                    style={styles.qBtn}
                    accessibilityLabel="{o.title}"
                    >
                    <Text>{o.title}</Text>
                </button>
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
        console.log(this.state)
        return(
            <View style={styles.qBox}>
                <View  style={styles.qTitleBox} >
                    <Text onPress={this.goFullScreen.bind(this)} style={styles.qTitle}>{this.state.question.title}</Text>
                </View>
                <View style={styles.qBtnGrp}>
                {this.renderButtons()}
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
        Assessment.fetch('77457')
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
    renderAssScene(route, assNavigator){
        if(!this.assNavigator && assNavigator){
            dispatcher.dispatch({
                action_type : "NAVIGATION",
                navigator : assNavigator
            })
            this.assNavigator = assNavigator
        }
        switch (route.name){
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
