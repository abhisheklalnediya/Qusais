import { EventEmitter } from "events";
import { AsyncStorage } from "react-native";
import  moment from 'moment';
import dispatcher from "../dispatcher/dispatcher"

class Session extends EventEmitter {
    API_ROOT = 'https://1212api.kraftvoll.in'
    constructor() {
        super()
        this.session = {
            client_id : '4gDWWcTQgx14gu3IrsYmkeT6l8DfwsV9DFyqK8Jh',
            client_secret : 'LLH1mtTdbBK9y4KViuoUqWs5qEt5icw79qn638XWMTNonAOuppLlyX1jIEp88BLeUJ1IErjozw1yKKgMuy4268mZzKmbv9n1W4h8zaqCuEo9hqg40HBcpxCtR4I0TYnO',
        }
        this.furtherHeaders = {}
        this.UserProfile = null
        this.assessmentKeys = []
        this.favDrugs = []
    }
    addEL(event, callback) {
        this.on(event, callback);
    }
    removeEL(event, callback) {
        this.removeListener(event, callback)
    }
    getUrlEncoded(creds){
        var data = {
            client_id : this.session.client_id,
            client_secret : this.session.client_secret
        }
        
        if(creds.hasOwnProperty('rfToken')){

            data.refresh_token = creds.rfToken
            data.grant_type = "refresh_token"
        }
        else{
            data.username = creds.username
            data.password = creds.password
            data.grant_type = 'password'

        }
        var url = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        return url;
    }
    getUserUUID (){
        try{
            return this.UserProfile.uuid    
        }
        catch(e){
            return null
        }
    }
    getToken(){
        // Return Access Token
        return ('access_token' in this.session && this.session.access_token)? this.session.access_token : null
    }
    login(creds){
        (async () => {
            try {
                let response = await fetch(this.API_ROOT + '/can/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    },
                    body : this.getUrlEncoded(creds)
                });

                let responseJson = await response.json();
                console.log(responseJson)
                if(response.status == 200)
                {
                    Object.assign(this.session, responseJson)
                    Object.assign(this.furtherHeaders, {
                        'Authorization' : this.session.token_type + ' ' +  this.getToken(),
                        'content-type' : 'application/json'
                    })
                    try {
                        await AsyncStorage.setItem('QuasisSession:rfToken', responseJson.refresh_token);
                        console.log('Local Save Success')
                    } catch (error) {
                        // Error saving data
                    }
                }
                this.emit("LOGIN_SUCCESS")
                this._fetchUserDetails()
            } catch(error) {
                console.log("Errorrr", error)
                this.emit("LOGIN_ERROR")
            }
        })()
    }
    _getNEwToken(rfToken){
        (async () => {
            try {
                let response = await fetch(this.API_ROOT + '/can/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    },
                    body : this.getUrlEncoded({"rfToken" : rfToken})
                });

                let responseJson = await response.json();
                console.log(responseJson)
                if(response.status == 200)
                {
                    Object.assign(this.session, responseJson)
                    Object.assign(this.furtherHeaders, {
                        'Authorization' : this.session.token_type + ' ' +  this.getToken(),
                        'content-type' : 'application/json'
                    })
                    try {
                        await AsyncStorage.setItem('QuasisSession:rfToken', responseJson.refresh_token);
                        this.emit("LOGIN_SUCCESS")
                    } catch (error) {
                        // Error saving data
                    }
                    this._fetchUserDetails()
                }
                else{
                    this.emit("LOGIN_ERROR")
                }
                
            } catch(error) {
                console.log("Errorrr", error)
                this.emit("LOGIN_ERROR")
            }
        })()
    }
    _fetchUserDetails (){
        (async () => {
            try {
                const url = this.API_ROOT + '/get/user/details/'
                console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...this.furtherHeaders
                    },
                });

                let responseJson = await response.json();
                if(response.status == 200)
                {
                    this.UserProfile = responseJson
                    this.UserProfile.eqvas_scale = this.UserProfile.health_scale
                    console.log(responseJson)
                    this.emit("USER_CHANGE")
                    this._fetchAssessmentKeys()
                    this._fetchFavDrugs()
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    _fetchAssessmentKeys (){
        (async () => {
            try {
                const url = this.API_ROOT + '/patient/' + this.getUserUUID() + '/accesskey/assessment/'
                console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...this.furtherHeaders
                    },
                });

                let responseJson = await response.json();
                if(response.status == 200)
                {
                    this.assessmentKeys = responseJson
                    console.log(responseJson)
                    this.emit("ASSKEY_CHANGE")
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    _fetchFavDrugs (){
        (async () => {
            try {
                const url = this.API_ROOT + '/patient/myFavouriteDrugs/'
                console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...this.furtherHeaders
                    },
                });

                let responseJson = await response.json();
                if(response.status == 200)
                {
                    this.favDrugs = responseJson
                    console.log(responseJson)
                    this.emit("FAVDRUG_CHANGE")
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    getFavDrugs(){
        return this.favDrugs
    }
    getAssKeys(){
        return this.assessmentKeys
    }
    checkLogin(){
        (async () => {
            try {
                let rfToken = await AsyncStorage.getItem('QuasisSession:rfToken');
                console.log(rfToken)
                if (rfToken){
                   this._getNEwToken(rfToken)
                }
                else {
                    this.emit("LOGIN_ERROR")
                }
            } catch (error) {
                console.log(error)
                this.emit("LOGIN_ERROR")
            }
        })()
    }
    setPain(v){
        console.log(v)
        this.UserProfile.pain_scale = v
        this.emit('USER_CHANGE')
    }
    handleActions(action) {
        console.log(action)
        switch(action.type) {
            case "FETCH_USER": {
                this._fetchUserDetails();
                break;
            }
        }
    }
}
const session = new Session;
dispatcher.register(session.handleActions.bind(session));

export default session;
