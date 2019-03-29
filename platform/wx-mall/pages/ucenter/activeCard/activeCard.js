var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unactiveCardList:[],
    activedCardList:[],
    popupFlag:false,     /***开启确认弹窗 */
    willDumpCardInfo:"", /***将要转储卡的信息 */
    dumpToCard:"",       /***目标卡的信息 */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) 
  {
    this.getUnactiveCardList();
  },
  /**
   * 获取未激活列表
   */
  getUnactiveCardList:function()
  {
    let that=this;
    let userId = wx.getStorageSync("userId");
    util.request(api.CardList, { userId, activateStatus: consts.CARD_NOACTIVE }, "POST").then(res => {
      if (res.code==0)
      {   
          if (res.cardList.length == 0) {
            wx.showToast({
              title: '你没有未激活的卡',
              icon: 'none'
            });
            return;
          }
          res.cardList.forEach((item)=>{
          let str = "";  
          let id = item.code; 
          for (let i = 0; i < id.length; i++)
          {
            if (i == 4 || i == 8 || i == 12)
            {
              str = str + ","
            }
            str = str + id[i];
          }
          item.handlerCarId = str.split(",");  //对卡号进行格式化
          item.handlerCardIdLastLetter = id[id.length - 1];//得到最后一个卡号
          item.handlerCardSpecilId = id.substring(12, 15);//得到倒数第三组卡号
          item.handlerMoneny = item.remainingSum.toString().split(".");
        });
        that.setData({
          unactiveCardList: res.cardList
        })
      }else
      {
        wx.showToast({
          title: `出现错误`,
          icon:'none'
        });
      }
    }).catch(err => {
      wx.showToast({
        title: `出现错误`,
        icon: 'none'
      });
      console.log("获取用户的未激活列表出现错误",err);
    })
  },
  /**
   * 激活卡接口
   */
  activeCard:function(e)
  {
    let that=this;
    let index=e.currentTarget.dataset.index;
    let CardInfo = this.data.unactiveCardList[index];
    this.setData({
      willDumpCardInfo: CardInfo
    })
    let dumpToCard="";
    let temp =app.globalData.activedCardList.forEach((item) =>{
      if (item.type == CardInfo.type){  //有重复的卡 
        dumpToCard=item;
    }});
    if (dumpToCard)  //开始转储 
    { 
      that.setData({
        popupFlag:true,
        dumpToCard,
      })
    } else
    {
      //直接使用激活接口 
      util.request(api.CardActive, { id: CardInfo.id, activateStatus:1},"POST").then            (res=>{
             if(res.code==0)
             {
               wx.showToast({
                 title: `激活成功`,
               });
               setTimeout(() => {
                 wx.navigateBack({
                   url: '/pages/ucenter/addCard/addCard',
                 })
               }, 500)
             }else{
               wx.showToast({
                 title:`激活失败`,
                 icon:'none'
               })
             }
          }).catch(err=>{
            wx.showToast({
              title: `${err}`,
            })
          });
      }
  },
  confrimDump:function()
  {
    this.dump();
  },
  cancelDump:function()
  {
    this.setData({
      popupFlag: false,
    })
  },
  /**
   * 用户转储接口
   */
  dump:function()
  {
    let that=this;
    util.request(api.Dump, { newCardId: this.data.willDumpCardInfo.id, oldCardId: this.data.dumpToCard.id},"POST").then(res=>{
      if (res.errno == 0)
        {
          wx.showModal({
            content: '转储成功',
            success:()=>{
              that.setData({
                popupFlag: false,
              }); 
              wx.navigateBack({
                delta :1,            
                })
            }
          })
        }else if (res.errno==400)
        {
          wx.showModal({
            title: '',
            content: `转储失败!\r\n${res.errmsg}.`,
            showCancel: false,
            success:()=>{
              that.setData({
                popupFlag: false,
              })
            }
          });
      } else if (res.errno == 500)
      {
        wx.showModal({
          title: '',
          content: `转储失败!\r\n${res.errmsg}.`,
          showCancel: false,
          success: () => {
            that.setData({
              popupFlag: false,
            })
          }
        });
      }
      }).catch(res=>{
        wx.showModal({
          title: '',
          content: `转储失败!\r\n${res.errmsg}.`,
          showCancel: false,
          success: () => {
            that.setData({
              popupFlag: false,
            })
          }
        });
      })
  }, 
  AddNewCard:()=>{
     wx.navigateTo({
       url: '/pages/ucenter/handAddCard/handAddCard',
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

  }
})