var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var consts = require('../../config/commonConsts.js');
/**
 * goods  获取商品详情
 * specificationList  规格列表
 * productList  产品列表 里面是不同规格的产品
 * relatedGoods 关联产品
 * cartGoodsCount   购物车的数量
 * openAttr  判断左侧第一个是收藏还是返回按钮 规格切换
 * displayPrice 选择规格时的零售价用于根据规格动态的显示价格
 * displayPriceMarket  市场价展示
 * vipFlage  卡会员标识符
 * temporaryVipFlag  临时会员标识符
 * exist   判断是否为游轮商品游轮
 * inventory  根据价格更新库存
 * priceDiffere 优惠差价
 * journeyData 行程安排
 * objElementInfo   存放元素实际高度 
 * ElementHeight  初始化元素高度
 * PriceDescFlage  控制价格mask层的显示与否
 * JourneyMore   控制行程查看更多mask层显示与否
 * bottom        弹出框动画
 * shipSpe       游轮规格
 * routingFirst   行程描述第一天
 * index          tabar的选中标号
 * dayNum         行程天数
 * displayDays    选中天数的显示内容
 * totalDays      总天数
 * tabData        这是查看更多的tabData
 * totalSkuSubsetStr  存放sku子集字符串
 * specStat       统计选中规格和未选中规格的
 * getUserSelectPath 用户可选则的路径
 * dateTotalArr 日历总数据
 * selectedCalendarItem  选中的日历日期
 * currentIndex 日历轮播图当前页
 * scrollLeft tabar向左滚动距离
 * monthData  存储月份的数据
 * noCollectImage 收藏按钮的图
 * hasCollectImage  收藏按钮被选中图 
 * totalDatePriceData 日期价格数据
 */
