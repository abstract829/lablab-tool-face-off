from trulens_eval import Tru
from trulens_eval.tru_custom_app import instrument
from utils.classify import classify
from utils.query import query

tru = Tru()


class TrulensApp:

    @instrument
    def run_classify(self, text: str):
        return classify(text)

    @instrument
    def run_query(self, content: str):
        return query(content)
