var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var consts=require('../../config/commonConsts.js')
var app = getApp();
/**
 * cartGoods 购物车商品
 * totalMoney 计算总钱数
 * selectedAllStatus 判断是否是全选状态
 * isEditCart  判断是否是编辑状态
 * vipFlage   会员标识符
 */
Page({
  data: {
    cartGoods: [],
    cartTotal: {    
      "goodsCount": 0,
      "goodsAmount": 0.00,
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    totalMoney:0,          
    selectedAllStatus: false,
    isEditCart: false,   
    checkedAllStatus:false, 
    editCartList: [],
    vipFlage: false,
  },
  onLoad: function (options) {
    

  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    
    this.judgeVip();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  /**
   * 获取购物车列表
   */
  getCartList: function () {
    let that = this;
    util.request(api.CartList).then(function (res) {
      if (res.errno === 0) {
        res.data.cartList.forEach(item=>{
          item.inventory=true;
        });
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  /**
   * 判断是否全选
   */
  isCheckedAll: function () {
    
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  /**
   * 购物车每一项的点击单选框事件
   */
  checkedItem: function (event) {
    let itemIndex = event.currentTarget.dataset.itemIndex;
    let that = this;
    if (!this.data.isEditCart)  /***改变选中，通过这个来判断实现编辑状态是不发送更改请求**/
     {
      util.request(api.CartChecked, { productIds: that.data.cartGoods[itemIndex].product_id, isChecked: that.data.cartGoods[itemIndex].checked ? 0 : 1 },'POST', 'application/json').then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else 
    {
      //编辑状态时
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex){
          element.checked = !element.checked;
        }
        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }
  },
  /**
   * 获取被选中元素的的数量
   */
  getCheckedGoodsCount: function(){
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.number;
      }
    });
    return checkedGoodsCount;
  },
  /**
   * 全选按钮点击事件
   */
  checkedAll: function () {
    let that = this;
    if (!this.data.isEditCart)   //不是编辑状态
    {
      var productIds = this.data.cartGoods.map(function (v) {
        return v.product_id;
      });
      util.request(api.CartChecked, { productIds: productIds.join(','), isChecked: that.isCheckedAll() ? 0 : 1 }, 'POST', 'application/json').then(function (res) {
        if (res.errno === 0) {
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else
     {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;  //与点击之前状态相反
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  /**
   * 编辑状态与下单状态的切换
   */
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        'cartTotal.checkedGoodsCount': that.getCheckedGoodsCount()
      });
    }

  },
  /**
   * 去逛逛函数
   */
  toIndexPage: function () {
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
  /**
   * 更新购物车
   */
  updateCart: function (productId, goodsId, number, id) {
    let that = this;
    return new Promise((resolve, reject)=>{
      util.request(api.CartUpdate, {
        productId: productId,
        goodsId: goodsId,
        number: number,
        id: id
      }, 'POST', 'application/json').then(function (res) {
        if (res.errno === 0) {

          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
          resolve();

        } else if (res.errno == 400) /**库存不足*/ {
          reject();
        }
        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });

    })
    

  },
  /**
   * 计数器减
   */
  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = (cartItem.number - 1 > 1) ? cartItem.number - 1 : 1;
    cartItem.number = number;
    this.setData({
      cartGoods: this.data.cartGoods  /**更改本地数据 */
    });
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id);
  },
  /**
   * 计数器减
   */
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let number = cartItem.number + 1;
    cartItem.number = number;
    /**调用购物车更新接口***/
    this.updateCart(cartItem.product_id, cartItem.goods_id, number, cartItem.id).then(res=>{
      this.setData({
        cartGoods: this.data.cartGoods
      });
    }).catch(err=>{
      cartItem.inventory=false;
      wx.showToast({
        title: '库存不足',
        icon:'none',
      })
    })
  
   
   

  },
  /**
   * 下单/结算
   */
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;
    
    //获取选中的元素 
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }


    wx.navigateTo({
      url: `../shopping/checkout/checkout?goodsType=${consts.ORDER_GOODS_TYPE_01}&vipFlage=${that.data.vipFlage}`
    })
  },
  /**
   * 购物车删除接口
   */
  deleteCart: function () {
    //获取已选择的商品
    let that = this;

    let productIds = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {  //返回被选中的元素
        return true;
      } else {
        return false;
      }
    });

    if (productIds.length <= 0) {
      return false;
    }

    productIds = productIds.map(function (element, index, array) {
      if (element.checked == true) {
        return element.product_id;
      }
    });


    util.request(api.CartDelete, {  //购物车删除事件
      productIds: productIds.join(',')
    }, 'POST', 'application/json').then(function (res) {
      if (res.errno === 0) {
        let cartList = res.data.cartList.map(v => {
          v.checked = false;
          return v;
        });
        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  /**
   * 判断用户是否为卡会员
   */
  judgeVip() {
    let that = this;
    util.request(api.JudgeVip).then(res => {
      if (res.errno == 0) {
        that.setData({
          vipFlage: true,
        });
        this.getCartList();
      }
     
    });
  }
})