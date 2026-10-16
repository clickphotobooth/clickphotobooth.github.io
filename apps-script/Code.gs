// Click booking form -> "Bookings" tab of Click Master Doc.
// Paste into Extensions > Apps Script on the sheet, then Deploy > New deployment > Web app.

const SHEET_NAME = 'Bookings';

function doPost(e) {
  const p = e.parameter || {};

  // Bots fill the hidden "website" field; people never see it.
  if (p.website) return reply_(true);

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    const submitted = Utilities.formatDate(new Date(), 'Africa/Lagos', 'd MMM yyyy, h:mm a');

    // Columns: STATUS, BILL TO, EVENT, DATE, LOCATION, WHATSAPP NUMBER, INVOICE SENT,
    // SET UP TIME, PACK UP TIME, PACKAGE TYPE, PRICE, NOTES
    sheet.appendRow([
      'Enquired',
      clean_(p.name),
      clean_(p.eventType),
      clean_(p.eventDates),
      clean_(p.location),
      clean_(p.whatsapp),
      '',
      clean_(p.setupTime),
      '',
      clean_(p.package),
      '',
      'Via website ' + submitted,
    ]);
    return reply_(true);
  } finally {
    lock.releaseLock();
  }
}

// Trim, cap length, and stop anything starting with = + - @ being read as a formula.
function clean_(value) {
  const text = String(value || '').trim().slice(0, 200);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply_(ok) {
  return ContentService.createTextOutput(JSON.stringify({ ok: ok }))
    .setMimeType(ContentService.MimeType.JSON);
}
