<?php

// GET index route
$app->get('/', function () use ($app) {
    $app->render('index.html');
});
$app->post('/todo', function () use ($app) {

    DB::$host = DB_HOST;
    DB::$user = DB_USER;
    DB::$password = DB_PASS;
    DB::$dbName = DB_NAME;
    DB::$encoding = 'utf8';
    //处理数据
    $result = array('error' => 0, 'message' => '');
    //var_dump($app->request->params(''));
    $phone = $app->request->params('phone');
    $username = $app->request->params('username');
    //检测手机号
    if (empty($phone)) {
        $result['error'] = __LINE__;
        $result['message'] = '请输入您的姓名';
    } elseif (!preg_match('/^1\d{10}$/', $phone)) {
        $result['error'] = __LINE__;
        $result['message'] = '请输入正确的手机号码';
    }
    $res = DB::queryFirstRow("select * from `userinfo` where `phone` = %s", $phone);
    if ($res) {
        $result['error'] = __LINE__;
        $result['message'] = '该手机已经存在~';
    }
    if ($result['error']) {
        echo json_encode($result);
        exit;
    }
    $user_IP = $_SERVER["REMOTE_ADDR"];
    $addStatus = DB::insert(
        'userinfo', 
        array('phone' => $phone, 'username' => $username, 'regdate' => time(), 'ip'=>$user_IP)
    );
    if ($addStatus) {
        $result['message'] = 'ok';
        echo json_encode($result);
        exit;
    }
});