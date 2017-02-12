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
                <TouchableHighlight
                    key={i}
                    onPress={this.onPressLearnMore}
                    style={styles.qBtn}
                    accessibilityLabel="{o.title}"
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
                <Text>{assessment.accessKey.accesskey}</Text>
                <Text>{assessment.status}</Text>
                {showQuestionnares()}
                <TouchableHighlight
                    onPress={this.onPressAnswer.bind(this)}
                    style={styles.qBtn}
                    accessibilityLabel="{o.title}"
                    >
                    <Text>Answer</Text>
                </TouchableHighlight>
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
        this.state = {
            status : "Fetching Assessment Details.",
            inProgress : true
        };
    }
    navigate(d){
        this.props.navigator.push({
            name:d
        })
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
        this.navigator.push({
            name:d
        })
    }
    renderAssScene(route, navigator){
        this.navigator = navigator
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
                    <AssOverview navigator={navigator} />
                )
            case "AssQstnrOverview":
                return (
                    <AssQstnrOverview navigator={navigator} />
                )
        }
    }
    render(){
        return(
            <Navigator
                ref={(nav) => { navigator = nav; }}
                initialRoute={routes[0]}
                initialRouteStack={routes}
                renderScene={this.renderAssScene.bind(this)}
                />
        )

    }
}
//
// export class FetchAssOverview extends Component {
//     constructor(props) {
//         console.log('here')
//         super(props);
//         this.state = {
//             inProgress: true,
//             status : "Fetching Assessment Details."
//         };
//     }
//     navigate(d){
//       this.props.navigator.push({
//         name:d
//       })
//     }
//     componentDidMount (){
//         console.log('mounting')
//         Assessment.fetch('77457')
//         Assessment.on('CHANGE', ()=>{
//             console.log('Ass Changed')
//             this.setState({
//                 inProgress : false,
//                 status : "Be ready for Assessment"
//             })
//         })
//     }
//
//     render(){
//         return(
//             <View>
//                 <ScrollView style={styles.questList}>
//                     <Text>{this.state.status}</Text>
//                 </ScrollView>
//             </View>
//         )
//     }
// }
//
// export class AssOverview extends Component {
//     constructor(props) {
//         console.log('here')
//         super(props);
//         this.state = {
//             inProgress: true,
//             status : "Logging in..."
//         };
//     }
//     navigate(d){
//       this.props.navigator.push({
//         name:d
//       })
//     }
//     componentWillMount (){
//         // Assessment.fetch('77457')
//         // Assessment.on('CHANGE', ()=>{
//         //     console.log('Ass Changed')
//         //     this.setState({
//         //         inProgress : false
//         //     })
//         //     // this.navigate('AssOverview')
//         // })
//     }
//     renderAssQuestions(){
//         console.log(this.state)
//         if(this.state.inProgress)
//         {
//             return (
//                 <ActivityIndicator
//                     animating={true}
//                     size="large"
//                     />
//             )
//         }
//         else {
//             return (
//                 Assessment.getAll().map((q,i) => {
//                     return (
//                         <AssQuestion key={i} navigator={this.props.navigator} question={q} />
//                     )
//                 })
//             )
//         }
//
//     }
//     render(){
//         return(
//             <View>
//                 <ScrollView style={styles.questList}>
//                     {this.renderAssQuestions()}
//                 </ScrollView>
//             </View>
//         )
//     }
// }
