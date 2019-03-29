var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data:{
    rows: [{ title: "绑定手机号", tips: "未绑定" }, { title: "支付密码", tips: "" }, {  title: "常用旅客", tips: "" }, { title: "地址管理", tips: "" }],
    flage:false,
  },
  onLoad: function (options) {
      
  },
  onReady: function () {

  },
  onShow: function () {
   this.judgeBindMobile();
  },
  
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
  /**
  * 判断用户是否绑定手机号
  */
  judgeBindMobile() {
    let that = this;
    util.request(api.BindPhone, {}, "POST", "application/json").then(res => {
      if (res.errno == 0) {
        let rows = that.data.rows;
        rows[0].tips = "已绑定"
        that.setData({
          rows,
          flage:true,
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '获取用户是否绑定手机号错误',
        icon: 'none',
      })
    })
  }, 
  /**
   *用户绑定
   */
  handlerBind(e)
  {
    let index=e.currentTarget.dataset.index;
    if(index==0)
    {
      if (this.data.flage) {
        // wx.showModal({
        //   title: '',
        //   content: '前去修改',
        // })
      } else {
        wx.showModal({
          content: '去绑定手机号',
          success: (res => {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/auth/mobile/mobile',
              })
            }
          })
        })
      }
    }else
    {
      let url="";
      switch(index)
      {
        case 2:
          url ="/pages/ucenter/traveller/travellerList/travellerList";
          break;
        case 3:
          url ="/pages/shopping/address/address"
          break
        default:
          url="";
          break;  
      }
      wx.navigateTo({
        url,
      })
    }
     
  }
})