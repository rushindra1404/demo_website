require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.static('.'));

// Rate limiter: max 10 requests per minute per IP
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { reply: "You're sending too many messages. Please slow down.", confidence: 0 }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Local FAQ grounding (Hybrid Mode)
const localFAQs = [
    {
        keywords: ['whitening', 'bleaching', 'white'],
        answer: 'Teeth whitening is a safe and effective way to brighten your smile. It usually takes about 45-60 minutes in the clinic, and results are immediate and painless.'
    },
    {
        keywords: ['root canal', 'rct', 'pain', 'nerve'],
        answer: 'A root canal is a procedure to save a severely infected tooth. Thanks to modern anesthesia and techniques, it is virtually painless and usually completed in 1-2 visits.'
    },
    {
        keywords: ['braces', 'aligners', 'invisalign', 'orthodontic', 'cost', 'price', 'fee'],
        answer: 'The cost of braces or invisible aligners depends on the complexity of your case. We offer flexible payment plans. We recommend booking a free consultation to get an exact estimate!'
    },
    {
        keywords: ['appointment', 'book', 'schedule', 'visit'],
        answer: 'You can easily book an appointment by clicking the "Book Consult" button at the top of the page, or by using our interactive booking wizard. Alternatively, you can call us or chat on WhatsApp!'
    },
    {
        keywords: ['time', 'hours', 'open', 'close', 'timing'],
        answer: 'We are open Monday to Saturday from 10:00 AM to 08:30 PM. We are closed on Sundays.'
    },
    {
        keywords: ['location', 'address', 'where', 'map', 'directions'],
        answer: 'We are located Besides Narayanarao Documention center, India 1 ATM, NH 26, Gajapatinagaram, Andhra Pradesh 535270. You can find the Google Maps link in the Contact section at the bottom of the page.'
    },
    {
        keywords: ['emergency', 'urgent', 'broken', 'accident', 'bleeding'],
        answer: 'For dental emergencies, please call us immediately at +91 94935 96930 or message us on WhatsApp. We prioritize urgent cases.'
    },
    {
        keywords: ['implant', 'missing tooth', 'replace'],
        answer: 'Dental implants are a permanent and natural-looking solution for missing teeth. Our Senior Implantologist, Dr. Ramesh, will guide you through the process step by step.'
    },
    {
        keywords: ['hi', 'hello', 'hey', 'greetings'],
        answer: 'Hello! Welcome to Sri Sai Divya Dental Clinic. How can I assist you with your smile today?'
    }
];

const systemPrompt = `ROLE:
You are "Smile Assistant", the official virtual assistant of Sri Sai Divya Dental Clinic.

MISSION:
Provide clear, friendly, and reliable information about dental care and the clinic’s services. Help users understand treatments, answer common questions, and guide them toward booking an appointment.

TONE & STYLE:
- Friendly, calm, and professional
- Simple, easy-to-understand language
- Avoid technical jargon unless necessary
- Keep responses concise (max 120–150 words)
- Use structured formatting when helpful (short paragraphs or bullet points)

SCOPE (WHAT YOU CAN ANSWER):
You are allowed to answer questions related to:
1. Dental Services: Teeth whitening, Braces / aligners, Root canal treatment, Dental implants, Pediatric dentistry, Cosmetic dentistry
2. General Dental Knowledge: Oral hygiene tips, Common dental problems, Procedure explanations, Aftercare guidance (basic)
3. Clinic Information: Appointment booking process, Clinic timings, Location, General pricing ranges (not exact quotes)

STRICT BOUNDARIES (VERY IMPORTANT):
1. NO MEDICAL DIAGNOSIS: Do NOT diagnose diseases, prescribe medications, or give treatment plans for specific cases. Instead say: "For an accurate diagnosis, please visit the clinic or consult the doctor."
2. NO GUARANTEES: Do NOT guarantee results. Avoid absolute claims like "100% safe" or "no pain".
3. LIMIT MEDICAL ADVICE: Only provide general guidance. Always encourage professional consultation for serious issues.
4. OUT-OF-SCOPE HANDLING: If the question is not related to dental care, too complex medically, or not clearly understood, respond with: "I’m not fully sure about that. Let me connect you with our clinic for accurate assistance." Then suggest WhatsApp contact.

RESPONSE STRUCTURE:
Whenever possible:
1. Short explanation
2. Key points (bullet format)
3. Friendly closing or next step

WHATSAPP FALLBACK:
If no clear answer, medical complexity, or user requests human help, say: "You can connect directly with our clinic for assistance." Suggest WhatsApp contact.

BOOKING GUIDANCE:
If user shows intent to book, guide them to booking system and suggest next steps clearly. Example: "You can book your appointment directly on our website or contact us via WhatsApp."

SAFETY & TRUST:
- Always prioritize user safety
- Never provide harmful or misleading information
- Maintain a professional healthcare tone

FINAL BEHAVIOR:
You must behave like a knowledgeable dental assistant, a helpful guide, and a trustworthy representative of the clinic. NOT like a generic AI, a medical doctor, or a casual chatbot.

All responses must be relevant, clear, safe, professional, and helpful.`;

app.post('/api/chat', apiLimiter, async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
            return res.status(400).json({ reply: 'Invalid message provided.', confidence: 0 });
        }

        const lowerMsg = userMessage.toLowerCase();

        // 1. Local FAQ matching
        let bestMatch = null;
        let maxMatches = 0;
        
        localFAQs.forEach(faq => {
            let matches = 0;
            faq.keywords.forEach(kw => {
                if (lowerMsg.includes(kw)) matches++;
            });
            if (matches > 0 && matches > maxMatches) {
                maxMatches = matches;
                bestMatch = faq;
            }
        });

        // If strong match
        if (bestMatch && maxMatches > 0) {
            return res.json({ 
                reply: bestMatch.answer + "<br><br><b>Visit our clinic!</b> <a href=\"#appointment\" onclick=\"toggleChat()\" class=\"text-primary font-bold underline\">Book your appointment here</a>", 
                confidence: 0.9,
                suggestions: []
            });
        }

        // 2. Fallback to Gemini API
        if (!process.env.GEMINI_API_KEY) {
            // If no key is set yet, trigger fallback in UI
            return res.json({
                reply: "I'm currently unable to connect to my brain. Let me connect you with our clinic directly.",
                confidence: 0.1
            });
        }

        const result = await model.generateContent(
            systemPrompt + "\n\nUser: " + userMessage
        );

        const reply = result.response.text();
        
        // Basic confidence heuristic: if it says "not certain" or "not sure", lower confidence
        let confidence = 0.8;
        if (reply.toLowerCase().includes("not certain") || reply.toLowerCase().includes("not sure") || reply.toLowerCase().includes("whatsapp")) {
            confidence = 0.3; // Trigger WhatsApp fallback in UI
        }

        res.json({
            reply: reply + "<br><br><b>Visit our clinic!</b> <a href=\"#appointment\" onclick=\"toggleChat()\" class=\"text-primary font-bold underline\">Book your appointment here</a>",
            confidence: confidence,
            suggestions: []
        });

    } catch (error) {
        console.error("Gemini API Error:", error.message);
        res.status(500).json({ 
            reply: "I encountered an error trying to process your request.", 
            confidence: 0 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
