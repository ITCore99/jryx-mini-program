let app=getApp();
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
Page({
  /**
   * 页面的初始数据
   * config 相当配置信息 插件github：https://github.com/kuckboy1994/mp_canvas_drawer
   * imageUrl canvas保存为图片
   * multip 缩放比例
   * avatarUrl 用户头像
   * userInfo 用户信息
   * temporaryVipFlag 判断是不是临时会员 
   * userVip  判断是不是卡会员,
   * qrcode 绘制出的二维码
   */
  data: {
    config: {},
    imageUrl: "",
    multip:1,
    avatarUrl:'',
    userInfo:{},
    temporaryVipFlag:false,
    userVip:[] ,
    qrcode:"",
pic1:"https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/1728016074a664.png",
pic2:"https://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/17290964b9243.png",
    paths:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that=this;
      
      wx.getSystemInfo({
        success: function (res) {
          let multip = res.windowWidth/750 
          that.setData({
            multip,
            userInfo: app.globalData.userInfo,
            userVip: JSON.parse(options.userVip)
          });
          that.isTemporyVip();
        },
      }) ;
    this.getQRCode();
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
    this.getQRCode();
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
  eventDraw() {
    let multip = this.data.multip;
    let paths=this.data.paths; 
    let nickName = this.data.userInfo.nickName;
    let vipDes="普通用户";
    if (this.data.temporaryVipFlag)
    {
      vipDes="优享会员";
      for(let i=0;i<this.data.userVip.length;i++)
      {
        if (this.data.userVip[i])
        {
          vipDes = "尊享会员";
          break;
        }
      }
    }
    this.setData({
      config: {
        width: 650 * multip,
        height: 890 *multip,
        clear: true,
        views: [
          {
            type:'image',
            url: `${paths[0]}`,
            top:0,
            left:0,
            width: 650 * multip,
            height: 890 * multip,
          },
          {
            type: 'image',
            url: `${paths[2]}`,
            top: 39*multip,
            left: 57*multip,
            width: 134*multip,
            height: 134*multip,
          },
          {
            type:'image',
            url: `${paths[1]}`,
            top: 36 * multip,
            left: 54 * multip,
            width: 140 * multip,
            height: 140 * multip,
          },
          {
            type: 'text',
            content:`${nickName}`,
            fontSize: 32*multip,
            color: '#5D5D5D',
            textAlign: 'left',
            top: 65*multip,
            left: 225*multip,
            bolder: true,
          },
          {
            type: 'text',
            content: `${vipDes}`,
            fontSize: 24*multip,
            color: '#B2B2B2',
            textAlign: 'left',
            top: 119*multip,
            left: 227*multip,
          },
          {
            type: 'image',
            url:`${paths[3]}`,
            width: 529*multip,
            height: 529*multip,
            top: 232*multip,
            left: 62*multip,
          },
          {
            type: 'text',
            content: '扫一扫上面的小程序码，享受更多优惠',
            color: '#B2B2B2',
            fontSize: 24*multip,
            top: 804*multip,
            left: 121*multip,
          }
        ]
      }
    })
  },
  /**
   * 获取画出图片的信息
   */
  eventGetImage(event) {
    wx.hideLoading();
    let { errMsg, tempFilePath } = event.detail;
    if (errMsg == "canvasdrawer:ok") {
      this.setData({
        imageUrl: tempFilePath
      });
    } else {
      wx.showToast({
        title: `${errMsg}`,
        icon: 'none',
        duration: 2000,
      })
    }

  },
  /**
   * 保存图片
   */
  eventSave() {
    let that = this;
    wx.showModal({
      title: '',
      content: '保存二维码，到手机相册',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.imageUrl,
            success: (res) => {
              wx.showToast({
                title: '保存图片成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  /**
   *判断是不是临时会员
   */
  isTemporyVip() {
    let that = this;
    util.request(api.TemporyVip).then(res => {
      if (res.errno == 0) {
        that.setData({
          temporaryVipFlag: true
        })
      }
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 获取二维码
   * 
   */
  getQRCode()
  {
    wx.showLoading({
      title: '二维码绘制中',
    });
    let that=this;
    util.request(api.GetQRCode).then(res=>{
      if(res.errno==0)
      {
        that.setData({
          qrcode: res.data
        })
        let newString=res.data.substring(0, 4) + "s" + res.data.substring(4, res.data.length);
        let paths = [that.data.pic1, that.data.pic2, that.data.userInfo.avatarUrl,newString]
        that.getLocalImage(paths).then(res=>{
          wx.hideLoading(); 
          this.setData({
            paths:res
          })
          that.eventDraw();
        })
        
      }else{
       wx.showToast({
         title: `${res.errmsg}`,
         icon:'none'
       })
      }

    }).catch(err=>{
      wx.showToast({
        title: `${err}`,
        icon:'none'
      })
    })
  
  },
  /**
   * 将网络图片转化为本地图片
   */
  getLocalImage(paths)
  {
     return new Promise((resolve, reject)=>{
       let pathsObj={};
       let count=0;
       paths.forEach((path,index)=>{
         wx.getImageInfo({
           src: path,
           success:(res)=>{
             pathsObj[index]=res.path;
             count++;
             if(count==paths.length)
             {
               resolve(pathsObj);
             }
           },
           fail:(err)=>{
             reject(err);
             console.log(err);
             wx.showToast({
               title: `${JSON.stringify(err)}`,
             })
           }
         })
       })    
    }) 
  }
})