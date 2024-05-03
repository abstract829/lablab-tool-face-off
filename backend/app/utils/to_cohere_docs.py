from llama_index.core.schema import NodeWithScore
from typing import List


def node_with_score_to_cohere_docs(retriever_docs: List[NodeWithScore]):

    cohere_docs = []

    for idx, doc in enumerate(retriever_docs):
        metadata_to_str_keys = {key: str(value) for key, value in doc.metadata.items()}

        doc = {
            "id": str(idx + 1),
            "text": doc.text,
            **metadata_to_str_keys,
        }

        cohere_docs.append(doc)

    return cohere_docs
