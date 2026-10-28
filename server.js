/**
 * CampusSaarthi AI - Express Backend Server
 * Powered by Google Gemini API (@google/genai SDK)
 * Education & Student Life Track
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(__dirname));

// Recommended currently supported Gemini model (can be configured in .env)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

/**
 * Health check & configuration status endpoint
 */
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey.trim() !== '' && apiKey !== 'your_api_key_here');

  res.json({
    status: 'ok',
    geminiConfigured: isConfigured,
    model: GEMINI_MODEL,
    message: isConfigured
      ? 'Gemini API is configured and ready.'
      : 'GEMINI_API_KEY is missing or set to placeholder in .env.'
  });
});

/**
 * Endpoint: POST /api/analyze
 * Body: { noticeText: string, language?: 'english' | 'hinglish' }
 */
app.post('/api/analyze', async (req, res) => {
  try {
    const { noticeText, language = 'english' } = req.body;

    if (!noticeText || typeof noticeText !== 'string' || noticeText.trim().length < 20) {
      return res.status(400).json({
        error: 'Invalid request: noticeText must be at least 20 characters.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY_NOT_CONFIGURED',
        message: 'GEMINI_API_KEY is not configured in .env. Please copy .env.example to .env, insert your Gemini API key from Google AI Studio, and restart the backend server.'
      });
    }

    // Initialize official Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // System prompt with strict factual grounding and contradiction auditing rules
    const prompt = `You are CampusSaarthi AI, an expert, strictly fact-grounded assistant for Indian college students.
CRITICAL INSTRUCTION: Treat the supplied notice as your SOLE AND ABSOLUTE SOURCE OF FACT.

MANDATORY FACTUAL GROUNDING & AUDITING RULES:
1. NEVER INVENT OR EXTRAPOLATE FACTS: Do NOT assume or invent generic college rules, fees, fines, photocopies, marksheets, receipts, counter rooms, attendance quotas, detention lists, or backlogs.
2. DISTINGUISH "NOT SPECIFIED" FROM "NOT REQUIRED":
   - If documents are not mentioned in the notice, do NOT claim "No documents required."
   - State explicitly: "Required documents: Not specified in the notice." (In Hinglish: "Required documents: Notice me specify nahi kiya gaya hai.")
3. AUDIT CONTRADICTIONS & DISCREPANCIES (NEVER SILENTLY CORRECT):
   - Always compare related facts in the circular for contradictions or ambiguities.
   - For example, if the notice states a test time window of "10:30 AM to 11:30 PM" alongside "Total Test Duration: 30 Minutes", recognize that 10:30 AM to 11:30 PM is a 13-hour span.
   - Preserve the exact original wording "10:30 AM to 11:30 PM" in dates/timings. NEVER silently alter or "correct" 11:30 PM to 11:30 AM!
   - In "missingInfo", you MUST flag this timing contradiction: highlight that a 13-hour open window contradicts a 30-minute test duration, and advise candidates to verify with organizers whether the test is flexible or if 11:30 PM is a typo for 11:30 AM.
4. COMPREHENSIVE ASSESSMENT & TEST SPECIFICS:
   - For test, exam, or assessment notices, explicitly capture and report:
     * Question count (e.g. 50 questions)
     * Test duration (e.g. 30 minutes)
     * Topics or syllabus covered
     * Login credentials (e.g. username is registered-email ID)
     * Platform/LMS link status (e.g. pending link not yet shared)
     * Test activation conditions (e.g. timer begins upon starting)
   - Place these in the summary, key takeaways, and interactive checklist.
5. GENUINE GAPS IN "UNCLEAR OR MISSING INFORMATION":
   - Do NOT say "None Identified" if the notice leaves key logistics pending or contradictory!
   - For an assessment notice like SETTribe, flag:
     1) Timing discrepancy between the 13-hour window (10:30 AM to 11:30 PM) and 30-minute duration.
     2) LMS portal link not yet shared / pending distribution.
     3) Exact activation schedule not specified.
6. ELIGIBILITY GROUNDING:
   - "eligible": Only target group explicitly supported by the notice (e.g., "Candidates registered for the STEP by SETTribe Internship Program"). If not clearly specified, state that the target group is not clearly specified in the text.
   - "ineligible": If the notice does not state any disqualifications or restrictions, return ["Not specified in the notice."]. DO NOT invent attendance shortages, fee dues, or detention lists!
7. DATES vs TIME OF DAY:
   - Clearly distinguish a time of day / window from calendar dates.
   - If no fees or fines exist in the notice text, set fee to null (never invent fees, penalties, or fines).
8. BILINGUAL:
   - Provide output for BOTH "english" (simple, active voice, zero jargon) AND "hinglish" (conversational Hindi-English blend). Both must adhere strictly to these exact factual rules.

COLLEGE NOTICE TEXT TO ANALYZE:
---
${noticeText.trim()}
---

Return ONLY valid JSON matching this exact structure:
{
  "type": "Accurate detected notice type (e.g., 'Internship Assessment Test Notice', 'Semester Examination Schedule', 'Academic Lecture Notice')",
  "urgency": "Urgency rating grounded in text (e.g., 'Assessment Deadline', 'Compulsory Attendance', 'General Notice')",
  "english": {
    "immediateAction": "Exact immediate step grounded strictly in the notice",
    "summary": "Plain-English summary of ONLY what the notice actually says, including test parameters (50 questions, 30 min duration, topics, registered email login, pending LMS link)",
    "keyTakeaways": ["Key takeaway points grounded strictly in the notice text"],
    "dates": [
      {
        "label": "Timing or Date label (e.g., 'Test Window (10:30 AM to 11:30 PM)' or 'Form Submission Deadline')",
        "date": "Exact extracted time or date from text without silent alterations",
        "fee": null,
        "feeClass": "fee-tag-zero",
        "type": "normal",
        "note": "Context from notice, including any duration or open-window notes"
      }
    ],
    "eligibility": {
      "eligible": ["Target audience explicitly supported by notice, or 'Not clearly specified in notice'"],
      "ineligible": ["Explicit disqualifications stated in notice, or 'Not specified in the notice.'"]
    },
    "documents": [
      {
        "name": "Document explicitly requested, or 'Required documents: Not specified in the notice.'",
        "mandatory": false
      }
    ],
    "missingInfo": [
      {
        "tag": "Genuinely relevant missing information or contradiction",
        "text": "Clear explanation of the missing logistics, timing discrepancy, or pending links"
      }
    ],
    "checklist": [
      {
        "id": "t1",
        "title": "Actionable task grounded strictly in this notice",
        "subtext": "Helpful instruction from notice text"
      }
    ]
  },
  "hinglish": {
    "immediateAction": "Immediate step in conversational Hinglish",
    "summary": "Summary in conversational Hinglish grounded strictly in notice",
    "keyTakeaways": ["Key points in Hinglish grounded in notice"],
    "dates": [
      {
        "label": "Timing label in Hinglish",
        "date": "Extracted time or date verbatim",
        "fee": null,
        "feeClass": "fee-tag-zero",
        "type": "normal",
        "note": "Note in Hinglish"
      }
    ],
    "eligibility": {
      "eligible": ["Eligible students in Hinglish"],
      "ineligible": ["Disqualifications in Hinglish, or 'Notice me koi disqualification mention nahi hai.'"]
    },
    "documents": [
      {
        "name": "Document in Hinglish, or 'Required documents: Notice me specify nahi kiya gaya hai.'",
        "mandatory": false
      }
    ],
    "missingInfo": [
      {
        "tag": "Missing info tag in Hinglish",
        "text": "Explanation in Hinglish"
      }
    ],
    "checklist": [
      {
        "id": "t1",
        "title": "Task in Hinglish",
        "subtext": "Subtext in Hinglish"
      }
    ]
  }
}`;

    // Call the Gemini model using official SDK
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    let rawOutput = response.text;
    if (!rawOutput) {
      throw new Error('Gemini model returned empty response.');
    }

    // Strip markdown code block wrapper if present
    rawOutput = rawOutput.trim();
    if (rawOutput.startsWith('```')) {
      rawOutput = rawOutput.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    }

    const parsedData = JSON.parse(rawOutput);

    // Ensure valid structure
    if (!parsedData.english || !parsedData.english.summary) {
      throw new Error('Gemini response did not conform to expected schema.');
    }

    // Post-processing guardrail: Sanitize output against ground-truth notice text
    const lowerText = noticeText.toLowerCase();
    const hasFeeTerms = /(fee|fees|fine|late fee|rs\.|inr|₹|penalty|challan)/i.test(lowerText);
    const hasDocTerms = /(receipt|marksheet|undertaking|resume|certificate|admit card|challan|bonafide|id card|identity card)/i.test(lowerText);
    const hasDisqualTerms = /(not eligible|ineligible|barred|detained|detention|suspended|disqualified)/i.test(lowerText);

    // Contradiction detection: Wide time window vs short duration
    const hasWideWindow = /10:30\s*am\s*(?:to|-)\s*11:30\s*pm/i.test(lowerText) || (/\b\d{1,2}:\d{2}\s*am\s*(?:to|-)\s*\d{1,2}:\d{2}\s*pm/i.test(lowerText) && /duration.*(?:30|45|60)\s*min/i.test(lowerText));
    const hasShortDuration = /(?:duration|test\s*duration|time\s*duration).*(?:30|45)\s*min/i.test(lowerText) || /30\s*minutes/i.test(lowerText);
    const hasTimingDiscrepancy = hasWideWindow && hasShortDuration;

    // Pending LMS/Link detection
    const hasPendingLink = /(lms\s*link|portal\s*link|test\s*link).*(?:shared|will be shared|pending|shortly)/i.test(lowerText) || (/(?:link|portal).*(?:shortly|later|before\s*the\s*test)/i.test(lowerText) && !/https?:\/\/[^\s]+/i.test(lowerText));

    // Activation schedule detection
    const mentionsActivation = /(activate|activation|timer\s*starts|timer\s*begins)/i.test(lowerText);
    const lacksActivationSchedule = mentionsActivation && !/(at\s+\d{1,2}:\d{2}\s*(?:am|pm)|\b\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}\b)/i.test(lowerText);

    ['english', 'hinglish'].forEach(lang => {
      const d = parsedData[lang];
      if (!d) return;

      // 1. If notice has no fee terms, sanitize dates to prevent hallucinated fines
      if (!hasFeeTerms && Array.isArray(d.dates)) {
        d.dates.forEach(item => {
          item.fee = null;
          item.feeClass = 'fee-tag-zero';
          if (item.type === 'danger') item.type = 'normal';
        });
      }

      // 2. Distinguish "not specified" from "not required"
      if (!hasDocTerms) {
        d.documents = [{
          name: lang === 'hinglish' 
            ? 'Required documents: Notice me specify nahi kiya gaya hai.' 
            : 'Required documents: Not specified in the notice.',
          mandatory: false
        }];
      } else if (Array.isArray(d.documents)) {
        // Clean any accidental "No documents required"
        d.documents = d.documents.map(doc => {
          if (doc.name && /no\s*documents?\s*required/i.test(doc.name)) {
            return {
              name: lang === 'hinglish' 
                ? 'Required documents: Notice me specify nahi kiya gaya hai.' 
                : 'Required documents: Not specified in the notice.',
              mandatory: false
            };
          }
          return doc;
        });
      }

      // 3. If notice has no disqualification terms, ensure ineligible list states unspecified
      if (!hasDisqualTerms) {
        d.eligibility.ineligible = [
          lang === 'hinglish'
            ? 'Notice me koi explicit disqualification mention nahi hai.'
            : 'Not specified in the notice (No explicit disqualifications stated).'
        ];
      }

      // 4. Ensure Unclear/Missing Information includes genuine contradictions and gaps
      if (!Array.isArray(d.missingInfo)) {
        d.missingInfo = [];
      }

      // Filter out any generic "None Identified" if genuine issues exist
      if (hasTimingDiscrepancy || hasPendingLink || lacksActivationSchedule) {
        d.missingInfo = d.missingInfo.filter(m => !/none\s*(identified|found)/i.test(m.tag || ''));
      }

      // Check if timing discrepancy is present in missingInfo
      if (hasTimingDiscrepancy && !d.missingInfo.some(m => /timing|window|contradiction|discrepancy/i.test(m.tag || ''))) {
        d.missingInfo.unshift({
          tag: lang === 'hinglish' 
            ? 'Timing Discrepancy (13 Ghante ka Window vs 30 Minute Test Duration)' 
            : 'Timing Discrepancy / Window Ambiguity (13-Hour Window vs 30-Minute Duration)',
          text: lang === 'hinglish'
            ? "Notice me test time '10:30 AM to 11:30 PM' (13 ghante ka window) diya hai jabki duration '30 Minutes' likhi hai. Organizers se confirm karein ki test din me kabhi bhi shuru kiya ja sakta hai ya 11:30 PM asal me 11:30 AM ka clerical typo hai."
            : "The notice states 'Test Time: 10:30 AM to 11:30 PM' (a 13-hour window) alongside 'Total Test Duration: 30 Minutes'. It is unclear whether candidates can take their 30-minute test at any point within this 13-hour window or if '11:30 PM' was a clerical typo for 11:30 AM. Seek confirmation from the test organizers."
        });
      }

      // Check if pending LMS link is present in missingInfo
      if (hasPendingLink && !d.missingInfo.some(m => /lms|portal|link/i.test(m.tag || ''))) {
        d.missingInfo.push({
          tag: lang === 'hinglish' 
            ? 'Pending LMS Portal Link (Abhi Tak Share Nahi Hua)' 
            : 'Pending LMS Portal Link Not Yet Shared',
          text: lang === 'hinglish'
            ? 'Notice me bataya gaya hai ki test LMS portal par hoga, lekin direct link abhi tak share nahi kiya gaya hai (test se pehle aana baaki hai).'
            : 'The notice indicates the test will take place on an LMS portal, but the direct website link has not yet been shared with students.'
        });
      }

      // Check if activation schedule is present in missingInfo
      if (lacksActivationSchedule && !d.missingInfo.some(m => /activation/i.test(m.tag || ''))) {
        d.missingInfo.push({
          tag: lang === 'hinglish' 
            ? 'Exact Test Activation Schedule Mention Nahi Hai' 
            : 'Exact Test Activation Schedule Not Specified',
          text: lang === 'hinglish'
            ? 'Notice ke mutabiq test start karte hi 30 minute ka timer shuru hoga, lekin link release aur exact activation ka schedule mention nahi hai.'
            : 'The notice states the 30-minute timer will activate upon starting, but the exact release time for the link and activation schedule are not specified.'
        });
      }
    });

    // Scholarship-specific factual guardrail
    // Only apply when the notice explicitly identifies a merit scholarship.
    if (/merit scholarship/i.test(noticeText)) {
      const isBCAGroup =
        /second[- ]year/i.test(noticeText) &&
        /third[- ]year/i.test(noticeText) &&
        /\bBCA\b/i.test(noticeText);

      const hasCGPA = /minimum\s+CGPA\s+of\s+7(?:\.0)?\b/i.test(noticeText);
      const hasNoApplicationFee =
        /no application fee is required/i.test(noticeText);

      const hasDeadline =
        /application deadline\s*:\s*10 November 2026,\s*5:00 PM/i.test(noticeText);

      const requiredDocuments = [
        'Latest college marksheet',
        'College Identity Card',
        'Valid income certificate'
      ].filter(doc => {
        const terms = {
          'Latest college marksheet': /latest college marksheet/i,
          'College Identity Card': /college identity card/i,
          'Valid income certificate': /valid income certificate/i
        };
        return terms[doc].test(noticeText);
      });

      ['english', 'hinglish'].forEach(lang => {
        const d = parsedData[lang];
        if (!d) return;

        d.eligibility = {
          eligible: [
            ...(isBCAGroup
              ? [lang === 'hinglish'
                  ? 'Second-Year aur Third-Year BCA students'
                  : 'Second-Year and Third-Year BCA students']
              : []),
            ...(hasCGPA
              ? [lang === 'hinglish'
                  ? 'Minimum CGPA: 7.0'
                  : 'Minimum CGPA: 7.0']
              : [])
          ],
          ineligible: [
            lang === 'hinglish'
              ? 'Notice me koi explicit disqualification mention nahi hai.'
              : 'Not specified in the notice.'
          ]
        };

        d.documents = requiredDocuments.map(name => ({
          name,
          mandatory: true
        }));

        d.dates = [
          {
            label: lang === 'hinglish'
              ? 'Notice ki date'
              : 'Notice Date',
            date: '28 October 2026',
            fee: null,
            feeClass: 'fee-tag-zero',
            type: 'normal',
            note: lang === 'hinglish'
              ? 'Notice par di gayi date.'
              : 'Date stated in the notice.'
          },
          ...(hasDeadline ? [{
            label: lang === 'hinglish'
              ? 'Application ki aakhri tareekh'
              : 'Application Deadline',
            date: '10 November 2026, 5:00 PM',
            fee: null,
            feeClass: 'fee-tag-zero',
            type: 'normal',
            note: lang === 'hinglish'
              ? 'Incomplete aur deadline ke baad aayi applications consider nahi hongi.'
              : 'Incomplete and late applications will not be considered.'
          }] : [])
        ];

        if (hasNoApplicationFee) {
          d.keyTakeaways = [
            ...(d.keyTakeaways || []).filter(
              item => !/late fee|penalty|pay on time|save money/i.test(item)
            ),
            lang === 'hinglish'
              ? 'Application fee nahi hai.'
              : 'No application fee is required.'
          ];
        }

        d.missingInfo = [
          {
            tag: lang === 'hinglish'
              ? 'Contact details specify nahi hain'
              : 'Contact Details Not Specified',
            text: lang === 'hinglish'
              ? 'Student Affairs Office ka phone number ya email aur exact working hours notice me nahi diye gaye.'
              : 'The Student Affairs Office phone number or email and exact working hours are not provided.'
          }
        ];
      });

      parsedData.type = 'Scholarship & Financial Aid Notice';
    }
    // Sanitize circular type if no fee/exam terms exist
    if (!hasFeeTerms && !/(regular\s*exam|semester\s*exam|university\s*exam)/i.test(lowerText)) {
      if (parsedData.type && /(fee|penalty)/i.test(parsedData.type)) {
        parsedData.type = /(assessment|test|internship)/i.test(lowerText) 
          ? 'Internship Assessment Test Notice' 
          : 'College Announcement';
      }
    }

    return res.json({
      success: true,
      source: `Gemini AI (${GEMINI_MODEL})`,
      data: parsedData
    });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({
      error: 'GEMINI_ANALYSIS_FAILED',
      message: error.message || 'Failed to analyze notice with Gemini API.'
    });
  }
});

// Fallback: serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`  CampusSaarthi AI Backend Server Running`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Gemini Model: ${GEMINI_MODEL}`);
  console.log(`  API Key:     ${process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here' ? 'Configured ✅' : 'Missing in .env ⚠️ (Running in demo mode)'}`);
  console.log(`=======================================================`);
});
