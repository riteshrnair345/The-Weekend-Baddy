# Weekend Baddie - Setup Instructions

This document outlines the steps to set up the complete system for the Weekend Baddy application.

## 1. Google Forms & Sheets Setup

1. Create a new Google Form for event registration.
2. Add the following fields at a minimum:
   - **Name** (Short answer)
   - **Email** (Email validation, or set the form to automatically collect emails)
3. Go to the **Responses** tab in the Form and click **Link to Sheets** (the green Sheets icon). Create a new spreadsheet.
4. Open the connected Google Sheet. Ensure the tab at the bottom is named `Form Responses 1` (this is the default).

## 2. Google Apps Script Backend Setup

1. In your newly created Google Sheet, go to **Extensions** > **Apps Script**.
2. Rename the project at the top left to "Weekend Baddie Backend".
3. Delete any default code in `Code.gs` and paste the entire contents of the `gas/Code.gs` file from this project into the editor.
4. Save the file (Ctrl+S / Cmd+S).

## 3. Configure the Trigger

We need to tell Google Apps Script to run our `onFormSubmit` function whenever someone submits the form.

1. On the left sidebar of the Apps Script editor, click on the **Triggers** icon (it looks like an alarm clock).
2. Click the **+ Add Trigger** button in the bottom right.
3. Configure the trigger with these exact settings:
   - **Choose which function to run:** `onFormSubmit`
   - **Choose which deployment should run:** `Head`
   - **Select event source:** `From spreadsheet`
   - **Select event type:** `On form submit`
4. Click **Save**.
5. *Important:* Google will ask for permissions. Choose your Google account, click "Advanced", and then "Go to Weekend Baddie Backend (unsafe)". Allow all requested permissions (this allows the script to read the sheet and send emails).

## 4. Deploy the Web App (API)

We need to deploy the script as a Web App so our Next.js frontend can communicate with it (send POST requests for check-ins, GET requests for the dashboard).

1. In the Apps Script editor, click the blue **Deploy** button in the top right.
2. Select **New deployment**.
3. Click the gear icon next to "Select type" and choose **Web app**.
4. Configure the deployment:
   - **Description:** `Initial Deployment` (or anything you like)
   - **Execute as:** `Me (your email)`
   - **Who has access:** `Anyone` *(This is crucial so the Next.js frontend can access the API without authentication)*
5. Click **Deploy**.
6. Copy the **Web app URL** that is generated. It should look like `https://script.google.com/macros/s/.../exec`.

## 5. Next.js Frontend Setup

1. Create a file named `.env.local` in the root of your Next.js project.
2. Add the copied Web app URL as an environment variable:
   ```env
   NEXT_PUBLIC_GAS_WEB_APP_URL="YOUR_WEB_APP_URL_HERE"
   ```
3. Run `npm run dev` to start the local Next.js server, or deploy the project to Vercel and set the environment variable in the Vercel dashboard.

## 6. Testing the Flow

1. Submit a test response to your Google Form.
2. Check the Google Sheet. You should see your response, plus two new columns automatically created: `QR_ID` and `Check-in Time`. The `QR_ID` will be populated.
3. Check your email. You should have received a ticket with a QR code.
4. Open your Next.js app on your phone (if deployed) or locally.
5. Go to the Scanner tab, grant camera permissions, and scan the QR code from the email.
6. The app should display "Check-in successful".
7. Check the Google Sheet again. The `Check-in Time` column should now have a timestamp.
8. Switch to the Dashboard tab in the Next.js app. Your name should appear with a status of "Checked In".
