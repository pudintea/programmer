// Fungsi REST API untuk Mengambil Data Tertentu dalam Format JSON
function doGet(e) {
  try {
    // Membuka spreadsheet dan mengambil data
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    var sheet = doc.getSheetByName(sheetName);
    var rows = sheet.getDataRange().getValues(); // Mengambil semua data

    // Menyiapkan header (baris pertama)
    var headers = rows[0];
    var data = [];

    // Mengonversi setiap baris menjadi objek JSON dengan kolom yang dipilih
    for (var i = 1; i < rows.length; i++) {
      var entry = {
        "timestamp": rows[i][headers.indexOf('timestamp')],
        "nama": rows[i][headers.indexOf('nama')],
        "jenjang": rows[i][headers.indexOf('jenjang')],
        "unit": rows[i][headers.indexOf('unit')],
        "kategori": rows[i][headers.indexOf('kategori')],
        "permohonan": rows[i][headers.indexOf('permohonan')],
        "status": rows[i][headers.indexOf('status')]
      };
      data.push(entry); // Menambahkan data ke array
    }

    // Mengembalikan hasil dalam format JSON
    return ContentService
      .createTextOutput(JSON.stringify({ data: data })) // Format JSON
      .setMimeType(ContentService.MimeType.JSON);      // Mengatur tipe konten JSON
  } catch (e) {
    // Mengembalikan error jika terjadi kesalahan
    return ContentService
      .createTextOutput(JSON.stringify({ 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

//Selesai
