var query;
var option;
var detail_id;
var detail_obj;
var user_id;
var reply_status_id;

/* Twitter API Object */
var api = new TwitAPI();

// 初期表示は
query = 'statuses/replies';
option = {count:100};

/* statusリストを取得  */
/* TwitAPI利用 */
function repliesUpdate() {
  console.log('Enter repliesUpdate');
  $.ui.showMask();
  $('#replies-results').empty();
  var onSuccess = function(results) {
    console.log('success');
    console.log(results);
    var i, tags = '';
    var tmpl = $('#replies-status-tmpl').html();
    setuserid(results[0].in_reply_to_screen_name);
    console.log("screen_name:"+results[0].in_reply_to_screen_name);
    for (i = 0; i < results.length; i++) {
      var r = results[i];
      
      //URLにリンクを付ける
      r.text = r.text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)/gi,'<a href="$1">$1</a>');
      
      tags += $.template(tmpl, r);
    }
    console.log(tags);
    $('#replies-results').html(tags);
    $.ui.hideMask();
  };
  var onError = function() {
    console.log(arguments);
    $.ui.hideMask();
    alert('Error!');
  };
  api.call('get', query, onSuccess, option);
  return false;
}
//$('#navbar_refresh').bind('click', repliesUpdate);

function setquery(newquery, newoption) {
  if(newquery) {
    query = newquery;
  }
  
  if(newoption) {
    option = newoption;
  }
}

function setuserid(uid) {
  console.log('setuserid('+uid+')');
  $('#user-screen-name').html(uid);
  user_id = uid;
}

function showditail(sid) {
  console.log('Enter showditail('+sid+')');
  $.ui.showMask();
  detail_id=sid;
  //$('#detail-id').html(detail_id);
  $('#show-results').html('');
  
  var onSuccess = function(results) {
    console.log('success');
    console.log(results);
    var i, tags = '';
    var tmpl = $('#show-status-tmpl').html();
    var r = results;
    
    //URLにリンクを付ける
    r.text = r.text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)/gi,'<a href="$1">$1</a>');
    
    //宛先
    console.log('hoge2');
    r.to = r.text.match("^@[a-zA-Z0-9_]+");
    r.text_format = r.text.replace(/^@[a-zA-Z0-9_]+/,'');
    
    tags += $.template(tmpl, r);
    
    console.log(tags);
    $('#show-results').html(tags);
    
    //他画面で利用するためグローバル変数に格納
    detail_obj = r;
    
    $.ui.hideMask();
  };
  api.call('get', 'statuses/show/'+detail_id, onSuccess);
  return false;
}
function addditail(sid) {
  console.log('Enter addditail('+sid+')');
  $.ui.showMask();
  $('.reply_status').html('');
  
  var onSuccess = function(results) {
    console.log('success');
    console.log(results);
    var i;
    var tags = $('#show-results').html();
    var tmpl = $('#add-status-tmpl').html();
    var r = results;
    
    //URLにリンクを付ける
    r.text = r.text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+)/gi,'<a href="$1">$1</a>');
    
    //インデント
    var length = $('.add_status').length+1;
    r.indent = length*20+"px";
    
    //宛先
    r.to = r.text.match("^@[a-zA-Z0-9_]+");
    r.text_format = r.text.replace(/^@[a-zA-Z0-9_]+/,'');
    
    console.log(r);
    tags += $.template(tmpl, r);
    
    console.log(tags);
    $('#show-results').html(tags);
    
    $.ui.hideMask();
  };
  api.call('get', 'statuses/show/'+sid, onSuccess);
  return false;
}

/* status更新  */
function statusUpdate() {
  console.log('Enter statusUpdate()');
  var status_option = {status:''};
  $.ui.showMask();
  var onSuccess = function(results) {
    console.log('success');
    console.log(results);
    $.ui.hideMask();
  };
  status_option.status = $('#edit-to').val() + ' ' + $('#edit-cc').val() + ' ' + $('#edit-subject').val() + ' ' + $('#edit-text').val();
  if(reply_status_id != '') {
    status_option.in_reply_to_status_id = reply_status_id;
  }
  console.log(status_option);
  api.call('post', 'statuses/update', onSuccess, status_option);
  return false;
}
//$('#navbar_send').bind('click', statusUpdate);


/* status削除 */
function statusDestroy() {
  console.log('Enter statusDestroy()');
  $.ui.showMask();
  var onSuccess = function(results) {
    console.log('success');
    console.log(results);
    $.ui.hideMask();
  };
  api.call('post', 'statuses/destroy/'+detail_id, onSuccess);
  return false;
}
//$('#navbar_trash').bind('click', statusUpdate);

function setreplystatus() {
  $('#edit-to').val(detail_obj.user.name);
  $('#edit-cc').val('');
  $('#edit-subject').val('');
  $('#org-text').val('----- Original Message -----\n'+detail_obj.text_format);
}

function setforwardstatus() {
  $('#edit-to').val('');
  $('#edit-cc').val('');
  $('#edit-subject').val('');
  $('#org-text').val('----- Original Message -----\n'+detail_obj.text_format);
}