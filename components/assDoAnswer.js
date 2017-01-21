import React, { Component } from 'react';
import {
    ActivityIndicator,
    Button,
    Image,
    StyleSheet,
    ScrollView,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

import Qstnr from "../stores/QstnrStore";

export class DoAssAnswer extends Component {
    constructor(props) {

        super(props);
        //console.log(this.props.qUuid)
        this.state = {
            question: Qstnr.getByUUID(this.props.qUuid)
        };
    }
    doOptionAnswer(p){
        console.log(p)
        this.setState({
            documented : true,
            valude : 1
        })
        this.setState({question : Qstnr.getNextQuestion(this.state.question.uuid)})
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

const styles = StyleSheet.create({
    qBox: {
        //width: 100,
        //height: 100,
        //borderWidth: 1,
        //borderColor: '#234243',
        //borderStyle: 'solid',
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
