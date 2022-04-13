let STORAGE_KEY = 'todos-vuejs-demo'
let todoStorage = {
    fetch: function() {
        let todos =JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        let maxindex=0;
        todos.forEach(function(todo){
            maxindex=todo.id>maxindex?todo.id:maxindex;
        })
        todoStorage.uid = maxindex+1
        return todos
    },
    save: function(todos){
        localStorage.setItem(STORAGE_KEY,JSON.stringify(todos))
    }
}
 

const app = new Vue({
    el: '#app',
    data: {
        todos: [],
        editIndex:-1,
        editComment:null,
        options:[
            {value: 0, label: '作業中'},
            {value: 1, label: '完了'}
        ],
    },
    watch:{
        todos:{
            handler:function(todos){
                todoStorage.save(todos)
            },
            deep:true
        }
    },
    created(){
        this.todos=todoStorage.fetch()
    },

    computed: {
        labels(){
            return this.options.reduce(function(a,b){
                return Object.assign(a,{[b.value]:b.label})
            },{})
        },
        changeButtonText() {
            return this.editIndex === -1 ? "追加" : "編集";
        }
  
    },
    methods: {
        addItems:function(){
            if(!this.editComment){
                return
            }

            this.todos.push({
                id:todoStorage.uid++,
                comment: this.editComment,
                state:0
            })
            this.cancel()
        },
        editItems:function(){
            this.todos.splice(this.editIndex,1,{
                id: this.editIndex,
                comment:this.editComment,
                state:this.state
            })
            this.cancel()
        },
        cancel(){
            this.editComment=null;
            this.editIndex=-1;
            this.state=0;
        },
        doChangeState:function(todo){
            todo.state = todo.state ? 0 : 1 ;
        },
        doRemove: function(todo){
            let index = this.todos.indexOf(todo)
            this.todos.splice(index,1)
        },
        doEdit:function(todo){
            this.editIndex=this.todos.indexOf(todo)
            this.todos[this.editIndex].comment=todo.comment
            this.state=todo.state
        }
    }
})
