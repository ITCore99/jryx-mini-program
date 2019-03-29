var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({
  data: {
    address: {   /***获取地址的具体信息 */
      id:0,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      address: '', 
      full_region: '',
      userName: '',
      telNumber: '',
      is_default: 0,
    },
    region:[],
    customItem: '全部', 
    addressId: 0,
    is_default:false,
    openSelectRegion: false, /***控制地址picker是否被打开 */
    selectRegionList: [     /***渲染顶部栏 */
      { id: 0, name: '省份', parent_id: 1, type: 1 },
      { id: 0, name: '城市', parent_id: 1, type: 2 },
      { id: 0, name: '区县', parent_id: 1, type: 3 }
    ],
    regionType: 1, /***判断是选中顶部栏的哪一个部分 */
    regionList: [],/***得到地区的列表 */
    selectRegionDone: false
  },
  /**
   * 电话input事件
   */
  bindinputMobile(event) {
    let address = this.data.address;
    address.telNumber = event.detail.value;
    this.setData({
      address: address
    });
  },
  /**
   * name input事件
   */
  bindinputName(event) {
    let address = this.data.address;
    address.userName = event.detail.value;
    this.setData({
      address: address
    });
  },
  /**
   * 地区选择器触发函数
   */
  bindRegionChange(event) {
    this.setData({
      region: event.detail.value,
    })
  },
  /**
   * switch触发函数
   */
  switchChange(event) {
    let address = this.data.address;
    address.is_default = !address.is_default;
    this.setData({
      address: address
    });
  },
  /**
   * 地址详情函数
   */
  bindinputAddress (event){
    let address = this.data.address;
    address.detailInfo = event.detail.value;
    this.setData({
      address: address
    });
  },
  // bindIsDefault(){
  //   let address = this.data.address;
  //   address.is_default = !address.is_default;
  //   this.setData({
  //     address: address
  //   });
  // },
  getAddressDetail() {
    let that = this;
    util.request(api.AddressDetail, { id: that.data.addressId }).then(function (res) {
      if (res.errno === 0) {
        if(res.data){
            that.setData({
                address: res.data,
                region: [res.data.provinceName,res.data.cityName, res.data.countyName]
            });
        }
      }
    });
  },
  setRegionDoneStatus() {
    let that = this;
    let doneStatus = that.data.selectRegionList.every(item => {
      return item.id != 0;
    });

    that.setData({
      selectRegionDone: doneStatus
    })

  },
  /**
   * 地址选项栏被点击
   */
  chooseRegion() {
    let that = this;
    this.setData({
      openSelectRegion: !this.data.openSelectRegion
    });

    //设置区域选择数据
    let address = this.data.address;
    if (address.province_id > 0 && address.city_id > 0 && address.district_id > 0) {
      let selectRegionList = this.data.selectRegionList;
      selectRegionList[0].id = address.province_id;
      selectRegionList[0].name = address.province_name;
      selectRegionList[0].parent_id = 1;

      selectRegionList[1].id = address.city_id;
      selectRegionList[1].name = address.city_name;
      selectRegionList[1].parent_id = address.province_id;

      selectRegionList[2].id = address.district_id;
      selectRegionList[2].name = address.district_name;
      selectRegionList[2].parent_id = address.city_id;

      this.setData({
        selectRegionList: selectRegionList,
        regionType: 3
      });

      this.getRegionList(address.city_id);
    } else {
      this.setData({
        selectRegionList: [
          { id: 0, name: '省份', parent_id: 1, type: 1 },
          { id: 0, name: '城市', parent_id: 1, type: 2 },
          { id: 0, name: '区县', parent_id: 1, type: 3 }
        ],
        regionType: 1
      })
      this.getRegionList(1);
    }

    this.setRegionDoneStatus();

  },
  onLoad: function (options) {

    if (options.id != '' && options.id != 0)
    {
      wx.setNavigationBarTitle({
        title: '修改地址',
      });
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
     
    }else
    {
      wx.setNavigationBarTitle({
        title: '添加地址',
      })
    }

    //this.getRegionList(1);

  },
  onReady: function () {

  },
  /**
   * 点击地区选择顶部栏的点击事件
   */
 
  selectRegionType(event) 
  {
    let that = this;
    let regionTypeIndex = event.target.dataset.regionTypeIndex; /**获取到点击的是哪一个 */
    let selectRegionList = that.data.selectRegionList;

    //判断是否可点击
    if (regionTypeIndex + 1 == this.data.regionType || (regionTypeIndex - 1 >= 0 && selectRegionList[regionTypeIndex-1].id <= 0)) {
      return false;
    }

    this.setData({
      regionType: regionTypeIndex + 1
    })
    
    let selectRegionItem = selectRegionList[regionTypeIndex];

    this.getRegionList(selectRegionItem.parent_id);

    this.setRegionDoneStatus();

  },
  /**
   * 
   * 地区item点击事件
   *
   */
  selectRegion(event) {
    let that = this;
    let regionIndex = event.target.dataset.regionIndex; /**点的是第几项 */
    let regionItem = this.data.regionList[regionIndex];  /**得到地址item项*/
    let regionType = regionItem.type;/**得到选项的类型号 */
    let selectRegionList = this.data.selectRegionList;
    selectRegionList[regionType - 1] = regionItem;  /**存储到渲染到的元素里面的第一项中*/


    if (regionType != 3) { /**不是最后一个选项 */
      this.setData({
        selectRegionList: selectRegionList,
        regionType: regionType + 1   /***省选完之后开始下一级 */
      })
      this.getRegionList(regionItem.id);/** 调用地区查询函数开始查询地区列表*/
    } else { /**等于三不在进行向底部级联 */
      this.setData({
        selectRegionList: selectRegionList
      })
    }

    //重置下级区域为空
    selectRegionList.map((item, index) => {
      if (index > regionType - 1) {
        item.id = 0;
        item.name = index == 1 ? '城市' : '区县';
        item.parent_id = 0;
      }
      return item;
    });

    this.setData({
      selectRegionList: selectRegionList
    })


    that.setData({
      regionList: that.data.regionList.map(item => {

        //标记已选择的
        if (that.data.regionType == item.type && that.data.selectRegionList[that.data.regionType - 1].id == item.id) {
          item.selected = true;
        } else {
          item.selected = false;
        }

        return item;
      })
    });

    this.setRegionDoneStatus();

  },
  doneSelectRegion() {
    if (this.data.selectRegionDone === false) {
      return false;
    }

    let address = this.data.address;
    let selectRegionList = this.data.selectRegionList;
    address.province_id = selectRegionList[0].id;
    address.city_id = selectRegionList[1].id;
    address.district_id = selectRegionList[2].id;
    address.province_name = selectRegionList[0].name;
    address.city_name = selectRegionList[1].name;
    address.district_name = selectRegionList[2].name;
    address.full_region = selectRegionList.map(item => {
      return item.name;
    }).join('');

    this.setData({
      address: address,
      openSelectRegion: false
    });

  },
  /**
   * 取消地址选择
   */
  cancelSelectRegion() {
    this.setData({
      openSelectRegion: false,
      regionType: this.data.regionDoneStatus ? 3 : 1
    });

  },
  /**
   * 得到地区的列表
   */
  getRegionList(regionId) {
    let that = this;
    let regionType = that.data.regionType;
    util.request(api.RegionList, { parentId: regionId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          regionList: res.data.map(item => {

            //标记已选择的
            if (regionType == item.type && that.data.selectRegionList[regionType - 1].id == item.id) {
              item.selected = true;
            } else {
              item.selected = false;
            }

            return item;
          })
        });
      }
    });
  },
  cancelAddress(){
    wx.navigateBack({
      url: '/pages/shopping/address/address',
    })
  },
  /**
   * 地址提交函数
   */
  saveAddress(){
    let address = this.data.address;

    if (address.userName == '') {
      util.showErrorToast('请输入姓名');

      return false;
    }

    if (address.telNumber == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }else{
      let PhoneExg =/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
      
      if (!(PhoneExg.test(address.telNumber)))
      {
        wx.showToast({
          title: '请输入正确的手机号！',
          icon:'none'
        })
        return false;
      }
    }
    if(this.data.region.length <3)
    {
      util.showErrorToast('请输入省市区');
      return false;
    }

    if (address.detailInfo == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }


    let that = this;
    util.request(api.AddressSave, { 
      id: address.id,
      userName: address.userName,
      telNumber: address.telNumber,
      is_default: address.is_default,
      provinceName: that.data.region[0],
      cityName: that.data.region[1],
      countyName: that.data.region[2],
      detailInfo: address.detailInfo,
    }, 'POST', 'application/json').then(function (res) {
      if (res.errno === 0) {
        wx.navigateBack({
          url: '/pages/shopping/address/address',
        })
      }
    });

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

})