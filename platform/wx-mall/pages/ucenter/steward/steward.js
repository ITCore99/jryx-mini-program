var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  /**
   * info 商旅管家信息
   */
  data: {
    info:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStewardInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 获取商旅管家
   */
  getStewardInfo()
  {
    let that=this;
    util.request(api.GetSteward,{},"POST","applicaation/json").then(res=>{
      if(res.errno==0)
      {
        if (res.data.length)
        {
          that.setData({
            info:res.data[0],
          })
        }
      }else{
        wx.showToast({
          title: '数据获取错误',
          icon:'none'
        })
      }
    }).catch(err=>{
      wx.showToast({
        title:'数据请求异常!,请重试',
        icon:'none'
      })
    })
  }
})