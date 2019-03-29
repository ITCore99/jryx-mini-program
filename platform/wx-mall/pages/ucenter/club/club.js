var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var consts = require('../../../config/commonConsts.js');
Page({
  data: {
    index: "",
    form_info:"",
    colum: [
      {
        indexImg: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/14560983441539.png',
        title: '亲子之旅',
        img: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/14413485b8ab0.png',
        content: '孩子是家庭的未来！开阔孩子的视野离不开父母的帮助，而孩子的成长更是需要父母的陪伴。如果父母把所有的时间都用来工作，那么将会错过孩子的童年。阖家欢乐，弥足珍贵！假日优选【SELECT HOLIDAY】为您规划精彩纷呈的亲子旅游方案，让孩子在您的陪伴下开启对世界的探索之旅。'
      },
      {
        indexImg: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/1515201536abbb.png',
        title: '研学之旅',
        img: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/151853168a3aaa.png',
        content: '古人常说“读万卷书不如行万里路”，近代人强调“知行合一”，已成为我国当前素质教育的新内容和新形式。旅途不仅能开阔中小学生的视野，还能提升自理能力，再结合一些培养项目又能增加孩子的社会实践经验，激发内在潜能，做全能型有用之才。假日优选【SELECT HOLIDAY】对7-17岁孩子开展科技、文艺、语言培训项目，帮助学生感受原汁原味的语言环境，体会雅俗共赏的文学艺术，探索世界科技前沿，追溯人类远古文明。享受生活，丰富阅历，感知世界，寓教于乐。'
      },
      {
        indexImg: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/151544345865b1.png',
        title: 'IP之旅',
        img: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/15192045271005.png',
        content: 'IP旅游让我们充分对某项专题或某一目的地进行深入的体验与探索。作为传统大众旅游的升级版，假日优选【SELECT HOLIDAY】根据会员的不同身份、切身需求、独特体验、消费心理等，量身定制旅游线路。相对于传统的旅行，IP定制旅行更具有专属、私密、趣味和深度性。'
      },
      {
        indexImg: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/151605422f168e.png',
        title: '康养之旅',
        img: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/151945820e3ea0.png',
        content: '时间都去哪儿了？辛劳半生，更应该关爱自己。让我们迈开双腿，背起行囊，去体验异域风情，感受沙滩海浪，站在甲板上、山峰上眺望远方，乐而忘忧。假日优选【SELECT HOLIDAY】为您甄选琴棋书画鉴赏，美酒佳肴品尝，健康养生体检，邮轮欢聚一堂。让我们陪伴您度过惬意的晚年时光。'
      },
      {
        indexImg: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/15161661184088.png',
        title: '商务之旅',
        img: 'http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20181218/15195980891ad6.png',
        content: '思想有多远，人就能走多远。企业嘉奖，员工激励，客户答谢，假日优选【SELECT HOLIDAY】精选的旅游方案让会议充满想象力，在诗情画意的环境中激发热情，凝心聚力。让您在轻松愉悦的氛围里，为企业插上梦想的翅膀，展翅飞翔！'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   * 进行表单提交
   */
  formSubmit:(e)=>{

    if (!e.detail.value.name) {
      wx.showToast({
        title: '请输入姓名！',
        icon: "none",
      })
      return;
    }
    if (!e.detail.value.phone) {
      wx.showToast({
        title: '请输入联系方式！',
        icon: "none",
      })
      return;
    }
    util.request(api.AirOrder, { type: consts.CUSTOMORDER_DEMAND_TYPE_05, name: e.detail.value.name, phone: e.detail.value.phone, remark: "假日优选咨询" },"POST","appliaction/json").then(res=>{
      if (res.errno == 0) {
        wx.showToast({
          title: '预约成功，我们客服人员稍后联系你，请保持联系方式的畅通。',
          icon: "none"
        });
        that.setData({
          form_info: ""
        })
      } else {
        wx.showToast({
          title: `${res.errmsg}`,
          icon: "none"
        })
      }
    })
  }
})
