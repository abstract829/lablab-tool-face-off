from youtube_transcript_api import YouTubeTranscriptApi
from pytube import YouTube
from llama_index.core import Document


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

    transcript_lines = YouTubeTranscriptApi.get_transcript(yt.video_id)

    grouped_transcripts = group_transcripts_by_character_count(transcript_lines, 200)

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
        doc = Document(
            text=transcript["text"],
            metadata={
                "start": transcript["start"],
                "duration": transcript["duration"],
                **shared_metadata,
            },
        )
        documents.append(doc)

    return documents
