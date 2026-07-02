import os
from dotenv import load_dotenv
from google import genai

# 1. Load the variables from the .env file explicitly
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key or "your_gemini_api_key" in api_key:
    print("❌ ERROR: You are still using a placeholder API key in your .env file!")
    print("Please get a valid key from https://aistudio.google.com/ and paste it into backend/.env")
else:
    print("🔄 Initializing modern Gemini client...")
    # 2. Initialize the modern client
    client = genai.Client(api_key=api_key)

    try:
        # 3. Call the recommended model
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents='Say hello in one sentence.',
        )
        print("\n✅ SUCCESS! Connection established.")
        print(f"Gemini Response: {response.text}")
        
    except Exception as e:
        print(f"\n❌ API Call Failed: {e}")