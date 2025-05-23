import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGemini() {
  try {
    console.log('🔍 Testing Gemini connection...');
    
    // Check if API key is loaded
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not set in environment variables');
    }
    console.log('✅ API Key found:', apiKey.substring(0, 10) + '...');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Create a test prompt
    const prompt = 'Explain how AI works in one sentence.';

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ Gemini Response:');
    console.log('Response:', text);
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
}

testGemini()
  .then(() => {
    console.log('\n🎉 Gemini integration test passed!');
    process.exit(0);
  })
  .catch((error: any) => {
    console.error('\n❌ Test failed:', error.message || 'Unknown error');
    process.exit(1);
  }); 