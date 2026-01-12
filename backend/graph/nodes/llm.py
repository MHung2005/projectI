from graph.state import State
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv
import os
import json
from typing import Any, Optional

def _extract_next_json(buffer: str) -> tuple[Optional[Any], str]:
    """
    Tìm JSON object đầu tiên trong buffer. Trả về (parsed_obj, remainder_buffer).
    Nếu chưa đủ, trả về (None, buffer).
    """
    start = buffer.find('{')
    if start == -1:
        return None, buffer

    depth = 0
    in_string = False
    escape = False
    for i in range(start, len(buffer)):
        ch = buffer[i]
        if in_string:
            if escape:
                escape = False
            elif ch == '\\':
                escape = True
            elif ch == '"':
                in_string = False
        else:
            if ch == '"':
                in_string = True
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    candidate = buffer[start:i+1]
                    try:
                        parsed = json.loads(candidate)
                        remainder = buffer[i+1:]
                        return parsed, remainder
                    except json.JSONDecodeError:
                        # chưa đủ hoặc payload không hợp lệ -> chờ thêm
                        return None, buffer
    return None, buffer

def stream_json_objects(llm, messages):
    """
    Generator: nhận chunk từ llm.stream_messages, cộng dồn vào buffer,
    yield mỗi khi tìm được 1 JSON object hoàn chỉnh.
    """
    buffer = ""
    for chunk in llm.stream(messages, stream_mode="update"):
        text = getattr(chunk, "content", chunk) if chunk is not None else ""
        if not isinstance(text, str):
            text = str(text)
        buffer += text

        while True:
            parsed, buffer = _extract_next_json(buffer)
            if parsed is None:
                break
            yield parsed

def call_llm(state: State):
    load_dotenv()
    api_key = os.getenv("api_key_gemini")

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.4,
        max_tokens=None,
        timeout=None,
        max_retries=0,
        streaming=True,
        api_key=api_key
    )

    messages = [
        {
            "role": "system",
            "content": (
                "Bạn là AI chuyên gia tạo dữ liệu học tập. "
                "Nhiệm vụ: Tạo câu hỏi Quiz dựa trên nội dung bài học. "
                "Quy tắc: Chỉ trả về JSON nguyên bản, không dùng Markdown (không có ```json), không có văn bản thừa."
            )
        },
        HumanMessage(content=f"""
            Hãy tạo 3 câu hỏi dựa trên nội dung sau:
            Nội dung bài học: {state['context']}
            Yêu cầu câu hỏi: {state['prompt']}

            **CẤU TRÚC DỮ LIỆU CHUNG (QuestionBase):**
            Tất cả các câu hỏi phải có các trường:
            - `id`: string (mã ngẫu nhiên)
            - `type`: string (loại câu hỏi)
            - `question`: string (nội dung câu hỏi)
            - `description`: string (mô tả thêm, có thể để trống "")
            - `explain`: string (GIẢI THÍCH CHI TIẾT tại sao đáp án đó đúng - bắt buộc)
            - `required`: boolean (mặc định true)

            **CÁC LOẠI CÂU HỎI CHI TIẾT:**

            1. ShortAnswerQuestion (type: "short_answer"):
            {{ ..., "correctAnswer": string, "config": {{ "placeholder": string, "minLength": number, "maxLength": number }} }}

            2. ParagraphQuestion (type: "paragraph"):
            {{ ..., "correctAnswer": string, "config": {{ "rows": number, "minWords": number, "maxWords": number }} }}

            3. MultipleChoiceQuestion (type: "multiple_choice"):
            {{ ..., "correctAnswer": string, "config": {{ "options": [{{ "id": string, "label": string, "value": string }}], "layout": "vertical" }} }}

            4. CheckboxesQuestion (type: "checkboxes"):
            {{ ..., "correctAnswer": string[], "config": {{ "options": [{{ "id": string, "label": string, "value": string }}], "minSelections": number }} }}

            5. DropdownQuestion (type: "dropdown"):
            {{ ..., "correctAnswer": string, "config": {{ "options": [{{ "id": string, "label": string, "value": string }}], "placeholder": string }} }}

            **YÊU CẦU TRẢ VỀ:**
            - Trả về từng JSON object riêng biệt, mỗi object nằm trên một khối dữ liệu để hỗ trợ streaming.
            - Không bọc các đối tượng vào mảng [].
            - Nội dung trong `explain` phải mang tính sư phạm cao.
            """)
    ]
                            
    all_questions = []
    for new_question in stream_json_objects(llm, messages):
      all_questions.append(new_question)
      yield {'output': all_questions[:]}


# if __name__ == "__main__":
#     test_state = {
#         'prompt': 'Tạo một bài quiz về các quốc gia châu Âu.',
#         'context': 'Các quốc gia châu Âu bao gồm Pháp, Đức, Ý, Tây Ban Nha, và nhiều quốc gia khác với lịch sử và văn hóa phong phú.'
#     }
#     for result in call_llm(test_state):
#         print(result)

# interface Quiz {{
                    #   id: string;
                    #   title: string;
                    #   description?: string;
                    #   questions: QuizQuestion[];
                    #   createdAt: string; // ISO date
                    #   updatedAt: string; // ISO date
                    # }}
            #     2. ParagraphQuestion (type: "paragraph"):
            # {{ "id": string, "type": "paragraph", "question": string, "config": {{ "rows": number, "minWords": number, "maxWords": number, "showWordCount": boolean }} }}
