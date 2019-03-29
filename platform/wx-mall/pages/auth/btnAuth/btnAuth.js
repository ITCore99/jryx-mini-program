const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
const user=require('../../../services/user.js')

//获取应用实例
const app = getApp()
Page({
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
    },
    onLoad: function (options) {
    },
    /**
     * 用户登录
     */
    bindGetUserInfo: function (e)
     {
      let that =this;
      if (e.detail.userInfo)
      {
        user.loginByWeixin(e.detail).then(res => { /**开始登录***/
          app.globalData.userInfo = res.data.userInfo; /**将用户信息保存到全局*/
          app.globalData.token = res.data.token;
          wx.setStorageSync('userId', res.data.userId);
          wx.showToast({
            title: '登陆成功',
          });
          let pages = getCurrentPages();
          let prevPages = pages[pages.length - 2];
          let flage = true;
          switch (prevPages.route) 
          {
            case "pages/cart/cart":
              flage: false;
              break;
          }
          if(flage)
          {
            wx.navigateBack({
              delta: 1
            })
          }else
          {
            wx.switchTab({
              url: prevPages.route,
            })
          }
        }).catch((err) =>
        {
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
                      app.globalData.userInfo = res.data.userInfo;
                      app.globalData.token = res.data.token;
                    }).catch((err) => {
                      wx.navigateTo({
                        url: '/pages/auth/btnAuth/btnAuth',
                      });
                    });
                  }
                }
              })
            }
          }
        });
      }
    },
    onReady: function () {
        // 页面渲染完成
    },
    onShow: function () {
        // 页面显示
    },
    onHide: function () {
        // 页面隐藏
    },
    onUnload: function () {
        // 页面关闭
    }
})
