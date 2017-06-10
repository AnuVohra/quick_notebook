var clear_DB=false;
var MSG_TIME_OUT_TIME=3000;
var VERSION=1;
var delete_task_id=[];
var delete_note_id=[];

var db = new Dexie("notebook_db");
if(clear_DB){
	db.delete();
}else{
	db.version(VERSION).stores({notebook:'date,a_note'});
	db.version(VERSION).stores({tasks:'date,task'});
	loadDataForAPP();
}


$(document).ready(function() {

$('#summernote').summernote({
  minHeight: 100
});


//binds key
$('.note-editable').bind('keydown', 'Ctrl+shift+return',  ()=>{
    let post=$("<div class='a_post' contenteditable='false'></div>").html($('.note-editable').html());
    let now=put_data_in_db(post[0].innerHTML);
	post.attr('id',now);
	post.dblclick(function(){
		$(this).attr('contenteditable','true');
	});
      add_post_to_container(post,now);
      post_message('Message posted');
  });

});

$('#input_box_task').bind('keydown', 'Ctrl+shift+return',function(){
	let task=$("<div class='a_task'></div>").html($('#input_box_task').html());
	let now=put_task_in_db(task[0].innerHTML);
	task.attr('id',now);
	add_task_to_task_container(task);
	get_number_of_task();
});

$(document).bind('keydown', 'Ctrl+shift+z', function(){
	toggle_task_manager();
});

$(document).bind('keydown', 'f1', function(){
	$('#help_menu_cover').css('display','flex');
	});

	$(document).bind('keydown', 'Esc', function(){
		$('#help_menu_cover').css('display','none');
		});

$(document).bind('keydown', 'del', function(){
	delete_task_id.forEach(function(item_id){
		let par=document.getElementById('task_list');
		let child=document.getElementById(item_id);
		par.removeChild(child);
		delete_a_task(item_id);
	});
	
	delete_task_id=[];

	delete_note_id.forEach(function(item_id){
		let par=document.getElementById('notes_post_container');
		let child=document.getElementById(item_id);
		par.removeChild(child);
		delete_a_note(item_id);
	});
	
	delete_note_id=[];
});

/**
Exports data to JSON
*/
function export_to_JSON() {
  var a = document.getElementById("export_to_JSON");
  let type="text/plain";
  let file_name="data.json";
  let result=[];
  db.notebook.each(function(note){
    result.push(note);
  }).then(()=>{
    let text=JSON.stringify(result);
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = file_name;
  });
}

/**
Add new message on screen
*/
function add_post_to_container(post){
  $('#notes_post_container').append(post);
    post.click(function(e){
	  let item=$(this);
	  let id=item.attr('id');

	  let handler=function(){
			item.remove();
		  };
		  

		if(item.hasClass('focused_selected')){
		  item.removeClass('focused_selected');
		  let index= delete_note_id.indexOf(id);
		  delete_note_id.splice(index,1);
	  }else{
		  //if(item.attr('contenteditable')==='false'){}
		  if(item.attr('contenteditable')==='true'){
			
		  }else{
			  	if(e.ctrlKey){
					item.addClass('focused_selected');
					delete_note_id.push(id);
				}
		  }
			
	}
	  
  });
  $('.note-editing-area .note-editable').html('<p><br></p>');
}

/**
Add new message on screen
*/
function add_task_to_task_container(task){
  $('#task_list').prepend(task);

  task.click(function(e){
	  let item=$(this);
	  let id=item.attr('id');
	  
	  let handler=function(){
			item.remove();
		  };
		  
		
		  if(item.hasClass('focused_selected')){
			  item.removeClass('focused_selected');
			  let index= delete_task_id.indexOf(id);
			  delete_task_id.splice(index,1);
		  }else{
			  if(e.ctrlKey){
				item.addClass('focused_selected');
				delete_task_id.push(id);
			  }
		  }
		  
  });
  $('#input_box_task').html('');
}


/**
Post message on screen
*/
function post_message(msg){
  let item=$('#msg_box');
  item.html(msg);
  item.css('display','block');
  setTimeout(()=>{
    item.css('display','none');
  },MSG_TIME_OUT_TIME);
}

