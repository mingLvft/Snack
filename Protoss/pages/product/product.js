// pages/product/product.js
import { Product } from '../product/product-model.js';
import { Cart } from '../cart/cart-model.js';

var product = new Product();
var cart = new Cart();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countArray: [1,2,3,4,5,6,7,8,9,10],
    productCount: 1,
    tab: ['商品详情','产品参数','售后保障'],
    currentTabsIndex: 0,
    loadingHidden: false,
    cartTotalCounts: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },

  _loadData: function(){

    product.getDatailInfo(this.data.id, (data)=>{
      console.log(data);
      this.setData({
        //购物车内商品总数量
        cartTotalCounts: cart.getCartTotalCounts(),
        product: data,
        loadingHidden: true
      });
    });

  },

  bindPickerChange:function(event){
    var index = event.detail.value;
    var selectedCount = this.data.countArray[index];
    this.setData({
      productCount: selectedCount
    });
  },

  onTabsItemTap:function(event){
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  onAddingToCartTap:function(events){
    //防止快速点击
    if (this.data.isFly) {
      return;
    }
    this._flyToCartEffect(events);

    this.addToCart();
    // var counts = this.data.cartTotalCounts + this.data.productCount;
    // this.setData({
    //   cartTotalCounts: cart.getCartTotalCounts()
    // });
  },

  addToCart:function(){
    var tempObj = {};
    var keys = ['id', 'name', 'main_img_url', 'price'];

    for (var key in this.data.product){
      //for-in遍历数组出来的值是数组下标，遍历js对象结果是对象属性名。
      if(keys.indexOf(key) >= 0){
        tempObj[key] = this.data.product[key];
      }
    }

    cart.add(tempObj, this.data.productCount);
  },

  onCartTap:function(event){
    wx.switchTab({
      url: '/pages/cart/cart',
    });
  },

  /*加入购物车动效*/
  _flyToCartEffect: function (events) {
    //获得当前点击的位置，距离可视区域左上角
    var touches = events.touches[0];
    var diff = {
      x: '25px',
      y: 25 - touches.clientY + 'px'
    },
      style = 'display: block;-webkit-transform:translate(' + diff.x + ',' + diff.y + ') rotate(350deg) scale(0)';  //移动距离
    this.setData({
      isFly: true,
      translateStyle: style
    });
    var that = this;
    setTimeout(() => {
      that.setData({
        isFly: false,
        translateStyle: '-webkit-transform: none;',  //恢复到最初状态
        isShake: true,
      });
      setTimeout(() => {
        var counts = that.data.cartTotalCounts + that.data.productCount;
        that.setData({
          isShake: false,
          cartTotalCounts: counts
        });
      }, 200);
    }, 1000);
  }

})