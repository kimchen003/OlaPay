<?php
if (!function_exists('json_result')) {
    function json_result($result)
    {
        header('Content-Type:application/json; charset=utf-8');
        return json_encode($result);
    }

}