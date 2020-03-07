// pages/home/home.js

import {Home} from '../home/home-model.js';

var home = new Home();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
  },

  onLoad:function(){
    this._loadData();
  },

  _loadData:function(){
    var id = 1;
    home.getBannerData(id,(res)=>{
      console.log(res);
      this.setData({
        loadingHidden: true,
        'bannerArr': res
      });
    });

    /*首页主题（精选主题） */
    home.getThemeData((res)=>{
      console.log(res);
      this.setData({
        'themeArr': res
      });
    });

    /*最近新品 */
    home.getProductsData((res) => {
      console.log(res);
      this.setData({
        productsArr: res
      });
    });

  },

  onProductsItemTap:function(event){
    var id = home.getDataSet(event,'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    });
  },

  onThemesItemTap: function (event) {
    var id = home.getDataSet(event, 'id');
    var name = home.getDataSet(event, 'name');
    wx.navigateTo({
      url: '../theme/theme?id=' + id + '&name=' + name,
    });
  },

})