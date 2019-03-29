var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');/**支付相关的服务 */

Page({
  data: {
    orderId: 0,
    actualPrice: 0.00,
    popupFlag: false, /**控制弹窗 */
    cardList: [],
    cardId:'',
    goodsType:'',/**订单类型 */
    vipFlage:false,
  },
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      actualPrice: options.actualPrice,
      goodsType: options.goodsType
    });
    this.judgeVip();
  },
  onReady: function () {
  },
  onShow: function () {
    this.judgeVip();
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  /**
   * 开始发起支付
   */
  requestPayParam() 
  {  
    let that = this;
    let checkedCard=""
    if(that.data.vipFlage)
    {
      checkedCard= this.data.cardList.filter(item => {
        if (item.checked) {
          return item;
        }
      });
      if (checkedCard.length == 0) {
        return wx.showToast({
          title: '请选择支付的卡',
          icon: 'none'
        });
      };
    }
    if(that.data.vipFlage)
    {
      pay.payOrder(that.data.orderId, checkedCard[0].id).then(res => {        //获取微信统一下单prepay_id
        console.log("这边下单了", res)
        that.setData({
          popupFlag: false
        });
        wx.redirectTo({
          url: `/pages/payResult/payResult?status=1&orderId=${that.data.orderId}&goodsType=${that.data.goodsType}`
        });
      }).catch(res => {
        that.setData({
          popupFlag: false
        });
        wx.redirectTo({
          url: `/pages/payResult/payResult?status=0&orderId=${that.data.orderId}&goodsType=${that.data.goodsType}`
        });
      });
    }else
    {
      pay.wxPayOrder(that.data.orderId).then(res => {
        wx.redirectTo({
          url: `/pages/payResult/payResult?goodsType=${this.data.goodsType}&status=1&orderId=${that.data.orderId}`
        });
      }).catch(res => {
        wx.redirectTo({
          url: `/pages/payResult/payResult?goodsType=${this.data.goodsType}&status=0&orderId=${that.data.orderId}`
        });
      });
    } 
  },
  /**
   * 开始重新支付
   */
  startPay() {
    
    if(this.data.vipFlage)
    {
      this.setData({
        popupFlag: true
      });
      this.getCardList();
    }else
    {
     this.requestPayParam();
    }
   
  },
  /**
   * 获取卡id
   */
  getCardID: function (e) {
    let index = e.currentTarget.dataset.index;
    let cardList = this.data.cardList;
    cardList[index].checked = !cardList[index].checked;
    this.setData({
      cardId: e.currentTarget.dataset.id,
      cardList
    });
    this.clearRadio(index);

  },
  /**
  * 取消mask
  */
  cancelPay: function () {
    this.setData({
      popupFlag: false
    });
  },
  /**
   * 获取用户卡的信息
   */
  getCardList: function () {
    let that = this;
    let userId = wx.getStorageSync("userId");
    util.request(api.CardList, { userId, activateStatus: 1 }, "POST").then(res => {
      if (res.code == 0) {
        if (res.cardList.length == 0) {
          wx.showToast({
            title: '你还没已激活的卡',
            icon: 'none'
          });
          return;
        }
        res.cardList.forEach(item => {
          item.checked = false;
          if (item.remainingSum < that.data.actualPrice) {
            item.lack = true;
          } else {
            item.lack = false
          }
        })
        that.setData({
          cardList: res.cardList
        });
      } else {
        wx.showToast({
          title: '出现错误',
          icon: 'none'
        });
      }
    }).catch(err => {
      wx.showToast({
        title: '出现错误',
        icon: 'none'
      });
    });
  },
  /**
   * 清空单选框
   */
  clearRadio(ind) {
    let cardList = this.data.cardList;
    cardList.forEach((item, index) => {
      if (ind != index) {
        item.checked = false;
      }
    });
    this.setData({
      cardList,
    })
  },
  /**
   * 判断用户是否是会员
   */
  judgeVip() {
    let that = this;
    util.request(api.JudgeVip).then(res => {
      if (res.errno == 0) {
        that.setData({
          vipFlage: true,
        })
      }
    })
  }
})