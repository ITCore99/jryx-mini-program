var api = require('../config/api.js');
var app=getApp();


/**
 * 时间格式化函数
 */
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = "POST", header = "application/x-www-form-urlencoded") {
    return new Promise(function (resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'Content-Type': header,
                'X-Nideshop-Token': wx.getStorageSync('token'),
                 'X-Company-Token': app.globalData.branchToken,
                // 'X-Company-Token':'A0002',
            },
            success: function (res) {
              if (res.statusCode== 200) 
              {
                    if (res.data.errno == 401)
                    { 
                      wx.showModal({
                        title: '登录提示',
                        content: '未登录/登录状态失效状，前往登录',
                        success:(res)=>{
                           if(res.confirm)
                           {
                             wx.navigateTo({
                               url: '/pages/auth/btnAuth/btnAuth',
                             });
                           }else if(res.cancel)
                           {
                             wx.showToast({
                               title: '登录授权失败',
                               icon:'none'
                             })
                           }
                        }
                      })

                    } else {
                        wx.hideLoading();
                        resolve(res.data);
                    }
                } else {
                    wx.hideLoading();
                    reject(res.errMsg);
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    });
}
/**
 * 检查微信会话是否过期
 */
function checkSession() {
    return new Promise(function (resolve, reject) {
        wx.checkSession({
            success: function () {
                resolve(true);
            },
            fail: function () {
                reject(false);
            }
        })
    });
}
/**
 * 调用微信登录
 */
function login() {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: function (res) {
                if (res.code) {
                    resolve(res);
                } else {
                    reject(res);
                }
            },
            fail: function (err) {
                reject(err);
            }
        });
    });
}

function redirect(url)
 {
    //判断页面是否需要登录
    if (false) {
        wx.redirectTo({
            url: '/pages/auth/login/login'
        });
        return false;
    } else {
        wx.redirectTo({
            url: url
        });
    }
}

function showErrorToast(msg) {
    wx.showToast({
        title: msg,
        image: '/static/images/icon_error.png'
    })
}

function showSuccessToast(msg) {
    wx.showToast({
        title: msg,
    })
}
/**
 * 获取小图标的路径函数(页面详情页)
 * 
 */
function getIconUrl(id)
{
  let url="";
   switch(id)
   {
     case 1001 : /***独立卫生间 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/16515713864103.png";
     break;
     case 1002 :/**淋浴 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/1652378204425.png";
     break;
     case 1003 : /**液晶电视 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/1653244942328f.png";
     break;
     case 1004 :/**保险箱 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/165451590f3f1.png";
     break;
     case 1005: /**冰箱 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/165518252c94e3.png";
     break; 
     case 1006: /**转换插座 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/16561097477c5a.png";
     break; 
     case 1007: /**电话 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/1656435055e184.png";
      break; 
     case 1008: /**热水壶 */
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/165711400e7500.png";
      break; 
      case 1009: /**毛巾*/
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/165742487eb8ce.png";
      break; 
      case "1010": /**香皂*/
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/165807692f9556.png";
     break; 
     case 1011: /**沐浴露*/
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/1658381075d5e8.png";
     break; 
     case 1012: /**洗发露*/
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/1658381075d5e8.png";
     break; 
     case 1013: /**吹风机*/
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/165916867161e9.png";
    break; 
    default:
url="http://hldfiles.oss-cn-qingdao.aliyuncs.com/selectholiday/upload/20190215/1659541852d220.png"
    break;
   }
  return url;
}

module.exports = {
    formatTime,
    request,
    redirect,
    showErrorToast,
    showSuccessToast,
    checkSession,
    login,
    getIconUrl
}