/**
Loads data from DB
Binds key down for editing the post later
*/
function loadDataForAPP(){
	load_data_from_server();
	get_number_of_task();
}

function load_data_from_server(){
	$.getJSON( 'data.json', function(data) {
		  $.each( data, function( key, val ) {
			db.notebook.put(val);
		  });
	}).success(function() { console.log('data has been recived from server successfully'); })
	.error(function() { console.log('Error while reterving data from server, check of json data is present.'); })
	.complete(function() {
	loadTasksfromDb();
	loadNotesfromDb();
	console.log('data loading from server complete'); });
}

/**
Loads Notes from DB
*/
function loadNotesfromDb(){
	db.notebook.each(function(note){
    let post=$("<div id='"+note.date+"' class='a_post' contenteditable='false'></div>").html(note.a_note);
	post.dblclick(function(){
		$(this).attr('contenteditable','true');
	});

	post.bind('keydown', 'Ctrl+shift+return',  function(){
		$(this).attr('contenteditable','false');
		update_a_note($(this).attr('id'),$(this).html());
		post_message('Message Updated');
	});
    add_post_to_container(post);
  });
}

/**
Loads tasks from DB
*/
function loadTasksfromDb(){
	db.tasks.each(function(task){
    let a_task=$("<div id='"+task.date+"' class='a_task' contenteditable='false'></div>").html(task.a_task);
    add_task_to_task_container(a_task);
  });
}

function delete_a_task(date_of_object_to_be_deleted){
	db.transaction('rw',db.tasks,function(){
		db.tasks.where("date").equals(date_of_object_to_be_deleted).delete().then(function (deleteCount) {
        //console.log( "Deleted " + deleteCount + " objects");
        get_number_of_task();
    });
	}).catch (Dexie.ModifyError, function (e) {

    // ModifyError did occur
    console.error(e.failures.length + " items failed to modify");

	}).catch (function (e) {
		console.error("Generic error: " + e);
	});
}

function delete_a_note(date_of_object_to_be_deleted){
	db.transaction('rw',db.notebook,function(){
		db.notebook.where("date").equals(date_of_object_to_be_deleted).delete().then(function (deleteCount) {
        //console.log( "Deleted " + deleteCount + " objects");
    });
	}).catch (Dexie.ModifyError, function (e) {

    // ModifyError did occur
    console.error(e.failures.length + " items failed to modify");

	}).catch (function (e) {
		console.error("Generic error: " + e);
	});
}

/**
Updates an existing note
*/
function update_a_note(date_of_object_to_be_modified,new_note){
	db.transaction("rw", db.notebook, function () {
		db.notebook.where("date").equals(date_of_object_to_be_modified).modify({a_note:new_note});
	}).catch (Dexie.ModifyError, function (e) {

    // ModifyError did occur
    console.error(e.failures.length + " items failed to modify");

	}).catch (function (e) {
		console.error("Generic error: " + e);
	});
}


/**
Toggle display of task manager
*/
function toggle_task_manager(){
$('#task_manager_container').toggle();
}


/**
inserts data in Indexed DB: Notes collection
*/
function put_data_in_db(data){
  let now=new Date().toISOString();
  db.notebook.put({
    date:now,
    a_note:data
  });
  return now;
}


/**
inserts data in Indexed DB: task collection
*/
function put_task_in_db(data){
  let now=new Date().toISOString();
  db.tasks.put({
    date:now,
    a_task:data
  });
  return now;
}

/**
Post entire notebook data to server and make backup.
*/
function post_data_to_server(){
	var a = document.getElementById("export_to_JSON");
  let type="text/plain";
  let file_name="data.json";
  let result=[];
  db.notebook.each(function(note){
    result.push(note);
  }).then(()=>{
    let text=JSON.stringify(result);
    $.post('services/backup',text,function(data){
		post_message("Data back up sent to server.");
	});
  });

  post_message("Data back up sent to server.");
}


function show_help_menu(){
	$('#help_menu_cover').css('display','flex');
}


function get_number_of_task(){
	db.tasks.count((count)=>{
		$('#count_of_tasks').html(count);
	});
}
