import asyncio
import json
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()

# Thêm middleware cho CORS để cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Định nghĩa cấu trúc dữ liệu đầu vào, giống file api.py
class GraphInput(BaseModel):
    message: str

# --- DỮ LIỆU GIẢ (MOCK DATA) ---
# Một danh sách chứa 3 câu hỏi quiz cố định để gửi đi
mock_questions = [
    {
        "id": "mock_q1_mc",
        "type": "multiple_choice",
        "question": "Hành tinh nào được biết đến với tên gọi 'Hành tinh Đỏ'?",
        "description": "Chọn một đáp án đúng.",
        "explain": "Sao Hỏa (Mars) có bề mặt màu đỏ đặc trưng do sự hiện diện của sắt(III) oxit, vì vậy nó thường được gọi là 'Hành tinh Đỏ'.",
        "required": True,
        "correctAnswer": "B",
        "config": {
            "options": [
                {"id": "optA_q1", "label": "Sao Kim (Venus)", "value": "A"},
                {"id": "optB_q1", "label": "Sao Hỏa (Mars)", "value": "B"},
                {"id": "optC_q1", "label": "Sao Mộc (Jupiter)", "value": "C"},
            ],
            "layout": "vertical"
        }
    },
    {
        "id": "mock_q2_cb",
        "type": "checkboxes",
        "question": "Những ngôn ngữ lập trình nào sau đây là ngôn ngữ lập trình hướng đối tượng?",
        "description": "Chọn tất cả các đáp án đúng.",
        "explain": "Java và Python là những ngôn ngữ hỗ trợ mạnh mẽ lập trình hướng đối tượng. C là ngôn ngữ lập trình thủ tục.",
        "required": True,
        "correctAnswer": ["A", "C"],
        "config": {
            "options": [
                {"id": "optA_q2", "label": "Java", "value": "A"},
                {"id": "optB_q2", "label": "Ngôn ngữ C", "value": "B"},
                {"id": "optC_q2", "label": "Python", "value": "C"},
            ],
            "minSelections": 1
        }
    },
    {
        "id": "mock_q3_sa",
        "type": "short_answer",
        "question": "Viết tên đại dương lớn nhất trên Trái Đất.",
        "description": "Câu trả lời chỉ nên chứa tên.",
        "explain": "Thái Bình Dương là đại dương lớn nhất và sâu nhất trong năm đại dương của Trái Đất.",
        "required": True,
        "correctAnswer": "Thái Bình Dương",
        "config": {
            "placeholder": "Nhập câu trả lời...",
            "minLength": 5,
            "maxLength": 50
        }
    }
]

@app.post("/run")
async def run_test_graph(input: GraphInput):
    """
    Endpoint này giả lập hành vi của API thật nhưng sử dụng dữ liệu cố định.
    Nó sẽ stream 3 câu hỏi từ `mock_questions` với khoảng nghỉ 1 giây giữa mỗi câu.
    """
    print(f"Received test request with message: '{input.message}'")

    async def event_generator():
        # Lặp qua từng câu hỏi trong danh sách dữ liệu giả
        for question_payload in mock_questions:
            try:
                # Chuyển đổi dictionary thành chuỗi JSON
                json_data = json.dumps(question_payload, ensure_ascii=False)
                
                # In ra terminal để theo dõi
                print("Streaming mock output:", json_data)
                
                # Gửi dữ liệu cho client theo định dạng text/event-stream
                yield f"data: {json_data}\n\n"
                
                # Tạm dừng 1 giây để giả lập thời gian xử lý
                await asyncio.sleep(1)
                
            except Exception as exc:
                print("Serialize error on mock data:", exc)
                continue

        # Sau khi gửi hết 3 câu hỏi, gửi tín hiệu kết thúc
        print("Stream ended")
        yield "data: [[END]]\n\n"

    # Trả về một StreamingResponse để gửi dữ liệu từng phần
    return StreamingResponse(event_generator(), media_type="text/event-stream")
