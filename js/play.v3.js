$(function () {
  if ((typeof ptoken) == 'undefined') {
    $('#video').css({'text-align':'center', 'font-size':'50px', 'padding-top': '50px'}).html('应版权方要求已屏蔽！');

    return;
  }
  $.getJSON("/god/" + ptoken + "?sg=" + sg, function (result) {
    if (result.url != null) {
      /*if (result.url.indexOf(".com") > 0 && result.url.indexOf("https") < 0) {
          result.url = result.url.replace('http', 'https');
      }*/
      if (result.url.indexOf("handler") > 0) {
        result.url += '/' + new Date().getTime() + '.mp4';
      }
      result.url = result.url.replace("?rkey", new Date().getTime() + ".mp4?ver=6010&rkey").replace('https', 'http');

      var ftn = result.url.substring(result.url.lastIndexOf("/"));

      var currentTime = localStorage.getItem("ct_" + pid);

      var index = 0;
      //eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('e f=[\'3://6-7.1.2.0\',\'3://g-7.1.2.0\',\'3://d-7.1.2.0\',\'3://9-4.1.2.0\',\'3://c-4.1.2.0\',\'3://6-4.1.2.0\',\'3://8-4.1.2.0\',\'3://a-4.1.2.0\',\'3://6-5.1.2.0\',\'3://6-b.1.2.0\',\'3://8-5.1.2.0\',\'3://8-b.1.2.0\',\'3://a-5.1.2.0\',\'3://9-5.1.2.0\'];',17,17,'com|ftn|qq|http|ctfs|btfs|sz|download|sh|tj|cd|btfsv2|xg|gzc|var|sites|njc'.split('|'),0,{}));
      var sites=['\x68\x74\x74\x70\x3a\x2f\x2f\x74\x6a\x2d\x63\x74\x66\x73\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x78\x67\x2d\x63\x74\x66\x73\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x73\x7a\x2d\x63\x74\x66\x73\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x78\x61\x2d\x62\x74\x66\x73\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x63\x64\x2d\x63\x74\x66\x73\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x73\x68\x2d\x63\x74\x66\x73\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x67\x7a\x63\x2d\x64\x6f\x77\x6e\x6c\x6f\x61\x64\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x6e\x6a\x63\x2d\x64\x6f\x77\x6e\x6c\x6f\x61\x64\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d','\x68\x74\x74\x70\x3a\x2f\x2f\x73\x7a\x2d\x64\x6f\x77\x6e\x6c\x6f\x61\x64\x2e\x66\x74\x6e\x2e\x71\x71\x2e\x63\x6f\x6d'];
      const dp = new DPlayer({
        container: document.getElementById('video'),
        autoplay: true,
        video: {
          url: result.url,
          pic: '/images/play_window_pic.png'
        }
      });
      if (IsPC) {
        var error = '<a href="/play-help.htm" target="_blank" style="margin-right: 10px;">播放问题？</a>';
        var download = '<a href="' + result.url + '" target="_blank" style="color: #fff !important;margin-right: 10px;">下载</a>';
        $('.xuanji').before(error + download);
      } else {
        $('.xuanji').before('<a href="' + result.url + '" target="_blank" style="color: #fff !important;margin-right: 10px;">下载</a>');
      }
      dp.on('error', function () {
        var url = result.url;
        if (index > sites.length) {
          $('body').toast({
            position: 'top center',
            class: 'error',
            message: '视频格式不支持或地址失效，请刷新页面或者换安卓手机浏览器重试！',
            showProgress: 'bottom'
          });
          dp.notice('视频格式不支持或地址失效，请刷新页面或者换安卓手机浏览器重试！', -1);
          return;
        }
        dp.notice('视频加载中...未提示失败前请勿刷新页面！', 10000);
        if (index == sites.length) {
          index++;
          url = result.url;
        }
        else
          url = sites[index++] + ftn;

        dp.switchVideo({
          url: url.replace('https', 'http'),
          pic: '/images/play_window_pic.png'
        });
      });

      dp.on('loadedmetadata', function () {
        dp.video.currentTime = currentTime;
        dp.play();
      });
      dp.on('timeupdate', function(){
        var currentTime = Math.floor(dp.video.currentTime);
        localStorage.setItem("ct_" + pid, currentTime);
      })

      $('.xuanji').click(function () {
        toggle()
      })
      /*$('.icon-download-alt').attr('href', result.url);
      $('.icon-download-alt').removeClass('hidden');*/
    } else {
      $('body').toast({
        position: 'top center',
        class: 'error',
        message: result.msg == null ? '解析失败，请刷新重试，多次失败请留言报告。':result.msg,
        showProgress: 'bottom'
      });
    }
  });

  function toggle() {
    $('.player-wrapper .ui.sidebar')
      .sidebar({
        context: $('#player-box'),
        transition: 'overlay'
      })
      .sidebar('toggle')
    ;
  }

  toggle()
  $('#play-list').scrollTop($('#play-list .active').offset().top - $('#play-list').offset().top + $('#play-list').scrollTop());
  setTimeout(function () {
    toggle()
  }, 3000)
})
