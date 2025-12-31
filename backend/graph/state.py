from typing import TypedDict, Optional

class State(TypedDict):
    prompt: str #prompt câu hỏi
    context: Optional[str] #các chunks API trả về
    output: Optional[dict] #bộ câu hỏi
    doc_ids: Optional[list]
    dataset_ids: Optional[list]