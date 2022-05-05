
import config from "./config";
// 封装请求功能函数
export default (url ,data=[],method="GET") =>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.host + url,
      data,
      method,
      success:(res)=>{
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