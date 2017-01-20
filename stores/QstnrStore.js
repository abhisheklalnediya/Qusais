import { EventEmitter } from "events";

//import dispatcher from "../dispatcher";




var Questions = [
    {
        'uuid': "121",
        'order' : 1,
        'q' : "How do you feel?",
        'o' :[
            {
                'title':'Ok',
                'uuid' : 4
            },
            {
                'title':'Not Ok',
                'uuid' : 5
            },
        ]
    },
    {
        'uuid': "123",
        'order' : 2,
        'q' : "Is your wife Ok??",
        'o' :[
            {
                'title':'Ok',
                'uuid' : 1
            },
            {
                'title':'Not Ok',
                'uuid' : 2
            },
            {
                'title':'Horney',
                'uuid' : 3
            }
        ]
    },
]


class Assessment extends EventEmitter {
    constructor() {
        super()
        this.questions = Questions
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

    getAll() {
        return this.questions;
    }
    getByUUID(uuid) {
        var q = this.questions.find(x =>x.uuid===uuid)
        console.log(q)
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
//dispatcher.register(assessment.handleActions.bind(assessment));

export default assessment;
