$(function(){
	var model = new ListModel(['PHP']),
		view = new ListView(model, {
			'list': $('#list'),
			'addButton' : $('#plusBtn'),
			'delButton': $('#minusBtn')
		}),
		controller = new ListController(model, view);

	view.show();
})


/*
 * Event is a simple class for implementing the Observer pattern
 */
function Event(sender){
	this._sender = sender;
	this._listeners = [];
}
Event.prototype = {
	attach: function(listener){
		this._listeners.push(listener);
	},
	notify: function(args){
		var index;
		for(index=0; index<this._listeners.length; index++){
			this._listeners[index](this._sender, args);
		}
	}
}



/**
 * The View. View presents the model and provides
 * the UI events. The controller is attached to these
 * events to handle the user interaction.
 */
function ListView(model, elements) {
	this._model = model;
	this._elements = elements;

	// 1. 通过View来注册几个UI上变化相关的事件，供Controller来监听
	this.listModified = new Event(this);
	this.addButtonClicked = new Event(this);
	this.delButtonClicked = new Event(this);

	// 1. 当UI中有所变化时，通知所注册的事件的监听器
	// attach listeners to HTML controls
	this._elements.list.change(function(e){
		// notify通知监听器时可传可不传参，所传参数会被监听的响应器所采用
		// 这里的e.target.selectedIndex其实是UI中用户的点击所产生的数据的对象
		_this.listModified.notify({index: e.target.selectedIndex})
	});
	this._elements.addButton.click(function(){
		_this.addButtonClicked.notify();
	});
	this._elements.delButton.click(function(){
		_this.delButtonClicked.notify();
	})


	// 4.添加对Model中数据变化的监听，更新UI
	var _this = this;
	// 通知时传递数据
	this._model.itemAdded.attach(function(sender,args){
		_this.rebuildList(args.item, "add");
	});
	this._model.itemRemoved.attach(function(sender, args){
		_this.rebuildList(args.index, "del");
	})
}
ListView.prototype = {
	show: function(){
		this.rebuildList();
	},
	rebuildList: function(item, text){
		var list, items, key;
		list = this._elements.list;
		items = this._model.getItems();
		if(item&&text=="add"){
			list.append($('<option>' + item + '</option>'));
		} else if(item&&text=="del") {
			var index = item;
			console.log(index);
			$("option").eq(index).remove();
		} else {
			list.html('');
			for(key in items){
				if(items.hasOwnProperty(key)){
					list.append($('<option>' + items[key] + '</option>'));
				}
			}
			this._model.setSelectedIndex(-1);
			// console.log(this._model.selectedIndex);
		}
		
	}
}


/**
 * The Controller. Controller responds to user actions and 
 * invokes changes on the model. 
*/
function ListController(model, view) {
	this._model = model;
	this._view = view;
	var _this = this;

	// 1. 在Controller中添加对View中事件的监听，并对此进行数据处理
	this._view.listModified.attach(function(sender, args){
		_this.updateSelected(args.index);
	});
	this._view.addButtonClicked.attach(function(){
		_this.addItem();
	});
	this._view.delButtonClicked.attach(function(){
		_this.delItem();
	})
}
ListController.prototype = {
	// 2.监听到View有所动作之后，处理并触发Model中的事件
	addItem: function(){
		var item = window.prompt('Add item:', '');
		if(item) {
			this._model.addItem(item);
		}
	},
	updateSelected : function(index){
		this._model.setSelectedIndex(index);
	},
	delItem: function(){
		var index = this._model.getSelectedIndex();
		if(index !== -1) {
			this._model.removeItemAt(index);
		}
	}
}



/*
 * The Model. Model stores items and notifies
 * observers about changes.
 */
function ListModel(items){
	this._items = items;
	this._selectedIndex = -1;
	// 3.注册一些可以通知响应用户的事件，供给View监听
	this.itemAdded = new Event(this);
	this.itemRemoved = new Event(this);
	// this.selectedIndexChanged = new Event(this);

}

// 3.根据Controller中传来的讯息处理内部数据，并通过注册的事件通知View中的监听器
ListModel.prototype = {
	addItem: function(item){
		this._items.push(item);
		this.itemAdded.notify({item: item});
	},
	getItems: function(){
		return [].concat(this._items);
	},
	removeItemAt: function(index){
		var item;
		item = this._items[index];
		this._items.splice(index, 1);
		this.itemRemoved.notify({item: item, index:index});
	},
	getSelectedIndex: function(){
		return this._selectedIndex;
	},
	setSelectedIndex: function(index){
		this._selectedIndex = index;
		// this.selectedIndexChanged.notify({previous: previousIndex});
	}
}


