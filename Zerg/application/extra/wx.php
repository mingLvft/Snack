<?php

return [
    'app_id' => 'wxe0c199dee1fff8f3',
    'app_secret' => '7bfef9a640f161a773f3aa4e98269f0f',
    // 微信使用code换取用户openid及session_key的url地址
    'login_url' => 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',

    // 微信获取access_token的url地址
    'access_token_url' => "https://api.weixin.qq.com/cgi-bin/token?" .
        "grant_type=client_credential&appid=%s&secret=%s",
];