import { EventEmitter } from "events";
import { AsyncStorage } from "react-native"

class Session extends EventEmitter {
    API_ROOT = 'https://appapi.kraftvoll.in'
    // API_ROOT = 'https://1212api.kraftvoll.in'
    //API_ROOT = 'http://10.0.2.2:8000'
    constructor() {
        super()
        // this.session = {
        //     //token : null,
        //     client_id : 'jSwaTFOh7ZLld8VDISq2DPAVJhuySD3bggBF13CB',
        //     client_secret : 'KcMBYotvABEbKMwBEEAs4FldFkvcu2U1lg6d0jMHsUCI2th2TtugY7dYc5FGJvVehO0249AmQQsWtbFaSrpC6smTShhN7kPj19HGCI10Hvx0Vp1H8y2Dkx7o6zrbpC2l',
        //     grant_type : 'client_credentials'
        // }
        this.session = {
            client_id : '4gDWWcTQgx14gu3IrsYmkeT6l8DfwsV9DFyqK8Jh',
            client_secret : 'LLH1mtTdbBK9y4KViuoUqWs5qEt5icw79qn638XWMTNonAOuppLlyX1jIEp88BLeUJ1IErjozw1yKKgMuy4268mZzKmbv9n1W4h8zaqCuEo9hqg40HBcpxCtR4I0TYnO',
            grant_type : 'password',
            username : null,
            password : null
        }
        this.furtherHeaders = {

        }

    }
    getUrlEncoded(creds){
        var data = this.session;
        if(creds.hasOwnProperty('rfToken')){
            data.refresh_token = creds.rfToken
            data.grant_type = "refresh_token"
        }
        else{
            data.username = creds.username
            data.password = creds.password
        }
        var url = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        return url;
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
            } catch(error) {
                console.log("Errorrr", error)
                this.emit("LOGIN_ERROR")
            }
        })()
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
                }
                this.emit("LOGIN_SUCCESS")
            } catch(error) {
                console.log("Errorrr", error)
                this.emit("LOGIN_ERROR")
            }
        })()
    }
}
const session = new Session;
//dispatcher.register(assessment.handleActions.bind(assessment));

export default session;
