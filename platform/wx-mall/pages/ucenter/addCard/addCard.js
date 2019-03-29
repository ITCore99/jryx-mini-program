var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
var app=getApp();
Page({
  data: 
  {
    activedCardList:[], //已激活卡的列表
  },
  onLoad: function (options) 
  {    
 
  },
  getCardList: function()
  { 
    let that=this;
    let userId = wx.getStorageSync("userId");
    util.request(api.CardList, { userId, activateStatus: consts.CARD_ACTIVE},"POST").then(res=>{
      if(res.code==0)
      {
        if (res.cardList.length==0)
        {
          return wx.showToast({
              title: '你还没已激活的卡',
              icon: 'none'
            });
            
        }
        res.cardList.forEach((item) => {
          let str = "";
          let id = item.code;
          for (let i = 0; i < id.length; i++) {
            if (i == 4 || i == 8 || i == 12) {
              str = str + ","
            }
            str = str + id[i];
          }
          item.handlerCarId = str.split(",");  //对卡号进行格式化
          item.handlerCardIdLastLetter = id[id.length - 1];//得到最后一个卡号
          item.handlerCardSpecilId = id.substring(12, 15);//得到倒数第三组卡号
          item.handlerMoneny = item.remainingSum.toString().split(".");
        });
        app.globalData.activedCardList = res.cardList;
        that.setData({
          activedCardList: res.cardList
        });
      }else
      {
        wx.showToast({
          title: '出现错误',
          icon: 'none'
        });
      }
    }).catch(err=>{
      wx.showToast({
        title: '出现错误',
        icon:'none'
      });
    });
  },
  /**
   * 判断是否绑定手机号
   */ 
  judgeBindMobile()
  {
    let that = this;
    util.request(api.BindPhone,{}, "POST", "application/json").then(res => {
      if (res.errno == 0) 
      {
        this.getCardList();

      } else if (res.errno = 1) 
      {
        wx.showModal({
          content: '你还没有绑定手机号,前去绑定',
          success: function (res) {
            if (res.cancel) {
              wx.switchTab({
                url: '/pages/ucenter/index/index',
              })
            } else {
              wx.navigateTo({
                url: '/pages/auth/mobile/mobile',
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '出现错误',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: `出现异常`,
        icon:'none'

      })
    })
  },
  AddNewCard:()=>{
    wx.navigateTo({
       url: '/pages/ucenter/activeCard/activeCard',
     })
  },
  goRecharge(e)
  {
    
    let index=e.currentTarget.dataset.index;
    let cardInfo=this.data.activedCardList[index];
    app.globalData.rechargeCard = cardInfo;
    wx.navigateTo({
      url: "/pages/ucenter/recharge/recharge",
    })
  },
  onReady: function () {

  },

  onShow: function () {
    this.judgeBindMobile();
  },

  onHide: function () {

  },
  onUnload: function () {

  },

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

})