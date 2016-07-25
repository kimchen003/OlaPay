<?php
namespace lib;
class Wechat
{
    const ACCESS_TOKEN_URL = 'https://api.weixin.qq.com/cgi-bin/token';
    const JS_TICKET_URL = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket';

    public $app_id = NULL;
    public $app_secret = NULL;
    public $access_token = NULL;
    public $js_ticket = NULL;
    public $errors = array();
    public $boundary = '';
    public $http_header = array();

    private static $_instance = NULL;

    public static function getInstance($params)
    {
        if (NULL === self::$_instance) {
            self::$_instance = new Wechat($params);
        }
        return self::$_instance;
    }

    public function __construct($params)
    {
        $this->app_id = $params['app_id'];
        $this->app_secret = $params['app_secret'];
    }

    public function authorizeUrl($redirect_uri, $scope = 'snsapi_base', $state = 'welcome')
    {
        $params = array();
        $params['appid'] = $this->app_id;
        $params['redirect_uri'] = $redirect_uri;
        $params['response_type'] = 'code';
        $params['scope'] = $scope;
        $params['state'] = $state;
        return $this->authorize_url . "?" . http_build_query($params) . "#wechat_redirect";
    }

    public function accessToken()
    {
        if (Cache::getInstance()->has('wechat_access_token')) {
            $this->access_token = Cache::getInstance()->get('wechat_access_token');
        } else {
            $params = array();
            $params['appid'] = $this->app_id;
            $params['secret'] = $this->app_secret;
            $params['grant_type'] = 'client_credential';
            $response = $this->http(self::ACCESS_TOKEN_URL . '?' . http_build_query($params));
            $response = json_decode($response, true);
            if (is_array($response) && !isset($response['errcode'])) {
                $expires_in = $response['expires_in'] / 60;
                Cache::getInstance()->put('wechat_access_token', $response['access_token'], $expires_in);
                $this->access_token = $response['access_token'];
            } else {
                return FALSE;
            }
        }

        return $this->access_token;
    }

    public function jsapiTicket()
    {
        if (Cache::getInstance()->has('wechat_js_ticket')) {
            $this->js_ticket = Cache::getInstance()->get('wechat_js_ticket');
            return $this->js_ticket;
        }

        $token = $this->accessToken();
        $r = $this->http(self::JS_TICKET_URL . "?access_token=$token&type=jsapi");
        $r = json_decode($r, true);
        if (isset($r['errcode']) && $r['errcode'] == 0) {
            $expires_in = $r['expires_in'] / 60;
            Cache::getInstance()->put('wechat_js_ticket', $r['ticket'], $expires_in);
            $this->js_ticket = $r['ticket'];
        } else {
            return FALSE;
        }
    }

    public function getSignPackage($share_url)
    {
        $ticket = $this->jsapiTicket();
        $timestamp = time();
        $noncestr = $this->createNonceStr(16);
        $string = "jsapi_ticket=$ticket&noncestr=$noncestr&timestamp=$timestamp&url=$share_url";
        $signature = sha1($string);
        $signpackage = array("appId" => $this->app_id, "nonceStr" => $noncestr, "timestamp" => $timestamp, "url" => $share_url, "signature" => $signature, "rawString" => $string);
        return $signpackage;
    }

    public function http($url, $method = 'GET', $postfields = array(), $extheaders = array())
    {
        if (!function_exists('curl_init'))
            exit('Need to open the curl extension');

        $method = strtoupper($method);
        $ci = curl_init();
        curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ci, CURLOPT_TIMEOUT, 30);
        curl_setopt($ci, CURLOPT_ENCODING, "");
        curl_setopt($ci, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ci, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ci, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ci, CURLOPT_HEADER, false);
        $headers = (array)$extheaders;

        if ($method == 'POST') {
            curl_setopt($ci, CURLOPT_POST, TRUE);
            if (!empty($postfields)) {
                curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
            }
        }

        curl_setopt($ci, CURLINFO_HEADER_OUT, TRUE);
        curl_setopt($ci, CURLOPT_URL, $url);
        if ($headers) {
            curl_setopt($ci, CURLOPT_HTTPHEADER, $headers);
        }

        $response = curl_exec($ci);
        curl_close($ci);
        return $response;
    }

    private function buildHttpQueryMulti($params)
    {
        if (!$params)
            return '';

        uksort($params, 'strcmp');

        $pairs = array();

        $this->boundary = $this->boundary = uniqid('------------------');
        $MPboundary = '--' . $this->boundary;
        $endMPboundary = $MPboundary . '--';
        $multipartbody = '';

        foreach ($params as $parameter => $value) {

            if (in_array($parameter, array('pic', 'image')) && $value{0} == '@') {
                $url = ltrim($value, '@');
                $content = file_get_contents($url);
                $array = explode('?', basename($url));
                $filename = $array[0];

                $multipartbody .= $MPboundary . "\r\n";
                $multipartbody .= 'Content-Disposition: form-data; name="' . $parameter . '"; filename="' . $filename . '"' . "\r\n";
                $multipartbody .= "Content-Type: image/unknown\r\n\r\n";
                $multipartbody .= $content . "\r\n";
            } else {
                $multipartbody .= $MPboundary . "\r\n";
                $multipartbody .= 'content-disposition: form-data; name="' . $parameter . "\"\r\n\r\n";
                $multipartbody .= $value . "\r\n";
            }
        }

        $multipartbody .= $endMPboundary;
        return $multipartbody;
    }

    private function getHeader($ch, $header)
    {
        $i = strpos($header, ':');
        if (!empty($i)) {
            $key = str_replace('-', '_', strtolower(substr($header, 0, $i)));
            $value = trim(substr($header, $i + 2));
            $this->http_header[$key] = $value;
        }
        return strlen($header);
    }

    private function createNonceStr($length = 16)
    {
        $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        $str = "";
        for ($i = 0; $i < $length; $i++) {
            $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        }
        return $str;
    }

}
