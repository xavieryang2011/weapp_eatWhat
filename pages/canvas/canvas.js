var app = getApp()
//默认长度
var awardLength=7
Page({
  data: {
    awardsList: {},
    animationData: {},
    btnDisabled: '',
    winList:{}
    },
  gotoList: function() {
    wx.redirectTo({
      url: '../list/list'
    })
  },
  getLottery: function () {
    var awardsConfig = wx.getStorageSync('awardsConfig'),
    awardLength=awardsConfig.length;
    var that = this
    var awardIndex = Math.random() * awardLength >>> 0;

    // 获取奖品配置
  
    var runNum = awardLength+2;
    console.log(awardIndex)

    // 初始化 rotate
  /*  var animationInit = wx.createAnimation({
      duration: 10
    })
    this.animationInit = animationInit;
    animationInit.rotate(0).step()
    this.setData({
      animationData: animationInit.export(),
      btnDisabled: 'disabled'
    })*/

    // 旋转抽奖
    app.runDegs = app.runDegs || 0
    console.log('deg', app.runDegs)
    app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / (awardLength)))
    console.log('deg', app.runDegs)

    var animationRun = wx.createAnimation({
      duration: 4000,
      timingFunction: 'ease'
    })
    that.animationRun = animationRun
    animationRun.rotate(app.runDegs).step()
    that.setData({
      animationData: animationRun.export(),
      btnDisabled: ''
    })

    // 中奖提示
    setTimeout(function() {
      wx.showModal({
        title: '结果',
        content:  (awardsConfig[awardIndex].name),
        showCancel: false
      })
     
      // 记录奖品
      var winAwards = wx.getStorageSync('winAwards') || { data: [] }
      var curDate = new Date();
      console.log('data', curDate.toLocaleString())
      winAwards.data.push(awardsConfig[awardIndex].name +"  "+ curDate.toLocaleString())
      wx.setStorageSync('winAwards', winAwards)

      that.setData({
        winList: wx.getStorageSync('winAwards').data.reverse() || { data: [] }
      })
      console.log('winlist', wx.getStorageSync('winAwards').data || { data: [] })
    }, 4000);
    

    /*wx.request({
      url: '../../data/getLottery.json',
      data: {},
      header: {
          'Content-Type': 'application/json'
      },
      success: function(data) {
        console.log(data)
      },
      fail: function(error) {
        console.log(error)
        wx.showModal({
          title: '抱歉',
          content: '网络异常，请重试',
          showCancel: false
        })
      }
    })*/
  },
  onShow: function (e) {

    var that = this;

    // getAwardsConfig
    app.awardsConfig = {
      chance: true,
      awards:[
        { 'index': 0, 'name': '羊汤'},
        {'index': 1, 'name': '冰冰湘'},
        {'index': 2, 'name': '牛舌'},
        {'index': 3, 'name': '九毛九'},
        {'index':4,'name':'太度'},
        {'index':5,'name':'食饭'},
        {'index':6,'name':'牛肉汤'}
      ]
    }
    
    if(wx.getStorageSync('awardsConfig')==""){
     wx.setStorageSync('awardsConfig', app.awardsConfig.awards)
    }
    
    that.setData({
      winList: wx.getStorageSync('winAwards').data.reverse() || { data: [] }
    })
    // 绘制转盘
    var awardsConfig = wx.getStorageSync('awardsConfig'),
        len = awardsConfig.length,
        awardLength=len,
        rotateDeg = 360 / len / 2 + 90,
        html = [],
        turnNum = 1 / len  // 文字旋转 turn 值
    that.setData({
      btnDisabled: app.awardsConfig.chance ? '' : 'disabled' 
    })
    var ctx = wx.createContext()
    for (var i = 0; i < len; i++) {
      // 保存当前状态
      ctx.save();
      // 开始一条新路径
      ctx.beginPath();
      // 位移到圆心，下面需要围绕圆心旋转
      ctx.translate(150, 150);
      // 从(0, 0)坐标开始定义一条新的子路径
      ctx.moveTo(0, 0);
      // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
      ctx.rotate((360 / len * i - rotateDeg) * Math.PI/180);
      // 绘制圆弧
      ctx.arc(0, 0, 150, 0,  2 * Math.PI / len, false);

      // 颜色间隔
      if (i % 2 == 0) {
          ctx.setFillStyle('rgba(255,184,32,.1)');
      }else{
          ctx.setFillStyle('rgba(255,203,63,.1)');
      }

      // 填充扇形
      ctx.fill();
      // 绘制边框
      ctx.setLineWidth(0.5);
      ctx.setStrokeStyle('rgba(228,55,14,.1)');
      ctx.stroke();

      // 恢复前一个状态
      ctx.restore();

      // 奖项列表
      html.push({turn: i * turnNum + 'turn', lineTurn: i * turnNum + turnNum / 2 + 'turn', award: awardsConfig[i].name});    
    }
    that.setData({
        awardsList: html
      });

    // 对 canvas 支持度太差，换种方式实现
    /*wx.drawCanvas({
      canvasId: 'lotteryCanvas',
      actions: ctx.getActions()
    })*/

  }

})