Page({
  data: {
    winHeight: "",
    id: 0,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,   
    noCollectImage: "/static/images/icon_collect.png",   
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png",
    displayPrice:"",    
    displayPriceMarket:"",
    vipFlage:false,      
    temporaryVipFlag:false, 
    shareId:"",
    exist:true,
    inventory:1,
    priceDiffere:0, 
    cabinCategoryData: [
      { title: "内舱房", url:"http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190125/1026351120a1d2.png"},
      { title: "阳台房", url:"http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190125/102221187b8664.png" },
      { title: "海景房", url:"http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190125/102350886f1b57.png" },
      { title: "套房", url:"http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190125/102421756b6f1e.png" },],
    journeyData:[], 
    reserveData:[
      { content:"邮轮舱位有限，请提早报名。"},
      { content: "报价均以两人一间为准，若出现单人情况，请另付单房差（船票的200%）。" },
      { content: "船票, 一旦付款确认, 则不能改期、退票、改签。" },
      { content: "景点内之考古学遗迹如果需要使用摄像机或照相机, 可能要求收取附加费。" },
      { content: "本报价包含邮轮上绝大部分餐饮及休闲娱乐，另有部分餐饮及服务需额外付费，详情请咨询。" },
      { content: "因不可抗拒之客观原因或不可抗力 (如天灾、战争、罢工等)或航空公司航班延误或取消、领馆签证延误、我公司有权取消或变更行程, 一切超出费用(如在外延期签证费、住、食、及交通费、国家航空运价调整等), 我公司有权追加差价；以上行程仅供参考，请以出团前的出发行程为准，我社保留对行程做出更改的权利。" },
      { content: "到预定的航次结束之日前已经怀孕24周的游客不能登船；参加邮轮旅行的儿童登船时最小年龄为6个月。" },
      { content: "请随身携带国际信用卡（船上用），美元现金（船上和岸上用），日元（岸上用）。" },
      { content: "自由行客人，请保证起航前2小时回船。船不等人，未按时归船者，责任自负。" },
      { content: "出团前，请认真阅读《出团通知》。" },],
      feesData:[
        { title:"费用包含：",list:[
          {content:"1.船票邮轮5晚住宿及免费餐厅用餐。"},
          { content: "2.邮轮上提供的免费娱乐设施。" },
          { content: "3.邮轮停靠港口港务税费。" },
          { content: "4.全程领队服务费。" },
          { content: "5.日本岸上游览观光免费行程【如因个人原因取消岸上观光行程，需补交境外地接签证名单及领队费用，￥500元/人】。" },
          { content: "6.日本团队出入境名单及登录许可证的费用。" },
          { content: "7.旅行社责任险。" },
          ]
        },
        {
          title: "费用不含：", list: [
            { content: "1.岸上游为赠送项目，如不参加，不可退还岸上观光费用。且需补交岸上游管理费500元/人。" },
            { content: "2.因交通延误、战争、政变、罢工、自然灾害、飞机故障、航次取消或更改时间等不可抗力原因所致的额外费用。" },
            { content: "3.特色餐厅或饮料酒水所需额外付费等项目。" },
            { content: "4.服务项目未提到的一切费用。" },
            { content: "5.邮轮服务费 船上自付：13周岁及以上乘客：(普通房型14.5美金/每人/每晚，套房房型：17.5美金/每人/每晚);4-12周岁儿童：(普通房型7.25美金/每人/每晚; 套房房型：8.75美金/每人/每晚); 4 周岁以下儿童：免收服务费。" },
            { content: "6.北京-天津往返大巴200元/人。" },
            { content: "7.旅游意外险（自选）70元/人。" },
          ]
        },
        {
          title: "邮轮船票取消原则：", list: [
            { content: "因邮轮产品特殊性，如果客人签署合同后，开船前解约的，旅行社向邮轮所支付的船票费用、港务费及燃油附加费等实际发生费用船方将不予退还，该部分费用将做为实际损失由客人承担。" },
            { content: "1.开船前60天（不含60天）以外取消，收取3000元作为损失费。" },
            { content: "2.开船前59天-45天取消，收取全款的50%作为损失费。" },
            { content: "3.开船前44~30天内取消，收取全款的80%作为损失费。" },
            { content: "4.开船前30天（含第30天）以内告知取消，或在开船前没有及时出现，或在开船之后无论以任何理由放弃旅行的客人，收取全款的100%作为损失费；以上任一情况均无权要求退还任何票款且应支付船票全价票款。" },
          ]
        },
        ],
    priceDescData: [{ content: "此价格为会员尊享" }, { content: "本起价是在最近24小时内测算的、按双人出行共用一间房核算的单人价格。" }, { content: "此价格不包含从您所在城市到达港口的大交通费用。" }, { content: "此价格不包含保险：“旅游保险”的费用。" }, { content: "产品价格会根据您所选择的出发日期、出行人数、入住舱型、航班或交通以及所选附加服务的不同而有所差别。" },],   
    objElementInfo: {}, 
    ElementHeight: { journey: { value: 75, state: true }, equipment: { value:75, state: true }, cate: { value: 75, state: true }, entertainment: { value: 75, state: true }, reserve: { value: 75, state: true }, feesDescription: { value: 75, state: true } },
   /**需要获取高度的元素节点id */
    // wantGetElement: ["journey", "equipment", "cate","entertainment","reserve","feesDescription"],
    PriceDescFlage: false,    
    JourneyMore: false,       
    bottom: -1086,            
    cruiseEntityList:[],
    goodsScheduleEntityList:[],
    goodsTravleEntityList:[],
    cruiseMacroList:[],
    shipSpe:{},   
    routingFirst:{},   
    index:"0",  
    dayNum:1 , 
    displayDays:{}, 
    totalDays:1, 
    tabData:{},
    titleShow:"" ,
    totalSkuSubsetStr:[], 
    specStat:{}, 
    getUserSelectPath:[],
    date_year:new Date().getFullYear(),
    date_month: new Date().getMonth() + 1,
    date_date:new Date().getDate(),
    weekData:['日','一','二','三','四','五','六'],
    monthData:[],
    dateTotalArr:[],
    selectedCalendarItem:"",
    currentIndex:0, 
    scrollLeft:0, 
    totalDatePriceData: [],
    },
    /**
     * 获取商品详情 
     */
    getGoodsInfo: function () {
    let that = this;
    util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) { 
      wx.hideLoading();
      if (res.errno === 0) 
      {   
        if (res.data.info.category_id != 1036013)
        {
           that.setData({
             exist:false
           })
        }else{
          that.getLooseInfo();
        }
        switch (res.data.info.category_id)
        {
          case 1036013:/**游轮 */
            res.data.specificationList.forEach((item,index)=>{
              if (item.specification_id==2)
              {
                item.name="舱型";

              } else if (item.specification_id ==4)
              {
                item.name = "日期"
              } else if (item.specification_id == 1)
              {
                item.name=""; 
              }
            });
            break;
          case 1036014:/**签证 */
            res.data.specificationList.forEach((item, index) => {
              if (index == 0) {
                item.name = "";
              } else {
                item.name = "选择"
              }
            });
            break;
          default:
            res.data.specificationList.forEach((item, index) => {
              if (index == 1) {
                item.name = "日期";
              } 
            });
            break;  
        } 
        let displayPrice=""
        let displayPriceMarket="" 
        displayPrice= res.data.info.retail_price;
        displayPriceMarket = res.data.info.market_price;

        res.data.specificationList.forEach(item=>{
          if (item.specification_id == 2)
          {
            item.valueList.forEach(temp=>{
              temp.iconUrl = that.Handler(temp.seq);
            })
          }
        })
        let priceDiffere = (Number(res.data.info.market_price * 1000) - Number(res.data.info.retail_price*1000))/1000;  
        that.setData({     
          goods: res.data.info,
          gallery: res.data.gallery, 
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.userHasCollect,
          displayPrice,
          displayPriceMarket,
          priceDiffere,
        });
         
        let ExistSku=that.getExistSku();
        let totalSkuSubset=[];    /**存放所有的sku子集 */
        ExistSku.forEach(item=>{
          let skuArr=item.split("_");
          let singleSubset=that.getExistSkuSubset(skuArr);
          totalSkuSubset=totalSkuSubset.concat(singleSubset);
        });
        let totalSkuSubsetStr=[]   /**存放转化为字符串sku子集 */
        totalSkuSubset.forEach(item=>{
            totalSkuSubsetStr.push(item.join("_"));
        })
        totalSkuSubsetStr = that.noreapeat(totalSkuSubsetStr);
        that.setData({
          totalSkuSubsetStr,
        })  
        that.setDefSpecInfo(that.data.specificationList);
        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }
        WxParse.wxParse('goodsDetail', 'html', that.data.goods.goods_desc, that,5);
        that.getGoodsRelated();

      }
    });

  },
  getGoodsRelated: function () { //商品详情页的关联商品（大家都在看）
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  /**
   * 点击规格item
   */
  clickSkuValue: function (event)
   {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;  //规格id
    let specValueId = event.currentTarget.dataset.valueId;//规格下面的子规格id
    let index=event.currentTarget.dataset.index;
    /**切换分类时将计数器重置*/
    this.setData({   
      number:1
    })

    //判断是否可以点击
    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++)
     {
      if (_specificationList[i].specification_id == specNameId) 
      {
        for (let j = 0; j < _specificationList[i].valueList.length; j++) 
        {
          if (_specificationList[i].valueList[j].id == specValueId) 
          {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) 
            {
              _specificationList[i].valueList[j].checked = false;
             
                this.setData({
                  displayPrice: this.data.goods.retail_price,
                  displayPriceMarket: this.data.goods.market_price
                })
            } else 
            {
              _specificationList[i].valueList[j].checked = true;
              let that=this;
              // setTimeout(()=>{
              //   let that = this;
              //   this.changePrice()
              // },100);
              this.changePrice();
            }
          } else 
          {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();
    //重新计算哪些值不可以点击

    let specStat= this.getSelectedSpeId();
    this.setData({
      specStat
    });
    let getUserSelectPath = this.getUserSelectPath();
    let specificationList= this.updateSpec(getUserSelectPath);
    this.setData({
      getUserSelectPath,
      specificationList
    })
  },

  //获取选中的规格信息
  getCheckedSpecValue: function (flage) 
  {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) 
    {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) 
      {
        if (_specificationList[i].valueList[j].checked) 
        {
            _checkedObj.valueId = _specificationList[i].valueList[j].id;
            _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },

  /**得到具体的规格id */
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });
    return checkedValue.join('_');
  },
 /**
  * 改变规格文本
  */
  changeSpecInfo: function (flage) 
  {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) 
      {
        return true;
      } else 
      {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  getCheckedProductItem: function (key) {  /***获取库存 */
    return this.data.productList.filter(function (v) {
      if (v.goods_specification_ids.indexOf(key) > -1) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) 
  {
    let that=this;
    this.setData({
      id: parseInt(options.id),
      shareId: options.shareId || wx.getStorageSync("shareId") || ""
    });
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          objElementInfo: { journey: 3*res.windowHeight, equipment: res.windowHeight, cate: res.windowHeight, entertainment: res.windowHeight, reserve: 2 * res.windowHeight, reserve: 2 * res.windowHeight },
        });
      },
    });
    //that.getDatePriceData();
    
 
  },
  onReady: function () {},
  onShow: function ()
  {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    util.request(api.CartGoodsCount).then(function (res) {
    
      if (res.errno === 0) {
        that.setData({
          cartGoodsCount: res.data.cartTotal.goodsCount
        });
        that.judgeVip();
        that.isTemporyVip();
      }
     
    });
    var that = this
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,     /**得到设备的实际高度 */
          clientWidth = res.windowWidth,        /**得到设备的实际宽度*/
          rpxR = 750 / clientWidth;            /**逻辑/实际**/
        var calc = clientHeight * rpxR - 100;
        that.setData({
          winHeight: calc
        });
      }
    });

  },
  /**
   * 分享
   */
  onShareAppMessage: function () {
    return {
      title:`${this.data.goods.name}` ,
      imageUrl: this.data.gallery[0].img_url,
      path: `/pages/index/index?id=${this.data.id}&${consts.SHARE_ID}=${wx.getStorageSync("userId")}&${consts.FLAGE}=${consts.PRODUCT_SHARE}&${consts.BRANCH_CODE}=${consts.CURRENT_BRANCH_CODE}`
    }
  },
  /**
   * 切换规格和详情
   */
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190109/150241347e7301.png"
      });
    }
  },
  closeAttrOrCollect: function () {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
      });
      if (that.data.userHasCollect == 1) {
        that.setData({
          'collectBackImage': that.data.hasCollectImage
        });
      } else {
        that.setData({
          'collectBackImage': that.data.noCollectImage
        });
      }
    } else {
      //添加或是取消收藏
      util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST", "application/json")
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            if ( _res.data.type == 'add') {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }

          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  /**
   * 直接购买
   */
  buyGoods: function () {
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190109/150241347e7301.png"
      });
    } else
     {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        wx.showToast({
          title: '请选择完整的规格',
          icon:'none'
        })
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());//参数是商品库存id goods_specification_ids
     
      if (!checkedProduct || checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return false;
      }

      //验证库存
      if (checkedProduct.goods_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          title: '库存不足',
          icon:  'none',
        })
        return false;
      } 
      let goodsType="";
      switch (this.data.goods.category_id)
      {
        case 1036015: /**优选产品*/
          goodsType = consts.ORDER_GOODS_TYPE_01
          break;
        case 1036014 : /**签证 */
          goodsType = consts.ORDER_GOODS_TYPE_04;
          break;  
        case 1036017 : /**活动*/  
          goodsType = consts.ORDER_GOODS_TYPE_03;
          break;  
        default:
          goodsType = consts.ORDER_GOODS_TYPE_02; 
          break;       
      }
      // 直接购买商品(添加缓存)
      util.request(api.BuyAdd, { goodsId: this.data.goods.id, number: this.data.number, productId: checkedProduct[0].id}, "POST",'application/json')
        .then(function (res) {  
          let _res = res;
          if (_res.errno == 0) {
            that.setData({
              openAttr:!that.data.openAttr,
            },function(){
              wx.navigateTo({
                url: `/pages/shopping/checkout/checkout?isBuy=true&goodsType=${goodsType}&vipFlage=${that.data.vipFlage}`,
              });
            });
           
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });

    }
  },

  /**
   * 添加到购物车
   */
  addToCart: function () {
    var that = this;
    if (this.data.openAttr == false)
     {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr,  //为true是表示是选择规格
        collectBackImage: "http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190109/150241347e7301.png"
      });
      wx.setNavigationBarTitle({
        title:'选择规格'
      })
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
          wx.showToast({
              title: '请选择完整规格'
          });
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());               //goods_specification_ids 验证是否有此类型的产品
      if (!checkedProduct || checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return false;
      }

      //验证库存
      if (checkedProduct.goods_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        return false;
        wx.showToast({
          title: '库存不足',
          icon: 'none'
        })
        return false;
      }
         
      //添加到购物车
      util.request(api.CartAdd, { goodsId: this.data.goods.id, number: this.data.number, productId: checkedProduct[0].id }, 'POST', 'application/json')
        .then(function (res) {  
          let _res = res;
          if (_res.errno == 0) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data.cartTotal.goodsCount
            });
            if (that.data.userHasCollect == 1) {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    if(this.data.number+1>this.data.inventory) /***库存不足 */
    {
      wx.showToast({
        title:"库存不足",
        icon:"none",
      })
      return;
    }
    this.setData({
      number: this.data.number + 1
    });
  },
    setDefSpecInfo: function (specificationList) {
        //未考虑规格联动情况
        let that = this;
        if (!specificationList)return;
        for (let i = 0; i < specificationList.length;i++){
            let specification = specificationList[i];
            let specNameId = specification.specification_id;
            //规格只有一个时自动选择规格
            if (specification.valueList && specification.valueList.length == 1){
                let specValueId = specification.valueList[0].id;
                that.clickSkuValue({ currentTarget: { dataset: { "nameId": specNameId, "valueId": specValueId } } });
            }
        }
        specificationList.map(function(item){

        });

    },
    /**
     * 根据选择不同的规格来动态显示价格
     */
  changePrice:function()
  { 
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        return false;
      }
      let that=this;
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      this.setData({
        inventory:checkedProduct[0].goods_number||0
      });
      if (!checkedProduct || checkedProduct.length <= 0)
      {
      }
      //验证库存
      if (checkedProduct.goods_number < this.data.number) 
      {
        return wx.showToast({
          title: '库存不足',
          icon: 'none',
        });
      }
    that.setData({
      displayPrice: checkedProduct[0].retail_price,
      displayPriceMarket: checkedProduct[0].market_price
    });
    },
  /**
   * 判断用户是否是会员
   */
  judgeVip()
  {
    let that=this;
    util.request(api.JudgeVip).then(res=>{
        if(res.errno==0)
        {
          that.setData({
            vipFlage:true,
          })
        }
       this.getGoodsInfo();
    })
  
  },
  /**
   * 判断舱型
   *
   */
  Handler(seq)
  {
    switch (seq > 100 ? (seq>200 ? (seq>300 ? (seq>400 ?(seq>500 ?(seq >600 ? 7 :5) :4) :3) :2):1): 0){
      case 0:
        return ""; 
        break; 
      case 1:
        return consts.INSIDE_CABIN_ICON;
        break;
      case 2:
        return consts.BALCONY_ROOM_ICON;
        break; 
      case 3:
        return consts.SEA_VIEW_ICON;
        break;   
      case 4:
        return consts.SUITE_ROOM_ICON
        break;   
      case 5:
        return consts.OTHER_ICON
        break; 
      default:
        return ""; 
        break;      
  } 
},
/**
 *判断是不是临时会员
 */
