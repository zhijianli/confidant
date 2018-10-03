//index.js
//获取应用实例
const app = getApp();
const host = require('../../utils/host.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        imgUrls: [],
        interval: 5000,
        duration: 1000,
        relatePicSrc: [],
        selectionTestList: [],
        hotTestLIst: []

    },
    go: function () {
        wx.navigateTo({
            url: '../collect/collect'
        })
    },
    jump: function (e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        })
    },
    jumpHot: function (e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        })
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;
        wx.getSetting({
            success(res) {
              console.log(res + "====================");
                if (!res.authSetting['scope.record']) {
                    wx.getUserInfo({
                        scope: 'scope.record',
                        success(data) {
                            // 用户已经同意
                            console.log(data)

                            wx.login({
                                success: res => {
                                    wx.setStorageSync('nickname', data.userInfo.nickName)
                                    wx.setStorageSync('headimgurl', data.userInfo.avatarUrl)
                                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                                    console.log(res)
                                    console.log(res.code);
                                    wx.request({
                                        // url: 'https://api.120xinmao.com/depression-api/weixinCore/getuserInfo.json',
                                      url: host + '/userOperationCenter/memberWechat/getuserInfo.json',
                                        method: "POST",
                                        data: {
                                            code: res.code,
                                            nickname: data.userInfo.nickName,
                                            sex: data.userInfo.gender,
                                            headimgurl: data.userInfo.avatarUrl,
                                            city: data.userInfo.city,
                                            country: data.userInfo.country,
                                            province: data.userInfo.province
                                        },
                                        header: {
                                            "Content-Type": "application/x-www-form-urlencoded"  //post
                                        },

                                        success: function (res) {
                                            console.log(res)
                                            if (res.statusCode == 200) {
                                              console.log("uid 为" + res.data.mid);
                                                wx.setStorageSync('uid', res.data.mid)
                                                wx.hideLoading()
                                            } else {
                                                wx.showToast({
                                                    title: res.errMsg,
                                                    icon: 'none',
                                                    duration: 2000
                                                })
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleInfo/getHomePageMessage',
            
          url: host+'/testCenter/testScaleInfo/getHomePageMessage',
            method: "GET",
            data: {
                isTop: 1
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                console.log(res);
                var n1;
                var n2;
                var n3;

                // var article = res.data.testScaleInfoMessage.description;
                // WxParse.wxParse('article', 'html', article, that, 5);

                if (res.statusCode == 200) {
                    that.setData({
                        relatePicSrc: res.data.homeRecommClassList,
                        // selectionTestList: res.data.selectionTestList.slice(0, 3),
                        selectionTestList: res.data.selectionTestList,
                        hotTestLIst: res.data.hotTestLIst
                    })
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }

            }
        })
        // wx.request({
        //     url: 'https://api.120xinmao.com/depression-api/adBanner/list.json',
        //     // url: 'http://192.168.0.247:8000/depression-api/adBanner/list.json',
        //     method: "POST",
        //     data: {
        //         pageIndex: 1,
        //         pageSize: 10,
        //         showLocation: 5
        //     },
        //     header: {
        //         "Content-Type": "application/x-www-form-urlencoded"  //post
        //     },

        //     success: function (res) {
        //         if (res.statusCode == 200) {
        //             that.setData({
        //                 imgUrls: res.data.list
        //             })
        //         } else {
        //             wx.showToast({
        //                 title: res.errMsg,
        //                 icon: 'none',
        //                 duration: 2000
        //             })
        //         }

        //     }
        // })
    }
})
