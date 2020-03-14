var h = window.location.href;
var mid = h.substring(h.lastIndexOf("/") + 1, h.indexOf('.htm'))
$.getJSON("/downloadInfo/list?mid=" + mid, function (list) {

  list.map(function (d) {
    var item = '<div class="item"><div class="content"><a class="parent" target="_blank" href="' + d.url + '"><em' +
      ' class="left"' +
      ' style="color:' +
      ' red">' + d.downloadCategory.name + '：</em><em class="right ui text nowrap" title="' + d.url + '">' + d.url + '</em>' + (d.password != 'none' ? '<em' +
        ' style="color:red">（' + d.password + '）</em>' : '') + '</a></div></div>';
    $('#download-list').prepend(item)
  });
  $('#download-wrapper').css('display', 'block');
});
$(function () {
  var collapseDefaultContent = '展开';
  var collapseActiveContent = '收起';
  if ($('.summary').height() > (1.8 * 14 * 3)) {
    var el = document.createElement('span');
    el.innerHTML = collapseDefaultContent;
    el.className = 'collapse';
    $('.summary').append($(el));
    // multi 是显示溢出的标志
    $('.summary').addClass('multi ellipsis')
  }
  // 点击判断收起还是展开
  $('.multi').on('click', '.collapse', function() {
    var $this = $(this)
    var $parent = $this.closest('.multi')

    if($parent.hasClass('ellipsis')) {
      $parent.removeClass('ellipsis');
      $this.html(collapseActiveContent);
    } else {
      $parent.addClass('ellipsis');
      $this.html(collapseDefaultContent);
    }
  })
})