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
        borderLeftColor : '#D93715',
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
class EqvasForm extends Component{
    constructor() {
        super();
        this.state = {
            eqvas_scale: 0,
            sliderColor: '#FFF'
        };
        this._updateEqvas = this._updateEqvas.bind(this)
    }
    _updateEqvas(){
        this.setState({
            eqvas_scale : Session.UserProfile.eqvas_scale || 0
        })
    }
    componentDidMount(){
        try {
            this.onSliderChange(Session.UserProfile.eqvas_scale)
        } catch(e) {
        }
        Session.addEL('USER_CHANGE',this._updateEqvas)
    }
    componentWillUnmount(){
        Session.removeEL('USER_CHANGE',this._updateEqvas)   
    }
    styles = StyleSheet.create({
        container: {
            backgroundColor: '#D93715'
        },

    })
    onSliderChange(v){
        this.setState({eqvas_scale:v}) 
        if (v>70){
            this.setState({
               sliderColor : '#FFF'
            })
        }
        else if(v>30) {
            this.setState({
               sliderColor : '#F6C913'
            })
        }
        else {
            this.setState({
               sliderColor : '#F6C913'
            })
        }
    }
    onSlidingComplete(v){
        Health.saveEqvas(v)
    }
    render(){
        return(
            <View style={[this.styles.container, styles.qContainer]}>
                <Text style={styles.qTitle}>Health</Text>
                <Text style={styles.qLatestVal}>{this.state.eqvas_scale} of {Utils.config.eqvas_scale_max}</Text>
                <Slider style={styles.slider} minimumTrackTintColor={this.state.sliderColor} step={1} onSlidingComplete={ this.onSlidingComplete.bind(this) } onValueChange={ this.onSliderChange.bind(this) } maximumValue={Utils.config.eqvas_scale_max} minimumValue={Utils.config.eqvas_scale_min} value={this.state.eqvas_scale}></Slider>
            </View>
        )
    }
}

class EqvasQuest extends Component{
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
                <Text style={styles.healthItemText}>{this.state.eqvas}</Text>
            </View>
        )
    }
}

export class Eqvas extends Component {
    constructor(props){
        super(props)
        this.state = {
            eqvasQuests : Health.getEqvasQuests(),
            isRefreshing : false
        }
        this._eqvasStoreUpdated = this._eqvasStoreUpdated.bind(this)
        this._showRefrehing = this._showRefrehing.bind(this)
    }
    _eqvasStoreUpdated(){
        this.setState({
            eqvasQuests : Health.getEqvasQuests(),
            isRefreshing : false
        })
    }
    _showRefrehing(){
        this.setState({
                isRefreshing : true
        })
    }
    componentDidMount(){
        Health.fetchEqvas()
        Health.addEL('EQVAS_STORE_UPDATED',this._eqvasStoreUpdated)
        //Health.addEL('EQVAS_STORE_UPDATING',this._showRefrehing)
    }
    componentWillUnmount(){
        Health.removeEL('EQVAS_STORE_UPDATED',this._eqvasStoreUpdated)
        //Health.removeEL('EQVAS_STORE_UPDATING',this._showRefrehing)
    }
    renderEqvasQuests(){
        return(
            this.state.eqvasQuests.map((q,i) => {
                return (
                    <EqvasQuest key={i} {...q}/>
                )
            })
        )
    }
    onScrollRefresh(){
        if(!this.state.isRefreshing)
        {
            this.setState({isRefreshing : true})
            Health.fetchEqvas()
            dispatcher.dispatch({
                    type : "FETCH_USER",
            })
        }
    }
    render(){
        return(
            <View>
                <EqvasForm />
                <ScrollView style={styles.questList} refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.onScrollRefresh.bind(this)}
                  /> }>
                    {this.renderEqvasQuests()}
                </ScrollView>
            </View>
        )
    }
}
