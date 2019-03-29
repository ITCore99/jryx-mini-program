var util = require('../../utils/util.js');
var api = require('../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    cruiseEntityList:[], /**小档案 */
    cruiseMacroList:[],
    shipSpe: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(options.id)
    {
      this.setData({
        id:options.id
      })
    }
    this.getLooseInfo();
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
  /**
   * 获取游轮的信息
   * 小图标区间：
   * 舱房设施：value  1000-2000
   * 餐厅饮食：value  2000-3000
   * 娱乐活动：value  3000以上
   */
  getLooseInfo() {
    let that = this;
    util.request(api.LooseInfo, { id: that.data.id }).then(res => {
      if (res.errno == 0) {
         
        wx.setNavigationBarTitle({
          title: `${res.data.cruiseEntityList[0].cruiseName}`,
        });
        let equimentArr = [], cateArr = [], entertainment = [];
        res.data.cruiseMacroList.forEach(item => {
          let url = util.getIconUrl(item.value);
          if (item.value < 2000) {   //舱房设施
            item.url = url;
            equimentArr.push(item);

          } else if (item.value < 3000) {  // 餐厅饮食
            item.url = url;
            cateArr.push(item);
          } else {  //娱乐活动
            item.url = url;
            entertainment.push(item);
          }
          res.data.cruiseEntityList.forEach(item=>{
            let strTime=util.formatTime(new Date(item.firstFlight));
            item.firstFlight = strTime.split(" ")[0];
          })
        })
        that.setData({
          cruiseEntityList: res.data.cruiseEntityList,
          goodsScheduleEntityList: res.data.goodsScheduleEntityList,
          goodsTravleEntityList: res.data.goodsTravleEntityList,
          cruiseMacroList: res.data.cruiseMacroList,
          shipSpe: { equimentArr, cateArr, entertainment }
        })
      } else {
        wx.showToast({
          title: '请求出错!',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '发生错误，请重试',
        icon: 'none'
      })
    })
  },
})