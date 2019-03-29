var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  /**
   *category String 顶部分类标签;
   *isShow  Boolean 筛选栏是否展开;
   *fliterIconState: Object 顶部的小三角icon状态
   *listData: Object 筛选条件
   *nowBarData：Array 当前筛选数据
   *id 分类id
   */
  data: {
    navList: [],
    currentTab:0,
    goodsList: [],
    id: 0,       
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    pixelRatio:0,      //设备像素比
    windowHeight:0,    //设备的高度
    windowWidth:0,    //设备的宽度
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    category:"",
    isShow:true,
    fliterIconState: { boardCityId: false, cruiseCompanyId: false, startDate: false, days:false},
    params:{},
    times:0,
    listData: {
      boardCityId: [{ name: "全部", value: "" ,checked:true},{ name: "上海", value: 55, checked: false }, { name: "天津", value: 54, checked: false }, { name: "巴黎", value: 253, checked: false }, { name: "布达佩斯", value: 221, checked: false }, { name: "维也纳", value: 230, checked: false}],
      cruiseCompanyId: [{ name: "全部", value: "", checked: true },{ name: "维京邮轮", value: 167, checked: false }, { name: "歌诗达邮轮", value: 45, checked: false }, { name: "地中海邮轮", checked: false }, { name: "皇家加勒比邮轮", value: 44, checked: false }],
      startDate: [{ name: "全部", value: "", checked: true },{ name: "最近1个月", value: 1, checked: false }, { name: "最近2个月", value: 2, checked: false }, { name: "最近3个月", value: 3, checked: false, checked: false }, { name: "3个月以上", value: 4, checked: false}],
      days: [{ name: "全部", value: "", checked: true },{ name: "1到5天", value: 1, checked: false }, { name: "6到10天", value: 2, checked: false }, { name: "11到20天", value: 3, checked: false }, { name: "21天以上", value: 4, checked: false}]
    },
    nowBarData:[]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    } 
    wx.getSystemInfo({
      success: function (res) 
      {
        that.setData({
          scrollHeight: res.windowHeight,
          windowWidth:res.windowWidth,
          windowHeight: res.windowHeight,
          pixelRatio:res.pixelRatio
        });
      }
    });
     this.getGoodsList({flage:0});
  },
  onReady: function ()
  {
    let query=wx.createSelectorQuery();
    query.select("#fliterTab").boundingClientRect(res=>{
     this.setData({
       scrollTop: res.height,
     })
    }).exec()

  },
  onShow: function () {
   
  },
  onHide: function () {
    
  },
  /*
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    this.getGoodsList({flage:1})
  },

  getGoodsList: function ({flage})
  { 
    var that = this;
    if (this.data.nomore)
    {
      return;
    }
    wx.showLoading({
      title: '加载中',
    })
    if (!flage)
    {
      that.setData({
        goodsList:[]
      }) 
    }
    let params = { categoryId: that.data.id, page: that.data.page, size: that.data.size};
    let requestParams = this.data.params;
    if (Object.getOwnPropertyNames(requestParams).length)
    {
      for (let key in requestParams) 
      {
        if (requestParams.hasOwnProperty(key))
        {
          if (requestParams[key].value)
          {
            params[key] = requestParams[key].value;
          }
        }
      }
    }
    util.request(api.JryxGoodsList, params)
      .then(function (res) {
        wx.hideLoading();
        if (res.data.goodsList.length<that.data.size)
        {
          if (that.data.page == 1 && res.data.goodsList.length==0)
          {  
             wx.showToast({
               title: '没有符合条件的结果',
               icon:'none'
             });
             return;
          }else{
            that.setData({
              nomore:true,
            })
            wx.showToast({
              title: '这是全部数据',
              icon: 'none',
              duration:1000,  
            })
          }
        }
        that.setData({
          goodsList: that.data.goodsList.concat(res.data.goodsList),      
          page:++that.data.page,
          totalPages: res.data.totalPages,
          times:++that.data.times
        });
       
        if (!flage && times)
        {
          wx.showToast({
            
            title: `共${res.data.count}个产品`,
            icon:'none'
          })
        }
      }).catch(err=>{
        wx.hideLoading();
      });
  },
  /**
   * 顶部筛选
   */
  fliterHander(event)
  {
    let category=event.currentTarget.dataset.category;
    let listData = this.data.listData;
    this.setData({
      category,
      isShow:false,
      nowBarData: listData[category]
    }) 
    this.changeTabIcon(category);
  },
  /**
   * 选中函数
   */
  selectedHandler(event)
  {
    let param = event.currentTarget.dataset.params;
    let index = event.currentTarget.dataset.index;
    let value = event.currentTarget.dataset.value;
    let name=event.currentTarget.dataset.name.substring(0,5);
    let params=this.data.params;
    let listData = this.data.listData;
    listData[param].forEach(item=>{
      item.checked=false;
    })
    listData[param][index].checked=true;
    params[param]={
      param,
      name,
      value,
    }
    this.setData({
      isShow: true,
      params,
      page:1,
      size:10,
      listData,
      nomore:false
    });
    this.changeTabIcon();
    this.getGoodsList({flage:0});
  },
  /**
   * 顶部三角图标重置
   */
  changeTabIcon(temp)
  {
    let fliterIconState=this.data.fliterIconState;
    for (let key in fliterIconState)
    {
      if(fliterIconState.hasOwnProperty(key))
      {
        fliterIconState[key]=false;
      }
    }
    if (temp) 
    {
      fliterIconState[temp]= true;
    }
    this.setData({
      fliterIconState
    })
  },
  /**
   * 搜索
   */
  search: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  }
})