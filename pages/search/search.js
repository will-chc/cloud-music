// pages/search/search.js
import request from '../../utils/request'
let timer = null; //节流
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent:'',//搜索框默认词
    topList:'',//热搜榜列表
    searchKeyWord:'',//搜索内容
    searchList:[],//模糊搜索结果
    searchHistory:[],//搜索历史
  },
  // 获取初始化数据
  async getInitData(){
    let placeHolderContentData =  await request('/search/default');
    let topListData = await request('/search/hot/detail');
    this.setData({
      placeHolderContent:placeHolderContentData.data.showKeyword?placeHolderContentData.data.showKeyword:'搜索',
      topList:topListData.data,
    })
  },
  //搜索
  handleInput(event){
    this.setData({
      searchKeyWord:event.detail.value.trim()
    })
  //节流
  if(timer){
    return ;
  }
  timer = setTimeout(()=>{
    this.getSearchData();
    timer = null
  },300)
  },
  //获取模糊搜索数据
  async getSearchData(){
    let {searchKeyWord,searchHistory} = this.data
    if(searchKeyWord){
      let searchData = await request('/search',{keywords:searchKeyWord,limit:10});
      //添加到历史记录中
      console.log(searchHistory);
      if(searchHistory.indexOf(searchKeyWord)!==-1){
        searchHistory.splice(searchHistory.indexOf(searchKeyWord),1);
      };
      searchHistory.unshift(searchKeyWord);
      this.setData({
        searchList:searchData.result?searchData.result.songs:[],
        searchHistory
      });
      wx.setStorageSync('searchHistory', searchHistory)
    }else{
      this.setData({
        searchList:[]
      })
    }
  },

  //关闭搜索
  closeSearch(){
    this.setData({
      searchKeyWord:'',
      searchList:[],
    })
  },
  //回到视频页
  backToVideo(){
    wx.switchTab({
      url: '/pages/video/video',
    })
  },
  //获取历史记录
  getSearchHistory(){
    let searchHistory = wx.getStorageSync('searchHistory');
    this.setData({
      searchHistory:searchHistory?searchHistory:[]
    })
  },
  //清空历史记录
  clearHistory(){
    wx.showModal({
      content: '确认删除吗?',
      success: (res) => {
        if(res.confirm){
          // 清空data中searchHistory
          this.setData({
            searchHistory: []
          })
          // 移除本地的历史记录缓存
          wx.removeStorageSync('searchHistory');
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData();
    this.getSearchHistory();
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