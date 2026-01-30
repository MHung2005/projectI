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
    # Ensure default context so downstream nodes don't KeyError
    state = {'prompt': input.message, 'context': ""}

    async def event_generator():
        try:
            sent_ids = set()  # Theo dõi những ID đã gửi
            async for output in graph.astream(state):
                # Bỏ qua các chunk không cần thiết từ các node khác
                if "retrival" in output:
                    continue

                # Trích xuất payload từ node 'llm'
                if "llm" in output and "output" in output["llm"]:
                    output_list = output["llm"]["output"]
                    
                    # Gửi các câu hỏi MỚI (những câu chưa gửi)
                    for idx, payload in enumerate(output_list):
                        payload_id = payload.get('id') if isinstance(payload, dict) else None
                        
                        # Chỉ gửi nếu là câu hỏi mới
                        if payload_id and payload_id not in sent_ids:
                            sent_ids.add(payload_id)
                            try:
                                json_data = json.dumps(payload, ensure_ascii=False)
                                print(f"  → Sending NEW question: {json_data[:80]}...")
                                yield f"data: {json_data}\n\n"
                            except Exception as exc:
                                print(f"  → Serialize error: {exc}")
                                continue
                        else:
                            print(f"      → Skipping (already sent)")
                else:
                    print("  → No llm output")
                    continue
            
            # Sau khi vòng lặp for kết thúc một cách tự nhiên, gửi tín hiệu END
            print(f"DEBUG - Loop ended. Total unique questions sent: {len(sent_ids)}")
            print("Stream ended naturally.")
            yield "data: [[END]]\n\n"

        except GeneratorExit:
            print("Client disconnected")
        except Exception as e:
            print(f"Stream error: {e}")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
