<?php


namespace app\api\controller\v1;


use app\api\controller\BaseController;
use app\api\service\WxNotify;
use app\api\validate\IDMustBePostiveInt;
use app\api\service\Pay as PayService;

class Pay extends BaseController
{
    protected $beforeActionList = [
        'checkExclusiveScope' => ['only' => 'getPreOrder']
    ];

    //小程序调用接口获取预订单参数 返回小程序 小程序再根据参数发起支付
    public function getPreOrder($id=''){
        (new IDMustBePostiveInt())->goCheck();
        $pay = new PayService($id);
        return $pay->pay();
    }

    public function receiveNotify(){
        //通知频率为15/15/30/180/1800/1800/1800/1800/3600，单位:秒
        //1. 检查库存量，超卖
        //2. 更新这个订单的status状态
        //3. 减库存
        //如果成功处理，我们返回微信成功处理的信息。否则，我们需要返回没有成功处理，
        //特点: post; xml格式;不会携带参数
        $notify = new WxNotify();
        $notify->Handle();
    }
}