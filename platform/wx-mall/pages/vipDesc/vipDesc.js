Page({

  /**
   * 页面的初始数据
   */
  data: {
     index:"",
     hightLight:0,
     SinglerWindowHeight:0,
     first:true
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
  /**
   * 滚动触发函数
   */
  bindscroll(e)
  {
    if(this.data.first)
    {
      this.setData({
        SinglerWindowHeight: parseInt(parseInt(e.detail.scrollHeight)/4)-100,
        first:false
      })
    }
    if (e.detail.scrollTop < this.data.SinglerWindowHeight-50) /**50的缓冲区 */
    {
      this.setData({
        hightLight:0
      })
    } else if (e.detail.scrollTop < 2 *this.data.SinglerWindowHeight-50)
    {
      this.setData({
        hightLight: 1
      })
    } else if (e.detail.scrollTop < 3 *this.data.SinglerWindowHeight)
    {
      this.setData({
        hightLight: 2
      })
    }else
    {
      this.setData({
        hightLight: 3
      })
    }
  
  
  }
})