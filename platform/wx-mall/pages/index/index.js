const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');
const consts = require('../../config/commonConsts.js');
//获取应用实例
const app = getApp();
/**
 * newGoods    新品发布
 * hotGoods    热卖商品
 * topics      专题精选
 * brands      品牌制造商
 * banner      轮播图数据
 * channelListOne  首页分类
 * cheapLine      热销路线
 * cheapGoods     优选产品
 * branchSwith  控制分店切换是否显示
 * branchName   分店名称
 * current      轮播图当前
 * handpickGoods  精选产品
 */
Page({
  data: {
    newGoods: [],     
    banner: [],   
    channelListOne: [], //分类
    channelListTwo:[],
    page: 1,
    size: 5,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    cheapLine:[],
    cheapGoods:[],
    handpickGoods:[],
    current: 0, 
    branchName:"",
    branchSwith: consts.MINIPROGRAM_TYPE
  },
  /**
   * 分享函数
   */
  onShareAppMessage: function ()
  {
    return {
      title: '假日优选',
      desc: '假日优选',
      path: `/pages/index/index?${consts.SHARE_ID}=${wx.getStorageSync("userId")}&${consts.BRANCH_CODE}=${consts.CURRENT_BRANCH_CODE}`
    }
  },
  /**
   * 下拉刷新数据的功能
   */
  onPullDownRefresh()
  {
	    var self = this;
 },
 /**
  * 
  * 会员俱乐部轮播图
  */
  handlerChange(e) {
    let current = e.detail.current;
    this.setData({
      current,
    })
  },
 /**
  * 获取数据
  */
  getIndexData: function ()
   {
    let that = this;
    var data = new Object();
    util.request(api.IndexUrlNewGoods).then(function (res) {
      if (res.errno === 0) {
        data.newGoods= res.data.newGoodsList
      that.setData(data);
      }
    });
    /**
     * 轮播图列表
     */
    util.request(api.IndexUrlBanner).then(function (res) {

      if (res.errno === 0) {
        data.banner = res.data.banner
      that.setData(data);
      }
    });
    /**
     * 主页分类
     */
    util.request(api.IndexUrlChannel).then(function (res) {
      if (res.errno === 0) {
        data.channel = res.data.channel;
        let channelOne=[];
        let channelTwo=[];
        for (let i = 0; i < 8;i++)
        {
          if(i<=3)
          {
             channelOne.push(res.data.channel[i]);
          }else
          {
            channelTwo.push(res.data.channel[i]);
          }
        }
         that.setData({
           channelListOne:channelOne,
           channelListTwo: channelTwo
         });
      }
    });
    /**
     * 航线特惠专线
     */
    this.getGoodsList(consts.HOME_CATEGORY_HOT_SALE_ID);//1036016
    /***
     * 优选商品
     */
    this.getGoodsList(consts.HOME_CATEGORY_FAVOR_PRODUCT_ID);

  },
  onLoad: function (options) 
  {
    /***
     * 小程序分享获取分享id
     */
    if (options.shareId) 
    {   
      let shareId =options.shareId;
      app.globalData.shareId = options.shareId || wx.getStorageSync("shareId") || "";
      wx.setStorage({
        key: 'shareId',
        data: options.shareId ? options.shareId : "",
      })
      let url="";
      if (options.flage==consts.PRODUCT_SHARE)
      {
        url=`/pages/goods/goods?id=${options.id}&shareId=${options.shareId}`
      } else if (options.flage==consts.VIP_SHARE)
      {
        url=`/pages/ucenter/buyVip/index?shareId=${options.shareId}`;
      }
      if(url)
      {
        wx.navigateTo({
          url: `${url}`,
        })
      }
    };
    /**
     * 分享获取分店code
     */
    if (options.branchCode)
    {
      app.globalData.branchToken = options.branchCode;
      wx.setStorageSync("branchCode", options.branchCode);
    }
    /**
     * 小程序扫码进入
     */
    if (options.scene)
    {
      let scene = decodeURIComponent(options.scene).split("=");
      app.globalData.shareId = scene[1];
      wx.setStorageSync(scene[0],scene[1]) ;
      
      /**
       * 分店获取
       */
      //{branchCode="123"&shareId="456"}
      // let scene=decodeURIComponent(options.scene).split("&");
      // let sceneShareIdPart = scene[1] && scene[1].split("=");
      // let sceneBranchPart = scene[0] && scene[0].split("=");
      // if (sceneShareIdPart)
      // {
      //      app.globalData.shareId = sceneShareIdPart[1];
      //      wx.setStorageSync(sceneShareIdPart[0], sceneShareIdPart[1]);
      // } 
      // if(sceneBranchPart && sceneBranchPart[1]) //存在branchcode
      // {
      //   app.globalData.branchToken = sceneBranchPart[1];
      //   wx.setStorageSync(sceneBranchPart[0], sceneBranchPart[1]);
      // }
    }
    this.getIndexData();
    this.getBoutiqueList(consts.HOME_CATEGORY_HOT_SALE_ID);
  },
  onReady: function () {
   
  },
  onShow: function () 
  {
    this.setData({
      branchName: app.globalData.branchName
    })
    this.getIndexData();
    this.getBoutiqueList(consts.HOME_CATEGORY_HOT_SALE_ID);
    
  },
  onHide: function () {
    
  },
  onUnload: function () {
    
  },
  /**
   * 特惠专线
   */
  getGoodsList: function (categoryId)
  {
    var that = this;
    let params = { categoryId: categoryId, page: that.data.page, size: that.data.size};
    if (categoryId == consts.HOME_CATEGORY_HOT_SALE_ID)
    {
      params.isHot = consts.BOUTIQUE
    }
    util.request(api.GoodsList, params)
      .then(function (res) {
        if (categoryId == consts.HOME_CATEGORY_HOT_SALE_ID)
        { 
          res.data.goodsList.forEach(item=>{
            item.createNum = parseInt(Math.random() * 100 + 20);
          })
          that.setData({
            cheapLine: res.data.goodsList,
          });
          return;
        } else if (categoryId == consts.HOME_CATEGORY_FAVOR_PRODUCT_ID)
        { 
          res.data.goodsList.forEach(item => {
            item.createNum = parseInt(Math.random() * 100 + 20);
          })
          that.setData({
            cheapGoods:res.data.goodsList,
          });
        }
        
      });
  },
  /**
   * 精品推荐
   */
  getBoutiqueList(categoryId)
  {
    let that=this;
    let params = { categoryId, page: this.data.page, size: this.data.size, isSelected: consts.BOUTIQUE};
    util.request(api.GoodsList, params).then(res=>{
      if(res.errno==0)
      {
        if (res.data.goodsList.length>0)
        {
          that.setData({
            handpickGoods: res.data.goodsList
          })
        }
      }
    }).catch(err=>{
      wx.showToast({
        title: '数据获取异常',
        icon: 'none'
      })
    })
  },
  /**
   * 搜索框跳转
   */
  search:function()
  {
     wx.navigateTo({
       url: '/pages/search/search',
     }) 
  },
  /**
   * 会员点击跳转
   */
  jump:function(e)
  {
    let index=e.currentTarget.dataset.index;
    let url="";
    switch(index)
    {
      case "0":
        url = "/pages/ucenter/vipCardType/vipCardType";
        break;
      case "1":  
        url = "/pages/vipDesc/vipDesc";
        break;
      case "2":
        url = "/pages/ucenter/club/club";
        break;  
      default:
        url ="/pages/ucenter/buyVip/index";
        break;  
    };
    wx.navigateTo({
      url,
    })
  },
  /**
   * 优惠路线的跳转函数
   */
  handlerClick(e)
  {
    wx.navigateTo({
      url:`/pages/goods/goods?id=${e.currentTarget.dataset.id}`,
    });
  },
  /**
   * 切換分店
   */
  changeBranch()
  {
    wx.navigateTo({
      url: '/pages/branch/branch',
    })
  },
})
