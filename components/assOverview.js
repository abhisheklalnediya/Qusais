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

//import {HeaderLogo} from './loginLayout'

const styles = StyleSheet.create({
    qBox: {
        //width: 100,
        height: 100,
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
const Questions = [
    {
        'q' : "How do you feel?",
        'o' :[
            {
                'title':'Ok'
            },
            {
                'title':'Not Ok'
            },
        ]
    },
    {
        'q' : "Is your wife Ok??",
        'o' :[
            {
                'title':'Ok'
            },
            {
                'title':'Not Ok'
            },
            {
                'title':'Horney'
            }
        ]
    },
]

class AssQuestion extends Component{
    constructor(props) {
        super(props);
        console.log(this.props)
        this.state = {
            question: this.props.question
        };
    }
    onPressLearnMore(){
        console.log('Brrr')
        return false
    }
    renderButtons(){
        console.log(this.props.question)
        return (this.props.question.o.map((o,i) => {
            console.log(o)
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
            })
        )
    }
    render(){
        return(
            <View style={styles.qBox}>
                <View style={styles.qTitleBox}>
                    <Text style={styles.qTitle}>{this.props.question.q}</Text>
                </View>
                <View style={styles.qBtnGrp}>
                    {this.renderButtons()}
                </View>
            </View>
        )
    }
}



export class AssOverview extends Component {
    renderAssQuestions(){
        return (Questions.map((q,i) => {
            return <AssQuestion key={i} question={q} />
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
