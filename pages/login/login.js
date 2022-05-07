// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  //methods
  // 获取表单数据
  handleInput(event){
    let type = event.currentTarget.id
    this.setData({
      [type]:event.detail.value
    })
  },
  //登录验证
  async handleSubmit(){
    //获取表数据
    //前端验证
    if(!this.data.phone){
      // 提示用户
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    };
    //验证手机号码合法的正则表达式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(this.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      });
      return ;
    };
    if(!this.data.password){
      wx.showToast({
        title: '密码不能为空',
        icon:'none'
      });
      return ;
    };
    //后端验证
    // 发送请求
    let result = await request('/login/cellphone',{phone:this.data.phone,password:this.data.password})
    if(result.code === 200){
      wx.showToast({
        title: '登录成功',
      });
      //将登录信息存储到本地
      //同步
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));
      // 跳转回到个人中心
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
      return ;
    };
    if(result.code === 400){
      wx.showToast({
        title: '手机号码不正确',
        icon:'none'
      });
      return ;
    }
    if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon:'none'
      });
      return ;
    }else {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon:'none'
      });
      return ;
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