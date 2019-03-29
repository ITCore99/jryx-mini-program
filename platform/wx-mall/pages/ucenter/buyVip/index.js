var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
var pay = require('../../../services/pay.js');
var app=getApp();
Page({
  /**
   * 页面的初始数据
   * 
   */
  data: {
    userInfo:{},
    vipInfo:"",
    vipState: consts.VIP_STATUS,
    privilegesOne: [
      {
        title: "专属价格",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/1629381398f49e.png"
      },
      {
        title: "私人订制",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/1630131280b3d3.png"
      },
      {
        title: "特价机票",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/163037488db9d5.png"
      },
      { title: "酒店特惠", imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/163104556401ee.png" },
    ],
    privilegesTwo: [
      {
        title: "会员日",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/1632159095e7fc.png"
      },
      {
        title: "专属管家",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/163249214a3841.png"
      },
      {
        title: "快速签证",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/16331524f1e0a.png"
      },
      {
        title: "私密行程",
        imgUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190111/1634388335d94.png"
      },
    ],
    vipExplains: [
      {
        title: "关于会员有效期",
        content: "成为优享会员需要支付200元会员费，支付成功后次日起算，一年有效期为365天。"
      },
      {
        title: "关于权益",
        content: "优享会员资格一人付费全家使用，均可享受假日优选旗下旅游产品会员价、飞机票优惠价、酒店特惠价、快速签证以及专属商旅管家私人定制私密行程服务等。"
      },
      {
        title: "关于续费",
        content: "优享会员资格一人付费全家使用，均可享受假日优选旗下旅游产品会员价、飞机票优惠价、酒店特惠价、快速签证以及专属商旅管家私人定制私密行程服务等。"
      },
      {
        title: "关于退款",
        content: "优享会员资格购买后不支持退款。"
      },
    ],
    maskFlage:false,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () 
  {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    // 页面显示
    if (userInfo && token) {
      this.getUserVipInfo();
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },
  /**
   * 去看vip
   */
  GoVIP()
  {
    this.setData({
      maskFlage:!this.data.maskFlage
    });
    wx.navigateTo({
      url: '/pages/ucenter/vipCardType/vipCardType',
    })
  },
  /**
   * 取消mask
   */
  cancelMask()
  {
    this.setData({
      maskFlage: !this.data.maskFlage
    });
  },
  /**
   * 获取微信支付的订单
   */
  getOrder()
  {
    let that=this;
    this.setData({
      maskFlage: !this.data.maskFlage
    });
    let shareId = app.globalData.shareId  || wx.getStorageSync("shareId") || "";
    let params = { price: consts.DREDGE_VIP_FEE}
    if (that.data.vipInfo.id)
    {
      params.vipId = that.data.vipInfo.id;
    };
    if (shareId) 
    {
      params.shareId = shareId;
    };
    util.request(api.VipPAyOrder, params ).then(res=>{
      if(res.errno==0)
      {
        let orderId = res.orderId;
        pay.wxPayOrder(orderId).then(res=>{
          util.request(api.OrderQuery, { orderId }).then(res => { /**发起支付成功的回调 */      that.getUserVipInfo();
          })
        })
      }else
      {
        wx.showToast({
          title: `${res.errmsg}`,
          icon:'none'
        })
      }
    }).then(err=>{
      console.log("成为会员失败",err);
    })
  },
  /**
   * 获取会员的信息
   */
  getUserVipInfo() {
    let that=this;
    util.request(api.Vipinfo).then(res => {
      if (res.errno == 0) {
         let strEffTime=util.formatTime(new Date(res.data.list.effectDate));
        res.data.list.effectDate = strEffTime;
          that.setData({
            vipInfo:res.data.list
          })
      } else {
        wx.showToast({
          title: `${res.errmsg}`,
          icon:'none'
        })
      }

    }).catch(err => {
      console.log("获取用户会员的信息错误", err);
    })
  },
  /**
   * 查看协议
   */
  lookAgreement()
  {
    wx.navigateTo({
      url: '/pages/ucenter/agreement/agreement',
    })
  },
  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title: "成为会员，享8大特权",
imageUrl:"http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190116/0953597685393.jpg",
      path: `/pages/index/index?${consts.SHARE_ID}=${wx.getStorageSync("userId")}&${FLAGE}=${consts.VIP_SHARE}&branchCode=${consts.CURRENT_BRANCH_CODE}`
    }
  },

})