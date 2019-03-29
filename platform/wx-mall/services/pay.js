
/**
 * 支付相关服务
 */

const util = require('../utils/util.js');
const api = require('../config/api.js');

/**
 * 判断用户是否登录 余额支付接口
 */
function payOrder(orderId,cardId) { 
  return new Promise(function (resolve, reject) {
    util.request(api.PayPrepayId, { 
      orderId,
      cardId,
    }).then((res) => {
      if (res.errno === 0) {
        const payParam = res.data;
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
};
/**
 * 微信支付接口
 */
function wxPayOrder(orderId)
{
   return new Promise((resolve,reject)=>{
     util.request(api.WXPayPrepayId, {
       orderId
     }).then(res=>{
       if(res.errno==0)
       {
         const payParam = res.data;
         wx.requestPayment({
           'timeStamp': payParam.timeStamp,
           'nonceStr': payParam.nonceStr,
           'package': payParam.package,
           'signType': payParam.signType,
           'paySign': payParam.paySign,
            success:(res)=>{
              resolve(res);
           },
           fail:(err)=>{
             console.log("失败",res);
             reject(err);
           },
           complete:(res)=>{
             console.log(res);
             reject(res);
           }
         });
       }else
       {
          console.log("获取微信统一的下单编号错误",res);
          reject(res);
       }
     })
   })
}
module.exports = {
  payOrder,
  wxPayOrder,
};









