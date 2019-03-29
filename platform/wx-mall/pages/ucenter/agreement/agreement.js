var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
var pay = require('../../../services/pay.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contents: [
      { content: '在假日优选小程序付款200元，即可获得假日优选俱乐部会员资格。'},
      { content: '成为假日优选俱乐部会员后，可享受假日优选俱乐部提供的所有服务。' },
      { content: '购买200元会籍，一人付费全家使用，均可以享受假日优选俱乐部提供的所有服务。' },
      { content: '假日优选俱乐部为会员提供的免费活动项目，除实名注册的会员外，其他人员参加均需缴纳活动所需的成本费用，具体活动和费用按当次活动的策划方案通报全体会员。' },
      { content: '如果其他人员想获得假日优选俱乐部会员服务，可以采取付款200元或购买假日优选四种储值消费卡入会。' },
      { content: '本会籍有效期一年，次年续卡优惠。' },
      { content: '本会籍实名注册有效。姓名，联系方式，证件号码真实有效。' },
      { content: '假日优选俱乐部的产品和服务， 请登录假日优选俱乐部官（www.selectholiday.cn）和微信公众号查询。' },
      { content: '会员在购买假日优选俱乐部的旅游产品时应当与假日优选俱乐部签署相应的旅游合同，会员在享受假日优选俱乐部的旅游服务期间产生的纠纷，依据双方签署的的旅游合同处理。' },
      { content: '优享会员权益一切解释权归北京假日优选旅行社有限公司所有。' },
    ],
    vipInfo:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getUserVipInfo();
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
   * 获取微信支付的订单
   */
  getOrder() {
    let that = this;
    this.setData({
      maskFlage: !this.data.maskFlage
    });
    util.request(api.VipPAyOrder, { price: consts.DREDGE_VIP_FEE, vipId: that.data.vipInfo.id ? that.data.vipInfo.id : "" }).then(res => {
      if (res.errno == 0) {
        let orderId = res.orderId;
        pay.wxPayOrder(orderId).then(res => {
          util.request(api.OrderQuery, { orderId }).then(res => { /**发起支付成功的回调 */      that.getUserVipInfo();
          })
        })
      } else {
        wx.showToast({
          title: `${res.errmsg}`,
          icon: 'none'
        })
      }
    }).then(err => {
      console.log("成为会员失败", err);
    })
  },
  /**
   * 获取会员的信息
   */
  getUserVipInfo() {
    let that = this;
    util.request(api.Vipinfo).then(res => {
      if (res.errno == 0) {
        let strEffTime = util.formatTime(new Date(res.data.list.effectDate));
        res.data.list.effectDate = strEffTime;
        that.setData({
          vipInfo: res.data.list
        })
      } else {
        wx.showToast({
          title: `${res.errmsg}`,
          icon: 'none'
        })
      }

    }).catch(err => {
      console.log("获取用户会员的信息错误", err);
    })
  }
})