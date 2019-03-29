var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var pay = require('../../../services/pay.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardInfo:[],
    totalMoney:"",
    moneyNumber:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
     this.setData({
       cardInfo: [app.globalData.rechargeCard],
       totalMoney: app.globalData.rechargeCard.remainingSum,
     })

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
   * 充值联动
   */
  bindInput(e)
  {
    if (!Number(e.detail.value) >= 0.01) {
      wx.showToast({
        title: '请正确输入钱数，最少充值为0.01元',
        icon: 'none'
      });
      this.setData({
        totalMoney: app.globalData.rechargeCard.remainingSum,
        moneyNumber: 0
      });
      return;
    }
    if(e.detail.value)
    {
        this.setData({
          totalMoney: (Number(this.data.cardInfo[0].remainingSum*100) + Number(e.detail.value*100))/100,
          moneyNumber:e.detail.value
        })
    }else{
      this.setData({
        totalMoney: app.globalData.rechargeCard.remainingSum,
        moneyNumber: 0
      })
    }
   
  },
  /**
   * 获取充值订单id函数
   */
  getRechargeOrderId()
  { 
    if (!this.data.moneyNumber)
    {
      wx.showToast({
        title: '请输入充值数目',
        icon:"none"
      });
      return;
    }
    if (!Number(this.data.moneyNumber)>=0.01)
    {
      wx.showToast({
        title: '请正确输入钱数，最少充值为0.01元',
        icon:'none'
      });
      return;
    }
    util.request(api.CardRecharge, { cardId: this.data.cardInfo[0].id, price: this.data.moneyNumber, postscript:"会员卡充值"}).then(res=>{
      if(res.errno==0)
      {
        let orderId=res.orderId;
        pay.wxPayOrder(orderId).then(res=>{
          util.request(api.OrderQuery, { orderId}).then(res=>{ /**发起支付成功的回调 */
            wx.navigateBack({
              delta: 1
            })
          })
        })
      }
    })
  }
})