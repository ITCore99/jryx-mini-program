var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    form_info:""
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
 * 预约
 */
  submitForm(e)
  {
    let that=this;
    if (!e.detail.value.name)
    {
       wx.showToast({
         title: '请输入姓名！',
         icon:"none",
       })
       return;
    }
    if (!e.detail.value.phone)
    {
      wx.showToast({
        title: '请输入联系方式！',
        icon: "none",
      })
      return;
    }
    util.request(api.AirOrder, {type : consts.CUSTOMORDER_DEMAND_TYPE_04,name:e.detail.value.name,phone:e.detail.value.phone,remark:"开通会员卡预约"},"POST","application/json").then(res=>{
      if (res.errno==0)
      {
        wx.showToast({
          title: '预约成功，我们客服人员稍后联系你，请保持联系方式的畅通。',
          icon:"none"
        });
        that.setData({
          form_info:""
        })
      }else
      {
        wx.showToast({
          title: `${res.errmsg}`,
          icon:"none"
        })
      }
    }).catch(err=>{
      wx.showToast({
        title: '预约错误',
        icon : 'none',
      })
    })
  }
})