<?php

namespace app\api\model;

use think\Model;

class BaseModel extends Model
{
    //读取器
    protected function prefixImgUrl($value,$data){
        $finaUrl = $value;
        //图片from为1 存在本地(2为云端) 拼接完整路径
        if($data['from'] == 1){
            $finaUrl = config('setting.img_prefix').$value;
        }
        return $finaUrl;
    }
}
