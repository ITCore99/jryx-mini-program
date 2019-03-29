var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    page: 1,
    size: 10,
    loadmoreText: '正在加载更多数据',
    nomoreText: '全部加载完成',
    nomore: false,
    totalPages: 1,
    goodsType:'',
    index: "",
    left: 30
  },
  onLoad:function(options){
    this.setData({
      goodsType: options.goodsType,
    }) 
  },
  
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () 
  {
    this.getOrderList()
  },
  getOrderList()
  {
    let that = this;
    if (that.data.totalPages <= that.data.page - 1) {
      that.setData({
        nomore: true
      })
      retrun;
    }
    util.request(api.OrderList, {page: that.data.page, size: that.data.size,goodsType:that.data.goodsType}).then(function (res) {
      if (res.errno === 0)
      {
        if (res.data.data.length==0)
        {
          wx.showToast({
            title : '已经是全部数据了',
            icon : 'none'

          })
          that.setData({
            nomore: true
          });
          return;
        }
        if(that.data.goodsType==2)
        {
            res.data.data.forEach(item=>{
            let text = "";
            switch (item.order_status) {
              case 201:
                text = "待出行";
                break;
              case 300:
                text = "已出行";
                break;
              default:
                text = item.order_status_text;
                break;
            }
            item.order_status_text = text;
          })
        }
        that.setData({
          orderList: that.data.orderList.concat(res.data.data),
          page: res.data.currentPage + 1,
          totalPages: res.data.totalPages
        });
        wx.hideLoading();
      }
    });
  },
  /**
   * 重新付款接口
   */
  payOrder(event){
      let that = this;
      let orderIndex = event.currentTarget.dataset.orderIndex;
      let order = that.data.orderList[orderIndex];
      console.log("被选中的order",order);
      wx.redirectTo({
        url: `/pages/pay/pay?orderId=${order.id}&actualPrice=${order.actual_price}&goodsType=${order.goods_type}`,
      })
  },
  onReady:function()
  {
    
  },
  onShow:function()
  {
    this.getOrderList();
  },
  onHide:function(){
  
  },
  onUnload:function(){
  },
  /**
   * tabBar点击滑动
   */
  tabHandClick(e) {
    let index = e.currentTarget.dataset.index;
    let left = index * 150 + 30
    this.setData({
      index,
      left,
    })
  }
})