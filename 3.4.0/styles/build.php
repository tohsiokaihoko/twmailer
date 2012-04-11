<?php
$path="base/";
foreach (glob($path."*.css") as $baseName) {
    $baseName=str_replace($path,"",$baseName);
    
    $contents=file_get_contents($path.$baseName);
    
    foreach (glob("../plugins/css/*.css") as $filename) {
       $contents.=file_get_contents($filename);
    }

    $fp=fopen($baseName,"w+");
    fputs($fp,$contents);
    fclose($fp);
}
?>