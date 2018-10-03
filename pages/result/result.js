//index.js
//获取应用实例
const app = getApp();
const util = require('../../utils/util.js');
const host = require('../../utils/host.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        pic: '',
        isShow: false,
        index: -1,
        result: [],
        scoreList: [],
        score: '',
        lowScore: '',
        highScore: '',
        scoreTop: 0,
        scoreLeft: 0,
        testingResultHotTestingList: [],
        detailComment: [],
        inputValue: '',
        aaaaaa: '',
        parentCommentId: 0,
        focus: false,
        placeholder: '我来说说...',
        mask: false
    },
    bindKeyInput: function (e) {
        this.setData({
            inputValue: e.detail.value
        })
        // console.log(e.detail.value)
    },
    jumpHot: function (e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        })
    },
    showScore(e) {
        var that = this;
        // var query = wx.createSelectorQuery();
        // query.select('.result-li').boundingClientRect()
        // query.exec(function (res) {
        //     //res就是 所有标签为mjltest的元素的信息 的数组
        //     console.log(res);
        //     //取高度
        //     console.log(res[0].top);
        //     console.log(res[0].left);
        //     that.setData({
        //         scoreTop: `${res[0].top}rpx`,
        //         scoreLeft: `${res[0].left}rpx`,
        //     })
        // })
        console.log(e)
        var aa = e.currentTarget.dataset.dimensionscore.toFixed(2)
        if (e.target.id == 'p') {
            if (e.currentTarget.dataset.dimensiondescription) {
                wx.showToast({
                    title: e.currentTarget.dataset.dimensiondescription,
                    icon: 'none',
                    duration: 3000
                })
            }
        } else {
            wx.showToast({
                title: `得分${aa}， 正常：${e.currentTarget.dataset.normlowscore}-${e.currentTarget.dataset.normhighscore}`,
                icon: 'none',
                duration: 3000
            })
        }
        // this.setData({
        //     index: 0,
        //     score: e.currentTarget.dataset.dimensionscore,
        //     lowScore: e.currentTarget.dataset.normlowscore,
        //     highScore: e.currentTarget.dataset.normhighscore
        // })
    },
    retest() {
        wx.navigateTo({
            url: `../topic/topic?id=${this.data.result.relateTestScaleId}`
        })
    },
    me() {
        wx.navigateTo({
            url: `../detail/detail?id=${this.data.result.relateTestScaleId}`
        })
    },
    go(e) {
        wx.navigateTo({
            url: `../detail/detail?id=${e.currentTarget.id}`
        })
    },
    hide(e) {
        this.setData({
            index: -1
        })
    },
    toComment: function () {
        if (wx.getStorageSync('uid')) {

        } else {
            wx.getSetting({
                success(res) {
                    console.log(res);
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
        }

        var that = this;

        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonComment/add',
          url: host +'/userOperationCenter/commonComment/add',
            method: "POST",
            data: {
                articleId: that.data.result.relateTestScaleId,
                mid: wx.getStorageSync('uid'),
                mHeadPortrait: wx.getStorageSync('headimgurl'),
                mName: wx.getStorageSync('nickname'),
                parentCommentId: that.data.parentCommentId,
                commentContent: that.data.inputValue,
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                console.log(res)
                that.setData({
                    aaaaaa: res.statusCode
                })
                if (res.statusCode == 200) {
                    that.setData({
                        inputValue: '',
                        placeholder: '我来说说...',
                        mask: false
                    })
                    wx.request({
                        // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonComment/getAllMessage',
                      url: host +'/userOperationCenter/commonComment/getAllMessage',
                        method: "POST",
                        data: {
                            articleId: that.data.result.relateTestScaleId,
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
    forReply(e) {
        console.log(e)
        this.setData({
            focus: true,
            parentCommentId: parseInt(e.currentTarget.id),
            placeholder: `回复${e.currentTarget.dataset.name}：`,
            mask: true
        })
    },
    back(e) {
        this.setData({
            focus: false,
            placeholder: `我来说说...`,
            mask: false
        })
    },
    onShareAppMessage(options) {

        console.log(options)
    },
    onLoad: function (option) {


        // var pages = getCurrentPages()    //获取加载的页面
        // var currentPage = pages[pages.length - 1]    //获取当前页面的对象
        // var url = currentPage.route    //当前页面url
        // var options = currentPage.options    //如果要获取url中所带的参数可以查看options

        // //拼接url的参数
        // var urlWithArgs = url + '?'
        // for (var key in options) {
        //     var value = options[key]
        //     urlWithArgs += key + '=' + value + '&'
        // }
        // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

        // console.log(urlWithArgs) 


        console.log(option)
        wx.showLoading({
            title: '加载中...',
        })
        var that = this;
        this.setData({ pic: app.data.prefix });
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/orderCenter/testScaleOrder/getTestResultMessage',
          url: host+'/orderCenter/testScaleOrder/getTestResultMessage',
            method: "POST",
            data: {
                testScaleOrderId: option.id
                          //  testScaleOrderId: 666
              // testScaleOrderId: 48002
                // testScaleOrderId: 13322
    
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                if (res.statusCode == 200) {

                  //把“建议”转换为富文本
                  var proposal = res.data.testScaleOrderMessage.tsqMessage.proposal;
                  WxParse.wxParse('proposal', 'html', proposal, that, 5);

                    if (res.data.testScaleOrderMessage.relateDisplayMode === 0) {
                        that.setData({
                            scoreList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        })
                    } else if (res.data.testScaleOrderMessage.relateDisplayMode === 1) {
                        that.setData({
                            scoreList: [10, 20, 30, 40, 50, 60, 70, 80, 90]
                        })
                    } else if (res.data.testScaleOrderMessage.relateDisplayMode === 2) {
                        that.setData({
                            scoreList: [-4, -3, -2, -1, 0, 1, 2, 3, 4]
                        })
                    }

                    const currrentYear = new Date().getFullYear()
                    const year = new Date(res.data.testScaleOrderMessage.birthday).getFullYear()

                    res.data.testScaleOrderMessage.birthday = currrentYear - year

                    that.setData({
                        result: res.data.testScaleOrderMessage
                    })
                    if (wx.getStorageSync('uid') == res.data.testScaleOrderMessage.userId) {
                        that.setData({
                            isShow: true
                        })
                    } else {
                        that.setData({
                            isShow: false
                        })
                    }
                    // 评论数
                    wx.request({
                        // url: 'https://m.120xinmao.com/depression-testing/userOperationCenter/commonComment/getAllMessage',
                      url: host +'/userOperationCenter/commonComment/getAllMessage',
                        method: "POST",
                        data: {
                            articleId: res.data.testScaleOrderMessage.relateTestScaleId,
                            pageIndex: 1,
                            pageSize: 1000
                        },
                        header: {
                            "Content-Type": "application/x-www-form-urlencoded"  //post
                        },

                        success: function (res) {
                            wx.hideLoading()
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
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleInfo/getRecommendTestScale',
          url: host +'/testCenter/testScaleInfo/getRecommendTestScale',
            method: "POST",
            data: {
                testScaleOrderId: option.id
                // testScaleOrderId: 13322
                // testScaleOrderId: 999
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                if (res.statusCode == 200) {
                    that.setData({
                        testingResultHotTestingList: res.data.recommendTestScaleList
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
