
import config from "./config";
// 封装请求功能函数
export default (url ,data=[],method="GET") =>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.host + url,
      data,
      method,
      header: {
        //设置cookie
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      success:(res)=>{
        //获取cookie
        if(data.isLogin){
          wx.setStorageSync('cookies', res.cookies);
        }
        // console.log("请求成功：",res.data);
        resolve(res.data);
      },
      fail:(err)=>{
        // console.log("请求失败：",err);
        reject(err);
      }
    })
  })
}