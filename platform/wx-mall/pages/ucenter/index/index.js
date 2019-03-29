var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts=require('../../../config/commonConsts.js');
var user = require('../../../services/user.js');
var app = getApp();
/**
 * userInfo 用户信息
 * hasMobile
 * userVip 用户办卡等级
 * vipInfo 用户开通会员信息
 * listData 底部列表渲染数据
 * orderList 订单列表渲染数据
 * cardData1,cardData2 会员小图标区
 */
Page({
    data: {
        userInfo: {},
        // hasMobile: '',
        userVip:[],
        vipInfo:"",
        vipState: consts.VIP_STATUS,
        windowHeight:'',
        listData: [
          { icon: "../../../static/icon/mine/icon_qianbao@2x.png", title: "卡包", url:"/pages/ucenter/addCard/addCard"},
          { icon: "../../../static/icon/mine/icon_wodehuiyuan@2x.png", title: "交易明细", url:"/pages/ucenter/ trade /trade"},
          // { icon: "../../../static/icon/mine/icon_shimingrenzheng@2x.png", title: "实名认证",url:"",            backIcon: "../../../static/icon/mine/icon_xiayiye@2x.png" },
          { icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/13551499779046.png", title: "我的收藏", url: '/pages/ucenter/collect/collect' },
          { icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/135556720c9591.png", title: "我的足迹", url: '/pages/ucenter/footprint/footprint' },
          { icon: "../../../static/icon/mine/icon_guanjia@2x.png", title: "商旅管家", url: "/pages/ucenter/steward/steward" },
          { icon: "../../../static/icon/mine/icon_lianxiwomen@2x.png", title: "联系我们", url: '/pages/ucenter/chatUs/chatUS' },
          { icon: "../../../static/icon/mine/icon_shezhi@2x.png", title: "设置", url: '/pages/ucenter/setUp/setUp' },
      ],
      orderList:[
        { name: "旅游", icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181219/130545918ac045.png",id:"2",style: ""},
        { name: "优选", icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181219/13051162732ca.png", id: "1", style: "width:44rpx;heigh:37rpx;"},
        { name: "活动", icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181219/130606815fa733.png",id:"3" },
        { name: "签证", icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181219/130338402fe52d.png", id: "4", style: "width:29rpx;heigh:44rpx;" },
        { name: "订制", icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190102/13065567161862.png", id: "4", style: "width:36rpx;heigh:43rpx;" },
        { name: "机票", icon: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190102/1307377645efe8.png", id: "4", style: "width:44rpx;heigh:43rpx;" },
],
  cardData1:[{
    title: "专属价格", url: "		https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/103607711349a3.png" 
    },
    {
      title: "私人订制", 
      url: "	https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/10365498a02bc.png"
    },
    {
      title: "特价机票", url: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/10373625860bd.png"
    },
    {
      title: "酒店特惠", 
      url: "	https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/10381835e13fa.png"
    }
  ],
      cardData2: [{
        title: "会员日",
        url: "	https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/1039107446286c.png"
      },
      {
        title: "专属管家",
        url: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/1039379182eab3.png"
      },
      {
        title: "快速签证", url: "	https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/104005999435c5.png"
      },
      {
        title: "私密行程",
        url: "	https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190114/104128333749d3.png"
      }
      ]
    },
    onLoad: function (options)
     {
      let that=this;  
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowHeight: res.windowHeight,
          });
        }
      });
    },
    onReady: function () {

    },
    onShow: function ()
     {
      
        let userInfo = wx.getStorageSync('userInfo');
        let token = wx.getStorageSync('token');

        // 页面显示
      if (userInfo && token)
       { 
            
            this.getUserVipInfo();
            app.globalData.userInfo = userInfo;
            app.globalData.token = token;
        }
        this.setData({
            userInfo: app.globalData.userInfo,
        });
    },
    onHide: function () {
        // 页面隐藏

    },
    onUnload: function () {
        // 页面关闭
    },
    /**
     * 用户登录引导
     */
    bindGetUserInfo(e)
     {

      let userInfo = wx.getStorageSync('userInfo');
      let token = wx.getStorageSync('token');
      if (userInfo && token) /**用户已经登录 */
      {
        return;
      }
      /**用户没有登录并且点击登录按钮 */
        if (e.detail.userInfo)  /**点击按钮会将用户信息存在此处 */
        {   
            user.loginByWeixin(e.detail).then(res => { /**开始登录***/
              if (res.data.userInfo.nickName.length > 8) /**限制显示的名字长度为7 */
              {
                res.data.userInfo.nickName = res.data.userInfo.nickName.substring(0,7)+"....";
              }
              this.setData({
                  userInfo: res.data.userInfo
              });
              app.globalData.userInfo = res.data.userInfo; /**将用户信息保存到全局*/
              app.globalData.token = res.data.token;
              this.getUserVipInfo();
            }).catch((err) => {
                console.log(err)
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告通知',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function (res) {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                                    user.loginByWeixin(e.detail).then(res => {
                                        this.setData({
                                            userInfo: res.data.userInfo
                                        });
                                        app.globalData.userInfo = res.data.userInfo;
                                        app.globalData.token = res.data.token;
                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }
                            }
                        })
                    }
                }
            });
        }
    },
    exitLogin: function () {
        wx.showModal({
            title: '',
            confirmColor: '#b4282d',
            content: '退出登录？',
            success: function (res) {
                if (res.confirm) {
                    wx.removeStorageSync('token');
                    wx.removeStorageSync('userInfo');
                    wx.switchTab({
                        url: '/pages/index/index'
                    });
                }
            }
        })
    },
  /**
   * 订单跳转
   */
  jumpOrder:function(e)
  {
    wx.navigateTo({
      url: `/pages/ucenter/order/order?goodsType=${e.currentTarget.dataset.id}`,
    })
  },
  /**
   * 设置跳转
   */
  jump()
  {
    wx.navigateTo({
      url: `/pages/ucenter/generatorQR/generatorQR?userVip=${JSON.stringify(this.data.userVip) }`,
    })
  },
  /**
   * 获取用户的会员卡
   */
  getUserVip()
  {
    let that=this;
    util.request(api.CardList, { activateStatus: consts.CARD_ACTIVE}).then(res=>{
      if(res.code==0)
      { 
        if (res.cardList.length==0)
        {
          return;
        }
        let vipArr = [];
        res.cardList.forEach(item => {
          switch (item.type) {
            case 1:
              vipArr[0] = "1";
              break;
            case 2:
              vipArr[1] = "2";
              break;
            case 3:
              vipArr[2] = "3";
              break;
            case 4:
              vipArr[3] = "4";
              break;  
            default:
              break;
          }
        });
        that.setData({
          userVip: vipArr
        })
      }else
      {
        console.log("用户vip等级获取失败",res);
      }
    })
  },
  /**
   * 获取会员的信息
   */
  getUserVipInfo()
  {
    let that=this;
    util.request(api.Vipinfo).then(res=>{
      if (res.errno==0)
      {
        that.setData({
          vipInfo: res.data.list
        });
        this.getUserVip();
      }else
      {
        wx.showToast({
          title: `${res.errmsg}`,
          icon:"none"
        })
      }
      
    }).catch(err=>{
      console.log("获取用户会员的信息错误",err);
    })
  },
  /**
   * 续费/成为会员
   */
  goBuyOrRenew(e)
  {
    let url = "/pages/ucenter/buyVip/index";
    if (this.data.userVip.length>0)
    {
      url ="/pages/ucenter/addCard/addCard"
    }
    wx.navigateTo({
      url,
    })
  },
})