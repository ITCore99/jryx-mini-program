var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp()

Page({
    data: {
        mobile: '',
        userInfo: {
            avatarUrl: '',
            nickName: ''
        },
        disableGetMobileCode: false,
        disableSubmitMobileCode: true,
        getCodeButtonText: '获取验证码'
    },

    onShow: function () {
    },

    onLoad: function () {
        var that = this
        that.setData({userInfo: app.globalData.userInfo})

        if (app.globalData.token) {
        } else {
            var token = wx.getStorageSync('userToken')
            if (token) {
                app.globalData.token = token
            }
        }

    },
    /***
     * 检测手机号
     */
    bindCheckMobile: function (mobile) {
        if (!mobile) {
            wx.showModal({
                title: '错误',
                content: '请输入手机号码'
            });
            return false
        }
        if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
            wx.showModal({
                title: '错误',
                content: '手机号格式不正确，仅支持国内手机号码'
            });
            return false
        }
        return true
    },
   /**
    * 
    */
    bindGetPassCode: function (e) {
        var that = this
        that.setData({disableGetMobileCode: true})
    },
     /**
      * 获取手机号
      */

    bindInputMobile: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },
    /**
     * 获取验证码
     */
    countDownPassCode: function () {
        if (!this.bindCheckMobile(this.data.mobile)) {
            return
        }
        util.request(api.SmsCode, {phone: this.data.mobile}, 'POST', 'application/json')
            .then(function (res) {
                if (res.errno == 0) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 1000
                    })
                    var pages = getCurrentPages()
                    var i = 60;
                    var intervalId = setInterval(function () {
                        i--
                        if (i <= 0) {
                            pages[pages.length - 1].setData({
                                disableGetMobileCode: false,
                                disableSubmitMobileCode: false,
                                getCodeButtonText: '获取验证码'
                            })
                            clearInterval(intervalId)
                        } else {
                            pages[pages.length - 1].setData({
                                getCodeButtonText: i,
                                disableGetMobileCode: true,
                                disableSubmitMobileCode: false
                            })
                        }
                    }, 1000);
                } else {
                    wx.showToast({
                        title: '发送失败',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });

    },

    bindLoginMobilecode: function (e) {
      console.log("我执行了")
        var mobile = this.data.mobile;
        console.log("电话号码是：",mobile);
        console.log("电话号码校验结果", this.bindCheckMobile(mobile))
        if (!this.bindCheckMobile(mobile)) {

            return
        }
        console.log("验证码", e.detail.value.code)
        if (!(e.detail.value.code && e.detail.value.code.length === 6)) {
            return
        }
        let code = e.detail.value.code;
        wx.showToast({
            title: '操作中...',
            icon: 'loading',
            duration: 5000
        })
      util.request(api.BindMobile, { mobile_code: code, mobile: mobile},"POST","application/json")
            .then(function (res) {
              console.log("返回回来的数据", res);
              if (res.errno == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '操作成功',
                        showCancel: false,
                        success:function(){
                          wx.switchTab({
                            url: '/pages/ucenter/index/index'
                          });   
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '验证码错误',
                        showCancel: false
                    })
                }
            }).catch(err=>{
              console.log("绑定手机错误",err);
            })
    }
})