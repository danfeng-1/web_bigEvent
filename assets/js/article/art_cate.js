$(function(){
    var layer = layui.layer
    var form = layui.form

    initArtCateList()


    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                console.log(res)
                // 参数第一个是不需要加# 的id ，第二个是数据
                var htmlStr = template('tpl-table', res)

                // 给标签为tbody的
                $('tbody').html(htmlStr)
            }
        })
    }

    // 为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', function(){
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html() // '配置各种参数，试试效果'
        })
    })

    // 页面上可能还不存在那个元素，应该绑定页面上已经有的元素
    // 通过代理的方式，为form-add表单绑定submit事件
    // 给body父节点代替 form 表单 id 为 form-add 的绑定提交事件
    $('body').on('submit', '#form-add', function(e){
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(), // 获取表单的所有数据
            success: function(res){
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('新增分类失败!')
                }
                initArtCateList() // 否则就是新增成功，重新渲染数据
                layer.msg('新增分类成功!')

                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过代理的形式 ， 为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function(){
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html() // '配置各种参数，试试效果'
        })

        var id = $(this).attr('data-id') // 获取当前选取的子元素的id
        // 发起请求获取点击那行对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res){
                // console.log(res)
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的方式编辑修改分类的form 的 id为 form-edit 表单绑定 submit事件
    $('body').on('submit', '#form-edit', function(e){
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res){
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('修改类别失败！')
                }
                layer.msg('修改类别成功！')

                // 关闭当前弹窗并重新加载展示
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })


    // 通过代理的方式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function(e){
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除？', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
            
        })
    })

})