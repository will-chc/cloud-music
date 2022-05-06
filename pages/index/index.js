// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图
    bannerList:[],
    //推荐歌曲数据
    recommendList:[],
    //排行榜数据
    topList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    //发送轮播图区域请求,获取轮播图数据
    let bannerResult = await request("/banner",{type:2});
    this.setData({
      bannerList:bannerResult.banners
    });
    //获取推荐歌曲数据
    let recommendResult = await request("/personalized",{limit:10});
    this.setData({
      recommendList:recommendResult.result
    });
    //获取排行榜数据
    let resultList =[];
    for(let i =0 ;i<5;i++){
      let topListResult = await request("/top/list",{idx:i});
      let topListItem = {name:topListResult.playlist.name,tracks:topListResult.playlist.tracks.slice(0,3)};
      resultList.push(topListItem);
      this.setData({
        topList:resultList
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})