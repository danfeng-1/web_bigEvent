$(function(){
    var form = layui.form

    form.verify({
        pwd: [ // 密码验证规则
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'],
        samePwd: function(value){ //判断新旧密码是否相同的验证，加在旧密码处value值是旧密码
            if(value === $('[name=oldPwd]').val()){
                return '新旧密码不能相同！'
            }
        },
        rePwd: function(value){ // 判断两次新密码是否一致
            if(value !== $('[name=newPwd]').val()){
                return '两次密码不一致！'
            }
        }
    })

    // 提交修改密码的表单
    $('.layui-form').on('submit', function(e){
        // 先阻止表单默认事件提交
        e.preventDefault()

        // 
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res){
                if(res.status !== 0){
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')

                // 重置清空表单,记得[0]
                $('.layui-form')[0].reset()
            }
        })

        
    })
})