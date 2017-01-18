import React, { Component } from 'react';
import {
    Navigator,
    View,
    Text,
    StyleSheet
} from 'react-native';

import { LoginPage, HeaderLogo } from './loginLayout';
import { Quests } from './quests';
import { AssOverview } from './assOverview';

const routes = [
    {title: 'First Scene', index: 0},
    {title: 'Second Scene', index: 1},
];


export class DefRouter extends Component{

    renderScene(route, navigator){
        console.log(route.name)
        if(route.name=='CheckLogin'){
            return <LoginPage navigator={navigator}/>
        }
        else if(route.name=='Quests'){
            return <Quests navigator={navigator}/>
        }
        else if(route.name=='AssOverview'){
            return <AssOverview navigator={navigator}/>
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
                    style={styles.nav}
                    initialRoute={{ name: 'CheckLogin' }}
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
