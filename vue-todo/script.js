<<<<<<< HEAD
=======


>>>>>>> 850122e05c93099e0cfe6e0af69572473e9ba6ba
var todoStorage = {
	fetch: function() {
		var data = (localStorage.getItem("todolist")) ? JSON.parse(localStorage.getItem("todolist")) : {
			todo: [], 
			completed: []
		}
		return data;
	},
	save: function(todo, completed) {
		localStorage.setItem("todolist", JSON.stringify({todo, completed}));
	}
}
<<<<<<< HEAD
=======

>>>>>>> 850122e05c93099e0cfe6e0af69572473e9ba6ba
var app = new Vue({
  el: '#app',
  data: {
    todo: todoStorage.fetch().todo,
    completed: todoStorage.fetch().completed
  },
  watch: {
  	todo: function() {
  		todoStorage.save(this.todo, this.completed);
  	},
  	completed: function() {
  		todoStorage.save(this.todo, this.completed);
  	}
  },
  methods: {
  	add() {
  		var input = this.$el.querySelector('#header input');
  		if (input.value) {
  			this.todo.unshift(input.value);
  			input.value = '';
  		}
  	},
  	done(item) {
  		var todoIndex = this.todo.indexOf(item);
  		this.todo.splice(todoIndex, 1);
  		this.completed.unshift(item);
  	},
  	undone(item) {
		var todoIndex = this.completed.indexOf(item);
  		this.completed.splice(todoIndex, 1);
  		this.todo.unshift(item);
  	},
  	remove(item, list) {
  		if (list === "todo") {
  			var todoIndex = this.todo.indexOf(item);
  			this.todo.splice(todoIndex, 1);
  		} else {
  			var todoIndex = this.completed.indexOf(item);
  			this.completed.splice(todoIndex, 1);
  		}
  	}
  }
})