var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:'',
      detail:[],
      cardName:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id
    });
    this.getData();
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  getData()
  {
    let that=this;
    util.request(api.Userfinance, { id: this.data.id},"POST").then(res=>{
      console.log(res);
      if(res.errno==0)
      {
        res.data.userFinance.handlerTime = util.formatTime(new Date(res.data.userFinance.createDate))
        console.log("处理过后的time", res.data.userFinance)
        that.setData({
          detail: res.data.userFinance,
          cardName: res.data.card ? res.data.card.name : res.data.userFinance.payer,
        })
      }
    }).catch(err=>{
      console.log(err);
      wx.showToast({
        title: `${err}`,
        icon:'none'
      })
    })
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

  }
})