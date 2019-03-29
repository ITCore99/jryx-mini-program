var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var consts=require('../../config/commonConsts.js')
Page({

  /**
   * 页面的初始数据
   */
  /**
   * type: Boolean 控制切換tabbar切換,
   * listData: Array 分店列表数据,
   * noData: boolean 判断是否有数据
   */
  data: {
    type:0,
    listData: [{code: "A0002",name: "同远科技总店"}],
    noData:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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
   * tabbar切換函數
   */
  chageBar(e)
  {
    let type=e.currentTarget.dataset.type;
    if(type=="0")
    {
      this.setData({
        noData:false,
        listData: [{ code: "A0002", name: "同远科技总店" }],
        type,
      })
      this.getData();
    }else{
      this.setData({
        type,
        listData: [],
        noData:true
      })
    }
   
  },
  /**
   * 单项点击事件
   */
  clickItem(e)
  {
   let name=e.currentTarget.dataset.name;
   let value=e.currentTarget.dataset.value;
    if (!name || !value)
    {
        return;
    }
   app.globalData.branchName = name;
   app.globalData.branchToken=value;
   wx.navigateBack({
     delta:1 
   })
  },
  /**
   * 数据获取函数
   */
  getData(method="POST", header ="application/x-www-form-urlencoded",data={})
  {
    let that=this;
    wx.request({
      url: `${api.GetBranch}`,
      method,
      data,
      header:{
        'Content-Type': header,
        'X-Nideshop-Token': wx.getStorageSync('token'),
        'X-Company-Token': `${consts.COMPANY_CODE}`,
      },
      success:(res)=>
      {
        if (res.statusCode == 200)
        {
          if (res.data.errno == 401)
          {
            wx.navigateTo({
              url: '/pages/auth/btnAuth/btnAuth',
            });
          }else
          {
            if(res.data.errno==0)
            {
             
              if (res.data.data.length > 0)
              {
                that.setData({
                  listData: that.data.listData.concat(res.data.data),
                })
              }else{
                that.setData({
                  noData: true
                })
              }
            }else{
               wx.showToast({
                 title: '出现未知错误',
                 icon: 'none'
               })
            }
          }

        }
      },
      fail:()=>{
        wx.showToast({
          title: '数据获取错误，请重试',
          icon: 'none'
        })
      }
    })
  }
})