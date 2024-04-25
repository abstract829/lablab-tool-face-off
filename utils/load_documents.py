from llama_index.core import StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from utils.transcripts import get_yt_documents
import pymongo
import os

mongo_uri = os.getenv("MONGO_URI")


def load_documents_to_vectorstore(video_url: str):
    docs = get_yt_documents(video_url)
    mongodb_client = pymongo.MongoClient(mongo_uri)
    store = MongoDBAtlasVectorSearch(mongodb_client)
    storage_context = StorageContext.from_defaults(vector_store=store)
    VectorStoreIndex.from_documents(documents=docs, storage_context=storage_context)
    print("Documents loaded to vectorstore")
