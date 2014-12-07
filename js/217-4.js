$(document).ready(function(){
    //var $location = $('#location');
    var $cart = [];
    var $lat, $lng;
    var $cartDiv = $('#cartDiv');
    $cartDiv.listview();
    var $bodyWidth = $('body').width();

    $(document).on('pageshow', function(){
        $('#directions').html('');
        navigator.geolocation.getCurrentPosition(function(pos){
            $lat = pos.coords.latitude;
            $lng = pos.coords.longitude;
            var $url = '<a href="https://www.google.com/maps/dir/' + $lat + ',' + $lng + ' + , ">Your Location</a>';
            $('#map').append($url);

            var mapOptions = {
                center: new google.maps.LatLng($lat,$lng),
                zoom: 10,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"), mapOptions);

            var destinations = [];
            destinations.push(new google.maps.LatLng($lat, $lng));
            destinations.push(new google.maps.LatLng(48.1450882,-117.1429974));

            var startPos = new google.maps.LatLng($lat,$lng);
            var startMark = new google.maps.Marker({
                position: startPos,
                map: map,
                title: 'Your Location',
                draggable: true
            });

            var endMark = new google.maps.Marker({
                position: new google.maps.LatLng(48.1450882,-117.1429974),
                map: map,
                title: 'Crust and Buns'
            });

            var directionsService = new google.maps.DirectionsService();

            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            directionsDisplay.setPanel(document.getElementById('directions'));
            var request = {
                origin: destinations[0],
                destination: destinations[1],
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status){
                if (status == google.maps.DirectionsStatus.OK){
                    directionsDisplay.setDirections(result);
                } else {
                    alert('Couldn\'t find your map');
                }
            });
            console.log($lat, $lng)
        });
    });


    function initialize(){

    }
    google.maps.event.addDomListener(window, 'load', initialize);


    $('#buyNow').on('click', function(e){
        var $buyUrl = '';
        for (var $item in $cart){
            qty = $cart[$item].qty;
            $buyUrl += "&$product[]=" + $item + '&qty[]=' + qty;
        }
        $.getJSON('buy.php?' + $buyUrl, function(data){
            $('#cartDiv').append(data);
        });
        console.log($buyUrl)
    });

    if(localStorage['favorite']){
        $cart = [];
        var $product;
        var $fav = JSON.parse(localStorage['favorite']);
        for(var item in $fav){
            $product = $fav[item].name;
            $cart[$product] = $fav[item];
        }
        displayCart();
    }

    $('#saveFavorite').on('click', function(){
        var cartStr = '[';
        for( var item in $cart){
            cartStr += JSON.stringify($cart[item]) + ',';
        }
        cartStr = cartStr.slice(0,-1);
        cartStr += ']';
        localStorage['favorite'] = cartStr;
    });

    $('#loadFavorite').on('click', function() {
        $cart = [];
        var $product;
        var $fav = JSON.parse(localStorage['favorite']);
        for(var item in $fav){
            $product = $fav[item].name;
            $cart[$product] = $fav[item];
        }
        displayCart();
    });

    $('.cart').on('click', function(e){
        e.preventDefault();
        var $product = $(this).parent().data('product');
        if($cart[$product]){
            $cart[$product].qty += 1;
        } else {
            $cart[$product] = new Object();
            $cart[$product].qty = 1;
            $cart[$product].name = $(this).parent().data('product');
            $cart[$product].price = $(this).parent().find('p').data('price');
            $cart[$product].img = $(this).parent().find('img').attr('src');
        }
        displayCart();
    });

    function displayCart(){
        var $grandTotal = 0;
        $cartDiv.html('');
        for(var $item in $cart){
            var img = $cart[$item].img;
            var $name = $cart[$item].name;
            var $qty = $cart[$item].qty;
            var $price = $cart[$item].price;
            var $subTotal = $qty * $price;
            $grandTotal += $subTotal;
                $cartDiv.append('<li data-remove="' + $name +'">' +
                '<img src="' + img + '" class="ui-li-icon" />' +
                '<h3>' + $name + '</h3>' +
                '<span class="ui-li-count">' + $qty + '</span>' +
                '</li>');
            $cartDiv.listview('refresh');
        }
        $cartDiv.append('<p>Grand Total:    ' + $grandTotal.toFixed(2) + '</p>');
    }

    $('#clear').on('click', function() {
        $cart = [];
        $cartDiv.html('<li>Your shopping cart is empty</li>')
        $cartDiv.listview('refresh');
    });
});

//function removeProduct(targ){
//    console.log($cart[targ]);
//    if ($cart[targ].qty > 0){
//        $cart[targ].qty -= 1;
//    }
//    var $grandTotal = 0;
//    $cartDiv.html('');
//    for (var item in $cart){
//        var price = $cart[item].price;
//        var qty = $cart[item].qty;
//        var name = $cart[item].name;
//        var img = $cart[item].img;
//        var $subTotal = qty * price;
//        $grandTotal += $subTotal;
//        if ($cart[targ].qty != 0){
//            $cartDiv.append('<li>' +
//            '<a href="#">' +
//            '<img src="' + img + '" class="ui-li-icon" />' +
//            '<h3>' + name + '</h3>' +
//            '<span class="ui-li-count">' + qty + '</span>' +
//            '</a>' +
//            '<a href="#" class="remove">Remove</a>' +
//            '</li>')
//        }
//    }
//    $cartDiv.append('<p>Grand Total:    ' + $grandTotal.toFixed(2) + '</p>');
//    $cartDiv.listview('refresh');
//}