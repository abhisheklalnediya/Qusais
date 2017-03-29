import React, { Component } from 'react';
import {
    Navigator,
    View,
    Text,
    StyleSheet,
    BackAndroid
} from 'react-native';

import dispatcher from "../dispatcher/dispatcher";

import { LoginPage, HeaderLogo } from './loginLayout';
import { Quests } from './quests';
//import { AssOverview } from './assOverview';
import { AssIndex } from './assOverview';
import { DoAssAnswer } from './assDoAnswer'
import { Pain } from './pain'
import { Eqvas } from './eqvas'

const routes = [
    {name: 'CheckLogin', index: 0},
];


export class DefRouter extends Component{

    constructor() {
      super();
    }
    componentWillMount(){
        navigator : null;
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
                return true;
            }
            return false;
        });
    }
    renderScene(routeOptions, navigator){
        if(!this.navigator && navigator){
            dispatcher.dispatch({
                action_type : "NAVIGATION",
                navigator : navigator
            })
            this.navigator = navigator
        }
        console.log('Going to n1: ', routeOptions.name)
        if(routeOptions.name=='CheckLogin'){
            return <LoginPage navigator={navigator}/>
        }
        else if(routeOptions.name=='Quests'){
            return <Quests navigator={navigator}/>
        }
        else if(routeOptions.name=='Pain'){
            return <Pain {...routeOptions} navigator={navigator}/>
        }
        else if(routeOptions.name=='Eqvas'){
            return <Eqvas {...routeOptions} navigator={navigator}/>
        }
        else if(routeOptions.name=='AssIndex'){
            return <AssIndex {...routeOptions} navigator={navigator}/>
        }
        else if(routeOptions.name=='FetchAssOverview'){
            return <FetchAssOverview navigator={navigator}/>
        }
        else if(routeOptions.name=='DoAnswerFS'){
            return <DoAssAnswer {...routeOptions}  navigator={navigator}/>
        }

        // else {
        //     return <Quests navigator={navigator}/>
        // }

    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderLogo navigator={this.navigator} style={styles.headerLogo} title="Welcome" />
                <Navigator
                    ref={(nav) => { navigator = nav; }}
                    style={styles.nav}
                    initialRoute={routes[0]}
                    initialRouteStack={routes}
                    renderScene={this.renderScene.bind(this)}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    nav: {
        flex: 1
    },
    headerLogo:{
        height:30,
        backgroundColor:'#ddd'
    },
    container: {
        flex: 1,

    }
})
