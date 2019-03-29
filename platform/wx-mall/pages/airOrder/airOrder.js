var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var consts = require('../../config/commonConsts.js');
Page({

  data: {
    startTimeF:"",
    endTime:"",
    radios: [{ title: "经济舱", imgUrl: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181226/162103650518aa.png", checkedUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181227/101214793c0635.png", checked: true }, { title: "公务舱/头等舱", imgUrl: "https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181226/162103650518aa.png", checkedUrl: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181227/101214793c0635.png", checked: false }],
    counters: [{ title: "成人", num: 0, name: "man" }, { title: "儿童", num: 0, name: "child" }    ],
    params: {},
    fromPlace:"",
    toPlace:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   console.log(util.formatTime(new Date()));
   this.setData({
     startTimeF: util.formatTime(new Date()).split(" ")[0],
     endTime: util.formatTime(new Date()).split(" ")[0],
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
  /**
   * form表单点击事件
   */
  bindsubmit(e) {
    let params = { ...e.detail.value, type: consts.CUSTOMORDER_DEMAND_TYPE_03};
    this.data.radios.forEach(item=>{
      if (item.checked)
      {
        params.cabinType = item.title;
      }
    });
    this.data.counters.forEach(item=>{
      params[item.name]=item.num;
    })
    console.log("处理过后的数据",params)
    console.log("params", this.data.params);  
    let that=this;
    if (!(params.startPlace && params.endPlace))
    {
       wx.showToast({
         title:'请填写出发地，目的地！',
         icon:"none"
       });
       return;
    }
    if (!(params.name && params.phone))
    {
      wx.showToast({
        title: '请填写联系，手机号！',
        icon: "none"
      });
      return;
    }
    let PhoneExg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!PhoneExg.test(params.phone))
    {
      wx.showToast({
        title:'手机号错了哦',
        icon:"none"
      });
      return;
    }
    util.request(api.AirOrder, params,"POST","application/json").then(res=>{
      console.log(res);
      if (res.errno==0)
      {
        wx.showModal({
          content: '订制成功!',
          cancelText:'残忍拒绝',
          confirmText:'欣然前往',
          success:(res)=>{
            if(res.confirm)
            {
              wx.showToast({
                title: '美丽的客服小姐姐马上联系你哦！',
                icon:"none"
              })
            }else if(res.cancel)
            {
              console.log("我执行了")
              that.onLoad();
            }
          }
        })
      }else 
      {
          wx.showToast({
            title: '出错了，请重试！',
            icon:none,
          })
      }
    }).catch(err=>{
      console.log(err);
      wx.showToast({
        title: `${err}`,
        icon:none,
      })
    })
  },
  /**单选框点击事件 */
  radioHandClick(e) {
    let index = e.currentTarget.dataset.index;
    console.log(e);
    let radios = this.data.radios;
    this.data.radios.forEach(item =>item.checked = false);
    radios[index].checked = !radios.checked;
    this.setData({
      radios,
    })
  },
  /**计数器点击事件 */
  counterClick(e) {

    let index = e.currentTarget.dataset.index;
    let target = e.currentTarget.dataset.target;
    console.log("我执行了", index, target);
    let counters = this.data.counters;
    if (index == 0) {
      counters[target].num = --counters[target].num;
    } else if (index == 1) {
      counters[target].num = ++counters[target].num;
    }
    this.setData({
      counters
    })
  },
  startTimeChange(e)
  {
    this.setData({
      startTimeF: e.detail.value
    })
  },
  endTimeChange(e)
  {
    this.setData({
      endTime: e.detail.value
    })
  },
  /**
   * 交换地点
   *
   */
  handlerExchage()
  {
      this.setData({
        fromPlace:this.data.toPlace,
        toPlace:this.data.fromPlace,
      })
  },
  /**
   * 
   */
  getFromPlace(e)
  {
    console.log("出发地", e.currentTarget.dataset.index);

    if(e.currentTarget.dataset.index=="0")
    {
       this.setData({
         fromPlace:e.detail.value
       })
    } else if (e.currentTarget.dataset.index == "1"){
      this.setData({
        toPlace:e.detail.value
      })
    }
  }

})