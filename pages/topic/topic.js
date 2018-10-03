//index.js
//获取应用实例
const app = getApp();
const host = require('../../utils/host.js');
Page({
    data: {
        relateTestScaleId: '',
        index: 0,
        showProfile: false,
        arr: [],
        testingRubric: [],
        width: '0%',
        format: ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "I.", "J.", "K.", "L.", "M."],
        mask: false,
        sexModalStatus: false,
        xb: '请选择',
        date: '1990-01-01',
        // birthday: '',
        fuck: 0,
        end: ''
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
    width() {
        if (!this.testingRubric) {
            return 0
        }
        return `${(this.index + 1) / this.testingRubric.length * 100}%`
    },
    report(e) {
        var that = this;
        that.data.arr[that.data.index].optionId = parseInt(e.currentTarget.id)
        if (that.data.index + 1 == that.data.testingRubric.length) {
            that.setData({
                fuck: parseInt(e.currentTarget.id)
            })
        } else {
            that.setData({
                fuck: that.data.arr[that.data.index + 1].optionId
            })
        }

        if (that.data.index < that.data.testingRubric.length - 1) {
            that.setData({

                index: that.data.index + 1,
                width: ((that.data.index + 2) / that.data.testingRubric.length) * 80 + '%'
            })
        }
    },
    back() {
        this.setData({
            index: this.data.index - 1,
            fuck: this.data.arr[this.data.index - 1].optionId
        })
    },
    submit() {
        if (this.data.arr[this.data.arr.length - 1].optionId) {
            this.setData({
                mask: true
            })
        } else {
            wx.showToast({
                title: '请选择最后一题',
                icon: 'none',
                duration: 2000
            })
        }
    },
    bian() {
        this.setData({
            sexModalStatus: true
        })
    },
    selectItem(e) {
        var that = this;
        if (e.currentTarget.id == 1) {
            that.setData({
                xb: '男',
                sexModalStatus: false
            })
        } else {
            that.setData({
                xb: '女',
                sexModalStatus: false
            })
        }
    },
    // qu(e) {
    //     var a = e.detail.value.replace(/-/g, "/")
    //     this.setData({
    //         birthday: a
    //     })
    // },
    bindDateChange(e) {
        console.log(e)
        var a = e.detail.value.replace(/-/g, "/")
        this.setData({
            date: a
        })
    },
    check() {
        var that = this;
        if (that.data.xb == '请选择') {
            wx.showToast({
                title: '请选择性别',
                icon: 'none',
                duration: 2000
            })
        } else if (that.data.date == 'YYYY-MM-DD') {
            wx.showToast({
                title: '请选择出生日期',
                icon: 'none',
                duration: 2000
            })
        }

        if (that.data.date != 'YYYY-MM-DD' && that.data.xb != '请选择') {
            wx.request({
                // url: 'https://m.120xinmao.com/depression-testing/orderCenter/testScaleOrder/completeTest',
              url: host +'/orderCenter/testScaleOrder/completeTest',
                method: "POST",
                data: {
                    birthday: that.data.date,
                    relateTestScaleId: that.data.relateTestScaleId,
                    sex: that.data.xb == '男' ? 'man' : 'woman',
                    tsotListStr: JSON.stringify(that.data.arr),
                    userId: wx.getStorageSync('uid'),
                  userName: wx.getStorageSync('nickname'),
                    // telephone: 13705801711

                },
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"  //post
                },

                success: function (res) {
                    console.log(res);
                    if (res.statusCode == 200) {
                        wx.navigateTo({
                            url: `../result/result?id=${res.data.testScaleOrderId}`
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

    },
    onLoad: function (option) {
        wx.showLoading({
            title: '加载中...',
        })
        var date = new Date;
        console.log(date.getFullYear());
        console.log(option.id)
        this.setData({
            end: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        })
        var that = this;
        wx.request({
            // url: 'https://m.120xinmao.com/depression-testing/testCenter/testScaleTitle/getAllTitleAndOption',
          url: host +'/testCenter/testScaleTitle/getAllTitleAndOption',
            method: "POST",
            data: {
                testScaleId: option.id
            },
            header: {
                "Content-Type": "application/x-www-form-urlencoded"  //post
            },

            success: function (res) {
                wx.hideLoading()
                console.log(res);
                if (res.statusCode == 200) {
                    that.setData({
                        relateTestScaleId: option.id,
                        testingRubric: res.data.testScaleTitleList,
                        arr: res.data.testScaleTitleList.map((item) => ({
                            testScaleTitleId: item.id,
                            optionId: ""
                        })),
                        width: (1 / res.data.testScaleTitleList.length) * 100 + '%'
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