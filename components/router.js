import React, { Component } from 'react';
import {
    Navigator,
    View,
    Text,
    StyleSheet,
    BackAndroid
} from 'react-native';

import { LoginPage, HeaderLogo } from './loginLayout';
import { Quests } from './quests';
import { AssOverview } from './assOverview';
import { DoAssAnswer } from './assDoAnswer'

const routes = [
    {name: 'CheckLogin', index: 0},
//    {name: 'Quests', index: 1},
//    {name: 'AssOverview', index: 2},
//    {name: 'DoAnswer', index:3},
];


export class DefRouter extends Component{

    constructor() {
      super();
    //   this.state = {
    //     //navigator : null
    //   };
    }


    componentWillMount(){
        navigator : null;// = this.navigator;
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (navigator && navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
                return true;
            }
            return false;
        });
    }

    renderScene(route, navigator){
        this.navigator = navigator
        console.log('Going to : ', route.name)
        if(route.name=='CheckLogin'){
            return <LoginPage navigator={navigator}/>
        }
        else if(route.name=='Quests'){
            return <Quests navigator={navigator}/>
        }
        else if(route.name=='AssOverview'){
            return <AssOverview navigator={navigator}/>
        }
        else if(route.name=='DoAnswerFS'){
            return <DoAssAnswer {...route} navigator={navigator}/>
        }
        // else {
        //     return <Quests navigator={navigator}/>
        // }

    }
    render() {
        return (
            <View style={styles.container}>
                <HeaderLogo style={styles.headerLogo} title="Welcome" />
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
