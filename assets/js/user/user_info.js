$(function(){

    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function(value){
            if(value.length > 6){
                return '昵称长度必须在1-6个字符之间'
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息（把用户的信息展示进表单，其中id的那一个隐藏）
    function initUserInfo(){
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取用户信息失败！') //提示框
                }
                console.log(res) // 成功打印出来

                //调用 form.val() 快速为表单赋值,lay-filter=formUserInfo的那个表单
                form.val('formUserInfo',res.data) // 只有显示username，昵称和邮箱都没有数据
            }
        })
    }

    // 点击重置按钮，重置表单的数据
    $('#btnReset').on('click', function(e){
        // 阻止表单默认提交行为
        e.preventDefault()
        // 再次渲染原来的数据到表格
        initUserInfo()
    })

    // 直接提交表单
    $('.layui-form').on('submit', function(e){
        e.preventDefault()
        //ajax数据的提交
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(), //通过serialize()函数快速获取到表单里面的所有数据
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('更新用户信息失败！') // 弹出提示
                }
                layer.msg('更新用户信息成功！')

                // 调用父页面中的方法，重新渲染用户的头像和用户的信息，在index.js中找
                window.parent.getUserInfo()
                console.log('parent成功')

            }
        })
    })

})

