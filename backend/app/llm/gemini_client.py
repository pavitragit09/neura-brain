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

            print(
                f"\nGemini Error (Attempt {attempt + 1}/{retries})"
            )

            print(str(e))

            if attempt < retries - 1:

                wait_time = (
                    attempt + 1
                ) * 3

                print(
                    f"Retrying in {wait_time} seconds..."
                )

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