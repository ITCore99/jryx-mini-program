/**
 * 定制和机票
 * 字段：type
 */
const CUSTOMORDER_DEMAND_TYPE_01=1; //个人定制
const CUSTOMORDER_DEMAND_TYPE_02=2; //团体订制
const CUSTOMORDER_DEMAND_TYPE_03=3; //机票预约
const CUSTOMORDER_DEMAND_TYPE_04=4; //会员卡办理预约
const CUSTOMORDER_DEMAND_TYPE_05 =5; //会员卡办理预约
/**
 * 会员卡
 * 字段：activateStatus
 */
const CARD_ACTIVE=1; //已激活的会员
const CARD_NOACTIVE=4;//未激活的会员卡
/**
 * 订单类型
 */
const ORDER_GOODS_TYPE_01=1 //旅游产品
const ORDER_GOODS_TYPE_02=2 //航线
const ORDER_GOODS_TYPE_03=3 //活动
const ORDER_GOODS_TYPE_04=4 //签证
const ORDER_GOODS_TYPE_05=5 //购买会员卡
const ORDER_GOODS_TYPE_06=6 //会员充值

/**
 * 首页的分类
 */
const HOME_CATEGORY_HOT_SALE_ID = 1036013 //热销分类id
const HOT_SALE=1 //热销状态
const HOME_CATEGORY_FAVOR_PRODUCT_ID = 1036015 //优选产品的id
const BOUTIQUE=1//精选状态

/**
 * 开通会员
 */
const  DREDGE_VIP_FEE=200 //开通会员费

/**
 * 分享类型
 */
const PRODUCT_SHARE= "0" /**产品分享 */
const VIP_SHARE= "1"     /***会员分享 */
  
/**
* 总公司在代号
*/
const COMPANY_CODE="A0002"
const COMPANY_NAME = "同远科技总店"

/**
 * 当前分店代号
 */
const CURRENT_BRANCH_CODE="";
const CURRENT_BRANCH_NAME="";

/**
 * 常量键名
 */
const SHARE_ID ="shareId" //分享id键名
const FLAGE = "flage"     //区分商品分享与会员分享键名 
const BRANCH_CODE ="branchCode" //分店code的键名

/**
 * 图标
 */

//套房
const SUITE_ROOM_ICON="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/142819559f38ba.png"
//海景房
const  SEA_VIEW_ICON="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/1434462204d013.png"
//阳台房
const BALCONY_ROOM_ICON="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/143910667b44bf.png"
//内舱房
const 
INSIDE_CABIN_ICON="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/1442128687b26e.png"
//其他
const OTHER_ICON="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190122/144402396aed16.png"  

/**
 * 会员状态 
 * 
 **/
const VIP_STATUS="2"        /**会员已到期 */

/**
 * 详情页
 * 
 */
const DEFAULTHEIGHT =75    /**下拉模块默认显示高度*/


/**
 * 小程序的类型 
 * false: 不带切换功能
 * true: 带有切换功能
*/
const MINIPROGRAM_TYPE=true; 

/**
 * Html中id映射
 * 1036013 -->  游轮分类
 * 1036017 -->  活动分类
 * 1036014  --> 签证
 */

module.exports=
{
  CUSTOMORDER_DEMAND_TYPE_01,
  CUSTOMORDER_DEMAND_TYPE_02,
  CUSTOMORDER_DEMAND_TYPE_03,
  CUSTOMORDER_DEMAND_TYPE_04,

  CARD_ACTIVE,
  CARD_NOACTIVE,
  ORDER_GOODS_TYPE_01,
  ORDER_GOODS_TYPE_02,
  ORDER_GOODS_TYPE_03,
  ORDER_GOODS_TYPE_04,
  ORDER_GOODS_TYPE_05,
  ORDER_GOODS_TYPE_06,
  
  HOME_CATEGORY_HOT_SALE_ID,
  HOT_SALE,
  HOME_CATEGORY_FAVOR_PRODUCT_ID,
  BOUTIQUE,

  DREDGE_VIP_FEE,
  PRODUCT_SHARE,
  VIP_SHARE,

  SUITE_ROOM_ICON,
  SEA_VIEW_ICON,
  BALCONY_ROOM_ICON,
  INSIDE_CABIN_ICON,
  OTHER_ICON,
   
  VIP_STATUS,
  COMPANY_CODE,
  COMPANY_NAME,
  MINIPROGRAM_TYPE,

  CURRENT_BRANCH_CODE,
  CURRENT_BRANCH_NAME,

  SHARE_ID,
  FLAGE,
  BRANCH_CODE,
  DEFAULTHEIGHT

}

