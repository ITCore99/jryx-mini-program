var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts=require('../../../config/commonConsts.js')
const pay = require('../../../services/pay.js');/**支付相关的服务 */
var app = getApp();
Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},   //地址检测
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0, //优惠券id
    isBuy: false,
    couponDesc: '',
    couponCode: '',
    buyType: '',
    popupFlag:false, /**控制弹窗 */
    cardList:[],/**会员卡列表 */
    vipFlage:false,/**会员标识符 */
    isProuduct:false,/***旅游产品标识符 */
  },
  onLoad: function (options) {

    if (options.isBuy!=null) {
      this.setData({
        isBuy:options.isBuy
      })
    }
    if (options.goodsType!=null);
    {
      let data = { goodsType: options.goodsType}
      if (options.goodsType == consts.ORDER_GOODS_TYPE_01)
      {
        data.isProuduct=true;
      }
      this.setData(data)
    }
    if (options.vipFlage!=null)
    {
       this.setData({
         vipFlage:options.vipFlage
       })
    }
    this.data.buyType = this.data.isBuy?'buy':'cart'
    //每次重新加载界面，清空数据
    app.globalData.userCoupon = 'NO_USE_COUPON'
    app.globalData.courseCouponCode = {}
  },
  /**
   * 订单请求函数
   */
  getCheckoutInfo: function () {
    let that = this;
    var url = api.CartCheckout
    let buyType = this.data.isBuy ? 'buy' : 'cart'  /**下单确认信息**/
    util.request(url, { addressId: that.data.addressId, couponId: that.data.couponId, type: buyType }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon ? res.data.checkedCoupon : "",
          couponList: res.data.couponList ? res.data.couponList : "",
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
        //设置默认收获地址
        if (that.data.checkedAddress.id)
        {
            let addressId = that.data.checkedAddress.id;
            if (addressId)
            {
                that.setData({ addressId: addressId });
            }
            var address = wx.getStorageSync('addressId');
          if (address.id)
           {
              that.setData({
                addressId: address.id,
                checkedAddress: address
              });
            }
        }else{
            wx.showModal({
                title: '',
                content: '请添加默认收货地址!',
                success: function (res) {
                    if (res.confirm) {
                        that.selectAddress();
                    }
                }
            })
        }
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  /**
   * 添加地址函数
   */
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    this.getCouponData()

    wx.showLoading({
      title: '加载中...',
    })

    this.getCheckoutInfo();
    
    try
     {
      var addressId = wx.getStorageSync('addressId');
      if (!addressId==null) {
        this.setData({
          'addressId': addressId.id,
          checkedAddress: addressId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 获取优惠券
   */
  getCouponData: function () {
    if (app.globalData.userCoupon == 'USE_COUPON') {
      this.setData({
        couponDesc: app.globalData.courseCouponCode.name,
        couponId: app.globalData.courseCouponCode.user_coupon_id,
      })
    } else if (app.globalData.userCoupon == 'NO_USE_COUPON') {
      this.setData({
        couponDesc: "不使用优惠券",
        couponId: '',
      })
    }
  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  /**
   * 选择可用优惠券
   */
  tapCoupon: function () {
    let that = this
  
      wx.navigateTo({
        url: '../selCoupon/selCoupon?buyType=' + that.data.buyType,
      })
  },
  /**
   * 进行提交订单
   */
  submitOrder: function () {  
    let checkedCard="";
    if (this.data.vipFlage === "true")
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
    //当为旅游产品是才校验地址
    if(this.data.isProuduct)
    {
      if (this.data.addressId <= 0) { 
        util.showErrorToast('请选择收货地址');
        return false;
      }    
    }
    let params = { addressId: this.data.addressId, couponId: this.data.couponId, type: this.data.buyType, goodsType: this.data.goodsType};
    if(!app.globalData.shareId)
    {
      params.shareId = app.globalData.shareId;
    }
    util.request(api.OrderSubmit, params , 'POST', 'application/json').then(res => {
      if (res.errno === 0)
      {
        const orderId = res.data.orderInfo.id; /**订单ID*/   
        if (this.data.vipFlage === "true")
        {
          pay.payOrder(parseInt(orderId), checkedCard[0].id).then(res => {
            wx.redirectTo({
              url: `/pages/payResult/payResult?goodsType=${this.data.goodsType}&status=1&orderId=${orderId}`
            });
          }).catch(res => {
            wx.redirectTo({
              url: `/pages/payResult/payResult?goodsType=${this.data.goodsType}&status=0&orderId=${orderId}`
            });
          });
        }else
        {
          wx.showModal({
            content: '请选择支付方式',
            confirmText:'卡支付',
            cancelText:'微信支付',
            success:(res)=>{
              if(res.confirm)
              {
                wx.navigateTo({
                  url: '/pages/ucenter/vipCardType/vipCardType',
                })
              }else if(res.cancel)
              {
                pay.wxPayOrder(parseInt(orderId)).then(res => {
                  util.request(api.OrderQuery,{ orderId}).then(res=>{
                    wx.redirectTo({
                      url: `/pages/payResult/payResult?goodsType=${this.data.goodsType}&status=1&orderId=${orderId}`
                    });
                    
                  })
                }).catch(res => {
                  wx.redirectTo({
                    url: `/pages/payResult/payResult?goodsType=${this.data.goodsType}&status=0&orderId=${orderId}`
                  });
                });
              }
            } 
          });
        } 
      } else {
        util.showErrorToast('下单失败');
      }
    });
  },
  /**
   * 获取卡id
   */
  getCardID:function(e)
  { 
    let index = e.currentTarget.dataset.index;
    let cardList = this.data.cardList;
    cardList[index].checked = !cardList[index].checked;
    this.setData({
      cardList
    });
    this.clearRadio(index);
  
  },
  /**
   * 取消mask
   */
  cancelPay:function()
  {
    this.setData({
      popupFlag: false
    });
  },
  temp:function()
  {
    if(this.data.vipFlage==="true")
    {
      this.setData({
        popupFlag: true
      });
      this.getCardList();

    }else
    {
      this.submitOrder();
    }
   
  },
  /**
   * 获取用户卡的信息
   */
  getCardList: function () 
  {
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
        res.cardList.forEach(item=>{
          item.checked=false;
          if (item.remainingSum < that.data.actualPrice)
          {
            item.lack=true;
          }else
          {
            item.lack=false
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
   * 请空单选框
   */
  clearRadio(ind)
  {
    let cardList = this.data.cardList;
    cardList.forEach((item,index)=>{
      if (ind !=index)
      {
        item.checked=false;
      }
    });
    this.setData({
      cardList,
    })
  }
})