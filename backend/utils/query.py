from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.mongodb import MongoDBAtlasVectorSearch
from utils.to_cohere_docs import node_with_score_to_cohere_docs
import cohere
import os
import pymongo

from llama_index.core.vector_stores.types import (
    MetadataFilters,
    MetadataFilter,
    FilterOperator,
)

mongo_uri = os.getenv("MONGO_URI")
cohere_api_key = os.getenv("COHERE_API_KEY")


def query(content: str):
    mongodb_client = pymongo.MongoClient(mongo_uri)
    store = MongoDBAtlasVectorSearch(mongodb_client)

    # filters = MetadataFilters(
    #     filters=[
    #         MetadataFilter(key="source", operator=FilterOperator.EQ, value=video_url)
    #     ]
    # )
    print("-----------")
    print("-----------")
    print("-----------")
    print("-----------")
    print("QUERY IS :", content)
    print("-----------")
    print("-----------")
    print("-----------")
    print("-----------")

    retriever = VectorStoreIndex.from_vector_store(vector_store=store).as_retriever()
    nodes = retriever.retrieve(content)

    print(len(nodes))
    cohere_docs = node_with_score_to_cohere_docs(nodes)
    co = cohere.Client(api_key=cohere_api_key)
    response = co.chat(message=content, documents=cohere_docs, model="command-r-plus")
    return {"response_str": response.text, "response": response}
