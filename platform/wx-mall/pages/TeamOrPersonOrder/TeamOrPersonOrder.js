var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var consts = require('../../config/commonConsts.js');
Page({
  data: {
    personShow: true,
    teamShow: false,
    startTimeF: "选择出发时间",
    endTimeF:"选择结束时间",
    counter:[{title:"成人",name:"man"},{title:"儿童",name:"child"}],
    params:{},
    startTime:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      startTime: util.formatTime(new Date()).split(" ")[0],
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
  handlerClick(e) {
    let index = e.currentTarget.dataset.index;
    if (index == 0) {
      this.setData({
        teamShow: false,
        personShow: true,
      })
    } else if (index == 1) {
      this.setData({
        personShow: false,
        teamShow: true
      })
    }

  },
  /**表单提交函数 */
  formSubmit(e)
  {
    let that=this;
    let params={...e.detail.value,...this.data.params};
    if (this.data.personShow)
    {
      params.type = consts.CUSTOMORDER_DEMAND_TYPE_01;
    }else if(this.data.teamShow)
    {
      params.type = consts.CUSTOMORDER_DEMAND_TYPE_02;
    }
    if (!(params.startPlace && params.endPlace)) {
      wx.showToast({
        title: '请填写出发地，目的地！',
        icon: "none"
      });
      return;
    }
    if (!(params.name && params.phone)) {
      wx.showToast({
        title: '请填写联系，手机号！',
        icon: "none"
      });
      return;
    }
    let PhoneExg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if (!PhoneExg.test(params.phone)) {
      wx.showToast({
        title: '手机号错了哦',
        icon: "none",
      });
      return;
    }
    util.request(api.AirOrder,params,"POST","application/json").then(res=>{
      if(res.errno==0)
      {
        wx.showModal({
          content: '信息已提交，请保持点电话的畅通，稍后我们将会与你联系！',
          confirmText: '确定',
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack({
                delat:1,
              })
            } else if (res.cancel) {
              wx.navigateBack({
                delat: 1,
              })
            }
          }
        })
      }else
      {
        wx.showToast({
          title: '出错了，请重试！',
          icon: none,
        })
      }
    }).catch(err=>{
      wx.showToast({
        title: `${err}`,
        icon: none,
      })
    })
  },
  /**DatePicker发生改变*/
  bindDateChange(e)
  {
    this.setData({
      startTimeF: e.detail.value
    })
  },
  bindDateChangeEnd(e)
  {
    this.setData({
      endTimeF: e.detail.value
    })
  }
})