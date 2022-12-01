// 注意：每次调用 $.get() 或者 $.post() 或 $.ajax() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数 中，可以拿到我们给ajax 提供的配置对象(补充，记得在vue里面，也可以通过配置文件来进行拼接)

$.ajaxPrefilter(function(options){
    console.log(options.url) // 接口路径

    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    //http://ajax.frontend.itheima.net 
    
    options.url = 'http://www.liulongbin.top:3007/' + options.url
    console.log(options.url)
})