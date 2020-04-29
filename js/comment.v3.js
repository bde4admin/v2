$.fn.serializeJson=function(){
    var serializeObj={};
    var array=this.serializeArray();
    var str=this.serialize();
    $(array).each(function(){
        if(serializeObj[this.name]){
            if($.isArray(serializeObj[this.name])){
                serializeObj[this.name].push(this.value);
            }else{
                serializeObj[this.name]=[serializeObj[this.name],this.value];
            }
        }else{
            serializeObj[this.name]=this.value;
        }
    });
    return serializeObj;
};
var commentSource = "<div class=\"comment\">" +
    "        <a class=\"avatar\">" +
    "            <img src=\"/images/steve.jpg\">" +
    "        </a>" +
    "        <div class=\"content\">" +
    "            <a class=\"author\"><%=comment.to != null ? comment.to.from.nickname : comment.from.nickname%></a>" +
    "            <div class=\"metadata\">" +
    "                <span class=\"date\"><%=comment.to != null ? comment.to.date : (comment.date == null ?'刚刚' : comment.date)%></span>" +
    "            </div>" +
    "            <div class=\"text\">" +
    "                <p><%=comment.to != null ? comment.to.content : comment.content%></p>" +
    "            </div>" +
    "            <% if (comment.to == null && comment.from.id != uid) {%>" +
    "            <div class=\"actions\">" +
    "                <a class=\"reply\" toCid='<%=comment.id%>'>回复</a>" +
    "            </div>" +
    "            <%}%>" +
    "        </div>" +
    "        <% if (comment.to != null) {%>" +
    "        <div class=\"comments\">" +
    "            <div class=\"comment\">" +
    "                <a class=\"avatar\">" +
    "                    <img src=\"/images/steve.jpg\">" +
    "                </a>" +
    "                <div class=\"content\">" +
    "                    <a class=\"author\"><%=comment.from.nickname%></a>" +
    "                    <div class=\"metadata\">" +
    "                        <span class=\"date\"><%=comment.date%></span>" +
    "                    </div>" +
    "                    <div class=\"text\">" +
    "                        <%=comment.content%>" +
    "                    </div>" +
    "                    <div class=\"actions\">" +
    "                        <a class=\"reply\" toCid='<%=comment.id%>'>回复</a>" +
    "                    </div>" +
    "                </div>" +
    "            </div>" +
    "        </div>" +
    "        <%}%>" +
    "    </div>";
$('input[name=verifyCode]').on('keydown', function (event) {
    if (event.keyCode == 13) return false;
})
function replaceface(text){
  for(i=0;i<60;i++){
    text=text.replace(eval('/#'+ (i+1) +'#/g'),' <img src="/images/face/'+(i+1)+'.gif"> ');
  }
  return text;
}
var renderFn = template.compile(commentSource);
var toComment = null;
var showReplay = function() {
    if ($(this).html() == '取消') {   //取消回复,还原位置
        toComment = null;
        $('#comment-list').append($('#reply-form'));
        $(this).html('回复');
        return;
    }
    //当前回复id
    toComment = {
        id: $(this).attr('toCid'),
        from: {
            nickname: $(this).parent().parent().find('.author').text()
        },
        content: $(this).parent().parent().find('.text').text(),
        date: $(this).parent().parent().find('.date').text()
    };
    //还原所有“取消按钮”
    $('.reply').html('回复')
    //移动到当前回复位置
    $(this).parent().append($('#reply-form'))
    //改变当前位置回复按钮
    $(this).html('取消')

}
$(function (){
  $("a.face").smohanfacebox({
    Event : "click",	//触发事件
    divid : "faceBox", //外层DIV ID
    textid : "content" //文本框 ID
  });
  $('#comments-wrapper').replaceface($('#comments-wrapper').html());
  $('.reply').on('click',showReplay);

  var page = 2, loading = false;
  $('#more-comment').click(function() {
    if (loading) return;
    loading = true;
    var params = {
      page: page++,
      topicId: $('input[name=topicId]').val(),
      topicType: $('input[name=topicType]').val()
    };
    $.getJSON('/comments',params, function (data) {
      loading = false;
      for (var i = 0; i < data.list.length; i++) {
        var comment = data.list[i];
        $('#comments-wrapper').append(replaceface(renderFn({"comment": comment})));

        //$('#comments-wrapper .comment:last-child').replaceface($('#comments-wrapper .comment:last-child').html())
      }
      $('.reply').unbind('click');
      $('.reply').click(showReplay);
      if (data.isLastPage) {
        $('#more-comment').before('<span class="text-center ui small grey text">没有更多了</span>');
        $('#more-comment').remove();
      }
    });
  });

  $('#sub-comment').click(function () {

    var valid = true, errMsg = '';
    if (uid == null) {
      errMsg = '请登录后再操作！';
      valid = false;
    }
    if ($('#content').val().trim()===''||$('#content').val().trim().length < 3) {
      errMsg = '总要说点什么吧，必须大于3个字符。';
      valid = false;
    }
    if ($('input[name=verifyCode]').val().trim()=='') {
      errMsg = '请输入验证码！';
      valid = false;
    }
    if (!valid) {
      $('body').toast({
        position: 'top center',
        class: 'error',
        message: errMsg,
        showProgress: 'bottom'
      });
      return;
    }
    var params = $('#reply-form').serializeJson();
    if (toComment != null)
      params['to.id'] = toComment.id;

    $.post('/comment', params, function(result){
      $('body').toast({
        position: 'top center',
        class: result.status == -1 ? 'error' : 'success',
        message: result.message,
        showProgress: 'bottom'
      });
      $('input[name=verifyCode]').val('');
      if (result.status==0) {
        var comment = {
          "comment":{
            "from": {
              "id": uid,
              "nickname": nickname
            },
            "content":$('#content').val()
          }
        };
        if (toComment != null) {
          comment.comment.to = toComment;
        }
        $('#comments-wrapper').prepend(replaceface(renderFn(comment)));
        mScroll('#comment');
        $('#content').val('');
      }
      $('.verify-code').attr('src', '/verifyCode?t=' + new Date().getTime());
      toComment = null;
      //还原所有“取消按钮”
      $('.reply').html('回复');
      $('#comment-list').append($('#reply-form'));
    });
  });
});
function mScroll(selector){$("html,body").stop(true);$("html,body").animate({scrollTop: $(selector).offset().top}, 500);}