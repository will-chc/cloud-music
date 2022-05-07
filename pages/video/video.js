// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[],
    currentId:''
  },
// 获取导航栏数据
async getNavList(){
  let navListData = await request('/video/group/list');

  this.setData({
    navList: navListData.data.slice(0, 14),
    currentId: navListData.data[0].id
  })
},
//获取当前导航id
handleActive(event){
  this.setData({
    //转换Number
    currentId:event.currentTarget.id*1
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // 获取导航栏数据
      this.getNavList();
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