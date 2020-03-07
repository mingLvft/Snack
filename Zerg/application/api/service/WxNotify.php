<?php


namespace app\api\service;

use app\lib\enum\OrderStatusEnum;
use app\api\model\Order as OrderModel;
use app\api\model\Product;
use app\api\service\Order as OrderService;
use Think\Db;
use think\Exception;
use think\Loader;
use Think\Log;

//  extend/WxPay/WxPay.Api.php
Loader::import('WxPay.WxPay',EXTEND_PATH,'.Api.php');

class WxNotify extends \WxPayNotify
{
    public function NotifyProcess($objData, $config, &$msg)
    {
        if($objData['result_code'] == 'SUCCESS'){
            $orderNo = $objData['out_trade_no'];
            //锁住事务块 防止多次减库存
            Db::startTrans();
            try {
                $order = OrderModel::where('order_no','=',$orderNo)->lock(true)->find();
                if($order->status == 1){
                    $service = new OrderService();
                    $stockStatus = $service->checkOrderStock($order->id);
                    if($stockStatus['pass']){
                        $this->updateOrderStatus($order->id,true);
                        $this->reduceStock($stockStatus);
                    }else{
                        $this->updateOrderStatus($order->id,false);
                    }
                }
                Db::commit();
                return true;

            }catch (Exception $ex){
                Db::rollback();
                Log::error($ex);
                //回调如果失败则再次请求回调
                return false;
            }
        }else{
            return true;
        }
    }

    private function reduceStock($stockStatus){
        foreach ($stockStatus['pStatusArray'] as $singlePStatus){
            Product::where('id','=',$singlePStatus['id'])->setDec('stock',$singlePStatus['count']);
        }
    }

    private function updateOrderStatus($orderID, $success){
        //true 则库存检测通过 已支付1  false库存检测不通过 已支付库存不足4
        $status = $success ? OrderStatusEnum::PAID : OrderStatusEnum::PAID_BUT_NOT_OF;
        OrderModel::where('id','=',$orderID)->update(['status'=>$status]);
    }
}