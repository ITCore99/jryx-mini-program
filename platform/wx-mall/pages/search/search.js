var util = require('../../utils/util.js');
var api = require('../../config/api.js');

var app = getApp()
Page({
  data: {
    keywrod: '',
    searchStatus: false,
    goodsList: [],
    helpKeyword: [],
    historyKeyword: [],
    categoryFilter: false,
    currentSortType: 'default',
    currentSortOrder: '',
    filterCategory: [],
    defaultKeyword: {},
    hotKeyword: [],
    page: 1,
    size: 20,
    currentSortType: 'id',
    currentSortOrder: 'desc',
    categoryId: 0,
    nomore:false,
    lock:false,   //放置用户连续触发两次cofrim按钮
  },
  //事件处理函数
  closeSearch: function () 
  {
    wx.navigateBack()
  },
  /**
   * 清除输入框的内容
   */
  clearKeyword: function ()
  {
    this.setData({
      keyword: '',
      searchStatus: false
    });
  },
  onLoad: function () 
  {
    this.getSearchKeyword();
  },
 /**
  * 获取搜索历史 默认关键字和 热词关键字
  */
  getSearchKeyword() 
  {
    let that = this;
    util.request(api.SearchIndex).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          historyKeyword: res.data.historyKeywordList,
          defaultKeyword: res.data.defaultKeyword,
          hotKeyword: res.data.hotKeywordList
        });
      }
    });
  },
 /**
  * 获取文本框输入事件
  */
  inputChange: function (e) {

    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
    this.getHelpKeyword();
  },
  /**
   * 联想词
   */
  getHelpKeyword: function ()
   {
    let that = this;
    util.request(api.SearchHelper, { keyword: that.data.keyword }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          helpKeyword: res.data
        });
      }
    });
  },
  /**
   * 用户鼠标聚焦
   */
  inputFocus: function () 
  {
    this.setData({
      searchStatus: false,
      goodsList: [],
      nomore:false,
    });
    if (this.data.keyword)
    {
      this.getHelpKeyword();
    }
  },
  /**
   * 清除历史记录
   */
  clearHistory: function () {
    this.setData({
      historyKeyword: []
    })

    util.request(api.SearchClearHistory, {})
      .then(function (res) {
      });
  },
  /**
   * 获取查询的商品列表
   */
  getGoodsList: function () 
  {
    let that = this;
    let flage=arguments[0];
    if (that.data.nomore)
    {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
      return;
    }
    if(!flage)
    {
      that.setData({
        goodsList:[]
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    util.request(api.JryxGoodsList, { keyword: that.data.keyword, page: that.data.page, size: that.data.size, sort: that.data.currentSortType, order: that.data.currentSortOrder, categoryId: that.data.categoryId }).then(function (res) {
      if (res.errno === 0) 
      { 
        wx.hideLoading();
        that.setData({
          searchStatus: true,
          categoryFilter: false,
          goodsList: that.data.goodsList.concat(res.data.goodsList),
          filterCategory: res.data.filterCategory,
          page: ++that.data.page,
          size: that.data.size,
          lock: false
        });
        if (res.data.count<that.data.size)
        {
          console.log("设置里nomore为true")
          wx.showToast({
            title: '已经加载出了全部数据',
            icon: 'none'
          });
          that.setData({
            nomore:true
          })
        }
      }

      //重新获取关键词
      that.getSearchKeyword();
    });
  },
  onKeywordTap: function (event) 
  {
    this.getSearchResult(event.target.dataset.keyword);

  },
  getSearchResult(keyword) 
  {
    this.setData({
      keyword: keyword,
      page: 1,
      categoryId: 0,
      goodsList: []
    });

    this.getGoodsList();
  },
  openSortFilter: function (event) 
  {
    let currentId = event.currentTarget.id;
    switch (currentId) {
      case 'categoryFilter':
        this.setData({
          'categoryFilter': !this.data.categoryFilter,
          'currentSortOrder': 'asc'
        });
        break;
      case 'priceSort':
        let tmpSortOrder = 'asc';
        if (this.data.currentSortOrder == 'asc') {
          tmpSortOrder = 'desc';
        }
        this.setData({
          'currentSortType': 'price',
          'currentSortOrder': tmpSortOrder,
          'categoryFilter': false
        });

        this.getGoodsList();
        break;
      default:
        //综合排序
        this.setData({
          'currentSortType': 'default',
          'currentSortOrder': 'desc',
          'categoryFilter': false
        });
        this.getGoodsList();
    }
  },
  /**
   * 分类触发
   */
  selectCategory: function (event) 
  {
    let currentIndex = event.target.dataset.categoryIndex;
    let filterCategory = this.data.filterCategory;
    let currentCategory = null;
    for (let key in filterCategory) {
      if (key == currentIndex) {
        filterCategory[key].selected = true;
        currentCategory = filterCategory[key];
      } else {
        filterCategory[key].selected = false;
      }
    }
    this.setData({
      'filterCategory': filterCategory,
      'categoryFilter': false,
      categoryId: currentCategory.id,
      page: 1,
      goodsList: []
    });
    this.getGoodsList();
  },
  /***
   * 用户确定
   */
  onKeywordConfirm(event) 
  {
    if(!this.data.lock) //放按钮联系触发两次
    {
      this.setData({
        lock:true
      })
      this.getSearchResult(event.detail.value);
    }
   
    
  },
  /***
   * 上拉刷新
   */
  onReachBottom:function()
 {
    this.getGoodsList(true)   
 }
})