let STORAGE_KEY = 'todos-vuejs-demo'
let todoStorage = {
    fetch: function() {
        let todos =JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo,index){
            todo.id = index
        })
        todoStorage.uid = todos.length
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
        beforeComment:'',
        editIndex:-1,
        editComment:'',
        beforeState:0,
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
        setItems:function(){
            if(this.editIndex===-1){
                let comment = this.$refs.comment
                if(!comment.value.length){
                    return
                }
                this.todos.push({
                id:todoStorage.uid++,
                comment: comment.value,
                state:0
                })
            }else{
                this.todos.splice(this.editIndex,1,{
                    id: this.editIndex,
                    comment:this.editComment,
                    state:this.state
                })
            }
            this.cancel()
        },
        cancel(){
            this.beforeComment='';
            this.editComment='';
            this.editIndex=-1;
            this.state=0;
        },
        doChangeState:function(todo){
            todo.state = todo.state ? 0 : 1 ;
        },
        doRemove: function(todo){
            let index = this.todos.indexOf(todo)
            console.log(index)
            this.todos.splice(index,1)
        },
        doEdit:function(todo){
            this.editIndex=this.todos.indexOf(todo)
            this.beforeComment=todo.comment
            this.state=todo.state
        }
    }
})
