import { EventEmitter } from "events";
import { AsyncStorage } from "react-native";
import moment from 'moment';
import Utils from '../Utils'
import Session from "./SessionStore";
import dispatcher from "../dispatcher/dispatcher"
class HealthStore extends EventEmitter {
    API_ROOT = 'https://1212api.kraftvoll.in'
    constructor() {
        super()
        this.painQuests = []
        this.eqvasQuests = []
        this.lastFetch_month = null
        this.lastFetch_year = null
    }
    addEL(event, callback) {
        this.on(event, callback);
    }
    removeEL(event, callback) {
        this.removeListener(event, callback)
    }
    getPainQuests (){
        return this.painQuests
    }
    getEqvasQuests (){
        return this.eqvasQuests
    }
    fetchPain(){
        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/painQuests/'
                //console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...Session.furtherHeaders
                    },
                });
                let responseJson = await response.json();
                if(response.status == 200)
                {
                    //console.log(responseJson)
                    this.painQuests = responseJson
                    if(this.painQuests.length){

                    }
                    this.emit('PAIN_STORE_UPDATED')
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    fetchEqvas(){
        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/eqvasQuests/'
                //console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...Session.furtherHeaders
                    },
                });
                let responseJson = await response.json();
                if(response.status == 200)
                {
                    //console.log(responseJson)
                    this.eqvasQuests = responseJson
                    this.emit('EQVAS_STORE_UPDATED')
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    _updateHealthArray(val){
        if(val.hasOwnProperty('pain'))
        {

            var ansIndex = this.painQuests.findIndex((x)=>{ return x.prescribedDate == val.prescribedDate })
            this.painQuests.splice((ansIndex == -1) ? 0 : ansIndex, (ansIndex == -1) ? 0 : 1, val)
            if(ansIndex == 0 || ansIndex == -1)
            {
                dispatcher.dispatch({
                    type : "FETCH_USER",
                })
            }

        }
        else if(val.hasOwnProperty('eqvas'))
        {

            var ansIndex = this.eqvasQuests.findIndex((x)=>{ return x.prescribedDate == val.prescribedDate })
            this.eqvasQuests.splice((ansIndex == -1) ? 0 : ansIndex, (ansIndex == -1) ? 0 : 1, val)
            if(ansIndex == 0 || ansIndex == -1)
            {
                dispatcher.dispatch({
                    type : "FETCH_USER",
                })
            }

        }

    }
    _savePain(v){

        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/painQuests/'
                //console.log(url)
                console.log(Utils.deFormatDate(moment()), moment().date())
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        ...Session.furtherHeaders
                    },
                    body : JSON.stringify({
                        pain:String(v),
                        patient:Session.getUserUUID(),
                        prescribedDate:Utils.deFormatDate(moment())
                    })
                });

                let responseJson = await response.json();
                if(response.status == 201)
                {
                    this.assessmentKeys = responseJson
                    this._updateHealthArray(responseJson)
                    this.emit("PAIN_STORE_UPDATED")
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    savePain(v){
        this.emit('PAIN_STORE_UPDATING')
        this._savePain(v)
    }
    _saveEqvas(v){

        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/eqvasQuests/'
                //console.log(url)
                let response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        ...Session.furtherHeaders
                    },
                    body : JSON.stringify({
                        eqvas:String(v),
                        patient:Session.getUserUUID(),
                        prescribedDate:Utils.deFormatDate(moment())
                    })
                });

                let responseJson = await response.json();
                if(response.status == 201)
                {
                    this.assessmentKeys = responseJson
                    this._updateHealthArray(responseJson)
                    this.emit("EQVAS_STORE_UPDATED")
                }
                return true
            } catch(error) {
                error = await console.log('error', error)
                //this.emit("CHANGE")
                return false
            }
        })()
    }
    saveEqvas(v){
        this.emit('EQVAS_STORE_UPDATING')
        this._saveEqvas(v)
    }

}
const healthStore = new HealthStore;
//dispatcher.register(assessment.handleActions.bind(assessment));

export default healthStore;
