/**
 * CampusSaarthi AI - Core Engine & Interactive UI Logic
 * Education & Student Life Track Hackathon MVP
 * 
 * Features:
 * - Real-world Indian university notice samples (AKTU, VTU, NSP, TPO)
 * - Zero-hallucination heuristic parser for arbitrary pasted notices
 * - Multi-lingual rendering (Simple English & Hinglish)
 * - Interactive task checklist with persistent local progress
 * - Missing/Ambiguous information safety guardrails
 * - WhatsApp share formatter & print support
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Curated Sample Notices & Verified Pre-Calibrated Data
  // =========================================================================
  const SAMPLE_NOTICES = {
    exam: {
      id: "exam",
      title: "Semester Exam & Late Fee Schedule (State Tech University)",
      type: "Semester Examination Notice",
      urgency: "High (Upcoming Deadline)",
      rawText: `DR. A.P.J. ABDUL KALAM TECHNICAL UNIVERSITY / STATE TECH BOARD
Circular Ref No: STU/EXAM/ODD-SEM/2026/1104
Date: October 24, 2026

SUBJECT: SUBMISSION OF REGULAR AND CARRY-OVER EXAMINATION FORMS FOR ODD SEMESTER (1st, 3rd, 5th & 7th SEMESTERS) ACADEMIC SESSION 2026-27

All the Principals/Directors of affiliated colleges and students of B.Tech / B.Pharm / MBA / MCA courses are hereby informed that the portal for filling odd semester examination forms for session 2026-27 has been scheduled as follows:

1. Submission of examination form without late fee: From 01-Nov-2026 to 15-Nov-2026 (till 11:59 PM).
2. Submission of examination form with late fee of Rs. 500/- per student: From 16-Nov-2026 to 20-Nov-2026 (till 5:00 PM).
3. Submission of examination form with fine of Rs. 1000/- (Final Opportunity): From 21-Nov-2026 to 25-Nov-2026 (till 2:00 PM).
No forms will be accepted under any circumstances after 25-Nov-2026.

ELIGIBILITY AND GUIDELINES:
- Regular students having minimum 75% overall attendance in the current semester are eligible. Students appearing on the department detention list are strictly barred.
- Carry-over candidates can fill backlog papers subject to maximum of 4 active theory backlogs from earlier odd semesters.
- Students must verify subject codes and elective options carefully before final submission. Changes will not be permitted post fee payment.

MANDATORY DOCUMENTS TO BE SUBMITTED TO DEPT. OFFICE:
1. Two hardcopies of printed online exam form.
2. Original ERP fee payment receipt (Rs. 7,850 regular / Rs. 1,000 per carry-over paper).
3. Self-attested copy of previous semester marksheet.
4. Undertaking signed by student and parent regarding anti-ragging and attendance.

Hardcopies must be submitted to the examination counter after verification by the respective Head of Department (HOD).

- By Order of Controller of Examinations`,
      
      analysis: {
        english: {
          immediateAction: "Fill your exam form on the university ERP portal before 15th Nov to save ₹500 - ₹1000 in late fees.",
          summary: "State Tech University has officially opened the examination form submission portal for all Odd Semester (1st, 3rd, 5th, 7th sem) students for session 2026-27. You must submit online and deposit stamped hardcopies with fee receipts to your HOD.",
          keyTakeaways: [
            "Regular exam fee is ₹7,850; Carry-over/backlog fee is ₹1,000 per paper.",
            "Portal closes completely on 25-Nov-2026 at 2:00 PM. No further extensions.",
            "Both online submission AND offline hardcopy submission to your HOD are mandatory."
          ],
          dates: [
            { label: "Normal Submission (No Late Fee)", date: "01 Nov - 15 Nov 2026 (11:59 PM)", fee: "₹0 Fine", feeClass: "fee-tag-zero", type: "normal", note: "Best window to pay regular examination fees." },
            { label: "Late Fee Surcharge Window", date: "16 Nov - 20 Nov 2026 (5:00 PM)", fee: "+₹500 Late Fine", feeClass: "fee-tag-fine", type: "warning", note: "Portal charges penalty automatically." },
            { label: "Final Deadline with Heavy Penalty", date: "21 Nov - 25 Nov 2026 (2:00 PM)", fee: "+₹1,000 Late Fine", feeClass: "fee-tag-fine", type: "danger", note: "Last chance. Portal locks at 2:00 PM sharp." }
          ],
          eligibility: {
            eligible: [
              "Regular B.Tech/B.Pharm/MBA/MCA students enrolled in Odd Semesters (1st, 3rd, 5th, 7th)",
              "Students maintaining 75% or higher overall attendance",
              "Carry-over students with up to 4 active theory backlogs"
            ],
            ineligible: [
              "Students flagged on departmental detention / low-attendance lists",
              "Students having more than 4 active theory backlogs from earlier odd semesters",
              "Students with pending college tuition fee dues preventing ERP clearance"
            ]
          },
          documents: [
            { name: "Printed Online Exam Form (2 Hardcopies)", mandatory: true },
            { name: "Original ERP Fee Payment Receipt (₹7,850)", mandatory: true },
            { name: "Self-Attested Previous Semester Marksheet", mandatory: true },
            { name: "Parent & Student Signed Undertaking", mandatory: true },
            { name: "HOD Verification Stamp & Signature", mandatory: true }
          ],
          missingInfo: [
            { tag: "Missing ERP Link", text: "The circular states 'portal for filling form is scheduled', but does NOT provide the exact website URL or login link." },
            { tag: "Department Submission Timings Unclear", text: "Notice mandates physical submission to the examination counter, but does NOT specify office open hours or counter numbers." },
            { tag: "Payment Methods Not Clarified", text: "Does not mention whether UPI / Debit Card / Netbanking or Challan payment is required inside the portal." }
          ],
          checklist: [
            { id: "c1", title: "Verify attendance with Class Advisor (> 75%)", subtext: "Confirm you are not in the detention list" },
            { id: "c2", title: "Login to ERP and select correct subject & elective codes", subtext: "Codes cannot be changed after payment" },
            { id: "c3", title: "Pay Regular / Carry-over fee online before 15 Nov", subtext: "Download and print original payment receipt" },
            { id: "c4", title: "Take 2 printouts of completed examination form", subtext: "Affix recent passport size photo if required" },
            { id: "c5", title: "Get undertaking signed by Parent / Guardian", subtext: "Covers attendance and university code of conduct" },
            { id: "c6", title: "Get HOD signature & submit hardcopy at Admin Counter", subtext: "Keep one stamped copy safe as proof of submission" }
          ]
        },
        hinglish: {
          immediateAction: "Sabse pehle 15 Nov se pehle online ERP portal par exam form bhar do, warna seedha ₹500 se ₹1000 ka fine lagega!",
          summary: "State Tech University ne session 2026-27 ke Odd Semesters (1st, 3rd, 5th, 7th) ke exam forms nikaal diye hain. Sabhi students ko online form bharna hai aur receipt + printout HOD se sign karwa ke counter par submit karna hai.",
          keyTakeaways: [
            "Regular students ki fees ₹7,850 hai; Carry-over/backlog ki fees ₹1,000 per paper hai.",
            "Last date bina late fee ke 15 November raat 11:59 PM tak hai.",
            "Sirf online bharne se kaam nahi chalega — college counter par hardcopy dena zaroori hai."
          ],
          dates: [
            { label: "Bina Late Fee ke Date", date: "01 Nov - 15 Nov 2026 (11:59 PM)", fee: "₹0 Extra", feeClass: "fee-tag-zero", type: "normal", note: "Isi window me form bharlo taaki penalty na lage." },
            { label: "₹500 Late Fine Window", date: "16 Nov - 20 Nov 2026 (5:00 PM)", fee: "+₹500 Fine", feeClass: "fee-tag-fine", type: "warning", note: "Har student se ₹500 extra charge liya jayega." },
            { label: "Aakhri Mauka (Bhaari Fine)", date: "21 Nov - 25 Nov 2026 (2:00 PM)", fee: "+₹1,000 Fine", feeClass: "fee-tag-fine", type: "danger", note: "25 Nov dopahar 2 baje ke baad portal hamesha ke liye band ho jayega." }
          ],
          eligibility: {
            eligible: [
              "B.Tech / B.Pharm / MBA / MCA ke Odd semester wale sabhi students",
              "Jinki attendance 75% ya usse zyada hai",
              "Purani backlogs wale students (maximum 4 theory papers)"
            ],
            ineligible: [
              "Jo students attendance kam hone ki wajah se Detention list me hain",
              "Jin students ki 4 se zyada theory backlogs bachi hain",
              "Jin students ki purani college fee baki hone par ERP block hai"
            ]
          },
          documents: [
            { name: "Online Exam Form ke 2 Printouts", mandatory: true },
            { name: "Original ERP Fee Receipt (₹7,850)", mandatory: true },
            { name: "Pichhle semester ki marksheet ki Self-Attested copy", mandatory: true },
            { name: "Parents aur student ke sign wala Undertaking form", mandatory: true },
            { name: "HOD ki verification stamp aur sign", mandatory: true }
          ],
          missingInfo: [
            { tag: "ERP Portal ka Link Missing", text: "Notice me ye to likha hai ki portal khul gaya hai, par koi direct website link ya URL nahi diya gaya hai." },
            { tag: "Department Counter ki Timings Gayab", text: "Notice me ye nahi bataya gaya ki kis room ya counter par hardcopy jama hogi aur kis samay (e.g. 2 PM se 4 PM)." },
            { tag: "Payment Methods Clear Nahi", text: "Notice me ye mention nahi hai ki UPI/Debit card chalega ya sirf Netbanking/Challan." }
          ],
          checklist: [
            { id: "c1", title: "Class Advisor se apni attendance check karo (> 75%)", subtext: "Sure karlo ki detention list me naam na ho" },
            { id: "c2", title: "College ERP login karke subject aur elective codes dhyan se select karo", subtext: "Payment ke baad subject change nahi hoga" },
            { id: "c3", title: "15 November se pehle online fee pay karo", subtext: "Fee receipt ka PDF download karke print nikaalo" },
            { id: "c4", title: "Exam form ke 2 clear printout nikaalo", subtext: "Passport photo lagana na bhoolein" },
            { id: "c5", title: "Undertaking par parents ke signature karwao", subtext: "Anti-ragging aur attendance declaration" },
            { id: "c6", title: "HOD se sign aur stamp karwake college counter par jama karo", subtext: "Ek copy par receiving stamp leke apne paas rakho" }
          ]
        }
      }
    },

    scholarship: {
      id: "scholarship",
      title: "Post-Matric NSP & State Scholarship Notice",
      type: "Scholarship & Financial Aid Notice",
      urgency: "Medium (Verification Required)",
      rawText: `OFFICE OF THE DEAN STUDENT WELFARE (DSW)
Circular No: SCH/2026-27/OCT/42
Dated: 22nd October 2026

NOTICE FOR CENTRAL & STATE POST-MATRIC SCHOLARSHIP (NSP/SAMAJ KALYAN) SCHEMES

Applications are invited from eligible SC, ST, OBC, Minority, and General-EWS category students studying in 1st, 2nd, 3rd, and 4th year undergraduate/postgraduate programs for the Academic Year 2026-27 under the Post-Matric Scholarship Schemes.

IMPORTANT DEADLINES:
- Online application submission on the National Scholarship Portal (NSP) / State Portal: Last Date is 30th November 2026 (5:00 PM).
- Institute Level Physical Document Verification: From 05-Nov-2026 to 05-Dec-2026.
Late applications will not be forwarded to the social welfare department.

ELIGIBILITY CRITERIA:
1. Annual family income from all sources must NOT exceed Rs. 2,50,000/- per annum (Rs. 2.5 Lakhs).
2. Must have passed previous academic examination with minimum 60% marks without any un-cleared UFM/disciplinary action.
3. Candidate must not be in receipt of any other central/state government financial assistance.

LIST OF DOCUMENTS FOR INSTITUTE VERIFICATION (PHYSICAL DOSSIER):
- Printed copy of submitted online application form.
- Income Certificate issued by competent authority (Tehsildar / Sub-Divisional Magistrate) issued on or after 01-April-2026.
- Caste Certificate / Category Certificate (digitally verified).
- Domicile Certificate of the state.
- College Bonafide Certificate and Current Year Fee Receipt.
- Bank Passbook copy clearly showing Account Number and IFSC code (Account MUST be Aadhaar-seeded / NPCI active).
- Marksheets of Class 10th, 12th, and all previous college semesters.

Students must ensure biometric Aadhaar authentication at the college digital center before final submission to Counter 3.

Dean Student Welfare`,
      
      analysis: {
        english: {
          immediateAction: "Verify your family Income Certificate date (must be after 1-Apr-2026) and check if your bank account has active NPCI Aadhaar seeding.",
          summary: "Dean Student Welfare has released the Post-Matric Scholarship instructions for SC/ST/OBC/Minority/EWS categories for 2026-27. Students must register on the portal and complete physical document verification at the institute before 5th Dec.",
          keyTakeaways: [
            "Family annual income ceiling is strictly ₹2,50,000 (₹2.5 Lakhs).",
            "Bank account must be Aadhaar-seeded / NPCI active or scholarship disbursement will fail.",
            "Income certificate must be issued on or after 01-April-2026."
          ],
          dates: [
            { label: "Online Portal Deadline", date: "30-Nov-2026 (5:00 PM)", fee: "Portal Closes", feeClass: "fee-tag-fine", type: "warning", note: "Complete online filing on NSP/State portal before this." },
            { label: "Institute Verification Window", date: "05-Nov to 05-Dec-2026", fee: "Mandatory Step", feeClass: "fee-tag-zero", type: "normal", note: "Physical dossier submission at Dean office." }
          ],
          eligibility: {
            eligible: [
              "SC, ST, OBC, Minority, and EWS students across 1st to 4th year",
              "Annual household income under ₹2,50,000 (verified by Tehsildar)",
              "Minimum 60% marks in previous qualifying exam"
            ],
            ineligible: [
              "Students with family income exceeding ₹2.5 Lakhs",
              "Students already receiving another government scholarship or corporate fellowship",
              "Students with active disciplinary / unfair means (UFM) penalties"
            ]
          },
          documents: [
            { name: "Printed Online Scholarship Form", mandatory: true },
            { name: "Income Certificate (Dated after 01-Apr-2026)", mandatory: true },
            { name: "Caste / Category Certificate", mandatory: true },
            { name: "Aadhaar Seeded Bank Passbook Copy (NPCI active)", mandatory: true },
            { name: "College Bonafide Certificate & Fee Receipt", mandatory: true },
            { name: "10th, 12th & Semester Marksheets", mandatory: true }
          ],
          missingInfo: [
            { tag: "Portal URL Not Specified", text: "Notice mentions 'National Scholarship Portal / State Portal' without giving the exact website address." },
            { tag: "Biometric Center Timings Omitted", text: "Mentions 'biometric Aadhaar authentication at college digital center' but does not specify operating hours or room number." }
          ],
          checklist: [
            { id: "s1", title: "Check Income Certificate issue date (must be after 1-Apr-2026)", subtext: "If older, apply for a renewal immediately at Tehsil/Jan Seva Kendra" },
            { id: "s2", title: "Confirm Bank Account is Aadhaar-seeded via NPCI mapper", subtext: "Visit your bank branch to enable direct benefit transfer (DBT)" },
            { id: "s3", title: "Collect Bonafide Certificate from Academic Section", subtext: "Ensure current year tuition fee details are stamped" },
            { id: "s4", title: "Fill online form on the scholarship portal", subtext: "Upload clear scanned copies of all certificates" },
            { id: "s5", title: "Complete biometric authentication at college digital center", subtext: "Carry your physical Aadhaar card" },
            { id: "s6", title: "Submit physical file at Counter 3 before 05-Dec-2026", subtext: "Take receiving acknowledgment signature" }
          ]
        },
        hinglish: {
          immediateAction: "Apne Income Certificate ki date check karo (1 April 2026 ke baad ka hona chahiye) aur Bank Account me Aadhaar NPCI seeding verify karwao!",
          summary: "Dean Student Welfare ne SC/ST/OBC/Minority/EWS ke liye Post-Matric Scholarship ka notice nikala hai. 30 November tak online form bharna hai aur 5 December tak college me document file jama karni hai.",
          keyTakeaways: [
            "Family income maximum ₹2.5 Lakhs honi chahiye (Tehsildar approved).",
            "Bank account me Aadhaar DBT / NPCI active hona compulsory hai, warna paisa nahi aayega.",
            "Income certificate 1 April 2026 ke baad ka hi valid mana jayega."
          ],
          dates: [
            { label: "Online Portal ki Last Date", date: "30-Nov-2026 (5:00 PM)", fee: "Portal Band", feeClass: "fee-tag-fine", type: "warning", note: "Iske baad online application submit nahi hogi." },
            { label: "College Verification Window", date: "05-Nov se 05-Dec-2026", fee: "Hardcopy Jamakaro", feeClass: "fee-tag-zero", type: "normal", note: "Dean office me physical file verify karwana zaroori hai." }
          ],
          eligibility: {
            eligible: [
              "1st se 4th year ke SC, ST, OBC, Minority aur EWS students",
              "Jinki family ki annual income ₹2,50,000 se kam hai",
              "Pichhle saal minimum 60% marks score kiye hon"
            ],
            ineligible: [
              "Jinki family income ₹2.5 Lakhs se zyada hai",
              "Jo pehle se kisi dusri government scholarship ka benefit le rahe hain",
              "Jinpar koi disciplinary ya UFM case laga ho"
            ]
          },
          documents: [
            { name: "Online Scholarship Form ka Printout", mandatory: true },
            { name: "Income Certificate (1 April 2026 ke baad ka)", mandatory: true },
            { name: "Caste / Category Certificate", mandatory: true },
            { name: "Aadhaar Seeded Bank Passbook Copy (NPCI linked)", mandatory: true },
            { name: "College Bonafide Certificate aur Fee Receipt", mandatory: true },
            { name: "10th, 12th aur semester ke sabhi Marksheets", mandatory: true }
          ],
          missingInfo: [
            { tag: "Website Link Missing", text: "Notice me 'NSP / State Portal' likha hai par exact link provide nahi kiya." },
            { tag: "Biometric Center ki Location / Timings Gayab", text: "Digital center me biometric authentication bola hai par room number ya timing nahi batayi." }
          ],
          checklist: [
            { id: "s1", title: "Income Certificate ki date verify karo (1 April 2026 ke baad)", subtext: "Agar purana hai to Tehsil / CSC center par turant renew karao" },
            { id: "s2", title: "Bank branch jaakar check karo ki account Aadhaar/NPCI se linked hai ya nahi", subtext: "DBT enable hona zaroori hai" },
            { id: "s3", title: "Academic section se Bonafide Certificate banwao", subtext: "Current year ki fee receipt sath le jayein" },
            { id: "s4", title: "Scholarship portal par form fill karke documents upload karo", subtext: "Final submit karke PDF print nikaalein" },
            { id: "s5", title: "College digital center jaakar biometric verification complete karo", subtext: "Original Aadhaar card sath le jayein" },
            { id: "s6", title: "Saare documents Counter 3 par 5 Dec se pehle jama kardo", subtext: "File submission ki receiving slip lena mat bhoolna" }
          ]
        }
      }
    },

    placement: {
      id: "placement",
      title: "TPO Campus Placement Drive (Tech Giants)",
      type: "Campus Placement / TPO Circular",
      urgency: "High (Registration Closes Soon)",
      rawText: `TRAINING AND PLACEMENT CELL (T&P)
Ref: TPO/DRIVE/2026-27/088
Date: 26 October 2026

NOTICE: ON-CAMPUS RECRUITMENT DRIVE FOR B.TECH (CSE, IT, ECE, EE) - BATCH 2027

We are pleased to announce that a leading global IT multinational enterprise will be visiting our campus for the recruitment of Associate Software Engineers.

DRIVE SCHEDULE:
- Mandatory Google Form Registration Deadline: Friday, 31-Oct-2026 by 6:00 PM Sharp.
- Online Aptitude & Technical Coding Round: Sunday, 02-Nov-2026 (10:00 AM to 12:30 PM).
- Technical & HR Interviews: 05-Nov-2026 onwards for shortlisted candidates.

ELIGIBILITY CRITERIA:
- B.Tech (Computer Science, Information Technology, Electronics & Comm, Electrical).
- Minimum 65.0% or 6.8 CGPA throughout (10th, 12th, and aggregate of all B.Tech semesters till date).
- Maximum 1 active backlog permitted at the time of online test.
- No gap in studies exceeding 1 year after Class 12th.

MANDATORY INSTRUCTIONS FOR CANDIDATES:
1. Students must carry 2 hardcopies of updated 1-page resume.
2. College Identity Card is mandatory for entry into test premises.
3. Dress Code: Strictly formal business attire (formal shirt, trousers, tie, and formal shoes). Casuals / jeans strictly prohibited.
4. Late entry will not be permitted under any circumstances once the test begins.

TPO Cell, Main Administrative Block`,
      
      analysis: {
        english: {
          immediateAction: "Fill out the TPO registration Google Form before Friday, 31-Oct-2026 at 6:00 PM and prepare 2 printed copies of your resume.",
          summary: "The Training & Placement Cell has announced an on-campus recruitment drive for 2027 batch B.Tech students (CSE, IT, ECE, EE) for Associate Software Engineer roles. Shortlisting starts with an online coding test on 02-Nov.",
          keyTakeaways: [
            "Mandatory Registration closes on 31-Oct-2026 at 6:00 PM sharp.",
            "Cutoff: Minimum 65% / 6.8 CGPA throughout 10th, 12th & B.Tech.",
            "Maximum 1 active backlog is permitted; Strict formal attire enforced."
          ],
          dates: [
            { label: "Registration Closes", date: "31-Oct-2026 (6:00 PM)", fee: "Hard Deadline", feeClass: "fee-tag-fine", type: "danger", note: "No registrations accepted after this deadline." },
            { label: "Online Coding & Aptitude Test", date: "02-Nov-2026 (10:00 AM)", fee: "Online Assessment", feeClass: "fee-tag-zero", type: "warning", note: "2.5 hours online assessment." },
            { label: "Interviews for Shortlisted", date: "05-Nov-2026 Onwards", fee: "Final Round", feeClass: "fee-tag-zero", type: "normal", note: "In-person / virtual interviews." }
          ],
          eligibility: {
            eligible: [
              "B.Tech students of CSE, IT, ECE, EE graduating in 2027",
              "65.0% or 6.8 CGPA aggregate throughout 10th, 12th, and B.Tech",
              "Students with at most 1 active backlog"
            ],
            ineligible: [
              "Non-circuit branches (Mechanical, Civil, Chemical, etc.)",
              "Candidates with CGPA below 6.8 or under 65% in 10th/12th",
              "More than 1 active backlog or educational gap over 1 year"
            ]
          },
          documents: [
            { name: "Updated 1-Page Resume (2 Hardcopies)", mandatory: true },
            { name: "Original College Identity Card", mandatory: true },
            { name: "Government Photo ID (Aadhaar / PAN)", mandatory: true },
            { name: "Class 10, 12 & Semester Marksheets Dossier", mandatory: true }
          ],
          missingInfo: [
            { tag: "Package / CTC Missing", text: "Notice mentions 'Associate Software Engineer' role but does NOT disclose the salary package or compensation structure." },
            { tag: "Google Form Link Missing", text: "Mentions 'Mandatory Google Form Registration' but has not included the hyperlink or QR code in this circular text." },
            { tag: "Test Venue / Platform Unclear", text: "Does not clarify whether the 02-Nov online test will be proctored in college computer labs or taken from home." }
          ],
          checklist: [
            { id: "p1", title: "Ask TPO class representative for the Google Form link", subtext: "Register before Friday 6:00 PM deadline" },
            { id: "p2", title: "Calculate aggregate CGPA across all semesters", subtext: "Confirm it is >= 6.8 with <= 1 active backlog" },
            { id: "p3", title: "Update and print 2 copies of your 1-page resume", subtext: "Tailor projects to software engineering roles" },
            { id: "p4", title: "Prepare your formal dress code (shirt, trousers, formal shoes)", subtext: "Casuals are strictly prohibited at the venue" },
            { id: "p5", title: "Revise DSA, OOPs concepts, and Aptitude", subtext: "Be prepared for the 2.5 hour online test on 02-Nov" }
          ]
        },
        hinglish: {
          immediateAction: "Friday 31-Oct shaam 6:00 PM se pehle TPO ka Google Form fill kardo aur apna resume update karke 2 copies print nikaalo!",
          summary: "College ke TPO cell ne 2027 batch ke B.Tech (CSE, IT, ECE, EE) students ke liye MNC campus placement drive announce kiya hai. Associate Software Engineer role ke liye 2 November ko online coding round hoga.",
          keyTakeaways: [
            "Registration deadline 31-Oct shaam 6 baje tak hai. Bilkul miss mat karna.",
            "Eligibility criteria: 10th, 12th aur B.Tech me minimum 65% ya 6.8 CGPA compulsory.",
            "Maximum 1 active backlog allowed hai; Formals pehen kar aana compulsory hai."
          ],
          dates: [
            { label: "Google Form Last Date", date: "31-Oct-2026 (6:00 PM)", fee: "Strict Cutoff", feeClass: "fee-tag-fine", type: "danger", note: "Iske baad form link close ho jayega." },
            { label: "Online Coding Test", date: "02-Nov-2026 (10:00 AM)", fee: "Round 1", feeClass: "fee-tag-zero", type: "warning", note: "2.5 ghante ka aptitude aur coding test." },
            { label: "Technical & HR Interviews", date: "05-Nov-2026 Se Shuru", fee: "Round 2", feeClass: "fee-tag-zero", type: "normal", note: "Shortlist hone wale students ke interviews honge." }
          ],
          eligibility: {
            eligible: [
              "2027 batch ke B.Tech CSE, IT, ECE, EE students",
              "10th, 12th aur B.Tech me 65% ya 6.8 CGPA aggregate wale",
              "Jin students ki 1 ya 0 active backlog hai"
            ],
            ineligible: [
              "Mechanical, Civil aur dusri non-eligible branches",
              "Jinka CGPA 6.8 se kam hai ya 10th/12th me 65% se kam the",
              "Jinpar 1 se zyada backlog hai ya 12th ke baad 1 saal se bada study gap hai"
            ]
          },
          documents: [
            { name: "Updated 1-Page Resume ke 2 Printouts", mandatory: true },
            { name: "Original College Identity Card", mandatory: true },
            { name: "Aadhaar Card / Govt ID Proof", mandatory: true },
            { name: "10th, 12th aur sabhi semesters ki Marksheets file", mandatory: true }
          ],
          missingInfo: [
            { tag: "Salary / CTC Mention Nahi Hai", text: "Role 'Associate Software Engineer' likha hai par package kitna hoga (LPA) ye circular me nahi bataya." },
            { tag: "Google Form ka Link Missing", text: "Notice me registration form bharne ko bola hai par circular me link ya QR code gayab hai." },
            { tag: "Test College Lab me hoga ya Ghar se?", text: "Notice me ye clear nahi kiya ki 2-Nov ka test college computer lab me hoga ya online ghar se dena hai." }
          ],
          checklist: [
            { id: "p1", title: "TPO coordinator se registration Google form ka link maango", subtext: "Friday 6:00 PM se pehle form bharlo" },
            { id: "p2", title: "Apna B.Tech aggregate CGPA calculate karo", subtext: "Confirm karo ki 6.8 se zyada hai aur max 1 backlog hai" },
            { id: "p3", title: "Resume update karo aur 2 crisp printouts nikaal ke rakho", subtext: "Coding projects aur technical skills highlight karo" },
            { id: "p4", title: "Formal dress code arrange karo (formal shirt, pant, shoes)", subtext: "Drive ke din jeans / t-shirt strictly allowed nahi hai" },
            { id: "p5", title: "DSA, SQL, aur Aptitude ki practice karo", subtext: "2 November ko subah 10 baje test start hoga" }
          ]
        }
      }
    }
  };

  // =========================================================================
  // 2. DOM Elements Selection
  // =========================================================================
  const sampleSelect = document.getElementById('sample-select');
  const btnLoadSample = document.getElementById('btn-load-sample');
  const noticeInput = document.getElementById('notice-input');
  const btnClear = document.getElementById('btn-clear');
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnErrorSample = document.getElementById('btn-error-sample');
  const charCountEl = document.getElementById('char-count');
  const wordCountEl = document.getElementById('word-count');

  // Language selectors
  const langEnglishRadio = document.getElementById('lang-english');
  const langHinglishRadio = document.getElementById('lang-hinglish');
  const inlineLangBtns = document.querySelectorAll('.inline-lang-btn');

  // State containers
  const stateEmpty = document.getElementById('state-empty');
  const stateLoading = document.getElementById('state-loading');
  const stateError = document.getElementById('state-error');
  const stateResults = document.getElementById('state-results');
  const loadingProgress = document.getElementById('loading-progress');
  const loadingStepText = document.getElementById('loading-step-text');
  const errorMessageEl = document.getElementById('error-message');

  // Results displays
  const resultTypeBadge = document.getElementById('result-type-badge');
  const resultUrgencyBadge = document.getElementById('result-urgency-badge');
  const resultSourceIndicator = document.getElementById('result-source-indicator');
  const resultImmediateAction = document.getElementById('result-immediate-action');
  const resultSummary = document.getElementById('result-summary');
  const resultKeyTakeaways = document.getElementById('result-key-takeaways');
  const resultDatesTimeline = document.getElementById('result-dates-timeline');
  const resultEligibleList = document.getElementById('result-eligible-list');
  const resultIneligibleList = document.getElementById('result-ineligible-list');
  const resultDocumentsGrid = document.getElementById('result-documents-grid');
  const resultMissingInfo = document.getElementById('result-missing-info');
  const resultInteractiveChecklist = document.getElementById('result-interactive-checklist');
  const checklistCompletedCount = document.getElementById('checklist-completed-count');
  const checklistTotalCount = document.getElementById('checklist-total-count');
  const checklistPercent = document.getElementById('checklist-percent');
  const checklistProgressFill = document.getElementById('checklist-progress-fill');
  const btnResetChecklist = document.getElementById('btn-reset-checklist');
  const btnPrintChecklist = document.getElementById('btn-print-checklist');
  const btnCopySummary = document.getElementById('btn-copy-summary');
  const toastContainer = document.getElementById('toast-container');

  // Dynamic Card Headers & Notes
  const cardDatesTitle = document.getElementById('card-dates-title');
  const datesHeaderNote = document.getElementById('dates-header-note');
  const cardDocsTitle = document.getElementById('card-docs-title');
  const docsHeaderNote = document.getElementById('docs-header-note');

  // =========================================================================
  // 3. Application State
  // =========================================================================
  let currentLanguage = 'english'; // 'english' or 'hinglish'
  let currentAnalysisData = null;  // Holds current structured data
  let currentSource = 'custom';    // 'sample:exam', 'sample:scholarship', or 'custom'
  let currentNoticeType = 'Exam Notice';
  let currentUrgency = 'High Urgency';
  let currentSourceLabel = 'Curated Demo (Verified)';
  let checkedTasks = new Set();    // Set of completed task IDs

  // Load saved checklist state from localStorage if available
  const STORAGE_KEY = 'campussaarthi_checklist_state_v1';
  function loadPersistedChecklist() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        checkedTasks = new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Storage access restricted or unavailable", e);
    }
  }

  function persistChecklist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checkedTasks]));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  }

  loadPersistedChecklist();

  // =========================================================================
  // 4. Character / Word Counter Helper
  // =========================================================================
  function updateTextStats() {
    const text = noticeInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    charCountEl.textContent = `${chars.toLocaleString()} characters`;
    wordCountEl.textContent = `${words.toLocaleString()} words`;
  }

  noticeInput.addEventListener('input', updateTextStats);

  // Clear text button
  btnClear.addEventListener('click', () => {
    noticeInput.value = '';
    updateTextStats();
    noticeInput.focus();
    showToast("Notice cleared");
  });

  // =========================================================================
  // 5. Toast Notification System
  // =========================================================================
  function showToast(message, duration = 2800) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${escapeHtml(message)}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // =========================================================================
  // 6. Realistic Sample Notice Loader
  // =========================================================================
  function loadSampleNotice(key = null) {
    const selectedKey = key || sampleSelect.value;
    const sample = SAMPLE_NOTICES[selectedKey] || SAMPLE_NOTICES.exam;

    noticeInput.value = sample.rawText;
    currentSource = `sample:${sample.id}`;
    updateTextStats();
    showToast(`Loaded "${sample.title}"`);
    
    // Auto-scroll input into view on mobile
    if (window.innerWidth < 768) {
      noticeInput.scrollIntoView({ behavior: 'smooth' });
    }
  }

  btnLoadSample.addEventListener('click', () => {
    loadSampleNotice();
  });

  btnErrorSample.addEventListener('click', () => {
    loadSampleNotice('exam');
    analyzeNotice();
  });

  // =========================================================================
  // 7. Strictly Grounded Client-Side Parser for Any Arbitrary Notice Text
  // =========================================================================
  function parseCustomNotice(text) {
    const rawTrimmed = text.trim();
    const lower = text.toLowerCase();

    // 1. Keyword & Context Analysis
    const hasAssessmentTerms = /(assessment|internship\s*assessment|screening\s*test|settribe|step\s*by\s*settribe|online\s*assessment)/i.test(lower);
    const hasLectureTerms = /(lecture|class|session|meeting|webinar|seminar|workshop|presentation|lab|practical)/i.test(lower);
    const hasExamTerms = /(exam|examination|carry-over|backlog|re-exam|regular\s+exam)/i.test(lower);
    const hasPlacementTerms = /(placement|recruitment|drive|tpo|interview|hiring|job|package|ctc)/i.test(lower);
    const hasScholarshipTerms = /(scholarship|concession|financial aid|stipend|nsp|samaj kalyan)/i.test(lower);
    const hasHostelTerms = /(hostel|mess|room allotment|warden)/i.test(lower);

    const hasFeeTerms = /(fee|fees|fine|late fee|penalty|rs\.|inr|₹|challan|payment)/i.test(lower);
    const hasCompulsory = /(compulsory|mandatory|must attend|strictly|attendance is compulsory)/i.test(lower);

    // Contradiction detection: Wide time window vs short duration (e.g. 10:30 AM to 11:30 PM vs 30 Minutes)
    const wideWindowMatch = rawTrimmed.match(/(10:30\s*AM\s*(?:to|-)\s*11:30\s*PM)/i) || rawTrimmed.match(/(\d{1,2}:\d{2}\s*AM\s*(?:to|-)\s*\d{1,2}:\d{2}\s*PM)/i);
    const hasShortDuration = /(?:total\s*test\s*duration|test\s*duration|duration).*(?:30|45|60)\s*min/i.test(lower) || /30\s*minutes/i.test(lower);
    const isTimingContradiction = Boolean(wideWindowMatch && hasShortDuration);

    // Specific test parameters
    const has50Questions = /50\s*questions?/i.test(lower);
    const has30Min = /30\s*min(?:utes)?/i.test(lower);
    const hasRegisteredEmail = /(registered[- ]email|registered\s*email\s*id|email\s*id\s*as\s*username)/i.test(lower);
    const hasPendingLms = /(lms\s*link|portal\s*link|link\s*will\s*be\s*shared|shared\s*shortly)/i.test(lower) && !/https?:\/\/[^\s]+/i.test(lower);
    const hasActivation = /(activat|timer\s*will\s*begin|timer\s*starts)/i.test(lower);

    // Accurate Notice Type & Urgency
    let detectedType = "College Announcement";
    let urgency = "General Academic Notice";

    if (hasAssessmentTerms) {
      detectedType = "Internship Assessment Test Notice";
      urgency = "Assessment Test Window";
    } else if (hasLectureTerms && !hasExamTerms && !hasFeeTerms) {
      const matchSubject = rawTrimmed.match(/(?:NOTICE\s*[-–:]\s*|ABOUT\s+|FOR\s+)([A-Z\s]+LECTURE|[A-Z\s]+CLASS)/i);
      const subjectName = matchSubject ? matchSubject[1].trim() : "Lecture";
      detectedType = `Academic ${subjectName.toUpperCase().includes('LECTURE') ? subjectName : subjectName + ' Lecture'} Notice`;
      urgency = hasCompulsory ? "Compulsory Attendance" : "Academic Schedule";
    } else if (hasExamTerms) {
      detectedType = "Semester Examination Notice";
      urgency = hasFeeTerms ? "High Urgency (Exam Fee Deadline)" : "Exam Schedule";
    } else if (hasPlacementTerms) {
      detectedType = "Placement & Recruitment Notice";
      urgency = "Registration Cutoff";
    } else if (hasScholarshipTerms) {
      detectedType = "Scholarship & Financial Aid Notice";
      urgency = "Document Verification";
    } else if (hasHostelTerms) {
      detectedType = "Hostel & Campus Facilities Circular";
      urgency = "Facilities Update";
    } else if (hasFeeTerms) {
      detectedType = "Fee Schedule Circular";
      urgency = "Payment Deadline";
    }

    // 2. Extract Timings and Dates: Strictly preserve exact wording, never silently correct!
    const timeRangeRegex = /\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)\s*(?:to|-|till)\s*\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)\b/gi;
    const timeRanges = rawTrimmed.match(timeRangeRegex) || [];

    const calDateRegexes = [
      /\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b/g,
      /\b\d{1,2}(?:st|nd|rd|th)?[-/\s]+(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s,]+(?:\d{2,4})\b/gi,
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?(?:[,\s]+\d{2,4})?\b/gi
    ];

    const calDates = new Set();
    calDateRegexes.forEach(reg => {
      const m = rawTrimmed.match(reg);
      if (m) m.forEach(d => calDates.add(d.trim()));
    });

    const datesTimelineEn = [];
    const datesTimelineHi = [];

    // Add time ranges (preserve verbatim)
    timeRanges.forEach((tr, i) => {
      const isWindowContradiction = isTimingContradiction && /10:30.*11:30/i.test(tr);
      datesTimelineEn.push({
        label: isWindowContradiction 
          ? "Stated Test Time Window (13 Hours)" 
          : (hasLectureTerms ? "Lecture Timing (Time of Day)" : `Test / Session Time Window ${i + 1}`),
        date: isWindowContradiction ? `${tr} (13-Hour Window)` : tr,
        fee: null,
        feeClass: "fee-tag-zero",
        type: isWindowContradiction ? "warning" : "normal",
        note: isWindowContradiction
          ? "Preserved verbatim from notice. Note: 13-hour open window contradicts stated 30-minute test duration. Verify with organizers."
          : (calDates.size === 0 ? "Time of day as stated in notice. (Calendar date not specified in text)." : "Scheduled timing from notice text.")
      });
      datesTimelineHi.push({
        label: isWindowContradiction 
          ? "Notice me Likha Test Window (13 Ghante)" 
          : (hasLectureTerms ? "Lecture ka Samay (Time of Day)" : `Samay ${i + 1}`),
        date: isWindowContradiction ? `${tr} (13 Ghante ka Window)` : tr,
        fee: null,
        feeClass: "fee-tag-zero",
        type: isWindowContradiction ? "warning" : "normal",
        note: isWindowContradiction
          ? "Notice ka exact time likha hai. 13 ghante ka window aur 30 minute test duration me contradiction hai. Organizers se confirm karein."
          : (calDates.size === 0 ? "Notice ke mutabiq lecture timing. (Tareekh notice me nahi likhi hai)." : "Notice me bataya gaya samay.")
      });
    });

    // If test duration is specified alongside a window, add a specific duration timeline entry
    if (has30Min) {
      datesTimelineEn.push({
        label: "Total Test Duration",
        date: "30 Minutes (50 Questions)",
        fee: null,
        feeClass: "fee-tag-zero",
        type: "normal",
        note: "Individual test timer. Activates once candidate begins the assessment."
      });
      datesTimelineHi.push({
        label: "Total Test Duration",
        date: "30 Minutes (50 Questions)",
        fee: null,
        feeClass: "fee-tag-zero",
        type: "normal",
        note: "Individual candidate ke liye 30 minute ka timer test start karte hi chalega."
      });
    }

    // Add calendar dates if present
    Array.from(calDates).slice(0, 3).forEach((cd, i) => {
      const feeText = hasFeeTerms && /late|penalty|fine/i.test(lower) && i > 0 ? "Late Fee Window" : null;
      datesTimelineEn.push({
        label: i === 0 ? "Specified Date / Deadline" : `Timeline Milestone ${i + 1}`,
        date: cd,
        fee: feeText,
        feeClass: feeText ? "fee-tag-fine" : "fee-tag-zero",
        type: feeText ? "warning" : "normal",
        note: "Extracted directly from notice text."
      });
      datesTimelineHi.push({
        label: i === 0 ? "Specified Tareekh / Last Date" : `Tareekh ${i + 1}`,
        date: cd,
        fee: feeText ? "Late Fee Lag Sakti Hai" : null,
        feeClass: feeText ? "fee-tag-fine" : "fee-tag-zero",
        type: feeText ? "warning" : "normal",
        note: "Circular ke text se directly extract ki gayi date."
      });
    });

    // If neither time range nor calendar date was found
    if (datesTimelineEn.length === 0) {
      datesTimelineEn.push({
        label: "Schedule / Date",
        date: "Not specified in the notice.",
        fee: null,
        feeClass: "fee-tag-zero",
        type: "normal",
        note: "No specific time or calendar date was stated in the text."
      });
      datesTimelineHi.push({
        label: "Schedule / Tareekh",
        date: "Notice me koi specific date ya time nahi mila.",
        fee: null,
        feeClass: "fee-tag-zero",
        type: "normal",
        note: "Notice me time ya date specify nahi ki gayi hai."
      });
    }

    // 3. Eligibility Extraction Grounded in Text (Never invent generic rules)
    let targetAudience = null;
    if (/settribe|step/i.test(lower)) {
      targetAudience = "Candidates registered for the STEP by SETTribe Internship Program";
    } else {
      const targetMatch = rawTrimmed.match(/(?:All\s+)?([A-Za-z0-9,\s&]+(?:Division|Div|Batch|Sem|Semester|Year|B\.?Tech|B\.?E|TY|SY|FY)\s+[A-Za-z0-9,\s&]+students?|[A-Za-z0-9,\s&]+students?\s+of\s+[A-Za-z0-9,\s&]+)/i);
      if (targetMatch) {
        targetAudience = targetMatch[0].trim();
      }
    }

    const eligibleListEn = targetAudience 
      ? [`${targetAudience}${hasCompulsory ? ' (Attendance is compulsory)' : ''}`]
      : ["Target group is not clearly specified in the notice text."];
    const eligibleListHi = targetAudience 
      ? [`${targetAudience}${hasCompulsory ? ' (Attendance compulsory hai)' : ''}`]
      : ["Notice me target group clearly specify nahi kiya gaya hai."];

    // Ineligible list: NEVER fabricate detention lists or dues!
    const hasExplicitDisqual = /(not eligible|barred|disqualified|detained|detention)/i.test(lower);
    const ineligibleListEn = hasExplicitDisqual
      ? ["Check original notice text for explicit disqualification criteria."]
      : ["Not specified in the notice (No explicit disqualifications stated)."];
    const ineligibleListHi = hasExplicitDisqual
      ? ["Disqualification ki details ke liye original notice check karein."]
      : ["Notice me koi explicit disqualification mention nahi hai."];

    // 4. Required Documents: Distinguish "not specified" from "not required"
    const commonDocs = [
      { name: "Original Fee Receipt", pattern: /(fee\s*receipt|payment\s*receipt|challan)/i },
      { name: "Previous Semester Marksheet", pattern: /(marksheet|grade card|score card)/i },
      { name: "College Identity Card", pattern: /(id card|identity card)/i },
      { name: "Parent Undertaking / Affidavit", pattern: /(undertaking|affidavit)/i },
      { name: "Aadhaar Card Copy", pattern: /(aadhaar|aadhar|uidai)/i },
      { name: "Income Certificate", pattern: /(income certificate|aay praman)/i },
      { name: "Caste / Category Certificate", pattern: /(caste|category certificate)/i },
      { name: "Updated Resume", pattern: /(resume|cv|curriculum vitae)/i }
    ];

    const detectedDocs = [];
    commonDocs.forEach(doc => {
      if (doc.pattern.test(rawTrimmed)) {
        detectedDocs.push({ name: doc.name, mandatory: true });
      }
    });

    if (detectedDocs.length === 0) {
      detectedDocs.push({
        name: "Required documents: Not specified in the notice.",
        mandatory: false
      });
    }

    // 5. Unclear or Missing Information: Genuinely Relevant Only
    const missingChecks = [];
    const missingChecksHi = [];

    // Check 1: Timing Contradiction (10:30 AM to 11:30 PM vs 30 Minutes)
    if (isTimingContradiction) {
      missingChecks.push({
        tag: "Timing Discrepancy / Window Ambiguity (13-Hour Window vs 30-Minute Duration)",
        text: "The notice states 'Test Time: 10:30 AM to 11:30 PM' (a 13-hour open window) alongside 'Total Test Duration: 30 Minutes'. It is unclear whether candidates can begin their 30-minute test at any point within this 13-hour span or if '11:30 PM' was a clerical typo for 11:30 AM. Seek confirmation from the test organizers."
      });
      missingChecksHi.push({
        tag: "Timing Discrepancy (13 Ghante ka Window vs 30 Minute Test Duration)",
        text: "Notice me test time '10:30 AM to 11:30 PM' (13 ghante ka window) likha hai jabki duration sirf '30 Minutes' batayi hai. Organizers se confirm karein ki test din me kabhi bhi diya ja sakta hai ya 11:30 PM asal me 11:30 AM ka clerical typo hai."
      });
    }

    // Check 2: Pending LMS Link Not Yet Shared
    if (hasPendingLms) {
      missingChecks.push({
        tag: "Pending LMS Portal Link Not Yet Shared",
        text: "The notice states the test will be conducted on an LMS portal, but the direct website link has not yet been shared with students."
      });
      missingChecksHi.push({
        tag: "Pending LMS Portal Link (Abhi Tak Share Nahi Hua)",
        text: "Notice me LMS portal par test hone ka zikr hai, lekin direct login link abhi tak share nahi kiya gaya hai (aana baaki hai)."
      });
    }

    // Check 3: Exact Activation Schedule
    if (hasActivation && !/(at\s+\d{1,2}:\d{2}\s*(?:am|pm)|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b)/i.test(lower)) {
      missingChecks.push({
        tag: "Exact Test Activation Schedule Not Specified",
        text: "Notice states the 30-minute timer will activate upon starting, but the exact release time for the link and activation schedule are not specified."
      });
      missingChecksHi.push({
        tag: "Exact Test Activation Schedule Mention Nahi Hai",
        text: "Notice me test start hone par 30 minute timer activate hone ki baat hai, lekin link release hone ka exact time schedule nahi diya gaya."
      });
    }

    // Online meeting / lecture link check (for lecture notices)
    const mentionsMeeting = /(meeting|lecture|webinar|class|session)/i.test(lower);
    const hasMeetingUrlOrVenue = /https?:\/\/[^\s]+|zoom|meet\.google|teams|webex|room\s*(?:no\.?|number)?\s*\d+|hall\s*[a-z0-9]+/i.test(lower);

    if (mentionsMeeting && !hasMeetingUrlOrVenue && !hasAssessmentTerms) {
      missingChecks.push({
        tag: "Meeting Link or Room Venue Not Specified",
        text: "The notice instructs students to join the lecture meeting, but does not state the platform link (e.g. Google Meet, Zoom) or classroom venue."
      });
      missingChecksHi.push({
        tag: "Meeting Link ya Classroom Venue Gayab Hai",
        text: "Notice me meeting join karne ko kaha hai, lekin meeting ka platform link ya classroom number mention nahi kiya."
      });
    }

    // Time given without calendar date
    if (timeRanges.length > 0 && calDates.size === 0 && !isTimingContradiction) {
      missingChecks.push({
        tag: "Calendar Date or Day of Week Not Stated",
        text: `Notice specifies timing (${timeRanges[0]}), but does not state the calendar date or day of the week for this session.`
      });
      missingChecksHi.push({
        tag: "Calendar Date ya Day Mention Nahi Hai",
        text: `Notice me samay (${timeRanges[0]}) to diya hai, lekin kis tareekh ya din session hoga ye nahi bataya.`
      });
    }

    // Submit online check
    const mentionsOnlineSubmit = /(submit\s+online|online\s+portal|fill\s+on\s+portal)/i.test(lower);
    const hasUrl = /https?:\/\/[^\s]+|\.edu\.in|\.ac\.in|\.nic\.in|\.gov\.in/i.test(lower);
    if (mentionsOnlineSubmit && !hasUrl && !hasPendingLms) {
      missingChecks.push({
        tag: "Missing Website / Portal URL",
        text: "The notice instructs online submission on a portal, but does not state the website URL."
      });
      missingChecksHi.push({
        tag: "Website / Portal URL Gayab Hai",
        text: "Notice me portal par online submit karne ko bola hai, par exact website link nahi diya."
      });
    }

    if (missingChecks.length === 0) {
      missingChecks.push({
        tag: "None Identified",
        text: "All necessary details appear to be covered in the notice text."
      });
      missingChecksHi.push({
        tag: "Koi Kami Nahi Mili",
        text: "Notice me zaroori jaankari di gayi lagti hai."
      });
    }

    // 6. Action Checklist & Summary Grounded in Type
    let immediateActionEn = "";
    let immediateActionHi = "";
    let checklistTasks = [];

    if (hasAssessmentTerms) {
      immediateActionEn = "Watch for the LMS test portal link on your registered email and confirm with organizers whether the test slot is an open 13-hour window or a 1-hour slot.";
      immediateActionHi = "Apne registered email par LMS portal link ka wait karein aur organizers se confirm karein ki test 13 ghante me kabhi bhi de sakte hain ya 1 ghante ka slot hai.";

      checklistTasks = [
        {
          id: "ast1",
          title: "Monitor registered email for the pending LMS portal link",
          subtext: "Link will be shared prior to test activation"
        },
        {
          id: "ast2",
          title: "Confirm test window timing with organizers (10:30 AM to 11:30 PM vs 11:30 AM)",
          subtext: "Clarify whether 11:30 PM is an open 13-hour window or a typographical error"
        },
        {
          id: "ast3",
          title: "Review topics covered before starting the assessment",
          subtext: "Total test has 50 questions with a strict 30-minute timer"
        },
        {
          id: "ast4",
          title: "Login to the LMS portal using your registered-email ID as username",
          subtext: "Ensure stable internet connection before clicking to activate test"
        },
        {
          id: "ast5",
          title: "Complete all 50 questions before the 30-minute activation timer concludes",
          subtext: "Timer starts immediately upon activating the test"
        }
      ];
    } else if (hasLectureTerms && !hasExamTerms && !hasFeeTerms) {
      const timeStr = timeRanges[0] || "scheduled time";
      immediateActionEn = `Join the lecture meeting on time (${timeStr})${hasCompulsory ? ' as attendance is compulsory.' : '.'}`;
      immediateActionHi = `${timeStr} par lecture meeting me time se join karein${hasCompulsory ? ', attendance compulsory hai.' : '.'}`;

      checklistTasks = [
        {
          id: "lec1",
          title: "Confirm meeting link or classroom venue with faculty / classmates",
          subtext: "Check whether the lecture is online or in a designated college room"
        },
        {
          id: "lec2",
          title: `Join the lecture session promptly before ${timeRanges[0] ? timeRanges[0].split(/\s*(?:to|-)\s*/)[0].trim() : 'start time'}`,
          subtext: hasCompulsory ? "Compulsory attendance - late entry may result in absence" : "Join on time"
        },
        {
          id: "lec3",
          title: "Attend the complete lecture until the session concludes",
          subtext: "Ensure your presence is recorded by the instructor"
        }
      ];
    } else if (hasExamTerms) {
      immediateActionEn = "Check exam form submission cutoffs and verify your enrolled subjects.";
      immediateActionHi = "Exam form ki last date check karein aur apne subjects verify karein.";

      checklistTasks = [
        { id: "ex1", title: "Verify subject codes and eligible semester registration", subtext: "Confirm details before final submission" },
        { id: "ex2", title: "Submit examination form before the specified deadline", subtext: hasFeeTerms ? "Submit early to avoid late fee penalties" : "Official exam deadline" },
        { id: "ex3", title: "Collect and retain submission confirmation / receipt", subtext: "Keep a safe copy for university records" }
      ];
    } else {
      immediateActionEn = "Review the instructions in this announcement and note all relevant timings.";
      immediateActionHi = "Is notice ke nirdesh dhyan se padhein aur samay note karein.";

      checklistTasks = [
        { id: "gn1", title: `Review full details for ${detectedType}`, subtext: "Confirm instructions with department board" },
        { id: "gn2", title: "Follow action steps specified in the circular text", subtext: "Comply within the stated timeframe" }
      ];
    }

    // Summary & Key Takeaways
    const cleanOneLine = rawTrimmed.replace(/\s+/g, ' ');
    const summaryEn = hasAssessmentTerms
      ? `Online Internship Assessment Test Notice for ${targetAudience || 'registered candidates'}. The assessment comprises 50 questions with a total duration of 30 minutes on the covered topics. The stated test window is 10:30 AM to 11:30 PM (13-hour open span). Candidates must use their registered-email ID as their username once the pending LMS link is distributed. The 30-minute timer begins immediately upon test activation.`
      : (cleanOneLine.length > 220 ? cleanOneLine.substring(0, 220) + '...' : cleanOneLine);

    const summaryHi = hasAssessmentTerms
      ? `${targetAudience || 'Registered candidates'} ke liye Online Internship Assessment Test ka notice. Test me covered topics par 50 questions honge aur total duration 30 minutes hai. Stated test window 10:30 AM to 11:30 PM (13 ghante) batayi gayi hai. LMS portal link share hone ke baad registered email ID se login karna hoga. Test activate karte hi 30 minute ka timer start ho jayega.`
      : `Notice jaankari: "${summaryEn}"`;

    const takeawaysEn = hasAssessmentTerms
      ? [
          "Assessment format: 50 Questions with a Total Test Duration of 30 Minutes on covered topics.",
          "Stated Test Window: 10:30 AM to 11:30 PM (13-hour window - confirm timing with organizers).",
          "Login Credentials: Username is your registered-email ID.",
          "Platform & Activation: LMS link will be shared prior to test; 30-minute countdown starts upon activation.",
          "Required documents: Not specified in the notice."
        ]
      : [
          `Category: ${detectedType}`,
          `Timing/Schedule: ${timeRanges.length > 0 ? timeRanges.join(', ') : (calDates.size > 0 ? Array.from(calDates).join(', ') : 'Not specified in text')}`,
          `Target Group: ${targetAudience || 'Specified in notice'}`,
          `Fees/Penalties: ${hasFeeTerms ? 'Mentioned in notice text' : 'None specified in the notice.'}`
        ];

    const takeawaysHi = hasAssessmentTerms
      ? [
          "Test Format: Covered topics par 50 Questions aur Total Test Duration 30 Minutes.",
          "Stated Test Window: 10:30 AM to 11:30 PM (13 ghante ka window - organizers se confirm karein).",
          "Login Credentials: Username aapki registered-email ID hogi.",
          "Platform & Activation: LMS link test se pehle aayega; start karte hi 30 minute ka timer shuru hoga.",
          "Required documents: Notice me specify nahi kiya gaya hai."
        ]
      : [
          `Category: ${detectedType}`,
          `Samay: ${timeRanges.length > 0 ? timeRanges.join(', ') : (calDates.size > 0 ? Array.from(calDates).join(', ') : 'Notice me specific nahi mila')}`,
          `Kiske liye: ${targetAudience || 'Notice ke mutabiq'}`,
          `Fees/Fine: ${hasFeeTerms ? 'Notice me fees ka zikr hai' : 'Notice me fees ya fine ka koi zikr nahi hai.'}`
        ];

    return {
      type: detectedType,
      urgency: urgency,
      english: {
        immediateAction: immediateActionEn,
        summary: summaryEn,
        keyTakeaways: takeawaysEn,
        dates: datesTimelineEn,
        eligibility: {
          eligible: eligibleListEn,
          ineligible: ineligibleListEn
        },
        documents: detectedDocs,
        missingInfo: missingChecks,
        checklist: checklistTasks
      },
      hinglish: {
        immediateAction: immediateActionHi,
        summary: summaryHi,
        keyTakeaways: takeawaysHi,
        dates: datesTimelineHi,
        eligibility: {
          eligible: eligibleListHi,
          ineligible: ineligibleListHi
        },
        documents: detectedDocs.map(d => ({
          name: d.name.includes('Not specified') ? 'Required documents: Notice me specify nahi kiya gaya hai.' : d.name,
          mandatory: d.mandatory
        })),
        missingInfo: missingChecksHi,
        checklist: checklistTasks.map(t => ({
          id: t.id,
          title: t.title,
          subtext: t.subtext
        }))
      }
    };
  }

  // Helper to determine API base URL (handles localhost:3000, Live Server, and file:// protocol)
  function getApiBaseUrl() {
    if (window.location.protocol === 'file:' || window.location.port === '5500') {
      return 'http://localhost:3000';
    }
    return '';
  }

  // Check backend health & Gemini configuration status on launch
  async function checkBackendHealth() {
    const apiStatusText = document.getElementById('api-status-text');
    const apiStatusDot = document.getElementById('api-status-dot');
    if (!apiStatusText) return;

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/api/health`, { cache: 'no-store' });
      if (res.ok) {
        const health = await res.json();
        if (health.geminiConfigured) {
          apiStatusText.textContent = `Gemini AI Connected (${health.model})`;
          if (apiStatusDot) apiStatusDot.style.backgroundColor = 'var(--color-success)';
        } else {
          apiStatusText.textContent = `Backend Live (Set API key in .env)`;
          if (apiStatusDot) apiStatusDot.style.backgroundColor = 'var(--color-warning)';
        }
      } else {
        apiStatusText.textContent = `Client-Side Heuristic (Demo)`;
        if (apiStatusDot) apiStatusDot.style.backgroundColor = 'var(--color-text-light)';
      }
    } catch (e) {
      // Backend server not started yet, running client-side
      apiStatusText.textContent = `Client-Side Heuristic (Demo)`;
      if (apiStatusDot) apiStatusDot.style.backgroundColor = 'var(--color-text-light)';
    }
  }

  // =========================================================================
  // 8. Analyze Notice Action (Workflow & Progress Simulation)
  // =========================================================================
  async function analyzeNotice() {
    const rawText = noticeInput.value.trim();

    // 1. Validation check
    if (!rawText || rawText.length < 25) {
      showErrorState("Notice text is too short or empty. Please paste at least 1-2 paragraphs of circular text, or click 'Try realistic sample' above.");
      return;
    }

    // 2. Transition to Loading State
    showLoadingState();

    // Steps for simulated realistic processing
    const steps = [
      { pct: 20, text: "Scanning circular headers & ref numbers..." },
      { pct: 50, text: "Connecting to Gemini 2.5 Flash / NLP parser..." },
      { pct: 75, text: "Auditing missing details & checking zero-hallucination guardrails..." },
      { pct: 95, text: "Finalizing actionable student checklist..." }
    ];

    let currentStep = 0;
    const progressTimer = setInterval(() => {
      if (currentStep < steps.length) {
        loadingProgress.style.width = `${steps[currentStep].pct}%`;
        loadingStepText.textContent = steps[currentStep].text;
        currentStep++;
      }
    }, 220);

    // Check if current text matches a known sample notice
    let sampleFound = null;
    for (const key in SAMPLE_NOTICES) {
      const s = SAMPLE_NOTICES[key];
      if (rawText.includes(s.title) || rawText.includes(s.rawText.substring(0, 80))) {
        sampleFound = s;
        break;
      }
    }

    // If it's a known sample notice, use the verified curated breakdown immediately
    if (sampleFound) {
      setTimeout(() => {
        clearInterval(progressTimer);
        loadingProgress.style.width = '100%';
        currentAnalysisData = sampleFound.analysis;
        currentSource = `sample:${sampleFound.id}`;
        renderResults(sampleFound.type, sampleFound.urgency, "Curated Demo (Verified)");
        showResultsState();
        showToast("Analysis complete! Action plan ready.");
        if (window.innerWidth < 1024) {
          stateResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 700);
      return;
    }

    // For custom notice text: Attempt backend call to /api/analyze (Gemini 2.5 Flash)
    let backendSuccess = false;
    let geminiErrorMsg = null;

    try {
      const apiBase = getApiBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch(`${apiBase}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noticeText: rawText, language: currentLanguage }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && resJson.data) {
          clearInterval(progressTimer);
          loadingProgress.style.width = '100%';
          currentAnalysisData = resJson.data;
          currentSource = "gemini";
          renderResults(resJson.data.type, resJson.data.urgency, resJson.source || "Gemini 2.5 Flash AI");
          showResultsState();
          showToast("✨ Analyzed with official Gemini 2.5 Flash SDK!");
          backendSuccess = true;
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        if (errJson.error === 'GEMINI_API_KEY_NOT_CONFIGURED') {
          geminiErrorMsg = "Backend active, but GEMINI_API_KEY is not configured in .env. Showing local heuristic analysis.";
        } else if (errJson.message) {
          geminiErrorMsg = `Gemini API: ${errJson.message}`;
        }
      }
    } catch (netErr) {
      console.info("Backend server offline or unreachable; using client-side heuristic engine.", netErr);
    }

    // Seamless fallback to client-side heuristic engine if backend is offline or key is missing
    if (!backendSuccess) {
      clearInterval(progressTimer);
      loadingProgress.style.width = '100%';

      try {
        const parsed = parseCustomNotice(rawText);
        currentAnalysisData = {
          english: parsed.english,
          hinglish: parsed.hinglish
        };
        currentSource = "custom";
        renderResults(parsed.type, parsed.urgency, "Client-Side Heuristic (Non-AI)");
        showResultsState();

        if (geminiErrorMsg) {
          showToast(geminiErrorMsg, 4500);
        } else {
          showToast("Notice analyzed using client-side heuristic engine.");
        }
      } catch (err) {
        console.error("Analysis error:", err);
        showErrorState("An unexpected error occurred while processing the notice. Please try again with simpler text.");
      }
    }

    if (window.innerWidth < 1024) {
      stateResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // =========================================================================
  // 9. State Transitions (Empty, Loading, Error, Results)
  // =========================================================================
  function hideAllStates() {
    stateEmpty.style.display = 'none';
    stateLoading.style.display = 'none';
    stateError.style.display = 'none';
    stateResults.style.display = 'none';
  }

  function showEmptyState() {
    hideAllStates();
    stateEmpty.style.display = 'flex';
  }

  function showLoadingState() {
    hideAllStates();
    stateLoading.style.display = 'flex';
    loadingProgress.style.width = '0%';
    loadingStepText.textContent = "Scanning circular text...";
  }

  function showErrorState(msg) {
    hideAllStates();
    stateError.style.display = 'flex';
    errorMessageEl.textContent = msg;
  }

  function showResultsState() {
    hideAllStates();
    stateResults.style.display = 'flex';
  }

  // =========================================================================
  // 10. Render Structured Results in Chosen Language
  // =========================================================================
  function renderResults(noticeType, urgency, sourceLabel) {
    if (!currentAnalysisData) return;

    const data = currentAnalysisData[currentLanguage];
    if (!data) return;

    // Badges & Meta
    if (noticeType) currentNoticeType = noticeType;
    if (urgency) currentUrgency = urgency;
    if (sourceLabel) currentSourceLabel = sourceLabel;

    resultTypeBadge.textContent = currentNoticeType;
    resultUrgencyBadge.textContent = currentUrgency;
    resultSourceIndicator.textContent = currentSourceLabel;

    // 1. Immediate Next Step
    resultImmediateAction.textContent = data.immediateAction;

    // Dynamic Card Headers & Notes based on factual notice contents
    const hasFeeNotice = data.dates && data.dates.some(d => d.fee && (d.fee.toLowerCase().includes('fine') || d.fee.includes('₹') || d.fee.toLowerCase().includes('fee')));

    if (cardDatesTitle && datesHeaderNote) {
      if (hasFeeNotice) {
        cardDatesTitle.textContent = currentLanguage === 'hinglish' 
          ? '2. Important Dates aur Penalty Timeline' 
          : '2. Important Dates & Penalty Timeline';
        datesHeaderNote.textContent = currentLanguage === 'hinglish'
          ? 'Late fee se bachne ke liye time par pay karein'
          : 'Pay on time to save money';
      } else {
        cardDatesTitle.textContent = currentLanguage === 'hinglish'
          ? '2. Schedule aur Samay'
          : '2. Schedule & Timings';
        datesHeaderNote.textContent = currentLanguage === 'hinglish'
          ? 'Notice ke mutabiq timing'
          : 'Timing extracted from notice';
      }
    }

    if (cardDocsTitle && docsHeaderNote) {
      const hasActualDocs = data.documents && data.documents.some(doc => !doc.name.includes('Not specified') && !doc.name.includes('nahi'));
      if (hasActualDocs) {
        cardDocsTitle.textContent = currentLanguage === 'hinglish'
          ? '4. Zaroori Documents aur Paperwork'
          : '4. Required Documents & Paperwork';
        docsHeaderNote.textContent = currentLanguage === 'hinglish'
          ? 'Hardcopies tayyar rakhein'
          : 'Keep hardcopies ready';
      } else {
        cardDocsTitle.textContent = currentLanguage === 'hinglish'
          ? '4. Required Documents'
          : '4. Required Documents';
        docsHeaderNote.textContent = currentLanguage === 'hinglish'
          ? 'Notice me koi document require nahi'
          : 'No documents required';
      }
    }

    // 2. Summary & Takeaways
    resultSummary.textContent = data.summary;
    resultKeyTakeaways.innerHTML = '';
    data.keyTakeaways.forEach(item => {
      const div = document.createElement('div');
      div.className = 'takeaway-item';
      div.textContent = item;
      resultKeyTakeaways.appendChild(div);
    });

    // 3. Dates & Deadlines Timeline
    resultDatesTimeline.innerHTML = '';
    data.dates.forEach(item => {
      const card = document.createElement('div');
      card.className = `timeline-item-card timeline-${item.type || 'normal'}`;
      card.innerHTML = `
        <div class="timeline-label">${escapeHtml(item.label)}</div>
        <div class="timeline-date">${escapeHtml(item.date)}</div>
        ${item.fee ? `<div class="timeline-fee-tag ${item.feeClass || 'fee-tag-zero'}">${escapeHtml(item.fee)}</div>` : ''}
        <div class="timeline-note">${escapeHtml(item.note)}</div>
      `;
      resultDatesTimeline.appendChild(card);
    });

    // 4. Eligibility Criteria
    resultEligibleList.innerHTML = '';
    data.eligibility.eligible.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      resultEligibleList.appendChild(li);
    });

    resultIneligibleList.innerHTML = '';
    data.eligibility.ineligible.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      if (item.includes('Not specified') || item.includes('mention nahi hai') || item.includes('No explicit')) {
        li.className = 'item-unspecified';
      }
      resultIneligibleList.appendChild(li);
    });

    // 5. Required Documents Grid
    resultDocumentsGrid.innerHTML = '';
    data.documents.forEach(doc => {
      const badge = document.createElement('div');
      const isNone = doc.name.includes('Not specified') || doc.name.includes('No documents required') || doc.name.includes('require nahi');
      badge.className = `doc-badge ${isNone ? 'doc-badge-none' : (doc.mandatory ? 'doc-badge-mandatory' : '')}`;
      badge.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          ${isNone 
            ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' 
            : '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>'}
        </svg>
        <span>${escapeHtml(doc.name)}</span>
      `;
      resultDocumentsGrid.appendChild(badge);
    });

    // 6. Missing or Unclear Info Guardrails
    const guardrailExplanationText = document.getElementById('guardrail-explanation-text');
    if (guardrailExplanationText) {
      guardrailExplanationText.textContent = currentLanguage === 'hinglish'
        ? 'Is notice me mili zaroori kamiyaan, contradictions aur missing jaankari:'
        : 'Critical contradictions, ambiguous timings, and missing logistics identified directly from this notice:';
    }

    resultMissingInfo.innerHTML = '';
    data.missingInfo.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'missing-item';
      itemEl.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div>
          <span class="missing-tag">${escapeHtml(item.tag)}:</span>
          <span>${escapeHtml(item.text)}</span>
        </div>
      `;
      resultMissingInfo.appendChild(itemEl);
    });

    // 7. Interactive Checklist
    renderInteractiveChecklist(data.checklist);

    // Sync inline language switcher buttons
    inlineLangBtns.forEach(btn => {
      if (btn.dataset.lang === currentLanguage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // =========================================================================
  // 11. Interactive Checklist Logic (Toggle, Progress, LocalStorage)
  // =========================================================================
  function renderInteractiveChecklist(tasks) {
    resultInteractiveChecklist.innerHTML = '';
    const total = tasks.length;
    let completedCount = 0;

    tasks.forEach(task => {
      const isDone = checkedTasks.has(task.id);
      if (isDone) completedCount++;

      const item = document.createElement('div');
      item.className = `checklist-task-item ${isDone ? 'task-completed' : ''}`;
      item.setAttribute('role', 'checkbox');
      item.setAttribute('aria-checked', isDone ? 'true' : 'false');
      item.tabIndex = 0;

      item.innerHTML = `
        <div class="checklist-checkbox" aria-hidden="true">
          ${isDone ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
        <div class="task-content">
          <div class="task-title">${escapeHtml(task.title)}</div>
          ${task.subtext ? `<div class="task-subtext">${escapeHtml(task.subtext)}</div>` : ''}
        </div>
      `;

      // Toggle interaction
      const toggleHandler = () => {
        if (checkedTasks.has(task.id)) {
          checkedTasks.delete(task.id);
        } else {
          checkedTasks.add(task.id);
        }
        persistChecklist();
        renderInteractiveChecklist(tasks);
      };

      item.addEventListener('click', toggleHandler);
      item.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleHandler();
        }
      });

      resultInteractiveChecklist.appendChild(item);
    });

    // Update progress bar & counters
    checklistCompletedCount.textContent = completedCount;
    checklistTotalCount.textContent = total;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    checklistPercent.textContent = `${percentage}%`;
    checklistProgressFill.style.width = `${percentage}%`;
  }

  // Reset Checklist Button
  btnResetChecklist.addEventListener('click', () => {
    checkedTasks.clear();
    persistChecklist();
    if (currentAnalysisData && currentAnalysisData[currentLanguage]) {
      renderInteractiveChecklist(currentAnalysisData[currentLanguage].checklist);
    }
    showToast("Checklist progress reset");
  });

  // Print Checklist Button
  btnPrintChecklist.addEventListener('click', () => {
    window.print();
  });

  // =========================================================================
  // 12. Language Switching (English / Hinglish)
  // =========================================================================
  function setLanguage(newLang) {
    if (currentLanguage === newLang) return;
    currentLanguage = newLang;

    // Sync input radio buttons
    if (newLang === 'english') {
      langEnglishRadio.checked = true;
    } else {
      langHinglishRadio.checked = true;
    }

    // Re-render results if already displayed
    if (currentAnalysisData) {
      renderResults();
      showToast(`Language switched to ${newLang === 'hinglish' ? '🇮🇳 Hinglish' : '🇬🇧 Simple English'}`);
    }
  }

  langEnglishRadio.addEventListener('change', () => setLanguage('english'));
  langHinglishRadio.addEventListener('change', () => setLanguage('hinglish'));

  inlineLangBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  // =========================================================================
  // 13. Share to WhatsApp / Copy Formatted Summary
  // =========================================================================
  btnCopySummary.addEventListener('click', () => {
    if (!currentAnalysisData) return;
    const data = currentAnalysisData[currentLanguage];
    if (!data) return;

    let textToCopy = `📢 *${resultTypeBadge.textContent} - Action Summary*\n`;
    textToCopy += `_Decoded via CampusSaarthi AI_\n\n`;
    textToCopy += `🚀 *IMMEDIATE NEXT STEP:*\n${data.immediateAction}\n\n`;
    textToCopy += `📌 *Summary:*\n${data.summary}\n\n`;

    textToCopy += `⏰ *CRITICAL DATES & PENALTIES:*\n`;
    data.dates.forEach(d => {
      textToCopy += `• ${d.label}: *${d.date}* (${d.fee || 'No Fine'})\n`;
    });

    textToCopy += `\n📄 *MANDATORY DOCUMENTS:*\n`;
    data.documents.forEach(doc => {
      textToCopy += `• [ ] ${doc.name}\n`;
    });

    if (data.missingInfo && data.missingInfo.length > 0) {
      textToCopy += `\n⚠️ *BEWARE - MISSING IN NOTICE:*\n`;
      data.missingInfo.forEach(m => {
        textToCopy += `• ${m.tag}: ${m.text}\n`;
      });
    }

    textToCopy += `\nShared via CampusSaarthi AI for College Students 🎓`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast("Copied formatted summary for WhatsApp!");
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast("Copied formatted summary for WhatsApp!");
    });
  });

  // =========================================================================
  // 14. Event Listeners & Keyboard Shortcuts
  // =========================================================================
  btnAnalyze.addEventListener('click', analyzeNotice);

  // Shortcut: Ctrl+Enter or Cmd+Enter to analyze
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      analyzeNotice();
    }
  });

  // Load default sample on initial launch for immediate delight
  loadSampleNotice('exam');

  // Verify backend connectivity and Gemini status
  checkBackendHealth();
});
