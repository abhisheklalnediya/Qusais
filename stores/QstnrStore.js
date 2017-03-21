import { EventEmitter } from "events";

import dispatcher from "../dispatcher/dispatcher";

import Session from "./SessionStore";


class Assessment extends EventEmitter {
    constructor() {
        super()
        this.assKey = null
        this.assessment = null
        this.assessmentAns = null
    }
    fetchAssAns(id){
        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/assessments/' + id + '/answers/'
                console.log(url)
                let response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        ...Session.furtherHeaders
                    },
                });

                let responseJson = await response.json();
                this.assessmentAns = responseJson
                console.log(responseJson)
                this.populateQuestions()
                this.emit("ASSESSMENT_READY_TO_ANSWER")
                return true
            } catch(error) {
                error = await console.log('error', error)
                this.emit("CHANGE")
                return false
            }
        })()
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
                this.fetchAssAns(id)
                return true
            } catch(error) {
                error = await console.log('error', error)
                this.emit("ASSESSMENT_ERROR")
                return false
            }
        })()
    }
    fetch(accessKey){
        (async () => {
            try {
                this.assKey = accessKey
                console.log(Session.API_ROOT + '/patient/get/cankado/assessment/access/' + accessKey + '/')
                let response = await fetch(Session.API_ROOT + '/patient/get/cankado/assessment/access/' + accessKey + '/', {
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
                this.emit("ASSESSMENT_ERROR")
                return false
            }
        })()
    }
    getAnswerOfQuestion(questionUUID){
        var q = this.assessmentAns.find(x =>x.question===questionUUID)
        return q || null
    }
    populateQuestions(){
        var questions = []
        this.assessment.questionnaires.map((qstnr,i)=>{
            qstnr.sections.map((sec)=>{
                sec.questions.map((quest)=>{
                    quest.order_qstnr = i
                    quest.section = sec
                    quest.questionnaire = qstnr
                    quest.answer = null
                    answer = this.getAnswerOfQuestion(quest.uuid)
                    if (answer){
                        if(quest.ansType == 'o'){
                            quest.answer = answer.option;
                        }
                        else if(quest.ansType == 'm'){
                            quest.answer = answer.mOptions || [];
                        }
                        else if(quest.ansType == 't'){
                            quest.answer = answer.textAns;
                        }
                    }
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
        console.log(this.questions)
        return this.questions
    }
    getQuestionByUUID(uuid) {
        var q = this.questions.find(x =>x.uuid===uuid)
        return q 
    }
    getNextQuestion(uuid){
        var qi = this.questions.findIndex(x =>x.uuid===uuid)

        return this.questions[qi+1]
    }
    doAnswer(data){
        (async () => {
            try {
                const url = Session.API_ROOT + '/patient/assessments/' + this.assessment.uuid + '/answers/'
                console.log(url)
                var patchData = [{
                    assessment : this.assessment.uuid,
                    ...data
                }]
                console.log(patchData)
                let response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        ...Session.furtherHeaders
                    },
                    body : JSON.stringify(patchData)
                });
                let responseJson = await response.json();
                patchData.forEach((pd)=>{
                    this.updateAnswer(pd)
                    this.emit("ASSESSMENT_ANSWER_CHANGE_" + pd.question);
                })
                return true
            } catch(error) {
                error = await console.log('error', error)
                this.emit("ASSESSMENT_ERROR")
                return false
            }
        })()
    }
    updateAnswer(answer){
        var rIndex = this.assessmentAns.findIndex((x)=>{ return x.question == answer.question })
        this.assessmentAns.splice(rIndex, (rIndex == -1) ? 0 : (rIndex + 1), answer)
        this.populateQuestions()
    }
    handleActions(action) {
        console.log(action)
        switch(action.type) {
            case "DOCUMENT_QUESTION": {
                this.doAnswer(action);
                break;
            }
        }
    }

}

const assessment = new Assessment;
dispatcher.register(assessment.handleActions.bind(assessment));

export default assessment;
