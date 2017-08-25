
function Event(sender) {
	this._sender = sender
	this._listeners = []
}
Event.prototype = {
	attach: function(listener){
		this._listeners.push(listener);
	},
	notify: function(args){
		for(var i=0; i<this._listeners.length; i++){
			this._listeners[i](this._sender, args);
		}
	}
}


function View(model, elements){
	this._model = model;
	this._elements = elements;
	this.addBtnClicked = new Event(this);
	this.removeBtnClicked = new Event(this);
	this.completeBtnClicked = new Event(this);
	this.listInit = new Event(this);

	var _this = this;
	this._elements.inputItem.on("keydown", function(e){
		if(e.key=="Enter"){
			var todoItem = _this._elements.inputItem.val();
			if(todoItem){
				_this.addBtnClicked.notify({value: todoItem});
				_this._elements.inputItem.val("");
			}
		}
	})
	this._elements.addBtn.on("click", function(){
		var todoItem = _this._elements.inputItem.val();
		if(todoItem){
			_this.addBtnClicked.notify({value: todoItem});
			_this._elements.inputItem.val("");
		}
	})

	this.todoList = this._elements.container.find("#todo");
	var todoEmpty = this._elements.container.find("#todo").find('.emptyText');
	this.completedList = this._elements.container.find("#completed");
	var completedEmpty = this._elements.container.find("#completed").find('.emptyText');
	this._elements.container.on("click", function(e){
		if(e.target.closest('.remove')) {
			var fromTodo = (e.target.closest('#todo'))?true:false;
			var removedEl = e.target.closest('li');
			var value = removedEl.innerText;
			_this.removeBtnClicked.notify({value: value, removedEl: removedEl, fromTodo: fromTodo});
		}
		if(e.target.closest('.complete')) {
			var completeEl = e.target.closest('li');
			var value = completeEl.innerText;
			var fromTodo = true;
			if(e.target.closest('#todo')){
				_this.completedList.append(completeEl);
				fromTodo = true;
			}else {
				_this.todoList.append(completeEl);
				fromTodo = false;
			}
			_this.completeBtnClicked.notify({value: value, completeEl: completeEl, fromTodo: fromTodo});
			
		};
	})


	// **** 根据Model数据状态响应UI
	this._model.itemAdded.attach(function(sender, args){
		_this.todoList.append(_this.appendLiHtml(args.value));
	});
	this._model.itemRemoved.attach(function(sender, args){
		var liEl = args.el;
		liEl.remove();
	});
	this._model.itemCompleted.attach(function(sender, args){
		var liEl = args.el;
		if(args.fromTodo){
			_this.completedList.append(liEl);
		}else {
			_this.todoList.append(liEl);
		}
	});
	this._model.listEmpty.attach(function(sender, args){
		var parts = args.emptyPart;
		if(parts.length == 1 && parts[0]=="todo"){
			todoEmpty.show();
			completedEmpty.hide();
		}else if(parts.length == 1 && parts[0]=="completed"){
			completedEmpty.show();
			todoEmpty.hide();
		}else if(parts.length == 2){
			todoEmpty.show();
			completedEmpty.show();
		} else {
			todoEmpty.hide();
			completedEmpty.hide();
		}
	})
}
View.prototype = {
	init: function(){
		var todos = this._model.todos;
		console.log(todos);
		if(todos.todo.length){
			for(var i=0; i<todos.todo.length; i++){
				this.todoList.append(this.appendLiHtml(todos.todo[i]));
			}
		}
		if(todos.completed.length){
			for(var j=0; j<todos.completed.length; j++){
				this.completedList.append(this.appendLiHtml(todos.completed[j]));
			}
		}
		this.listInit.notify();
	}, 
	appendLiHtml: function(value){
		var removeSVG = '<svg version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink x=0px y=0px width=20px height=20px viewbox="0 0 20 20" enable-background="new 0 0 20 20" xml:space=preserve><g><g><path class="fill" d="M15.106,2.553h-1.915V2.34c0-1.294-1.047-2.34-2.34-2.34H9.149c-1.294,0-2.34,1.047-2.34,2.34v0.213H4.894c-1.294,0-2.34,1.047-2.34,2.34V6.17c0,0.511,0.366,0.945,0.851,1.038V17.66c0,1.294,1.047,2.34,2.34,2.34h8.511c1.294,0,2.34-1.047,2.34-2.34V7.208c0.485-0.094,0.851-0.528,0.851-1.038V4.894C17.447,3.6,16.4,2.553,15.106,2.553z M8.085,2.34c0-0.587,0.477-1.064,1.064-1.064h1.702c0.587,0,1.064,0.477,1.064,1.064v0.213h-3.83V2.34z M15.319,17.66c0,0.587-0.477,1.064-1.064,1.064H5.745c-0.587,0-1.064-0.477-1.064-1.064V7.234h10.638V17.66z M16.17,5.957H3.83V4.894c0-0.587,0.477-1.064,1.064-1.064h10.213c0.587,0,1.064,0.477,1.064,1.064V5.957z"></g><g><path class="fill" d="M10,17.021c-0.352,0-0.638-0.286-0.638-0.638V9.574c0-0.352,0.286-0.638,0.638-0.638c0.352,0,0.638,0.286,0.638,0.638v6.809C10.638,16.735,10.352,17.021,10,17.021z"></g><g><path class="fill" d="M7.021,17.021c-0.352,0-0.638-0.286-0.638-0.638V9.574c0-0.352,0.286-0.638,0.638-0.638S7.66,9.222,7.66,9.574v6.809C7.66,16.735,7.374,17.021,7.021,17.021z"></g><g><path class="fill" d="M12.979,17.021c-0.352,0-0.638-0.286-0.638-0.638V9.574c0-0.352,0.286-0.638,0.638-0.638c0.352,0,0.638,0.286,0.638,0.638v6.809C13.617,16.735,13.331,17.021,12.979,17.021z"></g></g></svg>';
		var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="22px" height="22px" viewBox="0 0 22 22" enable-background="new 0 0 22 22" xml:space="preserve"><g><g><path class="fill" d="M9.666,14.417L9.666,14.417c-0.199,0-0.39-0.079-0.53-0.22L6.47,11.53c-0.293-0.293-0.293-0.768,0-1.061c0.294-0.294,0.769-0.292,1.061,0l2.136,2.137l4.804-4.803c0.293-0.293,0.768-0.293,1.061,0s0.293,0.768,0,1.061l-5.334,5.333C10.056,14.338,9.866,14.417,9.666,14.417z"/></g></g></svg>';
		var liEl = document.createElement("li");
		var buttons = document.createElement("div");
		buttons.className = "buttons";
		var removeBtn = document.createElement("button");
		removeBtn.className = "remove";
		var completeBtn = document.createElement("button");
		completeBtn.className = "complete";
		liEl.innerHTML = value;
		removeBtn.innerHTML = removeSVG;
		completeBtn.innerHTML = completeSVG;
		buttons.append(removeBtn);
		buttons.append(completeBtn);
		liEl.append(buttons);
		return liEl;
	}
}

