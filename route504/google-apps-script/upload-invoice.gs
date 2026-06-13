// Route 504 Invoice Upload Handler
// Deploy as: Web App → Execute as: Me → Who has access: Anyone
// After deploying, copy the URL into UPLOAD_URL in route-customers.html

const CUSTOMERS_FOLDER_ID = '1yXZn-CVLKMtx6yhDMME7ddRl4xp0fHJY';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { customerName, date, fileBase64 } = data;

    if (!customerName || !date || !fileBase64) {
      return jsonResp({ ok: false, error: 'Missing required fields' });
    }

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return jsonResp({ ok: false, error: 'Invalid date format, expected YYYY-MM-DD' });
    }

    const customersFolder = DriveApp.getFolderById(CUSTOMERS_FOLDER_ID);
    const iter = customersFolder.getFoldersByName(customerName);

    if (!iter.hasNext()) {
      return jsonResp({ ok: false, error: 'No Drive folder found for: ' + customerName });
    }

    const customerFolder = iter.next();
    const baseName = date + ' ' + customerName;
    let filename = baseName + '.pdf';

    // Avoid overwriting — find next available suffix
    if (customerFolder.getFilesByName(filename).hasNext()) {
      let suffix = 2;
      while (customerFolder.getFilesByName(baseName + ' ' + suffix + '.pdf').hasNext()) {
        suffix++;
      }
      filename = baseName + ' ' + suffix + '.pdf';
    }

    const bytes = Utilities.base64Decode(fileBase64);
    const blob = Utilities.newBlob(bytes, 'application/pdf', filename);
    customerFolder.createFile(blob);

    return jsonResp({ ok: true, filename: filename });
  } catch (err) {
    return jsonResp({ ok: false, error: err.toString() });
  }
}

function jsonResp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
