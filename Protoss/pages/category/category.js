// pages/category/category.js
import {Category} from '../category/category-model.js';
var category = new Category();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transClassArr:['tanslate0','tanslate1','tanslate2','tanslate3','tanslate4','tanslate5'],
    currentMenuIndex: 0,
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData:function(){
    category.getCategoryType((categoryData)=>{
      console.log(categoryData);
      this.setData({
        categoryTypeArr: categoryData
      });
      //在回调里再进行获取分类详情商品的方法调用
      category.getProductsByCategory(categoryData[0].id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        };
        console.log(dataObj);
        this.setData({
          loadingHidden: true,
          categoryInfo0: dataObj
        });
      });
    });
  },

  /*切换分类*/
  changeCategory: function (event) {
    var index = category.getDataSet(event, 'index'),
      id = category.getDataSet(event, 'id')//获取data-set
    this.setData({
      currentMenuIndex: index
    });

    //如果数据是第一次请求
    if (!this.isLoadedData(index)) {
      var that = this;
      category.getProductsByCategory(id, (data) => {
        //绑定新分类
        that.setData(that.getDataObjForBind(index, data));
      });
    }
  },

  isLoadedData: function (index) {
    if (this.data['categoryInfo' + index]) {
      return true;
    }
    return false;
  },

  getDataObjForBind:function(index,data){
    var obj={},
        arr=[0,1,2,3,4,5],
        baseData=this.data.categoryTypeArr[index];
    for(var item in arr){
      if(item==arr[index]) {
        obj['categoryInfo' + item]={
          procucts:data,
          topImgUrl:baseData.img.url,
          title:baseData.name
        };

        return obj;
      }
    }
  },

  onProductsItemTap: function (event) {
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

})