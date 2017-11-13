//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    awardsList: {},
    userInfo: {}
  },
  //事件处理函数
  gotoLottery: function() {
    wx.redirectTo({
      url: '../canvas/canvas'
    })
  },
  deleteItem:function(e){
    var index = e.currentTarget.dataset.index;
  },
  onLoad: function () {
    var that = this
    var list = wx.getStorageSync('awardsConfig').awards
    console.log('list',list)

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        awardsList: list || []
      })
    })
  }
})
