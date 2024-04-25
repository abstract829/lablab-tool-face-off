from dotenv import load_dotenv

load_dotenv()

import os
from utils.trulens_app import TrulensApp
from utils.trulens_feedbacks import CustomFeedbacks
from trulens_eval import TruCustomApp, Tru, Feedback


import nest_asyncio

nest_asyncio.apply()

tru = Tru()

tru.run_dashboard()


mongo_uri = os.getenv("MONGO_URI")
cohere_api_key = os.getenv("COHERE_API_KEY")


video_url = "https://www.youtube.com/watch?v=kCc8FmEb1nY"


def main():
    custom_feedbacks = CustomFeedbacks()

    f_feedback_topic_fit = Feedback(custom_feedbacks.topic_fit).on_input_output()

    app = TrulensApp()

    tru_recorder = TruCustomApp(
        app=app, app_id="Custom Application v2", feedbacks=[f_feedback_topic_fit]
    )

    with tru_recorder as recording:
        app.run_classify(
            "I bought a new iphone yesterday. It is a great phone. I love it."
        )

    import time

    while 1:
        time.sleep(10)


if __name__ == "__main__":
    main()
