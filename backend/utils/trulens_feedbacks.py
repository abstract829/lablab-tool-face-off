from trulens_eval import Provider
from llama_index.llms.openai import OpenAI
from llama_index.core.output_parsers import PydanticOutputParser
from llama_index.core.program import LLMTextCompletionProgram
from llama_index.core.bridge.pydantic import BaseModel, Field
from typing import Any


topic_fit_evaluate_prompt_str = """\
Your task is to evaluate how well the topics fits the text.

The result of the evaluation should be a score between 0 and 10, where 0 means the topics do not fit the text at all and 10 means the topics fit the text perfectly.

The text is:
{text}

The topics are:
{topics}

Result:
"""


class Output(BaseModel):
    """Data model of the output"""

    score: float = Field(default=0.0, description="The score obtained")


class CustomFeedbacks(Provider):
    def topic_fit(self, input: str, output: Any) -> float:
        llm = OpenAI(temperature=0)

        llm_program = LLMTextCompletionProgram.from_defaults(
            output_parser=PydanticOutputParser(Output),
            prompt_template_str=topic_fit_evaluate_prompt_str,
            llm=llm,
            verbose=True,
        )

        try:
            response = llm_program(topics=output, text=input)
            return response.score / 10.0
        except Exception as e:
            return 0.0
