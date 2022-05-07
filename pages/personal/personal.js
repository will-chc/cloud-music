// pages/personal/personal.js
let startY = 0;
let moveY = 0;
let movedistance = 0;
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',//cover动画
    coverTransition:'',
    // 用户信息
    userInfo:{},
    // 最近播放
    recentPlayList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //获取最近播放列表
  onLoad(options) {
    //获取用户信息
    if(wx.getStorageSync('userInfo')){
      this.setData({
        userInfo:JSON.parse(wx.getStorageSync('userInfo'))
      });
    this.getRecentPlayList(this.data.userInfo.userId)
    }
    
  },

  // method

  //获取用户最近播放列表
  async getRecentPlayList(userId){
    let recentPlayData = await request('/user/record',{uid:userId,type:0})
    let index = 0;
    let recentPlayList = recentPlayData.allData.splice(0, 10).map(item => {
      item.id = index++;
      return item;
    });
    this.setData({
      recentPlayList
    });
  },
//下拉动画
  handleTouchStart(event){
    //取消动画变换
    this.setData({
      coverTransition:''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event){
    moveY = event.touches[0].clientY
    movedistance = moveY-startY;
    if(movedistance<0){ return };
    if(movedistance>80){
      movedistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${movedistance}rpx)`
    })
  },
  handleTouchEnd(){
    //回弹
    this.setData({
      coverTransform:'translateY(0rpx)',
      coverTransition: 'transform 1s linear'
    })
  },
  // 跳转登录页面
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
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