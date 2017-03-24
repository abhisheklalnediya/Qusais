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
    styles = StyleSheet.create({
        container: {
            height : 100,
            //flex : 200,
            backgroundColor: '#F0F',
            margin : 5
        }
    })
    render(){
        return(
            <View style={this.styles.container}>
                <Text>Did you took Drug1?</Text>
            </View>
        )
    }
}
class PainQuest extends Component{
    styles = StyleSheet.create({
        container: {
            height : 100,
            //flex : 200,
            backgroundColor: '#0FF',
            margin : 5
        }
    })
    render(){
        return(
            <View style={this.styles.container}>
                <Text>Pain</Text>
            </View>
        )
    }
}
class EqvasQuest extends Component{
    styles = StyleSheet.create({
        container: {
            //flex : 500,
            height : 100,
            backgroundColor: '#FF0',
            margin : 5
        }
    })
    render(){
        return(
            <View style={this.styles.container}>
                <Text>Health Scale</Text>
            </View>
        )
    }
}

class AssQuest extends Component{
    styles = StyleSheet.create({
        container: {
            //flex : 500,
            height : 100,
            backgroundColor: '#FF0',
            margin : 5
        }
    })
    render(){
        return(
            <View style={this.styles.container}>
                <Text>Assessment Quest</Text>
            </View>
        )
    }
}

export class Quests extends Component {
    styles = StyleSheet.create({
        healthRow: {
            //flex : 1,
            //flexDirection:'row',
            //justifyContent: 'space-between',
            //alignItems: 'flex-end',
            //backgroundColor: '#F5FCFF',
        },
        painBox : {
         //   flex : 20
        },
        eqvasBox : {
         //   flex : 300

        }
    })
    render(){
        return(
            <View>
                <ScrollView style={styles.questList}>
                    <PainQuest style={this.styles.painBox} />
                    <EqvasQuest style={this.styles.eqvasBox} />
                    <DrugQuest />
                    <AssQuest />
                </ScrollView>
            </View>
        )
    }
}