isTemporyVip()
{ 
  let that=this;
  util.request(api.TemporyVip).then(res=>{
    if (res.errno==0)
    {
      that.setData({
        temporaryVipFlag:true
      })
    }
  }).catch(err=>{
    console.log(err);
  })
},
/**
 * 点击展开和收缩
 */
changHeight(e)
{
 
  let index=e.currentTarget.dataset.index;
  let ElementHeight=this.data.ElementHeight;
  let objElementInfo = this.data.objElementInfo;
  /**将其他展开的清除 */
  for (let key in ElementHeight)
  {
    if (!ElementHeight[key].state && key != index)
    {
      ElementHeight[key].value = consts.DEFAULTHEIGHT;
      ElementHeight[key].state=true;
    }
  }
  if (ElementHeight[index].value<100)/**未展开 */
  {
    ElementHeight[index].value = objElementInfo[index];
    ElementHeight[index].state =false;
    this.setData({
      ElementHeight,
    })
  }else{   /**已展开 */
    ElementHeight[index].value = consts.DEFAULTHEIGHT;
    ElementHeight[index].state = true;
    this.setData({
      ElementHeight,
    })
  }  
},
/**
 * 切换显示遮罩层
 */
toggleMask(e)
{
  let index=e.currentTarget.dataset.index;
  if(index=="1")
  {
    this.setData({
      bottom: this.data.JourneyMore ? -1086 : 0, 
      JourneyMore: !this.data.JourneyMore,
      titleShow: this.data.goodsScheduleEntityList[this.data.dayNum-1].title
    });
    this.updateTabData();
    WxParse.wxParse('travelDetail', 'html', this.data.goodsScheduleEntityList[this.data.dayNum - 1].outline, this, 0);
  }else{
    this.setData({
      PriceDescFlage: !this.data.PriceDescFlage
    })
  }
},
/**
 * tabbar切换函数 
 */
