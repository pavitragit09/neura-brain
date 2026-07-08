import os
import time

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_content(
    prompt: str,
    retries: int = 3
):
    import re

    last_error = None

    for attempt in range(retries):

        try:

            response = (
                client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
            )

            return response.text

        except Exception as e:

            last_error = e
            err_msg = str(e)

            print(
                f"\nGemini Error (Attempt {attempt + 1}/{retries})"
            )
            print(err_msg)

            if attempt < retries - 1:
                # Default backoff
                wait_time = (attempt + 1) * 3
                
                # Check for explicit delays in error message
                match = re.search(r'(?:wait|retry after|after)\s*(\d+)\s*(?:seconds|s)?', err_msg, re.IGNORECASE)
                is_rate_limit = "429" in err_msg or "quota" in err_msg.lower() or "limit" in err_msg.lower()
                
                if match:
                    wait_time = int(match.group(1)) + 2
                    print(f"[RATE LIMIT] Detected explicit retry delay in error: {wait_time} seconds.")
                elif is_rate_limit:
                    wait_time = 35
                    print(f"[RATE LIMIT] Rate limit detected. Sleep duration: {wait_time} seconds.")
                else:
                    print(f"Retrying in {wait_time} seconds...")

                time.sleep(
                    wait_time
                )

    print(
        "\nGemini failed after all retries."
    )

    raise last_error


def generate_answer(
    question: str,
    context: str
):

    prompt = f"""
You are Company Brain.

Answer ONLY using the provided context.

If the answer is not present
in the context, respond:

"I could not find that information."

CONTEXT:
{context}

QUESTION:
{question}
"""

    return generate_content(
        prompt
    )