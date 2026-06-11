// Weekend Baddie - Google Apps Script Backend
// Deployment Instructions:
// 1. Go to script.google.com and create a new project.
// 2. Paste this code into Code.gs (replace the default).
// 3. Update the SHEET_NAME variable if your sheet has a different name.
// 4. Set up an installable Trigger:
//    - Go to "Triggers" (clock icon) -> Add Trigger
//    - Choose "onFormSubmit", "Head", "From spreadsheet", "On form submit".
// 5. Deploy as Web App:
//    - "Deploy" -> "New deployment" -> "Web app"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
// 6. Copy the Web App URL and set it as NEXT_PUBLIC_GAS_WEB_APP_URL in your Next.js environment.

const SHEET_NAME = "Form Responses 1";
const MASTER_SHEET_NAME = "Master_Players";

// Triggered when a new form response is submitted
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  
  // e.range is the range that was edited/added.
  const row = e.range.getRow();
  
  // Get the headers and the submitted row data
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  let emailIndex = -1;
  let nameIndex = -1;
  let qrIdIndex = -1;
  let qrLinkIndex = -1;
  
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toString().toLowerCase();
    if (header.includes("email")) emailIndex = i;
    if (header.includes("name")) nameIndex = i;
    if (header === "qr_id") qrIdIndex = i;
    if (header === "qr link") qrLinkIndex = i;
  }
  
  let nextCol = headers.length;
  if (qrIdIndex === -1) {
    qrIdIndex = nextCol++;
    sheet.getRange(1, qrIdIndex + 1).setValue("QR_ID");
  }
  if (qrLinkIndex === -1) {
    qrLinkIndex = nextCol++;
    sheet.getRange(1, qrLinkIndex + 1).setValue("QR Link");
  }
  
  const email = emailIndex !== -1 ? rowData[emailIndex] : null;
  const name = nameIndex !== -1 ? rowData[nameIndex] : "Participant";
  
  if (!email) {
    console.error("No email found in submission row " + row);
    return;
  }
  
  // Generate Unique ID
  const uniqueId = `WB-${row}-${Utilities.base64EncodeWebSafe(email).substring(0, 10)}`;
  
  // Generate QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(uniqueId)}`;
  
  // Write IDs and URL back to sheet
  sheet.getRange(row, qrIdIndex + 1).setValue(uniqueId);
  sheet.getRange(row, qrLinkIndex + 1).setValue(qrCodeUrl);
  
  // Send Email with QR Code
  const subject = "Your Weekend Baddie Ticket!";
  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; text-align: center;">
      <h2>Hi ${name}!</h2>
      <p>You're successfully registered for the Weekend Baddy session.</p>
      <p>Please present the QR code below when you arrive:</p>
      <img src="${qrCodeUrl}" alt="Your Ticket QR Code" style="width: 300px; height: 300px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);" />
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Ticket ID: ${uniqueId}</p>
    </div>
  `;
  
  GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });
}

// Handles incoming POST requests (from Next.js app for Check-in)
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const scannedId = data.qrId;
    
    if (!scannedId) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No QR ID provided" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    let qrIdIndex = headers.findIndex(h => h.toString() === "QR_ID" || h.toString().toLowerCase() === "qr_id");
    
    if (qrIdIndex === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "System not properly initialized. Submit a test form first." }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Find the row with the matching QR_ID
    let foundRow = -1;
    let participantData = null;
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][qrIdIndex] === scannedId) {
        foundRow = i + 1; // +1 because array is 0-indexed and sheet is 1-indexed
        
        // Extract all data for Master_Players
        participantData = {};
        for(let j=0; j < headers.length; j++) {
            let h = headers[j].toString().toLowerCase();
            if (h.includes("name")) participantData.name = values[i][j];
            if (h.includes("email")) participantData.email = values[i][j];
            if (h.includes("phone")) participantData.phone = values[i][j];
            if (h.includes("age")) participantData.age = values[i][j];
            if (h.includes("proficiency")) participantData.proficiency = values[i][j];
            if (h.includes("duration") || h.includes("playing")) participantData.duration = values[i][j];
            if (h.includes("shoes") || h.includes("racket") || h.includes("gear")) participantData.gear = values[i][j];
            if (h.includes("hear") || h.includes("heard")) participantData.heardFrom = values[i][j];
            if (h === "qr link" || h === "qr_link") participantData.qrLink = values[i][j];
        }
        break;
      }
    }
    
    if (foundRow !== -1 && participantData) {
      const now = new Date();
      
      // Manage Master_Players sheet
      let masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
      
      if (!masterSheet) {
        masterSheet = ss.insertSheet(MASTER_SHEET_NAME);
        masterSheet.appendRow([
          "Player ID", "Name", "Email", "Phone", "Age", "Proficiency", 
          "Playing Duration", "Has Gear", "Heard From", "First Seen", 
          "Last Active", "Events Attended", "QR Link", "Check-in Status", 
          "Time when checked in"
        ]);
      }
      
      const masterValues = masterSheet.getDataRange().getValues();
      const masterHeaders = masterValues[0];
        
      const fuzzyColIndex = (name) => {
          const idx = masterHeaders.findIndex(h => h.toString().toLowerCase().includes(name.toLowerCase()));
          return idx !== -1 ? idx : null;
        };
        const exactColIndex = (name) => {
          const idx = masterHeaders.findIndex(h => h.toString().toLowerCase() === name.toLowerCase());
          return idx !== -1 ? idx : null;
        };
        
        const emailCol = fuzzyColIndex("email");
        let masterRowIdx = -1;
        
        // Check if participant exists in Master
        if (emailCol !== null && participantData.email) {
            for (let m = 1; m < masterValues.length; m++) {
                if (masterValues[m][emailCol] === participantData.email) {
                    masterRowIdx = m + 1;
                    break;
                }
            }
        }
        
        let mCheckedInCol = exactColIndex("check-in status");
        if (mCheckedInCol === null) mCheckedInCol = exactColIndex("checked in"); // fallback
        let mTimeCol = fuzzyColIndex("time when checked in");
        
        // Add columns if they don't exist
        if (mCheckedInCol === null) {
            mCheckedInCol = masterHeaders.length;
            masterSheet.getRange(1, mCheckedInCol + 1).setValue("Check-in Status");
            masterHeaders.push("Check-in Status");
        }
        if (mTimeCol === null) {
            mTimeCol = masterHeaders.length;
            masterSheet.getRange(1, mTimeCol + 1).setValue("Time when checked in");
            masterHeaders.push("Time when checked in");
        }
        
        if (masterRowIdx !== -1) {
            // Check if already checked in recently (e.g. within 12 hours) to prevent double scans
            let mTimeCol = fuzzyColIndex("time when checked in");
            if (mTimeCol !== null && masterValues[masterRowIdx - 1][mTimeCol]) {
                let lastCheckIn = new Date(masterValues[masterRowIdx - 1][mTimeCol]);
                if (now - lastCheckIn < 12 * 60 * 60 * 1000) {
                     return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Already checked in" }))
                                          .setMimeType(ContentService.MimeType.JSON);
                }
            }
        
            // UPDATE EXISTING PLAYER
            const lastActiveCol = fuzzyColIndex("last active");
            const eventsCol = fuzzyColIndex("events attend");
            
            if (lastActiveCol !== null) masterSheet.getRange(masterRowIdx, lastActiveCol + 1).setValue(now);
            if (eventsCol !== null) {
                let currentEvents = parseInt(masterValues[masterRowIdx - 1][eventsCol]) || 0;
                masterSheet.getRange(masterRowIdx, eventsCol + 1).setValue(currentEvents + 1);
            }
            masterSheet.getRange(masterRowIdx, mCheckedInCol + 1).setValue("Checked in");
            masterSheet.getRange(masterRowIdx, mTimeCol + 1).setValue(now);
            
        } else {
            // APPEND NEW PLAYER
            let nextPlayerNum = 1;
            const idCol = fuzzyColIndex("player id");
            if (idCol !== null) {
               for (let m = 1; m < masterValues.length; m++) {
                   let idStr = String(masterValues[m][idCol]);
                   if (idStr.startsWith("TWB-")) {
                       let num = parseInt(idStr.replace("TWB-", ""));
                       if (!isNaN(num) && num >= nextPlayerNum) nextPlayerNum = num + 1;
                   }
               }
            }
            const newPlayerId = `TWB-${nextPlayerNum.toString().padStart(3, '0')}`;
            const newRow = new Array(masterHeaders.length).fill("");
            
            const setIfFound = (colName, value, exact = false) => {
               let idx = exact ? exactColIndex(colName) : fuzzyColIndex(colName);
               if (idx !== null) newRow[idx] = value;
            };
            
            setIfFound("player id", newPlayerId);
            setIfFound("name", participantData.name);
            setIfFound("email", participantData.email);
            setIfFound("phone", participantData.phone);
            setIfFound("age", participantData.age);
            setIfFound("proficiency", participantData.proficiency);
            setIfFound("duration", participantData.duration);
            setIfFound("gear", participantData.gear);
            setIfFound("heard from", participantData.heardFrom);
            setIfFound("first seen", now);
            setIfFound("last active", now);
            setIfFound("events attend", 1);
            setIfFound("qr link", participantData.qrLink || "");
            
            // Check for Check-in Status or Checked In
            let chkIdx = exactColIndex("check-in status");
            if (chkIdx === null) chkIdx = exactColIndex("checked in");
            if (chkIdx !== null) newRow[chkIdx] = "Checked in";
            
            setIfFound("time when checked in", now);
            
            masterSheet.appendRow(newRow);
        }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Check-in successful", name: participantData.name || "Participant", time: now }))
                           .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Invalid ticket" }))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handles incoming GET requests (from Next.js app for Dashboard)
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const values = sheet.getDataRange().getValues();
    
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([]))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = values[0];
    const nameIndex = headers.findIndex(h => h.toString().toLowerCase().includes("name"));
    const emailIndex = headers.findIndex(h => h.toString().toLowerCase().includes("email"));
    
    // Read master sheet to determine check-in status
    const masterSheet = ss.getSheetByName(MASTER_SHEET_NAME);
    let masterEmails = {};
    if (masterSheet) {
        const mValues = masterSheet.getDataRange().getValues();
        if (mValues.length > 0) {
            const mHeaders = mValues[0];
            const mEmailIdx = mHeaders.findIndex(h => h.toString().toLowerCase().includes("email"));
            const mTimeIdx = mHeaders.findIndex(h => h.toString().toLowerCase().includes("time when checked in"));
            
            for (let i = 1; i < mValues.length; i++) {
                if (mEmailIdx !== -1 && mValues[i][mEmailIdx]) {
                    masterEmails[mValues[i][mEmailIdx]] = {
                        time: mTimeIdx !== -1 ? mValues[i][mTimeIdx] : null
                    };
                }
            }
        }
    }
    
    const roster = [];
    const now = new Date();
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Skip empty rows
      if (nameIndex !== -1 && !row[nameIndex] && emailIndex !== -1 && !row[emailIndex]) continue;
      
      const email = emailIndex !== -1 ? row[emailIndex] : null;
      let isCheckedIn = false;
      let checkInTime = null;
      
      if (email && masterEmails[email]) {
          const mData = masterEmails[email];
          // If they were checked in within the last 16 hours, count them as checked in for this event
          if (mData.time) {
              const lastCheckIn = new Date(mData.time);
              if (now - lastCheckIn < 16 * 60 * 60 * 1000) {
                  isCheckedIn = true;
                  checkInTime = mData.time;
              }
          }
      }
      
      roster.push({
        name: nameIndex !== -1 ? row[nameIndex] : "Unknown",
        email: email || "Unknown",
        checkInTime: checkInTime,
        status: isCheckedIn ? "Checked In" : "Pending"
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify(roster))
                         .setMimeType(ContentService.MimeType.JSON);
                         
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
