import axios from "axios";

const request = axios.create({
    baseURL: '//localhost:8090',
    timeout: 20000,
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
    }
});

//请求拦截器  前端给后端参数
request.interceptors.request.use(config => {
    //在请求之前做些什么
    // 添加loading加载
    const token = localStorage.getItem('token')
    if (token) {
        config.headers["token"] = token //请求头添加token
    }
    config.headers["Content-Type"] = 'application/x-www-form-urlencoded';
    return config            // 拦截成功后最后一定要返回
    //可通过return 向请求中添加数据
    // return {
    //     ...config,
    //     token: token, //添加token
    //     'Content-Type': 'application/x-www-form-urlencoded',
    // }
}, err => {
    //请求错误做些什么
    return Promise.reject(err)
})

// 响应拦截器  后端给前端参数
request.interceptors.response.use(response => {
    //对响应数据做些什么
    //取消加载
    return response.data
}, err => {
    //请求失败也要取消加载
    alert(err)
    return Promise.reject(err)   //抛出错误,把错误抛给谁? 谁调		用它发请求就给谁
})
//导出请求对象
export default request
