from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from graph.builder import graph
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GraphInput(BaseModel):
    message: str

@app.post("/run")
async def run_graph(input: GraphInput):
    state = {'prompt': input.message} #lúc tích hợp có thể mở rộng thêm các tham số khác như dataset_ids, doc_ids

    async def event_generator():
        stream_closed = False
        payload_count = 0
        try:
            for output in graph.stream(state):
                # Kiểm tra nếu client đã disconnect
                if stream_closed:
                    break

                # Bỏ qua các chunk không cần
                if "retrival" in output:
                    continue

                payload = None
                if "llm" in output and "output" in output["llm"]:
                    payload = output["llm"]["output"]
                elif all(k in output for k in ("id", "type", "question")):
                    payload = output
                else:
                    continue

                # Ép về JSON hợp lệ
                try:
                    json_data = json.dumps(payload, ensure_ascii=False)
                    print("Serialized output:", json_data)
                    yield f"data: {json_data}\n\n"
                    payload_count += 1
                    
                    # Dừng sau 3 payload
                    if payload_count >= 3: #sửa từ 10 thành 3 để test nhanh hơn
                        break
                        
                except Exception as exc:
                    print("Serialize error:", exc)
                    continue

        except GeneratorExit:
            print("Client disconnected")
            stream_closed = True
        except Exception as e:
            print(f"Stream error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        # Chỉ gửi END khi đã đủ 3 payload
        if payload_count >= 3: #sửa từ 10 thành 3 để test nhanh hơn
            print("Stream ended")
            yield "data: [[END]]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")