from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from trulens_eval import TruCustomApp, Feedback
from trulens_eval.feedback.provider import OpenAI
from utils.load_documents import load_documents_to_vectorstore
from utils.trulens_app import TrulensApp
from pydantic import BaseModel
import nest_asyncio

nest_asyncio.apply()

app = FastAPI()
provider = OpenAI()


class LoadData(BaseModel):
    video_url: str


@app.post("/load")
async def load_yt_video(data: LoadData):
    load_documents_to_vectorstore(data.video_url)
    return {"message": "Documents loaded to vectorstore"}


class QueryData(BaseModel):
    query: str
    video_url: str


@app.post("/query")
async def query(data: QueryData):
    app = TrulensApp()

    f_answer_relevance = Feedback(provider.relevance).on_input_output()

    tru_recorder_query = TruCustomApp(
        app=app, app_id="QA", feedbacks=[f_answer_relevance]
    )

    with tru_recorder_query as recording:
        data = app.run_query(data.query, data.video_url)

    return data["response"]
