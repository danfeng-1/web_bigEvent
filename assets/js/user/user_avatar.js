$(function(){

    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
      // 纵横比
      aspectRatio: 1, // 宽高比例 1/1
      // 指定预览区域
      preview: '.img-preview'
    }
  
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 上传文件
    $('#btnChooseImage').on('click', function(){
        $('#file').click()
    })

    // 为文件选择框绑定 change 事件
    $('#file').on('change', function(e){
      // console.log(e)
      // 获取用户选择的文件
      var filelist = e.target.files
      if(filelist.length === 0){
        return layer.msg('请选择图片！')
      }

      //否则就是选择了图片
      // 拿到用户点击的图片
      var file = filelist[0] // e.target.files[0]

      // 转化为URL路径
      var imgURL = URL.createObjectURL(file)

      // 重新渲染裁剪
      $image
        .cropper('destroy') //销毁
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) //创建裁剪区域
    })

    // 把裁剪的区域上传服务器
    $('#btnUpload').on('click', function(){

      // 把图像转成base64格式
      var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    
      // 接着ajax发送数据
      $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
          avatar: dataURL// 请求体是avatar,数据是base64的
        },
        success: function(res){
          if(res.status !== 0){
            return layer.msg('更换头像失败!')
          }
          layer.msg('更换头像成功!')

          // 重新渲染头像
          window.parent.getUserInfo()
        }
      })
    })
    
})