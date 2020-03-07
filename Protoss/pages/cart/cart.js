// pages/cart/cart.js
import {Cart} from '../cart/cart-model.js';
var cart = new Cart();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**监听页面隐藏（离开购物车保存缓存数据） */
  onHide:function(){
    cart.execSetStorageSync(this.data.cartData);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var cartData = cart.getCartDataFromLocal();
    // var countsInfo = getCartTotalCounts(true);
    var cal = this._calcTotalAccountAndCounts(cartData);
    console.log(cal);
    console.log(cartData);
    this.setData({
      selectedCounts: cal.selectedCounts,
      selectedTypeCounts: cal.selectedTypeCounts,
      account: cal.account,
      cartData: cartData,
      loadingHidden: true
    });
  },

  _calcTotalAccountAndCounts:function(data){
    var len = data.length,

    //所需要计算的总价格(选中)，但是要注意排除掉未选中的商品
    account = 0,

    //购买商品的总个数(选中)
    selectedCounts = 0,
    //购买商品种类的总数(选中)  判断是否全选selectedTypeCounts(选中商品种类)==cartData.length(总商品种类)
    selectedTypeCounts = 0;
    
    let multiple = 100;
    for(let i=0; i<len; i++){
      //避免0.05 + 0.01 =0.060 000 000 000 000 005 的问题，乘以100 *100
      //选中的商品
      if(data[i].selectStatus){
        account += data[i].counts * multiple * Number(data[i].price) * multiple;
        selectedCounts += data[i].counts;
        selectedTypeCounts++;
      }
    }
    return {
      selectedCounts: selectedCounts,
      selectedTypeCounts: selectedTypeCounts,
      account: account / (multiple*multiple)
    }
  },

  toggleSelect:function(event){
    var id = cart.getDataSet(event, 'id'),
      status = cart.getDataSet(event, 'status'),
      index = this._getProductIndexById(id);

    //改变某个数据中的选中状态(并未更新缓存中的数据选中状态)
    this.data.cartData[index].selectStatus = !status;
    this._resetCartData();
  },

  toggleSelectAll:function(event){
    var status = cart.getDataSet(event, 'status') == 'true';
    var data = this.data.cartData,
    len = data.length;
    for (let i = 0; i < len; i++) {
      //所有商品
      data[i].selectStatus = !status;
    }
    this._resetCartData();
  },

  _resetCartData: function () {
    //重新计算总金额和商品总数
    var newData = this._calcTotalAccountAndCounts(this.data.cartData);
    //重新绑定新数据
    this.setData({
      selectedCounts: newData.selectedCounts,
      selectedTypeCounts: newData.selectedTypeCounts,
      account: newData.account,
      cartData: this.data.cartData
    });
  },

  /**
   * 根据商品id得到 商品所在下标
   */
  _getProductIndexById:function(id){
    var data = this.data.cartData,
    len = data.length;
    for(let i=0; i<len; i++){
      if(data[i].id == id){
        return i;
      }
    }
  },

  changeCounts:function(event){
    var id = cart.getDataSet(event, 'id'),
      type = cart.getDataSet(event, 'type'),
      index = this._getProductIndexById(id),
      counts = 1;
    
    if(type == 'add'){
      cart.addCounts(id);
    }else{
      counts = -1;
      cart.cutCounts(id);
    }

    //修改数量(并未更新缓存中的数据)
    this.data.cartData[index].counts += counts;
    this._resetCartData();
  },

  delete:function(event){
    var id = cart.getDataSet(event, 'id'),
    index = this._getProductIndexById(id);

    //删除某一项商品(并未更新缓存中的数据)
    this.data.cartData.splice(index, 1);
    this._resetCartData();
    //删除缓存中的数据
    cart.delete(id);
  },

  submitOrder:function(event){
    wx.navigateTo({
      url: '../order/order?account=' + this.data.account + '&from=cart',
    });
  }

})