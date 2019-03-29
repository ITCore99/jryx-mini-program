var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  /**
   * tradeList 交易列表
   * index 导航栏选中控制
   * type 流水类型
   * nomore 没有数据
   */
  data: {
    page: 1,
    size: 15,
    tradeList: [],
    index: 0,
    left: 80,
    type: '',
    nomore: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTradeList(this.data.page, this.data.size, 0, this.data.type);
  },
  /**
   * 获取流水记录
   */
  getTradeList: function (page, size, flag, type) {
    if (this.data.nomore) {
      return;
    }
    let that = this;
    util.request(api.Trade, { page, size, type }, "POST").then(res => {
      if (res.errno == 0) {
        if (flag) {
          res.data.list.forEach((item) => {
            item.handlerTime = util.formatTime(new Date(item.createDate))
          });
          that.setData({
            tradeList: that.data.tradeList.concat(res.data.list)
          })
        } else {
          res.data.list.forEach((item) => {
            item.handlerTime = util.formatTime(new Date(item.createDate));
          });
          that.setData({
            tradeList: res.data.list
          })
        }
        if (res.data.list.length < this.data.size) {
          this.setData({
            nomore: true
          });
          wx.showToast({
            title: '已是全部数据',
            icon: 'none'
          })
          return;
        }
      }
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 导航栏控制
   */
  handClick(e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let left = index * 250 + 80;
    this.setData({
      left,
      index,
      type,
      page: 1,
      size: 15,
      nomore: false
    })
    this.getTradeList(this.data.page, this.data.size, 0, type);
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
    this.getTradeList(1, 10, 0, this.data.type);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({
      page: ++that.data.page,
    })
    this.getTradeList(this.data.page, this.data.size, 1, this.data.type);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})