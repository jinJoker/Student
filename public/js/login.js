$(document).ready(function () {
  $(function () {
    var animationLibrary = 'animate';
    $.easing.easeOutQuart = function (x, t, b, c, d) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    $('[ripple]:not([disabled],.disabled)').on('mousedown', function (e) {
      var button = $(this);
      var touch = $('<touch><touch/>');
      var size = button.outerWidth() * 1.8;
      var complete = false;
      $(document).on('mouseup', function () {
        var a = { 'opacity': '0' };
        if (complete === true) {
          size = size * 1.33;
          $.extend(a, {
            'height': size + 'px',
            'width': size + 'px',
            'margin-top': -size / 2 + 'px',
            'margin-left': -size / 2 + 'px'
          });
        }
        touch[animationLibrary](a, {
          duration: 500,
          complete: function () {
            touch.remove();
          },
          easing: 'swing'
        });
      });
      touch.addClass('touch').css({
        'position': 'absolute',
        'top': e.pageY - button.offset().top + 'px',
        'left': e.pageX - button.offset().left + 'px',
        'width': '0',
        'height': '0'
      });
      button.get(0).appendChild(touch.get(0));
      touch[animationLibrary]({
        'height': size + 'px',
        'width': size + 'px',
        'margin-top': -size / 2 + 'px',
        'margin-left': -size / 2 + 'px'
      }, {
        queue: false,
        duration: 500,
        'easing': 'easeOutQuart',
        'complete': function () {
          complete = true;
        }
      });
    });
  });
  var username = $('#username'), flag1=false,flag2 = false,flag3 = false,password = $('#password'), usercode = $('#usercode'),noticeUsername = $("#auth-username"),noticePassword = $("#auth-password"),noticeCode = $("#auth-notice"),erroru = $('erroru'), errorp = $('errorp'), submit = $('#submit'), udiv = $('#u'), pdiv = $('#p'),cdiv = $('#c');
  username.blur(function () {
    if (username.val() == '') {
      udiv.attr('errr', '');
      return;
    } else {
      udiv.removeAttr('errr');
      flag1 = true;
    }
  });
  password.blur(function () {
    if (password.val() == '') {
      pdiv.attr('errr', '');
      return;
    } else {
      pdiv.removeAttr('errr');
      flag2 = true;
    }
  });
  usercode.keyup(function(){
    ajaxCode(usercode.val(),function(result){
      if(usercode.val() == ''){
        cdiv.attr('errr','');
        return;
      }else if(result.status == 0){
        noticeCode.html(result.info);
        cdiv.attr('errr','');
        return;
      }else{
        cdiv.removeAttr('errr');
        flag3 = true;
      }
    });

  });
  submit.on('click', function (event) {
    event.preventDefault();
    console.log(flag1);
    console.log(flag2);
    console.log(flag3);
    if(flag1 && flag2 && flag3){
       // alert(1);
       // alert(1);
       // $("#login-form").submit();
       var params = {};
       params.username = username.val();
       params.password = password.val();
       params.usercode = usercode.val();


      ajaxAuth(params);      
    }else{
      layer.open({
        content: '请输入正确的登陆信息'
      });
    }




  });
  function ajaxCode(val,fun){
    $.post('/api/authcode',{usercode:val},function(data){
      fun(data);
    })
  }
  function ajaxAuth(params,fun){

    layer.open({type: 2});    
    $.post('/api/login',params,function(data){
      console.log(data);
        if(data.status > 0){
            layer.closeAll();
            if(data.userType == 'student'){
              location.href = '/student';
            }else if(data.userType == 'teacher'){
              location.href = '/teacher';
            }else if(data.userType == 'admin'){
              location.href = '/admin';
            }
            return;
          }else if(data.status == 0){
            //验证码错误
           noticeCode.html(data.info);
            cdiv.attr('errr',''); 
            layer.closeAll(); 
            // location.reload(); 
          }else if(data.status == -1){
            //用户名错误
            noticeUsername.html(data.info);
            udiv.attr('errr', '');         
            layer.closeAll();     
            // location.reload();                    
          }else if(data.status == -2){
            //密码错误
            noticePassword.html(data.info);
            pdiv.attr('errr', '');         
            layer.closeAll();  
            // location.reload();                       
          }
    })
  }
});