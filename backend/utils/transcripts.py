from youtube_transcript_api import YouTubeTranscriptApi, TranscriptList
from pytube import YouTube
from llama_index.core import Document
from utils.trulens_app import TrulensApp
from utils.trulens_feedbacks import CustomFeedbacks
from trulens_eval import TruCustomApp, Feedback
import json
from utils.classify import Topics


def classify_with_trulens(text: str):
    custom_feedbacks = CustomFeedbacks()

    f_feedback_topic_fit = Feedback(custom_feedbacks.topic_fit).on_input_output()

    app = TrulensApp()

    tru_recorder_clasiffy = TruCustomApp(
        app=app, app_id="Clasifications", feedbacks=[f_feedback_topic_fit]
    )

    with tru_recorder_clasiffy as recording:
        res = app.run_classify(text)

    return res


def group_transcripts_by_character_count(transcripts, char_count):
    grouped = []
    current_group = {
        "text": "",
        "start": 0,
        "duration": 0,
    }

    for index, transcript in enumerate(transcripts):
        if len(current_group["text"]) == 0:
            current_group["start"] = transcript["start"]

        if len(current_group["text"]) + len(transcript["text"]) <= char_count:
            current_group["text"] += transcript["text"] + " "
            current_group["duration"] = (
                transcript["start"] + transcript["duration"] - current_group["start"]
            )
        else:
            grouped.append(current_group)
            current_group = {
                "text": transcript["text"] + " ",
                "start": transcript["start"],
                "duration": transcript["duration"],
            }

        if index == len(transcripts) - 1:
            grouped.append(current_group)

    return grouped


def get_yt_documents(video_url: str):
    yt = YouTube(video_url)

    list_transcript = YouTubeTranscriptApi.list_transcripts(yt.video_id)

    manually_list = list_transcript._manually_created_transcripts
    lang = "en"

    for key in manually_list:
        if key:
            lang = key
            break

    transcript_lines = YouTubeTranscriptApi.get_transcript(
        yt.video_id, languages=[lang]
    )

    grouped_transcripts = group_transcripts_by_character_count(transcript_lines, 400)

    documents = []

    shared_metadata = {
        "title": yt.title or "Unknown",
        "description": yt.description or "Unknown",
        "view_count": yt.views or 0,
        "thumbnail_url": yt.thumbnail_url or "Unknown",
        "publish_date": (
            yt.publish_date.strftime("%Y-%m-%d %H:%M:%S")
            if yt.publish_date
            else "Unknown"
        ),
        "length": yt.length or 0,
        "author": yt.author or "Unknown",
        "source": yt.video_id,
    }

    for transcript in grouped_transcripts:

        res = classify_with_trulens(transcript["text"])

        topics = res["response"].topics

        topics_arr = [topic.value for topic in topics if topic.value]

        doc = Document(
            text=transcript["text"],
            metadata={
                "start": transcript["start"],
                "duration": transcript["duration"],
                "topics": json.dumps(topics_arr),
                **shared_metadata,
            },
        )
        documents.append(doc)

    return documents
