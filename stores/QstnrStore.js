import { EventEmitter } from "events";

import dispatcher from "../dispatcher/dispatcher";

import Session from "./SessionStore";


class Assessment extends EventEmitter {
    constructor() {
        super()
        this.assKey = null
        this.assessment = null
    }
    fetchAss(id){
        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/assessments/' + id + '/'
                console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...Session.furtherHeaders
                    },
                    //body : this.getUrlEncoded()
                });

                let responseJson = await response.json();
                this.assessment = responseJson
                this.populateQuestions()
                this.emit("CHANGE")
                return true
            } catch(error) {
                error = await console.log('error', error)
                this.emit("CHANGE")
                return false
            }
        })()
    }
    fetch(id){
        (async () => {
            try {
                this.assKey = id
                console.log(Session.API_ROOT + '/patient/get/cankado/assessment/access/' + id + '/')
                let response = await fetch(Session.API_ROOT + '/patient/get/cankado/assessment/access/' + id + '/', {
                    method: 'GET',
                    headers: {
                        ...Session.furtherHeaders
                    },
                    //body : this.getUrlEncoded()
                });

                let responseJson = await response.json();
                this.fetchAss(responseJson.uuid)
                return true
            } catch(error) {
                error = await console.log('error', error)
                this.emit("CHANGE")
                return false
            }
        })()
    }
    createTodo(text) {
        const id = Date.now();

        this.questions.push({
            id,
            text,
            complete: false,
        });

        this.emit("change");
    }
    populateQuestions(){
        var questions = []
        this.assessment.questionnaires.map((qstnr,i)=>{
            qstnr.sections.map((sec)=>{
                sec.questions.map((quest)=>{
                    quest.order_qstnr = i
                    quest.order_sec = sec.order
                    questions.push(quest)
                })
            })
        })
        this.questions = questions
    }
    getAssment() {
        return this.assessment;
    }
    getAllQuestions() {
        return this.questions
    }
    getByUUID(uuid) {
        var q = this.questions.find(x =>x.uuid===uuid)
        return q
    }
    getNextQuestion(uuid){
        var qi = this.questions.findIndex(x =>x.uuid===uuid)

        return this.questions[qi+1]
    }
    handleActions(action) {
        switch(action.type) {
            case "CREATE_TODO": {
                this.createTodo(action.text);
                break;
            }
            case "RECEIVE_TODOS": {
                this.questions = action.questions;
                this.emit("change");
                break;
            }
        }
    }

}

const assessment = new Assessment;
dispatcher.register(assessment.handleActions.bind(assessment));

export default assessment;
