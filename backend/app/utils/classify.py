from llama_index.core.bridge.pydantic import BaseModel, Field
from llama_index.program.openai import OpenAIPydanticProgram
from typing import List
from enum import Enum

from llama_index.llms.openai import OpenAI

prompt_template_str = """\
You will receive a text extracted from a youtube video transcript.
You task is to classify the text into one or more of the following topics:

- Positive
- Negative
- Frustrating
- Neutral

Classify the text in the topics that you think are according to the text.

If you think the text does not fit in any of the topics, you can select "Neutral".

Text: "{text}"
"""


class Topics(Enum):
    """Topics a text can be about"""

    FRUSTRATING = "frustrating"
    NEGATIVE = "negative"
    POSITIVE = "positive"
    NEUTRAL = "neutral"


class Classify(BaseModel):
    """A class to classify a text"""

    topics: List[Topics] = Field(..., description="The topics the text is about")


def classify(text: str):
    llm = OpenAI(model="gpt-4o", temperature=0)

    program = OpenAIPydanticProgram.from_defaults(
        output_cls=Classify, prompt_template_str=prompt_template_str, llm=llm
    )
    try:
        response = program(text=text)
        response_str = ", ".join(
            [topic.value for topic in response.topics if topic.value]
        )
        return {"response_str": response_str, "response": response}
    except Exception as e:
        return {"response_str": "neutral", "response": Classify(topics=[Topics.NEUTRAL])}
