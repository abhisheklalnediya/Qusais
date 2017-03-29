import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    ScrollView,
    View,
    Slider,
    TouchableHighlight

} from 'react-native';

import Utils from '../Utils'
import Session from "../stores/SessionStore";
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
    qTitle:{
        textAlign : 'left',
        color : '#FFF',
        fontWeight : "bold",
        fontSize : 18
    },
    qLatestVal:{
        textAlign : 'right',
        color : '#FFF',
        fontWeight : "bold",
        fontSize : 20
    },
    qContainer: {
        //flex : 500,
        //height : 50,
        margin : 5,
        padding : 5
    }
});

class HealthQuest extends Component{
    constructor(props) {
        super(props);
        this.type = this.props.type
        this.state = {
            type : this.type
        };
        this.state[this._getScaleType()] = 0
        this._userChanged = this._userChanged.bind(this)
    }
    _getScaleType(){
        return (this.props.type=='PAIN')? 'pain_scale':'health_scale'
    }
    _getScaleColor(){
        return (this.props.type == 'PAIN')? '#B8C90A':'#D93715'
    }
    _userChanged(){
        var s = {}
        s[this._getScaleType()] = Session.UserProfile[this._getScaleType()] || 0

        this.setState(s)
        //console.log(s, this._getScaleType(),this.state)
    }
    componentDidMount(){
        //console.log(this.state)
         try {
            this._userChanged()
        } catch(e) {
        }
        Session.addEL('USER_CHANGE', this._userChanged)
    }
    componentWillUnmount(){
        Session.removeEL('USER_CHANGE', this._userChanged)
    }
    styles = StyleSheet.create({
        container: {
            backgroundColor:this._getScaleColor()
        },

    })
    changePain(){
        return false
    }
    onPainPress(){
        //console.log(this.props)
        this.props.navigator.push({
            name : (this.state.type == 'PAIN')? "Pain" : "Eqvas",
        })
    }
    render(){
        return(
            <TouchableHighlight onPress={this.onPainPress.bind(this)} style={styles.button} underlayColor="white">
                <View style={[this.styles.container, styles.qContainer]}>
                    <Text style={styles.qTitle}>{(this.state.type=='PAIN')?'Pain':'Health'}</Text>
                    <Text style={styles.qLatestVal}>{this.state[this._getScaleType()]} of {Utils.config.pain_scale_max}</Text>
                </View>
            </TouchableHighlight>

        )
    }
}

class DrugQuest extends Component{
    constructor(props){
        super(props);
        this.state = {
            favDrugs : Session.getFavDrugs()
        }
        this._updateAsskeys = this._updateAsskeys.bind(this)
    }
    _updateAsskeys(){
        this.setState({
            favDrugs : Session.getFavDrugs()
        })
    }
    componentDidMount(){
        Session.addEL('FAVDRUG_CHANGE',this._updateAsskeys)
    }

    styles = StyleSheet.create({
        container: {
            backgroundColor: '#91C5AB'
        }
    })
    renderKeys(){
        return(
            this.state.favDrugs.map((q,i) => {
                return (
                    <View key={i} style={[this.styles.container, styles.qContainer]}>
                        <Text  style={styles.qTitle}>Drug Intake</Text>
                        <Text  style={styles.qLatestVal} >{q.quantity} {q.drug.form} {q.drug.name}</Text>
                    </View>
                )
            })
        )
    }
    render(){
        return(
            <View>
            {this.renderKeys()}
            </View>
        )
    }
}
class AssQuest extends Component{
    constructor(props){
        super(props);
        this.state = {
            assKeys : Session.getAssKeys()
        }
        this._updateAsskeys = this._updateAsskeys.bind(this)
    }
    _updateAsskeys(){
        this.setState({
            assKeys : Session.getAssKeys()
        })
    }
    componentDidMount(){
        Session.addEL('ASSKEY_CHANGE',this._updateAsskeys)
    }
    componentWillUnmount(){
        Session.removeEL('ASSKEY_CHANGE', this._updateAsskeys)
    }
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#b72c4d'
        }
    })

    onAssessmentPress(key){
        //console.log(this.props)
        this.props.navigator.push({
            name : "AssIndex",
            accesskey : key
        })
    }
    renderKeys(){
        return(
            this.state.assKeys.map((q,i) => {
                if( q.status == 'g'){
                    return (
                        <TouchableHighlight key={i} onPress={() => this.onAssessmentPress(q.accesskey)} style={styles.button} underlayColor="white">
                            <View style={[this.styles.container, styles.qContainer]}>
                                <Text  style={styles.qTitle}>Assessment</Text>
                                <Text  style={styles.qLatestVal}>{q.accesskey.toUpperCase()}</Text>
                            </View>
                        </TouchableHighlight>
                    )
                }
            })
        )
    }
    render(){
        return(
            <View>
            {this.renderKeys()}
            </View>
        )
    }
}

export class Quests extends Component {
    styles = StyleSheet.create({
        healthRow: {
        },
        painBox : {
        },
        eqvasBox : {
        }
    })
    render(){
        return(
            <View>
                <ScrollView style={styles.questList}>
                    <HealthQuest type={'PAIN'} navigator={this.props.navigator} style={this.styles.painBox} />
                    <HealthQuest type={'EQVAS'} navigator={this.props.navigator} style={this.styles.painBox} />
                    <DrugQuest navigator={this.props.navigator} />
                    <AssQuest navigator={this.props.navigator} />
                </ScrollView>
            </View>
        )
    }
}
