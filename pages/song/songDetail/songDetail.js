// pages/song/songDetail/songDetail.js
import request from '../../../utils/request'
import PubSub from 'pubsub-js'
import moment from 'moment'
// 获取全局实例
const appinstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//音乐播放状态
    musicId: '',//音乐id
    musicInfo: {},//音乐信息
    musicLink: '',//音乐链接
    currentTime: '00:00',//当前播放时间
    durationTime: '00:00',//歌曲总时长
    currentWidth:0,//进度条的长度

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options为路由跳转时传递的query参数
    if (options) {
      this.setData({
        musicId: options.songId
      })
      this.getMusicInfo(options.songId);
    }
    let { musicId } = this.data
    //音乐是否已经播放
    if (appinstance.globalData.song.id === musicId && appinstance.globalData.song.isPlay) {
      //修改播放状态
      this.setData({
        isPlay: true
      })
    }
    //创建背景音乐实例
    //将实例添加到this中（解决作用域调用问题）
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 监听音乐播放
    this.backgroundAudioManager.onPlay(() => {
      appinstance.globalData.song.id = musicId
      this.changIsPlay(true);
    });
    //监听音乐暂停
    this.backgroundAudioManager.onPause(() => {
      this.changIsPlay(false);
    });
    //监听音乐停止
    this.backgroundAudioManager.onStop(()=>{
      this.changIsPlay(false);
    })
    //监听歌曲播放进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss');
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450;
      //更新数据
      this.setData({
        currentTime,
        currentWidth
      })
    })
    //监听歌曲播放结束自动播放下一首
    this.backgroundAudioManager.onEnded(()=>{
      this.changIsPlay(false);
      //发布消息切换下一首歌曲
      PubSub.publish('switchSong','next');
      PubSub.subscribe('nextPlaySong', (msg, songId) => {
        //获取新的歌曲详情信息
        this.getMusicInfo(songId);
        //自动播放
        this.musicControl(songId, true);
        //取消订阅
        PubSub.unsubscribe('nextPlaySong');
      })
      //更新current
      this.setData({
        currentTime: '00:00',
        currentWidth:0

      })
    })
  },
  //改变音乐播放状态
  changIsPlay(isPlay) {
    this.setData({
      isPlay
    });
    //修改全局音乐播放状态
    appinstance.globalData.song.isPlay = isPlay;
  },
  // 获取歌曲详细信息
  async getMusicInfo(musicId) {
    let musicData = await request('/song/detail', { ids: musicId });
    // 获取音乐总时长并格式化
    let durationTime = moment(musicData.songs[0].dt).format('mm:ss');
    this.setData({
      musicInfo: musicData.songs[0],
      durationTime
    });
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.musicInfo.name
    });
  },
  //播放和暂停(按钮)
  handlePlaySong() {
    let { musicId, isPlay, musicLink } = this.data;
    isPlay = !isPlay;
    //更新数据
    this.setData({
      isPlay
    })
    this.musicControl(musicId, isPlay, musicLink)
  },
  //音乐的播放和暂停
  async musicControl(musicId, isPlay, musicLink) {
    if (isPlay) {
      if (!musicLink) {
        // 获取播放音乐链接
        let musicLinkData = await request('/song/url', { id: musicId });
        musicLink = musicLinkData.data[0].url;
        this.setData({
          musicLink,
        });
      }
      //播放音乐
      this.backgroundAudioManager.src = musicLink;
      this.backgroundAudioManager.title = this.data.musicInfo.ar[0].name;
    } else {
      this.backgroundAudioManager.pause();
    }
  },
  //切歌
  handleswitch(event) {
    let type = event.currentTarget.dataset.type;
    this.backgroundAudioManager.stop();
    //订阅新的歌曲信息
    PubSub.subscribe('nextPlaySong', (msg, songId) => {
      //获取新的歌曲详情信息
      this.getMusicInfo(songId);
      //自动播放
      this.musicControl(songId, true);
      //取消订阅
      PubSub.unsubscribe('nextPlaySong');
    })

    //发布消息
    PubSub.publish('switchSong', type);
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