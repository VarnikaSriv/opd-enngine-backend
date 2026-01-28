# OPD Engine API Guide

Complete guide to test all endpoints using PowerShell, curl, or Postman.

## Prerequisites
- App must be running (`npm start`)
- MongoDB must be running

---

## PowerShell users: use `Invoke-RestMethod`, not `curl`

On Windows PowerShell, `curl` is an alias for `Invoke-WebRequest`, which uses different syntax and will fail with the curl-style examples below. Use **`Invoke-RestMethod`** instead:

```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/doctor" -ContentType "application/json" -Body '{"name":"Dr. Alice"}'
```

Or use **`curl.exe`** (the real curl) if you have it installed:
```powershell
curl.exe -X POST http://localhost:3000/api/doctor -H "Content-Type: application/json" -d "{\"name\":\"Dr. Alice\"}"
```

---

## Step 1: Create a Doctor

**POST** `http://localhost:3000/api/doctor`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/doctor" -ContentType "application/json" -Body '{"name":"Dr. Alice"}'
```

**PowerShell (curl.exe):**
```powershell
curl.exe -X POST http://localhost:3000/api/doctor -H "Content-Type: application/json" -d "{\"name\":\"Dr. Alice\"}"
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/doctor`
- Body (raw JSON):
```json
{
  "name": "Dr. Alice"
}
```

**Response:** You'll get back a doctor object with `_id`. **Copy this `_id`** for the next step!

Example response:
```json
{
  "_id": "65f1234567890abcdef12345",
  "name": "Dr. Alice",
  "createdAt": "2026-01-28T...",
  "updatedAt": "2026-01-28T..."
}
```

---

## Step 2: Create a Slot for the Doctor

**POST** `http://localhost:3000/api/slot`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/slot" -ContentType "application/json" -Body '{"doctorId":"PASTE_DOCTOR_ID_HERE","startTime":"09:00","endTime":"10:00","capacity":3}'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/slot`
- Body (raw JSON):
```json
{
  "doctorId": "PASTE_DOCTOR_ID_HERE",
  "startTime": "09:00",
  "endTime": "10:00",
  "capacity": 3
}
```

**Response:** You'll get back a slot object with `_id`. **Copy this `_id`** for booking tokens!

Example response:
```json
{
  "_id": "65f1234567890abcdef12346",
  "doctorId": "65f1234567890abcdef12345",
  "startTime": "09:00",
  "endTime": "10:00",
  "capacity": 3,
  "tokens": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Step 3: Book Tokens (Different Sources)

**POST** `http://localhost:3000/api/token/book`

### Book a WALKIN token:
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"PASTE_SLOT_ID_HERE","patientName":"John Walkin","source":"WALKIN"}'
```

### Book an ONLINE token:
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"PASTE_SLOT_ID_HERE","patientName":"Jane Online","source":"ONLINE"}'
```

### Book a PAID token:
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"PASTE_SLOT_ID_HERE","patientName":"Bob Paid","source":"PAID"}'
```

### Book a FOLLOWUP token:
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"PASTE_SLOT_ID_HERE","patientName":"Alice Followup","source":"FOLLOWUP"}'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/token/book`
- Body (raw JSON):
```json
{
  "slotId": "PASTE_SLOT_ID_HERE",
  "patientName": "John Walkin",
  "source": "WALKIN"
}
```

**Valid sources:** `WALKIN`, `ONLINE`, `PAID`, `FOLLOWUP`, `EMERGENCY`

**Response:** Returns the created token with priority assigned.

---

## Step 4: View Slot with All Tokens

**GET** `http://localhost:3000/api/slot/:id`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/slot/PASTE_SLOT_ID_HERE"
```

**Postman:**
- Method: `GET`
- URL: `http://localhost:3000/api/slot/PASTE_SLOT_ID_HERE`

**Response:** Slot with all tokens populated:
```json
{
  "_id": "...",
  "doctorId": "...",
  "startTime": "09:00",
  "endTime": "10:00",
  "capacity": 3,
  "tokens": [
    {
      "_id": "...",
      "patientName": "John Walkin",
      "source": "WALKIN",
      "priority": 1,
      "status": "BOOKED",
      ...
    },
    {
      "_id": "...",
      "patientName": "Jane Online",
      "source": "ONLINE",
      "priority": 2,
      "status": "BOOKED",
      ...
    }
  ]
}
```