toggleTabBar(e) {
   let index=e.currentTarget.dataset.index;
   let key=e.currentTarget.dataset.key;
   let tabData=this.data.tabData
   this.setData({
     index,
     displayDays: tabData[key]
   })
  WxParse.wxParse('travelDetail', 'html', this.data.goodsScheduleEntityList[this.data.dayNum-1][key],this,0);
 },
 /**
  * 切换天数,重置tabBar
  */
  toggleDay(e)
  {
     let  flage=e.currentTarget.dataset.index;
     let  totalDays = this.data.totalDays;
     let  dayNum = this.data.dayNum;
     if(flage=="1") /**后一天 */
     {
       if (dayNum+1 > totalDays)
       {
         return wx.showToast({
           title: '已经是最后一天了',
           icon:'none'
         });
         return;
       }
        this.setData({
          index: 0,
          dayNum: dayNum + 1,
  
        })
        this.updateTabData();
       this.setData({ titleShow: this.data.goodsScheduleEntityList[this.data.dayNum-1].title});
       WxParse.wxParse('travelDetail', 'html', this.data.goodsScheduleEntityList[this.data.dayNum - 1].outline, this, 0);
     } else if (flage == "0")/**前一天 */
     { 
       if (dayNum-1 <1)
       {
         return  wx.showToast({
           title: '已经是第一天了',
           icon: 'none'
         });
        return;
       }
       this.setData({
         index:0,
         dayNum: dayNum - 1,
       })
       this.updateTabData();
       this.setData({
         displayDays: this.data.tabData.outline,
         titleShow: this.data.goodsScheduleEntityList[this.data.dayNum-1].title,
       });
       WxParse.wxParse('travelDetail', 'html', this.data.goodsScheduleEntityList[this.data.dayNum - 1].outline,this, 0);
     }
  },
  /**获取游轮 */
  getLooseInfo()
  {
    let that=this;
    util.request(api.LooseInfo, { id: that.data.id }).then(res=>{
      if(res.errno==0)
      {
        let routingFirst={};
        let journeyData=[];
        res.data.goodsScheduleEntityList.sort((value1,value2)=>{
          if (value1.daysOrder > value2.daysOrder)
          {
            return 1;
          } else if (value1.daysOrder < value2.daysOrder){
            return -1;
          }else{
            return 0;
          }
        })
        res.data.goodsScheduleEntityList.forEach((item,index)=>{
          if (index==0)
            {
              routingFirst.dayName ="D"+item.daysOrder;
              routingFirst.desc = item.title;
            }else{
            journeyData.push({ dayName: "D" + item.daysOrder, desc: item.title,url:item.pic1})
            }
        });
        let equimentArr = [], cateArr = [], entertainment = [];
        res.data.cruiseMacroList.forEach(item=>{
          let url = util.getIconUrl(item.value);
          if(item.value<2000)
          {
             item.url=url;
             equimentArr.push(item);
          }else if(item.value<3000)
          {
            item.url = url;
            cateArr.push(item);
          }else{
            item.url = url;
            entertainment.push(item);
          }
        });
        that.setData({
          journeyData,
          routingFirst,
          cruiseEntityList: res.data.cruiseEntityList,
          goodsScheduleEntityList: res.data.goodsScheduleEntityList,
          goodsTravleEntityList: res.data.goodsTravleEntityList,
          cruiseMacroList: res.data.cruiseMacroList,
          shipSpe: {equimentArr, cateArr, entertainment},
          totalDays: res.data.goodsScheduleEntityList.length,
        })
      }else{
        wx.showToast({
          title: '请求出错!',
          icon: 'none'
        })
      }
    }).catch(err=>{
      wx.showToast({
        title: '发生错误，请重试',
        icon: 'none'
      })
    })
  },
  /**
   * 查看游轮详情
   */
  goInfoDetails()
  {
    wx.navigateTo({
      url:`/pages/brief/biref?id=${this.data.id}`
    })
  },
  /**
   * 更新tabData
   */
  updateTabData()
  {
    let reg = /&amp;nbsp|\s/g;
    let goodsScheduleEntityList = this.data.goodsScheduleEntityList[this.data.dayNum-1];
    let tabData = {};
    if (goodsScheduleEntityList.outline) 
    {

      tabData.outline = {
        key: "outline",
        desc: goodsScheduleEntityList.outline.replace(reg,""),
        pic: goodsScheduleEntityList.pic1
      }
    };
    if (goodsScheduleEntityList.cityDesc) {

      tabData.cityDesc = {
        key: "cityDesc",
        desc: goodsScheduleEntityList.cityDesc.replace(reg,""),
        pic: goodsScheduleEntityList.pic2
      }
    };
    if (goodsScheduleEntityList.localTaste) {

      tabData.localTaste = {
        key: "localTaste",
        desc: goodsScheduleEntityList.localTaste.replace(reg,""),
        pic: goodsScheduleEntityList.pic3
      }
    };
    if (goodsScheduleEntityList.upTaste)
    {
      tabData.upTaste = {
        key: "upTaste",
        desc: goodsScheduleEntityList.upTaste.replace(reg,""),
        pic: goodsScheduleEntityList.pic4
      }
    }
    this.setData({
      tabData,
      displayDays: tabData["outline"], 
    })
  },
  /**
   *统计商品的规格 
   */
  getExistSku()
  {
    let ExistSkuArr=[];
    let productList = this.data.productList;
    productList.forEach(item=>{
      if (!!(item.goods_specification_ids))
      {
        ExistSkuArr.push(item.goods_specification_ids);
      }
    });
    return ExistSkuArr;
  },
 /**
  * 获取商品规格的子集
  */
  getExistSkuSubset(skuArr)
  {
    let ps=[[]];
    for(let i=0;i<skuArr.length;i++)
    {
      for(let j=0,len=ps.length;j<len;j++)
      {
        ps.push(ps[j].concat(skuArr[i]));
      }
    }
    return ps.slice(1,ps.length);
  },
  /**
   * 获取已选中的规格id
   */
  getSelectedSpeId()
  {
    let specificationList = this.data.specificationList;
    let selectedSpecs=[];
    let noSelectSpecs=[];
    let specStat={};
    specificationList.forEach(item=>{
    item.valueList.forEach(temp=>{
        if(temp.checked)
        {
          selectedSpecs.push(temp);
        }else{
          noSelectSpecs.push(temp);
        }
      })
    })
    specStat.selectedSpecs = selectedSpecs;
    specStat.noSelectSpecs = noSelectSpecs;
    return specStat;
  },
  /**
   * 数组去重
   */
  noreapeat(arr)
  {
    let len = arr.length
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) {
          arr.splice(j, 1);
          j--;
        }
      }
    }
    return arr;
  },
  /**
   * 获取用户选择路径
   */
  getUserSelectPath()
  {
    let specStat = this.data.specStat;
    let noSelectSpecs = this.data.specStat.noSelectSpecs;
    let userPathsStr=[];
    for(let i=0 ,len=noSelectSpecs.length;i<len;i++)
    {
      let index="null";//用于记录同行选中元素的位置
      let selectedSpecs = [...specStat.selectedSpecs];
      let userPath=[];
      for (let j = 0, len2 = selectedSpecs.length; j < len2;j++)
      {
        //同行元素
        if (selectedSpecs[j].specification_id == noSelectSpecs[i].specification_id)
        {
            index=j;//记下同行元素的位置;
        }
      }
      if(index!=="null")/**存在同行元素将同行元素删除与其他的已选中元素生成路径 */
      {
        selectedSpecs.splice(index,1);
      }
      selectedSpecs.push(noSelectSpecs[i]);
      selectedSpecs.forEach(item=>{
        userPath.push(item.id);
      })
      userPath.sort();//一条用户选择路径
      userPathsStr.push({ specification_id: noSelectSpecs[i].specification_id, id: noSelectSpecs[i].id, path: userPath.join("_")});
    }
    return userPathsStr;
  },
  /**
   * 进行配牌sku
   */
  matchSku(userPath)
  {
    let totalSkuSubsetStr = this.data.totalSkuSubsetStr;
    return totalSkuSubsetStr.includes(userPath);
  },
  /**
   * 更新规格列表
   */
  updateSpec(userPaths)
  {
    let that=this;
    let specificationList = [...this.data.specificationList] 
    
      for (let i = 0, len = userPaths.length;i<len;i++)
      {
        let flage = that.matchSku(userPaths[i].path);
        if(!flage)
        {
          for (let j = 0, len2 = specificationList.length;j<len2;j++)
          {
            if (specificationList[j].specification_id == userPaths[i].specification_id)
            {
              for (let m = 0, len3 = specificationList[j].valueList.length;m<len3;m++)
              {
                if (specificationList[j].valueList[m].id == userPaths[i].id)
                {
                  specificationList[j].valueList[m].forbidden=true;
                }
              }
            }
          }
        }
      }
     return specificationList; 
  },
  /**
   * 获取日历的数据
   */
  getCalendarData()
  {
    /**展示多少个月 */
    let MonthLen=8;
    let dateTotalArr=[];
    let monthData=[];
    let currentYear = this.data.date_year;
    let currentMonth = this.data.date_month;
    let currentDate = this.data.date_date;
    for (let i = 0; i < MonthLen;i++) 
    {
      let dateArr=[];
      let paramY = currentMonth + i > 12 ? currentYear + 1 : currentYear; 
      let paramM = currentMonth + i > 12 ? (((currentMonth + i) % 13) + 1 == 1 ? `${paramY.toString().slice(-2)}年1` : ((currentMonth + i) % 13) + 1 ) : (currentMonth + i);
      monthData.push(paramM)
      dateArr=this.createDateListData(i);
      dateTotalArr.push(dateArr);
    };
    this.setData({
      monthData,
      dateTotalArr
    })
  },
  /**
   * 获取日历的数据
   */
  createDateListData(index)
  {
    //存储日期数据
    let  dateArr=[];
    //日期的长度
    let  dateLen=0;
    //当前时间
    let currentYear =this.data.date_year;
    let currentMonth=this.data.date_month;
    let currentDate=this.data.date_date;
    let paramM = currentMonth + index > 12 ? ((currentMonth + index)%13) : (currentMonth + index)-1;
    let paramY = currentMonth + index > 12 ? currentYear + 1 : currentYear; 
    //获取时间对象
    let now = new Date(paramY, paramM);
    let year=now.getFullYear();
    let month=now.getMonth()+1;
    //获取月份的天数
    let monthTotalDays=this.getMonthTotalDay(year,month);
    //获取首日的星期数
    let startWeek=this.getWeek(year,month,1);
    for(let i=-startWeek+1;i<=monthTotalDays;i++)
    {
      let available = true; //判断日期是否可用
      let amount="";
      if(i>0)
      {
        amount = this.getDatePrice(`${paramY}/${paramM}/${i}`);
        if(!amount)
        {
          available=false;
          amount="无行程";
        }else{
          amount = `￥${amount}`;
        }
       
      }
      
      if (year == currentYear && month == currentMonth && i < currentDate )//在当前之前的天为不可用   
       {
        available = false;
        amount = "已过期";

       }

       dateArr.push({
         date:i,
         available,
         checked:false,
         amount: amount !="" ? `￥${amount}`: '无行程',
       });   
    }
    return dateArr;
  },
  /**
   * 获取月份的总天数
   */
  getMonthTotalDay(year,month)
  {
    let totalDays=new Date(year,month,0).getDate();
    return totalDays;
  },
  /**
   * 获取月份首日是星期
   */
  getWeek(year,month,day)
  {
    let week=new Date(year,month-1,day).getDay();
    return week;
  },
  /***
   * 日历选中函数
   */
  selectedCalendar(e)
  {
    let row =e.currentTarget.dataset.row;
    let column = e.currentTarget.dataset.column;
    let selectedRow="";
    let selectedColumn=""
    let dateTotalArr = this.data.dateTotalArr;
    let selectedCalendarItem = this.data.selectedCalendarItem;
    if (selectedCalendarItem)
    {
      selectedRow = selectedCalendarItem.row;
      selectedColumn = selectedCalendarItem.column;
      dateTotalArr[selectedRow][selectedColumn].checked=false;
    }
    dateTotalArr[row][column].checked=true;
    selectedCalendarItem = {
      item: dateTotalArr[row][column],
      row,
      column
    }
    this.setData({
      dateTotalArr,
      selectedCalendarItem,
    })
  },
  /**
   *日历滑动触发方法
   */
  calendarSwiperChange(e)
  {
    let currentIndex = e.detail.current;
    this.setData({
      currentIndex
    });
    this.changeMonthTabar();
  },
  /**
   * 月份滚动条
   */
  changeMonthTabar()
  {
    let singal=750/6;
    let currentIndex=this.data.currentIndex;
    let scrollLeft = ((currentIndex -3) * singal);
    this.setData({
      scrollLeft
    });
  },
  /**
   *获取具体日期的价格
   */
  getDatePrice(date)
  {
    //后台返回的日期价格数据
    let totalDatePriceData = this.data.totalDatePriceData;
    let vipFlage=this.data.vipFlage;
    let temporaryVipFlag=this.data.temporaryVipFlag;
    let len=totalDatePriceData.length;
    //将传入的日期转化为时间戳
    let timeStamp=+new Date(date);
    let price="";
    for (let i = 0; i < len;i++)
    {
      let item = totalDatePriceData[i];
      //得到事件的区间
      let startTime = item.startDate;
      let endTime = item.endDate;
      if (timeStamp >= endTime && timeStamp <  endTime )
      {
        //在这里判断是否为会员价展示不同的价格
        if (vipFlage || vipFlage)
        {
          price = item.retailPrice;
        }else{
          price = item.marketPrice;
        }
        break;
      }
    }
    return price ;
  },
  /**
   * 获取不同日期价格数据
   */
  getDatePriceData() 
  {
    let that=this;
    util.request(api.GetDatePrice, { productId: 1984 }).then(res => {
      console.log(res);
      if(res.code==0)
      {
        this.setData({
          totalDatePriceData: res.list
        });
        that.getCalendarData();
      }
    }).catch(err=>{
      console.log("获取日期错误")
    })
  }
  
})