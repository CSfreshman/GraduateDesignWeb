import axios from "axios";

const service = axios.create({
    //baseURL会自动的加在接口地址上
    baseURL: 'http://localhost:8081',
    timeout: 3000,       //指定请求超时时间  毫秒
    headers: {
        'Content-type': 'application/json;charset=utf-8'
    }

})

//添加请求拦截器
service.interceptors.request.use(function (config){
    //在发送请求之前做一些事   比如添加token
    return config
},function (error){
    //请求报错做的事情
    return Promise.reject(error)
})


//添加响应拦截器
service.interceptors.response.use(function (response){
    //对响应数据做些什么
    return response
})

export default service