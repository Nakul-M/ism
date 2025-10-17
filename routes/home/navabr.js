const express = require("express");
const router = express.Router();
const axios = require("axios"); // <-- Add this line
const ClassMonthlyFee = require("../../models/ClassMonthlyFee");

// ------------------------
// Static page routes
// ------------------------
router.get("/index", (req, res) => {
  res.render("index");
});

router.get("/admission", (req, res) => {
  res.render("navbar/admission");
});

router.get("/contactus", (req, res) => {
  res.render("navbar/contactus");
});

router.get("/aboutus", (req, res) => {
  res.render("navbar/aboutus");
});

router.get("/download/HW", (req, res) => {
  res.render("navbar/downloadHW");
});

router.get("/transport", (req, res) => {
  res.render("navbar/transport");
});

router.get("/feeStructure", async (req, res) => {
  const classFee = await ClassMonthlyFee.find({});
  res.render("navbar/feeStructure", { classFee });
});

router.get("/chat", (req, res) => {
  res.render("navbar/chat" , { showFooter: false}); // this page will contain the chat form
});

// ------------------------
// RAG Chatbot query route
// ------------------------
router.post("/query", async (req, res) => {
  const { userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    // Call Python RAG FastAPI endpoint
    const response = await axios.post("http://16.171.33.53:8000/ask", {
      query: userQuery,
      top_k: 5,
    });

    // Return the answer as JSON to frontend
    res.json({ answer: response.data.answer });
  } catch (err) {
    console.error("RAG API error:", err.message);
    res.status(500).json({ error: "Failed to get answer from portal assistant" });
  }
});
router.get("/whatsapp", (req, res) => {
  const whatsappUrl = "https://api.whatsapp.com/send/?phone=%2B14155238886&text=join+saved-supply&type=phone_number&app_absent=0";
  res.redirect(whatsappUrl);
});



module.exports = router;

