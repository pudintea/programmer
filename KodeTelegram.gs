var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()
var TELEGRAM_TOKEN = 'XXXXXXXXXXXX'; // Gantilah dengan Token Bot Telegram Anda
var CHAT_ID = '-11111111111'; // Gantilah dengan Chat ID Grup Anda

function intialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

// Fungsi Mengirim Pesan Telegram
function sendTelegramMessage(message) {
  var url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage";
  var payload = {
    'chat_id': CHAT_ID,
    'text': message,
    'parse_mode': 'HTML'
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  UrlFetchApp.fetch(url, options);
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

    // Membuat Pesan yang Akan Dikirim ke Telegram
    var message = "🔔 *Notifikasi Data Baru Masuk!* 🔔\n\n";
    headers.forEach(function(header, index) {
      message += `<b>${header}:</b> ${newRow[index]}\n`;
    });

    // Mengirim Pesan ke Telegram
    sendTelegramMessage(message);

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
