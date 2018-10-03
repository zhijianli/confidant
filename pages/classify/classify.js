//index.js
//获取应用实例
const app = getApp()
const host = require('../../utils/host.js');
Page({
    data: {
        id: '',
        testScaleClassList: [],
        currentClassify: -1,
        testScaleInfoList: []

    },
    selectClassify: function (e) {
        var id = e.currentTarget.id;
        this.setData({
            currentClassify: id
        })
        var that = this;
        wx.request({
          url: host + '/testCenter/testScaleInfo/getMessageFromClassPage',
            // url: 'http://127.0.0.1:9000/testCenter/testScaleInfo/getMessageFromClassPage',
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleInfo/getMessageFromClassPage',
            // url: 'http://192.168.0.247:8000/testCenter/testScaleInfo/getMessageFromClassPage',
            method: "POST",
            data: {
                testScaleClassId: id
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            success: function (res) {
                if (res.statusCode == 200) {
                    that.setData({
                        testScaleInfoList: res.data.testScaleInfoList
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
    },
    jump: function (e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        })
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        console.log(option);
        this.setData({
            // currentClassify: option.id
            currentClassify:0
        })
        var that = this;
        wx.request({
          url: host + '/testCenter/testScaleClass/getAllMessageFromFront',
          // url: 'http://127.0.0.1:9000/testCenter/testScaleClass/getAllMessageFromFront',
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleClass/getAllMessageFromFront',
            // url: 'http://192.168.0.247:8000/testCenter/testScaleClass/getAllMessageFromFront',
            method: "POST",
            data: {

            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            success: function (res) {
                wx.hideLoading()
                if (res.statusCode == 200) {
                   console.log("++++++++++++++++" + res.data.testScaleClassList[0].id);
                    that.setData({
                        testScaleClassList: res.data.testScaleClassList
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
        wx.request({
          url: host + '/testCenter/testScaleInfo/getMessageFromClassPage',
          // url: 'http://127.0.0.1:9000/testCenter/testScaleInfo/getMessageFromClassPage',
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleInfo/getMessageFromClassPage',
            // url: 'http://192.168.0.247:8000/testCenter/testScaleInfo/getMessageFromClassPage',
            method: "POST",
            data: {
                // testScaleClassId: option.id
              testScaleClassId: 0
            },
   
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            success: function (res) {
                if (res.statusCode == 200) {
                  console.log("=========" + option.id);
                    that.setData({
                        testScaleInfoList: res.data.testScaleInfoList
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
    }
})
