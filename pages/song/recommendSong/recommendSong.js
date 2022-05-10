// pages/recommendSong/recommendSong.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',//天
    mouth:'',//月
    recommendSongList:[],//推荐歌曲列表
    index:'',//播放歌曲下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取时间
    this.setData({
      day: new Date().getDate(),
      mouth: new Date().getMonth()+1,//英文月份需要加一
    });
    //获取推荐歌曲数据
    this.getRecommendSongData();

    // 订阅切歌指令消息
    PubSub.subscribe('switchSong',(msg,type)=>{
      let {recommendSongList,index} = this.data;
      if(type === 'pre'){//上一首
        //index为0时
        (index === 0)&&(index = recommendSongList.length)
        index--;
      }else{
        //当index为最后一首
        (index === recommendSongList.length-1)&&(index = -1)
        index++
      }
      //更新数据
      this.setData({
        index
      })
      let songId = recommendSongList[index].id
      //发布新歌曲的数据
      PubSub.publish('nextPlaySong',songId)

    })

  },
  //获取推荐歌曲数据
  async getRecommendSongData(){
    // 需要登录
    if(wx.getStorageSync('cookies')){
      let recommendSongData = await request('/recommend/songs');
      //更新数据
      this.setData({
        recommendSongList:recommendSongData.recommend
      })
    }
    else{
      //未登录跳转到登录页面
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  },
  //路由跳转到歌曲播放详情页
  handleToDetail(event){
    let {songid,index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/song/songDetail/songDetail?songId='+songid,
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