function Controller(model, view){
	this._model =model;
	this._view = view;

	var _this = this;
	this._view.addBtnClicked.attach(function(sender, args){
		var value = args.value;
		_this.addItem(value);
	});
	this._view.removeBtnClicked.attach(function(sender, args){
		_this.removeItem(args.value, args.removedEl, args.fromTodo);
	});
	this._view.completeBtnClicked.attach(function(sender, args){
		_this.completeItem(args.value, args.completeEl, args.fromTodo);
	});
	this._view.listInit.attach(function(){
		_this._model.dataChanged();
	})
}
Controller.prototype = {
	addItem: function(value){
		this._model.addItem(value);
	},
	removeItem: function(value, el, fromTodo){
		this._model.removeItem(value, el, fromTodo);
	},
	completeItem: function(value, el, fromTodo){
		this._model.completeItem(value, el, fromTodo);
	}
}

function Model(todos) {
	this.todos = (todos)?todos:{
		todo: [],
		completed: [],
		deleted: []
	}
	this.itemAdded = new Event(this);
	this.itemRemoved = new Event(this);
	this.itemCompleted = new Event(this);
	this.listEmpty = new Event(this);
}
Model.prototype = {
	addItem: function(value){
		this.todos.todo.push(value);
		this.itemAdded.notify({value: value});
		console.log(this.todos);
		this.dataChanged();
	},
	removeItem: function(value, el, fromTodo){
		if(fromTodo){
			var index = this.todos.todo.indexOf(value);
			this.todos.todo.splice(index,1);
		}else {
			var index = this.todos.completed.indexOf(value);
			this.todos.completed.splice(index,1);
		}
		this.todos.deleted.push(value);
		this.itemRemoved.notify({el: el});
		this.dataChanged();
	},
	completeItem: function(value, el, fromTodo) {
		if(fromTodo){
			var index = this.todos.todo.indexOf(value);
			this.todos.todo.splice(index,1);
			this.todos.completed.push(value);
		}else {
			var index = this.todos.completed.indexOf(value);
			this.todos.completed.splice(index,1);
			this.todos.todo.push(value);
		}
		this.itemCompleted.notify({el: el, fromTodo: fromTodo});
		this.dataChanged();
	}, 
	// 判断数据中todo或者completed是否为空，并通知View决定是否显示空白填充文字
	dataChanged: function(){
		localStorage.setItem("todos", JSON.stringify(this.todos));
		var empty = [];
		if(!this.todos.todo.length){
			empty.push("todo");
		}
		if(!this.todos.completed.length){
			empty.push("completed");
		}
		this.listEmpty.notify({emptyPart: empty});
	}
}

function init(){
	var initTodos = (localStorage.getItem("todos")) ? JSON.parse(localStorage.getItem("todos")) : {
		todo: ["hello", "dkfj"],
		completed: ["dfkdj", "dsfkjsdf"],
		deleted: []
	}
	// 将初始数据的删除数据清零。
	initTodos.deleted = [];
	var model = new Model(initTodos),
		view = new View(model, {
			'addBtn': $("#add"),
			'container': $("#container"),
			'inputItem': $("input")
		}),
		controller = new Controller(model, view);
	view.init();
};
init();

