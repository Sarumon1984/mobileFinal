/**
 * Created by Sarumon on 12/7/2014.
 */
function init(){
    var pictureSource;
    var destinationType;

    document.addEventListener("deviceready",onDeviceReady,false);

    function onDeviceReady(){
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    function onPhotoDataSuccess(imageData){
        var capturedPicture = document.getElementById('capturedPicture');
        capturedPicture.style.width = imageData.width;
        capturedPicture.style.height = imageData.height;
        capturedPicture.style.display = 'block';
        capturedPicture.src = "data:image/jpeg;base64," + imageData;
    }

    function takePicture(){
        navigator.camera.getPicture(onPhotoDataSuccess, onFail,{
            quality: 100,
            destinationType: destinationType.DATA_URL });
    }

    function onFail(message){
        alert('Failed because: ' + message);
    }

    function clearPicture(){
        document.getElementById('capturedPicture').src = '';
    }

    function getPhoto(source){
        navigator.camera.getPicture(onPhotoURISuccess, onFail, {
            quality: 100,
            destinationType: destinationType.FILE_URI,
            sourceType: source });
    }

    function onPhotoURISuccess(imageURI){
        var capturedPicture = document.getElementById('capturedPicture');
        capturedPicture.style.display = 'block';
        capturedPicture.src = imageURI;
    }

    document.getElementById('takePic').onclick = takePicture();
    document.getElementById('clearPic').onclick = clearPicture();
    document.getElementById('getPhoto').onclick = getPhoto(pictureSource.SAVEDPHOTOALBUM);
}


window.onload = init;