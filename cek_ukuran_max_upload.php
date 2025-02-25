<?php

function file_upload_max_size() {
    static $max_size = -1;

    if ($max_size < 0) {
        // Ambil nilai post_max_size
        $post_max_size = parse_size(ini_get('post_max_size') ?: '0');
        
        // Jika tidak nol, gunakan sebagai batas awal
        if ($post_max_size > 0) {
            $max_size = $post_max_size;
        } else {
            $max_size = PHP_INT_MAX; // Jika post_max_size = 0, berarti tidak ada batasan
        }

        // Ambil nilai upload_max_filesize
        $upload_max = parse_size(ini_get('upload_max_filesize') ?: '0');

        // Jika upload_max_filesize lebih kecil dari batas awal, gunakan upload_max_filesize
        if ($upload_max > 0 && $upload_max < $max_size) {
            $max_size = $upload_max;
        }
    }

    return $max_size;
}

function parse_size($size) {
    // Ambil satuan (misal: M, K, G, dll.)
    $unit = strtolower(preg_replace('/[^bkmgtpezy]/i', '', $size));
    
    // Ambil angka ukuran tanpa satuan
    $size = floatval(preg_replace('/[^0-9\.]/', '', $size));

    // Jika ada satuan, konversi ke byte
    if ($unit) {
        return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
    }
    
    return round($size);
}

function format_size($bytes) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    $i = 0;

    while ($bytes >= 1024 && $i < count($units) - 1) {
        $bytes /= 1024;
        $i++;
    }

    return number_format($bytes, 2, ',', '.') . ' ' . $units[$i];
}

// Menampilkan hasil dengan format yang mudah dipahami
$max_upload_size = file_upload_max_size();
echo 'Maksimum file upload size: ' . format_size($max_upload_size);


// =============== END ==================
