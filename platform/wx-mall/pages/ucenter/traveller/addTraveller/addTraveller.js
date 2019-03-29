Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows: [{ title: "姓名", placeholder: "请输入姓名", name: "username", tips: "必填" }, { title: "电话", placeholder: "请输入手机号", name: "phone", tips: "必填" }, { title: "身份证号", placeholder: "身份证号", name: "cardId", tips: "必填" }, { title: "护照号码", placeholder: "请输入护照号码", name: "passport", tips: "选填" }],
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
  formSubmit(e) {
    console.log("form表单进行提交哦", e);
  }
})