$(function(){
    //点击 “去注册账号” 跳转
    $('#link-reg').on('click', function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击 “去登录” 跳转
    $('#link-login').on('click', function(){
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从layui 中获取 form 对象
    var form = layui.form
    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义了一个叫 pwd 的校验规则
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],

        // 校验两次密码是否一致的规则，把repwd放在确认密码
        repwd: function(value){
            // 通过形参拿到的是确认密码框中的内容，还需要拿到密码框中的内容，然后进行等于的判断，如果判断失败，则return一个提示信息即可
            var pwd = $('.reg-box [name=password]').val() //属性选择器
            if(pwd !== value){
                return '两次密码不一致'
            }
        }
    })
    // 使用jQuery的  表单的提交事件（绑定在 form 上而非 button 上
    $('#form_reg').on('submit', function(e){
        // 1.阻止默认的提交行为
        e.preventDefault()
        // 2.发起Ajax的post请求
        // 请求的url 地址， 请求的数据， 响应。
        // 请求的数据，按照属性选择器来的
        $.post('http://www.liulongbin.top:3007/api/reguser',{username:$('#form_reg [name=username]').val(),
        password:$('#form_reg [name=password]').val()}, function(res){
            if(res.status !== 0){
                // return console.log(res.message)
                return layer.msg(res.message)
            }
            //console.log('注册成功！')
            layer.msg('注册成功，请登录！')

            //注册成功，自动默认点击登录行为
            $('#link-login').click()
        })
    })

    //使用ajax的方式
    $('#form_login').submit(function(e) {
        e.preventDefault()
        $.ajax({
            url: 'http://www.liulongbin.top:3007/api/login',
            method: 'POST',
            data: $(this).serialize(), //获取表单里面的所有数据
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                console.log(res.token)

                // 将登陆成功得到的 token 字符串，保存到localStorage中
                // 这样每次请求需要权限的网址，带上请求头字段为 Authorization,值为token的发送即可
                localStorage.setItem('token', res.token)

                //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})