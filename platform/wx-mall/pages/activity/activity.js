var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     activityList:[],
     categoryId: 1036017,
  },

  onLoad: function (options) {
    this.getData();
  },
  /**
   * 获取活动产品
   */
  getData()
  { 
    let that=this;
    util.request(api.GoodsList, { categoryId: this.data.categoryId}).then(res=>{
      if (res.errno==0)
        {
        if (res.data.goodsList.length==0)
          {
            wx.showToast({
              title: '当前没有活动',
              icon:'none'
            });
            return;
          }
          that.setData({
            activityList: res.data.goodsList
          })
        }else
        {
          wx.showToast({
            title: '获取活动失败',
            icon: 'none',
          })
        }
    }).catch(err=>{
      wx.showToast({
        title: '获取活动失败',
        icon: 'none',
      })
    })
  },
  /**
   * 活动详情
   */
  handlerClick(e)
  {
    app.globalData.CategorykeyWords ="1036017 "
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/goods/goods?id=${id}`,
    })
    

  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getData();
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

  }
})