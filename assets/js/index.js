$(function(){
    // 渲染用户信息
    getUserInfo()

    //退出登录
    logOut()
})

function logOut(){
    var layer = layui.layer
    // 点击按钮实现退出的功能
    $('#btnLogout').on('click', function(){
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', {icon: 3, title:'提示'}, function(index){
            //do something
            //console.log('ok') // 点击确定才会打印ok
            // 1. 清空本地存储中的token
            localStorage.removeItem('token')

            // 2. 重新跳转到登录页面
            location.href = '/login.html'

            // 3. 关闭 confirm 询问框
            layer.close(index);
        });
    })
}


<<<<<<< HEAD
// 获取用户的基本信息
=======
// 获取用户的基本信息并渲染
>>>>>>> user
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if(res.status !== 0){
                return layui.layer.msg('获取用户信息失败！')
            }
<<<<<<< HEAD

=======
>>>>>>> user
            //调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },

        // 写在 baseAPI.js里面
        // complete: function(res){
        //     //console.log('执行了 complete 回调')
        //     //console.log(res)
        //     //在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if(res.responseJOSN.status === 1 && res.responseJOSN.message === '身份认证失败！'){
        //         // 1. 强制情况token
        //         localStorage.removeItem('token')
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }

    })
}


// 渲染用户的头像
function renderAvatar(user) {
    // 1. 得到用户名称(优先选择用户的昵称再是用户名)
    var name = user.nickname || user.username

    // 2. 根据得到的Name 设置欢迎的语句
    $('#welcome').html('欢迎&nbsp;' + name)

    // 3.渲染用户的头像
    if(user.user_pic !== null){
        // 如果有头像设置图片的路径并显示
        $('.layui-nav-img')
        .attr('src', user.user_pic)
        .show()
        // 把名字的隐藏
        $('.text-avatar').hide()
    }else{
        // 如果没有头像
        $('.layui-nav-img').hide() //图片的隐藏
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }

}