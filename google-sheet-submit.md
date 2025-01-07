<h1>Submit a Form to Google Sheets</h1>
<br/>
<p>Cara membuat formulir HTML yang menyimpan data formulir yang dikirimkan di Google Sheets menggunakan JavaScript biasa (ES6)</p>
<h2>1. Buat Google Sheet Baru</h2>
<ul>
<li>Pertama, buka <a href="https://docs.google.com/spreadsheets">Google Sheets</a> dan Start a new spreadsheet</li>
<li>Pilih Blank template.</li>
<li>Ganti namanya Email Subscribers. Atau apa pun, tidak masalah.</li>
<li>Letakkan header berikut pada baris pertama:</li>
</ul>
<table>
  <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
      <th>E</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>timestamp</td>
      <td>nama</td>
      <td>email</td>
      <td>phone</td>
      <td>message</td>
    </tr>
  </tbody>
</table>
<h2>2. Buat Google Apps Script</h2>
<ul>
<li>Klik Ekstensi > Apps Script , yang mana akan membuka tab baru.</li>
<li>Ubah nama dengan "Submit Form to Google Sheets". Pastikan untuk menunggu hingga skrip benar-benar tersimpan dan judul diperbarui sebelum mengedit skrip.</li>
<li>Sekarang, hapus function myFunction() {}blok dalam Kode.gs tab.</li>
<li>Tempelkan skrip berikut di tempatnya dan Save</li>
</ul>
<pre>
  <code>
var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON)
  }

  finally {
    lock.releaseLock()
  }
}
  </code>
</pre>






<p>By Pudin Saepudin, Thank to <a href="https://github.com/jamiewilson/form-to-google-sheets">jamiewilson</a> and <a href="https://www.youtube.com/watch?v=2XosKncBoQ4">Web Programming Unpas</a></p>
<p>Last Update : Jakarta, 07 Januari 2025</p>
