// pages/video/video.js
import request from '../../utils/request'
//模拟数据
import outVideoData from '../../utils/list'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[], //导航栏列表
    currentId:'',//当前导航id
    videoList:[],//当前视频列表
    videoId:'',//当前播放视频vid
    videoPlayTime:[],//视频已播放时间列表
    refresher:false,//下拉刷新

  },


// 获取导航栏数据
async getNavList(){
  let navListData = await request('/video/group/list');
  this.setData({
    navList: navListData.data.slice(0, 14),
    currentId: navListData.data[0].id
  });
  //获取视频数据
  this.getGroupVideo(this.data.currentId);
},
//获取切换导航
changeNav(event){
  this.setData({
    //转换Number
    currentId:event.currentTarget.dataset.id*1,
    videoList:[]
  });
  //显示加载提示
  wx.showLoading({
    title:'正在加载'
  })
  //获取对应导航的视频数据
  this.getGroupVideo(this.data.currentId)
},
// 获取对应视频数据
async getGroupVideo(currentId){
  if(!currentId){
    return ;
  };
  let videoListData = await request('/video/group',{id:currentId});
  //关闭loding提示
  
  wx.hideLoading({
    fail:()=>{
      return ;
    }
  });
  console.log(videoListData);
  let index = 0;
  if(videoListData.datas){
    let videoList = videoListData.datas.map(item => {
      item.id = index++;
      return item;
    });
    this.setData({
      videoList,
      refresher:false
    })
  }
 
},
//播放视频/继续播放的回调
handlePlay(event){
  //解决多个视频同时播放
  //点击下一个视频使得上一个视频停止播放
  //VideoContext 将video和id绑定
  //获取当前点击视频的id
  // let vid = event.currentTarget.id;
  // //当vid与this.vid不相等时为不同视频
  // this.vid !=vid &&this.videoContext&&this.videoContext.stop();
  // this.vid = vid;
  // //创建videoContext
  // this.videoContext = wx.createVideoContext(vid);

   //获取当前点击视频的id
  let vid = event.currentTarget.id;
  this.setData({
    videoId:vid
  });
   // //创建videoContext
  this.videoContext = wx.createVideoContext(vid);
  //获取videoPlayTime
  let {videoPlayTime} = this.data;
  // 当前视频是否已经播放过
  let videoItem = videoPlayTime.find(item => item.vid ===vid);
  if(videoItem){
    this.videoContext.seek(videoItem.currentTime);
  }
    this.videoContext.play();
},
//视频播放时间
handleUpdate(event){
  //记录播放的视频vid和播放时间
  let videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime};
  //获取videoPlayTime
  let {videoPlayTime} = this.data;
  //videoPlayTime中是否存在该条数据
  let videoItem = videoPlayTime.find(item => item.vid === videoTimeObj.vid);
  if(videoItem){
    //已经存在更新时间
    videoItem.currentTime = event.detail.currentTime;
  }else{
    //否则添加数据
    videoPlayTime.push(videoTimeObj);
  }
  //更新数据
  this.setData({
    videoPlayTime
  })
},
//视频播放结束
handleEnded(event){
  //视频播放结束删除对应videoPlayTime中元素
  //获取videoPlayTime
  let {videoPlayTime} = this.data
  let index = videoPlayTime.findIndex(item => item.vid ===event.currentTarget.id);
  //删除元素
  videoPlayTime.splice(index,1);
  //更新数据
  this.setData({
    videoPlayTime
  })
},
//下拉refresh
async handleRefresh(){
  // 发送请求获取新数据
  this.getGroupVideo(this.data.currentId);
},
//底部上拉获取分页数据
handleTolower(){
  
  //分页:前端分页(数据分割展示),后端分页(数据分次发送)
  // 追加数据在原有数据后面
  let {videoList} = this.data
  //模拟数据
  videoList.push(...outVideoData.videoList);
  //更新数据
  this.setData({
    videoList
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
  onShareAppMessage({target}) {
    if(target){
      return {
        title:'hahaha',
        page: '/pages/video/video',
        imageUrl: '/static/image/8chong.jpg'
      }
    }
  }
})