import React, { Component } from 'react';
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    View,

    TouchableHighlight
} from 'react-native';

import { Button, Container, Content, Form, Item, Input, Icon,Label } from 'native-base';

import dispatcher from "../dispatcher/dispatcher";
import Session from  "../stores/SessionStore";


export class LoginPage extends Component {
    constructor() {
        super();
        this.state = {
            inProgress: true,
            status : "Logging in...",
            showLginForm : false
        };
    }
    navigate(d){
        this.props.navigator.push({
            name:d
        })
    }
    loginSuccess(){
        this.setState( {
            inProgress : false,
            status : "Welcome",
            username : "",
            password : ""
            
        })
        this.navigate('Quests')
    }
    componentWillMount(){
        Session.once('LOGIN_SUCCESS', ()=>{
            if(Session.getToken()){
                this.loginSuccess()
            }
        })
        Session.once('LOGIN_ERROR', ()=>{
            this.setState({
                inProgress : false,
                showLginForm : true,
                status : "Login",
            })
        })
    }
    componentDidMount() {
        Session.checkLogin()
    }
    login(){
        console.log(this.state)
        Session.login({...this.state})
    }
    renderLoginForm(){
        return (
            <Form>
                <Item fixedLabel>
                    <Icon  name='person' />
                    <Input onChangeText={(text) => this.setState({username:text})} placeholder="username" />
                </Item>
                <Item fixedLabel last>
                    <Icon  name='key' />
                    <Input secureTextEntry={true} onChangeText={(text) => this.setState({password:text})} placeholder="password" />
                </Item>
                <Button block>
                    <Text onPress={this.login.bind(this)} >Login</Text>
                </Button>
            </Form>
        )
    }
    renderProgress(){
        return(
            <View>
                <ActivityIndicator
                    animating={this.state.inProgress}
                    style={[styles.centering, {height: 80}]}
                    size="large"
                    />
                <Text>{this.state.status}</Text>
            </View>
        )
    }
    render() {
        if(this.state.showLginForm){
            return ( this.renderLoginForm() )
        }
        else{
            return (this.renderProgress())
        }
            
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
