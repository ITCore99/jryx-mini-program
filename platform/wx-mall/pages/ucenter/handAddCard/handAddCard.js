var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     carId:'',
     phone:'',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  cardIdInput(e)
  {
    console.log(e);
    this.setData({
      carId: e.detail.value
    })
  },
  phoneInput(e)
  {
    this.setData({
      phone: e.detail.value
    })
  },
  verifyCard()
  {
    if (this.data.carId.length!=16)
    {
     wx.showToast({
       title: '卡号错误！',
       icon:'none'
     });
    }
    return this.data.carId.length == 16;
  },
  verifyPhone()
  {
    let reg = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
    if(!reg.test(this.data.phone))
    {
      wx.showToast({
        title: '手机号错误格式！',
        icon: 'none'
      })
    }
    return reg.test(this.data.phone);
  },
  handAdd()
  {
    console.log("我执行了")
    let that=this;
    if (this.data.carId&&this.data.phone)
    {
      if (!(that.verifyCard() && that.verifyCard()))
      {
        return;
      }
      util.request(api.TranCard, { code: that.data.carId,phone : that.data.phone}).then(res=>{
        console.log("res",res);
        if(res.errno==0)
        {
           wx.showToast({
             title: `${res.errmsg}`,
             icon:"success"
           });
           setTimeout(()=>{
             wx.navigateTo({
               url: '/pages/ucenter/addCard/addCard'
             });
           },500)
        }else if(res.errno==1)
        {
          wx.showToast({
            title: `${res.errmsg}`,
            icon:'none'
          })
        }
      }).catch(err=>{
         
         wx.showToast({
           title: '发生错误',
           icon:'none'
         })
      })
    }else
    {
      return wx.showToast({
        title: '卡号手机号不能为空',
        icon: 'none'
      })
    } 
  }
})