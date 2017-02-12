import { EventEmitter } from "events";

class Session extends EventEmitter {
    API_ROOT = 'http://ha.cankado.info'
    //API_ROOT = 'http://10.0.2.2:8000'
    constructor() {
        super()
        this.session = {
            //token : null,
            client_id : 'jSwaTFOh7ZLld8VDISq2DPAVJhuySD3bggBF13CB',
            client_secret : 'KcMBYotvABEbKMwBEEAs4FldFkvcu2U1lg6d0jMHsUCI2th2TtugY7dYc5FGJvVehO0249AmQQsWtbFaSrpC6smTShhN7kPj19HGCI10Hvx0Vp1H8y2Dkx7o6zrbpC2l',
            grant_type : 'client_credentials'
        }
        this.furtherHeaders = {

        }

    }
    getUrlEncoded(){
        var data = this.session;
        var url = Object.keys(data).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
        }).join('&')
        return url;
    }

    getToken(){
        // Return Access Token
        return ('access_token' in this.session && this.session.access_token)? this.session.access_token : null
    }
    checkLogin(){
        (async () => {
            try {
                let response = await fetch(this.API_ROOT + '/can/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded'
                    },
                    body : this.getUrlEncoded()
                });

                let responseJson = await response.json();
                if(response.status == 200)
                {
                    Object.assign(this.session, responseJson)
                    Object.assign(this.furtherHeaders, {
                        Authorization: this.session.token_type + ' ' +  this.getToken()
                    })
                }
                this.emit("CHANGE")
            } catch(error) {
                this.emit("CHANGE")
            }
        })()
    }
}
const session = new Session;
//dispatcher.register(assessment.handleActions.bind(assessment));

export default session;
