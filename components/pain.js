import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    ScrollView,
    View,
    Slider,
    RefreshControl
} from 'react-native';

import Utils from '../Utils'
import Session from "../stores/SessionStore";
import Health from "../stores/HealthStore"
import dispatcher from "../dispatcher/dispatcher"

const styles = StyleSheet.create({
    questList:{
        
    },
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
        fontSize : 23
    },
    qContainer: {
        //flex : 500,
        height : 100,
        margin : 5,
        padding : 5,
        marginBottom : 0,
    },
    slider:{
        //height:100
    },
    healthItemContainer:{
        flexDirection : 'row',
        marginLeft : 5,
        marginRight : 5,
        paddingTop : 5,
        paddingBottom : 5,
        borderBottomColor : '#ddd',
        borderBottomWidth : 1,
        borderLeftColor : '#B8C90A',
        borderLeftWidth : 3
        //marginBottom : ,
    },
    healthItemText:{
        flex : 400,
        fontWeight : 'bold',
        padding : 5

    },
    healthItemDate:{
        flex : 400,
        fontWeight : 'bold',
        padding : 5
    }
});
class PainForm extends Component{
    constructor() {
        super();
        this.state = {
            pain_scale: 0,
            sliderColor: '#FFF'
        };
        this._updatePain = this._updatePain.bind(this)
    }
    _updatePain(){
        this.setState({
            pain_scale : Session.UserProfile.pain_scale || 0
        })
    }
    componentDidMount(){
        try {
            this.onSliderChange(Session.UserProfile.pain_scale)
        } catch(e) {
        }
        Session.addEL('USER_CHANGE',this._updatePain)
    }
    componentWillUnmount(){
        Session.removeEL('USER_CHANGE',this._updatePain)   
    }
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#B8C90A'
        },

    })
    changePain(){
        return false
    }
    onSliderChange(v){
        this.setState({pain_scale:v}) 
        if (v<4){
            this.setState({
               sliderColor : '#FFF'
            })
        }
        else if(v<8) {
            this.setState({
               sliderColor : '#F6C913'
            })
        }
        else {
            this.setState({
               sliderColor : '#D93715'
            })
        }
    }
    onSlidingComplete(v){
        Health.savePain(v)
    }
    render(){
        return(
            <View style={[this.styles.container, styles.qContainer]}>
                <Text style={styles.qTitle}>Pain</Text>
                <Text style={styles.qLatestVal}>{this.state.pain_scale} of {Utils.config.pain_scale_max}</Text>
                <Slider style={styles.slider} minimumTrackTintColor={this.state.sliderColor} step={1} onSlidingComplete={ this.onSlidingComplete.bind(this) } onValueChange={ this.onSliderChange.bind(this) } maximumValue={Utils.config.pain_scale_max} minimumValue={Utils.config.pain_scale_min} value={this.state.pain_scale}></Slider>
            </View>
        )
    }
}

class PainQuest extends Component{
    constructor(props) {
        super(props)
        this.state = {
            ...this.props
        }
        
    }
    componentWillReceiveProps(props){
        this.setState({
            ...props
        })
    }
    render(){
        return(
            <View style={styles.healthItemContainer}>
                <Text style={styles.healthItemDate}>{Utils.formatDate(this.state.prescribedDate)}</Text>
                <Text style={styles.healthItemText}>{this.state.pain}</Text>
            </View>
        )
    }
}

export class Pain extends Component {
    constructor(props){
        super(props)
        this.state = {
            painQuests : Health.getPainQuests(),
            isRefreshing : false
        }
        this._painStoreUpdated = this._painStoreUpdated.bind(this)
        this._showRefrehing = this._showRefrehing.bind(this)
    }
    _painStoreUpdated(){
        this.setState({
            painQuests : Health.getPainQuests(),
            isRefreshing : false
        })
    }
    _showRefrehing(){
        this.setState({
                isRefreshing : true
        })
    }
    componentDidMount(){
        Health.fetchPain()
        Health.addEL('PAIN_STORE_UPDATED',this._painStoreUpdated)
        //Health.addEL('PAIN_STORE_UPDATING',this._showRefrehing)
    }
    componentWillUnmount(){
        Health.removeEL('PAIN_STORE_UPDATED',this._painStoreUpdated)
        //Health.removeEL('PAIN_STORE_UPDATING',this._showRefrehing)
    }
    renderPainQuests(){
        return(
            this.state.painQuests.map((q,i) => {
                return (
                    <PainQuest key={i} {...q}/>
                )
            })
        )
    }
    onScrollRefresh(){
        if(!this.state.isRefreshing)
        {
            this.setState({isRefreshing : true})
            Health.fetchPain()
            dispatcher.dispatch({
                    type : "FETCH_USER",
            })
        }
    }
    render(){
        return(
            <View>
                <PainForm />
                <ScrollView style={styles.questList} refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onScrollRefresh.bind(this)}
                  /> }>
                    {this.renderPainQuests()}
                </ScrollView>
            </View>
        )
    }
}
