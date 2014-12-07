<?php

$products = $_GET['$product'];
$quantity = $_GET['qty'];


$count = count($products);
$return_str = '';

for ($i = 0; $i < $count; $i++){
    $return_str .= $products[$i] . ': ' . $quantity[$i] . "\r\n";
}

mail("order-confirmation@217-4.devindelp.com, 217cis@gmail.com",
    "Order Confirmation",
    $return_str);
echo json_encode($return_str . 'Order Confirmation Sent');

