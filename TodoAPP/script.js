console.log("work");

var removeSVG = '<svg version=1.1 xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink x=0px y=0px width=20px height=20px viewbox="0 0 20 20" enable-background="new 0 0 20 20" xml:space=preserve><g><g><path class="fill" d="M15.106,2.553h-1.915V2.34c0-1.294-1.047-2.34-2.34-2.34H9.149c-1.294,0-2.34,1.047-2.34,2.34v0.213H4.894c-1.294,0-2.34,1.047-2.34,2.34V6.17c0,0.511,0.366,0.945,0.851,1.038V17.66c0,1.294,1.047,2.34,2.34,2.34h8.511c1.294,0,2.34-1.047,2.34-2.34V7.208c0.485-0.094,0.851-0.528,0.851-1.038V4.894C17.447,3.6,16.4,2.553,15.106,2.553z M8.085,2.34c0-0.587,0.477-1.064,1.064-1.064h1.702c0.587,0,1.064,0.477,1.064,1.064v0.213h-3.83V2.34z M15.319,17.66c0,0.587-0.477,1.064-1.064,1.064H5.745c-0.587,0-1.064-0.477-1.064-1.064V7.234h10.638V17.66z M16.17,5.957H3.83V4.894c0-0.587,0.477-1.064,1.064-1.064h10.213c0.587,0,1.064,0.477,1.064,1.064V5.957z"></g><g><path class="fill" d="M10,17.021c-0.352,0-0.638-0.286-0.638-0.638V9.574c0-0.352,0.286-0.638,0.638-0.638c0.352,0,0.638,0.286,0.638,0.638v6.809C10.638,16.735,10.352,17.021,10,17.021z"></g><g><path class="fill" d="M7.021,17.021c-0.352,0-0.638-0.286-0.638-0.638V9.574c0-0.352,0.286-0.638,0.638-0.638S7.66,9.222,7.66,9.574v6.809C7.66,16.735,7.374,17.021,7.021,17.021z"></g><g><path class="fill" d="M12.979,17.021c-0.352,0-0.638-0.286-0.638-0.638V9.574c0-0.352,0.286-0.638,0.638-0.638c0.352,0,0.638,0.286,0.638,0.638v6.809C13.617,16.735,13.331,17.021,12.979,17.021z"></g></g></svg>';
var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="22px" height="22px" viewBox="0 0 22 22" enable-background="new 0 0 22 22" xml:space="preserve"><g><g><path class="fill" d="M9.666,14.417L9.666,14.417c-0.199,0-0.39-0.079-0.53-0.22L6.47,11.53c-0.293-0.293-0.293-0.768,0-1.061c0.294-0.294,0.769-0.292,1.061,0l2.136,2.137l4.804-4.803c0.293-0.293,0.768-0.293,1.061,0s0.293,0.768,0,1.061l-5.334,5.333C10.056,14.338,9.866,14.417,9.666,14.417z"/></g></g></svg>';

var addBtn = document.querySelector("#add");
var input = document.querySelector("input");
var todoList = document.querySelector("#todo");
var completedList = document.querySelector("#completed");

addBtn.addEventListener("click", function(){
	var value = input.value;
	if(value) {
		addToDOM(value);
		input.value = "";
	}else {
		return;
	}
})

function addToDOM(value){
	var item = document.createElement("li");
	var buttons = document.createElement("div");
	buttons.className = "buttons";
	var removeBtn = document.createElement("button");
	removeBtn.className = "remove";
	var completeBtn = document.createElement("button");
	completeBtn.className = "complete";
	item.innerHTML = value;
	removeBtn.innerHTML = removeSVG;
	completeBtn.innerHTML = completeSVG;

	removeBtn.addEventListener("click", removeItem);
	completeBtn.addEventListener("click", completeItem);

	buttons.appendChild(removeBtn);
	buttons.appendChild(completeBtn);
	item.appendChild(buttons);
	todoList.insertBefore(item, todoList.childNodes[0]);
}
function completeItem(){
	var item = this.parentNode.parentNode;
	var listID = this.parentNode.parentNode.parentNode.id;
	var targetParent = (listID==="todo")?completedList:todoList;
	targetParent.insertBefore(item, targetParent.childNodes[0]);
}
function removeItem() {
	var item = this.parentNode.parentNode;
	var listID = this.parentNode.parentNode.parentNode.id;
	var targetParent = (listID==="todo")?todoList:completedList;
	targetParent.removeChild(item);
}