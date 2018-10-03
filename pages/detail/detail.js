//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const host = require('../../utils/host.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        id: '',
        pic: '',
        index: 0,
        imgSrc: 'music_1516178825000.jpeg',
        testingDetailIsTesting: true,
        detail: {},
        detailComment: {},
        shou: '',
        b: 0,
        inputValue: '',
        focus:false,
        parentCommentId:0,
        placeholder:'我来说说...',
        mask:false
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
        // console.log(e.detail.value)
    },
    toComment: function () {
        var that = this;
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonComment/add',
          url: host +'/userOperationCenter/commonComment/add',
            method: "POST",
            data: {
                articleId: this.data.id,
                mid: wx.getStorageSync('uid'),
                mHeadPortrait: wx.getStorageSync('headimgurl'),
                mName: wx.getStorageSync('nickname'),
                parentCommentId: this.data.parentCommentId,
                commentContent: this.data.inputValue,
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                    that.setData({
                        inputValue: '',
                        placeholder: '我来说说...',
                        mask:false
                    })
                    wx.request({
                        // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonComment/getAllMessage',
                      url: host +'/userOperationCenter/commonComment/getAllMessage',
                        method: "POST",
                        data: {
                            articleId: that.data.id,
                            pageIndex: 1,
                            pageSize: 1000
                        },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"  //post
                        },

                        success: function (res) {
                            console.log(res);
                            if (res.statusCode == 200) {
                                res.data.commonCommentList.forEach(v => {
                                    var a = v.commentTime;
                                    var reg = /http/;
                                    if (reg.test(v.mHeadPortrait)) {
                                        v.mHeadPortrait = v.mHeadPortrait
                                    } else if (v.mHeadPortrait === 'null') {
                                        v.mHeadPortrait = that.data.pic + 'default-avatar.png'
                                    } else {
                                        v.mHeadPortrait = that.data.pic + v.mHeadPortrait
                                    }
                                    v.commentTime = util.timeFormat(a);
                                })
                                that.setData({
                                    detailComment: res.data
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
    forReply(e){
        console.log(e)
        this.setData({
            focus:true,
            parentCommentId: parseInt(e.currentTarget.id),
            placeholder: `回复${e.currentTarget.dataset.name}：`,
            mask:true
        })
    },
    back(e) {
        this.setData({
            focus: false,
            placeholder: `我来说说...`,
            mask: false
        })
    },
    go: function () {
      
        wx.navigateTo({
            url: '../collect/collect'
        })
    },
    start: function (e) {
        wx.navigateTo({
            url: `../topic/topic?id=${e.currentTarget.id}`
        })
    },
    changeIndex: function (e) {
        this.setData({ index: e.currentTarget.id })
    },
    collect: function () {
        var a = '../image/shou-actived.png';
        var that = this;
        if (this.data.shou == a) {
            that.setData({ shou: '../image/shou.png', b: 0 })
        } else {
            that.setData({ shou: a, b: 1 })
        }
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonCollection/collectionTestScale',
          url: host +'/userOperationCenter/commonCollection/collectionTestScale',
            method: "POST",
            data: {
                articleId: this.data.id,
                mid: wx.getStorageSync('uid'),
                isCollected: this.data.b
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                if (res.statusCode == 200) {
                    console.log(res);
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
    view() {
        wx.navigateTo({
            url: `../result/result?id=${this.data.detail.latestOrderId}`
        })
    },
    onShareAppMessage(options) {

        console.log(options.webViewUrl)
        // if (res.from === 'button') {
        //   // 来自页面内转发按钮
        //   console.log(res.target)
        // }
        // return {
        //   path: '/pages/test/test?url=' + encodeURIComponent(options.webViewUrl),
        //   success: function (res) {
        //     console.log(res)
        //     // 转发成功
        //     console.log('ok');
        //   },
        //   fail: function (res) {
        //     // 转发失败
        //     console.log('failed');
        //   }
        // }
    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        this.setData({ pic: app.data.prefix });
        var that = this;
        this.setData({ id: option.id })
        // 是否测过
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/orderCenter/testScaleOrder/isHaveTestOrder',
          url: host +'/orderCenter/testScaleOrder/isHaveTestOrder',
            method: "POST",
            data: {
                relateTestScaleId: option.id,
                userId: wx.getStorageSync('uid')
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                wx.hideLoading()
                if (res.statusCode == 200) {
                    if (res.data.testScaleOrderNum > 0) {
                        that.setData({
                            testingDetailIsTesting: false
                        })
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

        //量表详情
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleInfo/getMessageByIdFromFront',
          url: host +'/testCenter/testScaleInfo/getMessageByIdFromFront',
            method: "POST",
            data: {
                testScaleId: option.id,
                userId: wx.getStorageSync('uid')
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                if (res.statusCode == 200) {
                  console.log(option.id);
                  console.log(wx.getStorageSync('uid'));
                  console.log(res.data.testScaleInfoMessage);
                    var article = res.data.testScaleInfoMessage.description;
                    WxParse.wxParse('article', 'html', article, that, 5);
                    that.setData({
                        detail: res.data.testScaleInfoMessage
                    })
                    if (res.data.isCollected == 0) {
                        that.setData({ shou: '../image/shou.png', b: 0 })
                    } else {
                        that.setData({ shou: '../image/shou-actived.png', b: 1 })
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

        // 评论数
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonComment/getAllMessage',
          url: host +'/userOperationCenter/commonComment/getAllMessage',
            method: "POST",
            data: {
                articleId: option.id,
                pageIndex: 1,
                pageSize: 1000
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                console.log(res);
                if (res.statusCode == 200) {
                  console.log(option.id);
                  console.log(res.data.commonCommentList);
                    res.data.commonCommentList.forEach(v => {
                        var a = v.commentTime;
                        var reg = /http/;
                        if (reg.test(v.mHeadPortrait)) {
                            v.mHeadPortrait = v.mHeadPortrait
                        } else if (v.mHeadPortrait === 'null') {
                            v.mHeadPortrait = that.data.pic + 'default-avatar.png'
                        } else {
                            v.mHeadPortrait = that.data.pic + v.mHeadPortrait
                        }
                        v.commentTime = util.timeFormat(a);

                    })
                    that.setData({
                        detailComment: res.data
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