---

## Step 5: Cancel a Token

**POST** `http://localhost:3000/api/token/cancel/:id`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/cancel/PASTE_TOKEN_ID_HERE"
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/token/cancel/PASTE_TOKEN_ID_HERE`

**Response:** Token with status changed to `CANCELLED`.

---

## Step 6: Mark Token as No-Show

**POST** `http://localhost:3000/api/token/noshow/:id`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/noshow/PASTE_TOKEN_ID_HERE"
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/token/noshow/PASTE_TOKEN_ID_HERE`

**Response:** Token with status changed to `NO_SHOW`.

---

## Step 7: Add Emergency Token (Evicts Lowest Priority if Full)

**POST** `http://localhost:3000/api/token/emergency`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/emergency" -ContentType "application/json" -Body '{"slotId":"PASTE_SLOT_ID_HERE","patientName":"Emergency Patient"}'
```

**Postman:**
- Method: `POST`
- URL: `http://localhost:3000/api/token/emergency`
- Body (raw JSON):
```json
{
  "slotId": "PASTE_SLOT_ID_HERE",
  "patientName": "Emergency Patient"
}
```

**Response:**
```json
{
  "emergencyToken": {
    "_id": "...",
    "patientName": "Emergency Patient",
    "source": "EMERGENCY",
    "priority": 5,
    "status": "BOOKED",
    ...
  },
  "evictedToken": {
    "_id": "...",
    "patientName": "John Walkin",
    "source": "WALKIN",
    "priority": 1,
    "status": "CANCELLED",
    ...
  }
}
```

If slot wasn't full, `evictedToken` will be `null`.

---

## Step 8: List All Doctors

**GET** `http://localhost:3000/api/doctor`

**PowerShell (Invoke-RestMethod):**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/doctor"
```

**Browser:** Just open `http://localhost:3000/api/doctor`

---

## Complete Test Scenario

**Important:** `DOCTOR_ID` and `SLOT_ID` are placeholders. Replace them with the actual `_id` values returned in steps 1 and 2 before running the commands.

1. **Create Doctor:**
   ```powershell
   Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/doctor" -ContentType "application/json" -Body '{"name":"Dr. Smith"}'
   ```
   Copy the `_id` from the response → use as `DOCTOR_ID` in step 2.

2. **Create Slot:** Replace `DOCTOR_ID` with the doctor `_id` from step 1.
   ```powershell
   Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/slot" -ContentType "application/json" -Body '{"doctorId":"DOCTOR_ID","startTime":"09:00","endTime":"10:00","capacity":3}'
   ```
   Copy the `_id` from the response → use as `SLOT_ID` in steps 3–5.

3. **Book 3 tokens (fill slot):** Replace `SLOT_ID` with the slot `_id` from step 2 in all three commands.
   ```powershell
   Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"SLOT_ID","patientName":"Patient 1","source":"WALKIN"}'
   Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"SLOT_ID","patientName":"Patient 2","source":"ONLINE"}'
   Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/book" -ContentType "application/json" -Body '{"slotId":"SLOT_ID","patientName":"Patient 3","source":"PAID"}'
   ```

4. **View slot:** Replace `SLOT_ID` with the slot `_id` from step 2.
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3000/api/slot/SLOT_ID"
   ```

5. **Add emergency (should evict WALKIN token):** Replace `SLOT_ID` with the slot `_id` from step 2.
   ```powershell
   Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/token/emergency" -ContentType "application/json" -Body '{"slotId":"SLOT_ID","patientName":"Emergency"}'
   ```

6. **View slot again** (same as step 4) to see the emergency token and evicted token.

---

## Priority Order

Tokens are prioritized as:
1. **EMERGENCY** (priority 5) - Highest
2. **PAID** (priority 4)
3. **FOLLOWUP** (priority 3)
4. **ONLINE** (priority 2)
5. **WALKIN** (priority 1) - Lowest

When an emergency arrives and slot is full, the **lowest priority BOOKED token** gets evicted.
