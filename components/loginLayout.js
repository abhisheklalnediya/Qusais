import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,

    TouchableHighlight
} from 'react-native';

import dispatcher from "../dispatcher/dispatcher";
import Session from  "../stores/SessionStore";


export class LoginPage extends Component {
    constructor() {
        super();
        this.state = {
            inProgress: true,
            status : "Logging in..."
        };
    }
    navigate(d){
        this.props.navigator.push({
            name:d
        })
    }
    loginSuccess(){
        this.setState( {
            "inProgress" : false,
            "status" : "Welcome"
        })
        this.navigate('AssIndex')
    }
    componentWillMount(){
        Session.on('CHANGE', ()=>{
            if(Session.getToken()){
                this.loginSuccess()
            }
        })
    }
    componentDidMount() {
        Session.checkLogin()
    }

    render() {
        return (
            <View style={styles.login_container}>
                <ActivityIndicator
                    animating={this.state.inProgress}
                    style={[styles.centering, {height: 80}]}
                    size="large"
                    />
                <Text>{this.state.status}</Text>
            </View>
        );
    }
}

export class HeaderLogo extends Component{
    constructor(props){
        super(props)
        //console.log(this.props)
    }
    componentWillMount(){
        //console.log("registering")
        dispatcher.register((payload)=>{
            //console.log(this)
            if (payload.action_type = "NAVIGATION"){
                this.navigator = payload.navigator
            }
            //console.log(this.navigator)
        });
    }
    onPressButton(){
        //console.log('halle', this.navigator)
        if (this.navigator && this.navigator.getCurrentRoutes().length > 1) {
                this.navigator.pop();
                return true;
            }
    }
    render() {
        return (
            <View style={styles.header_container}>
                <Image
                    style={styles.logo}
                    resizeMode={Image.resizeMode.contain}
                    source={require('../images/logo-header.png')}
                    />
                <TouchableHighlight onPress={this.onPressButton.bind(this)} style={styles.button} underlayColor="white">
                    <Text > &#9776;</Text>
                </TouchableHighlight>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    header_container: {

        flexDirection:'row',
        justifyContent: 'space-between',
        //alignItems: 'flex-end',
        backgroundColor: '#F5FCFF',
    },
    login_container: {

        flex : 1,
        justifyContent: 'center',
        alignItems: 'center',
        //backgroundColor: '#F5FCFF',
    },
    logo:{

        width:150,
        //alignItems: 'flex-start',
        height:50
    },
    menu:{
        width:50
    },
    button: {
        //borderWidth: 1,
        padding: 15,
        //   borderColor: 'black',
        //backgroundColor: 'red',
    }
})
