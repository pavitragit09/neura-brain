import google.generativeai as genai


from app.core.config import settings

client = genai.Client(
    api_key=settings.GEMINI_API_KEY
)

for model in genai.list_models():
    print(model.name)