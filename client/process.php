<?php
// this must be a RESTFull Controller :-)
//
define('UPLOAD_DIR', 'uploads/');
$types = array(
    "image/jpeg" => ".jpg",
    "image/png" => ".png"
);

$response = array(
    "status" => 200,
    "message" => "Ok"
);

if($_POST) {

    $data = $_POST["img"];
    $type = $_POST["type"];

    $data = str_replace("data:{$type};base64,", '', $data);
    $data = str_replace(' ', '+', $data);
    $data = base64_decode($data);

    $im = @imagecreatefromstring($data);
    $filename = UPLOAD_DIR . uniqid() . $types[$type];

    if ($im !== false) {
        switch ($types) {
            case 'image/jpg':
                imagejpeg($im, $filename);
                break;

            default:
                imagealphablending($im, false);
                imagesavealpha($im, true);
                imagepng($im, $filename);
                break;
        }

        imagedestroy($im);
    }
    else {
        $response["message"] = 'An error was encountered!';
        $response["status"] = 500;
    }
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($response);