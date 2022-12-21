$(function(){

    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data){
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '-' + ' ' + hh + ':' + mm + ':' + ss
    }

    // 单个数字转两位
    function padZero(n){
        return n < 9 ? '0'+n : n
    }

    // 定义一个查询的参数对象， 将来请求数据的时候，需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 默认第一页页码值
        pagesize: 2, // 每页显示几页数据
        cate_id: '', // 分类类别
        state: '' // 文章的发表状态
    }

    initTable()
    initCate()

    // 使用模板引擎 获取文章列表数据的方法(获取成功，但是服务器没数据)
    function initTable(){
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q, // 请求带去的数据模板
            success: function(res){
                console.log(res)
                if(res.status !== 0){
                    return layer.msg('获取文章列表失败！')
                }
                // 否则获取数据成功，用模板渲染
                var htmlStr = template('tpl-table', res) // 模板和数据成为完整的模板块
                $('tbody').html(htmlStr) // 获取htbody标签往里面嵌入
            }
        })
    }

    // 初始化模板引擎渲染分类的可选项
    function initCate(){
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('获取分类数据失败！')
                }

                // 否则就是查询成功，
                var htmlStr = template('tpl-cate', res) // 模板id名注意没有#号
                // 重新给name是cate_id的下拉选择框套入模板
                $('[name=cate_id]').html(htmlStr)

                // 需要重新通知layui重新渲染表单区域的UI结构
                form.render()

                // 接着渲染分页
                renderPage()
            }
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e){
        e.preventDefault()

        // 获取表单数据
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state

        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()

    })

    // 定义渲染分页的方法

    function renderPage(){
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的是分页容器的ID，不用加 # 号
            count: 20,//total,//20 //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认本选中的分页

            // 自定义排版功能
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'], // 默认的是只有prev,page, next这三个
            limits: [2,3,5,10],  // 每页显示的数据

            // 分页发生切换的时候，出发 jump 回调
            // 触发jump回调：1.点击页码（first是undefined）  2.只要调用laypage.render()方法 (first是true)
            jump: function(obj, first){
                // console.log(obj.curr)
                // 把最新的页码值 复制到 q 这个查询参数对象中
                q.pagenum = obj.curr

                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性
                q.pagesize = obj.limit

                // 根据最新的 q 获取对应的数据列表，并渲染表格,但是直接放在这里会发生死循环
                // 只有方式一才敢调用initTable
                if(!first){
                    initTable()
                }
                
            }
        });
    }

    $('tbody').on('click', '.btn-delete', function(){

        // 获取删除按钮的个数
        var len = $('.btn-delete').length


        // 获取到文章的Id
        var id = $(this).attr('data-id')
        //询问用户是否要删除数据
        layer.confirm('确认删除', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res){
                    if(res.status !== 0){
                        return llayer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成之后，需要判断当前这一页中，是否含有剩余的数据，如果没有剩余的数据了，则让页码值 -1 之后
                    // 再重新调用 initTable 方法
                    if(len === 1){
                        // 如果len 的值等于1，证明 删除之后页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
        });
    })

  
    // ！！！！！！！！！！！！！！！art_list编辑 有问题，数据是DF格式！！！！！！！！！！！！！！！！！！！
    // 通过代理的形式 ， 为 btn-editList 按钮绑定点击事件
    var indexEdit = null
    $('body').on('click', '#btn-editList', function(){
        //弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['800px', '500px'],
            title: '编辑文章信息',
            content: $('#dialog-editList').html() // '配置各种参数，试试效果'
        })

        var id = $(this).attr('data-id') // 获取当前选取的子元素的id
        // 发起请求获取点击那行对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/edit/' + id,
            success: function(res){
                // console.log(res)
                form.val('form-editList', res.data)
            }
        })
    })

})