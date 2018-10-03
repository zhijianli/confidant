//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const host = require('../../utils/host.js');
Page({
    data: {
        index: 0,
        profileTestingList: [],
        profileCollectTestingList: [],
       nickname:"",
      headimgurl:"",
        test: false,
        collect: false
    },
    clickTest: function () {
        this.setData({ index: 0 })
    },
    clickCollect: function () {
        this.setData({ index: 1 })
    },
    jump: function (e) {
        wx.navigateTo({
            url: `../result/result?id=${e.currentTarget.id}`
        })
    },
    jumpdetail(e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        })
    },

    onShow: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;

       //获取登录用户信息
      that.setData({
        nickname: wx.getStorageSync('nickname'),
        headimgurl: wx.getStorageSync('headimgurl')
      })


        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/orderCenter/testScaleOrder/getTestResultListMessage',
          url: host +'/orderCenter/testScaleOrder/getTestResultListMessage',
            method: "POST",
            data: {
                userId: wx.getStorageSync('uid'),
                pageIndex: 1,
                pageSize: 9999
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    if (res.data.testScaleOrderList) {
                        res.data.testScaleOrderList.forEach(v => {
                            var a = v.createTime;
                            v.createTime = util.timeFormat(a);
                        })
                        that.setData({
                            profileTestingList: res.data.testScaleOrderList
                        })
                    }

                    if (that.data.profileTestingList.length <= 0) {
                        that.setData({ test: true })
                    } else {
                      that.setData({ test: false })
                    }
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }

            }
        })
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleInfo/getCollectionTestList',
          url: host +'/testCenter/testScaleInfo/getCollectionTestList',
            method: "POST",
            data: {
                mid: wx.getStorageSync('uid'),
                pageIndex: 1,
                pageSize: 9999
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            success: function (res) {
                console.log(res)
                wx.hideLoading()
                if (res.statusCode == 200) {
                    that.setData({
                        profileCollectTestingList: res.data.collectionTestList
                    })
                    if (that.data.profileCollectTestingList.length <= 0) {
                        that.setData({ collect: true })
                    }else{
                        that.setData({ collect: false })
                    }
                } else {
                    wx.showToast({
                        title: res.errMsg,
                        icon: 'none',
                        duration: 2000
                    })
                }

                // res.data.testScaleOrderList.forEach(v => {
                //   var a = v.createTime;
                //   v.createTime = util.timeFormat(a);
                // })
                // console.log(res)



            }
        })
    }
})
