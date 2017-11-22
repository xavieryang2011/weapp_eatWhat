//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    awardsList: {},
    userInfo: {},
    inputval:""
  },
  //事件处理函数
  gotoLottery: function() {
    var list = wx.getStorageSync("awardsConfig");
    var inputval=wx.getStorageSync("inputVal")
    console.log(inputval);
    var award = { 'index': list.length, 'name': inputval };
    list.push(award)

    wx.setStorageSync('awardsConfig', list)
    console.log('list', list)
    this.setData({
      awardsList: list || []
    })
  },
  inputEvent:function(e){
    wx.setStorageSync("inputVal", e.detail.value)
     this.setData({
       inputval:e.detail.value
     })
  },
  deleteItem:function(e){
    var index = e.currentTarget.dataset.index;
    var list=wx.getStorageSync("awardsConfig");
    list.splice(index,1);
    wx.setStorageSync('awardsConfig', list)
    console.log('list', list)

    this.setData({
      awardsList:list || []
    })
  },
  onLoad: function () {
    var that = this
    var list = wx.getStorageSync('awardsConfig')

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
