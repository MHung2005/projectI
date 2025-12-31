from graph.state import State
import json
import requests
import os
from dotenv import load_dotenv

def call_api(state: State):
    load_dotenv()
    api_key = os.getenv("api_key_ragflow")

    api_url='https://ragflow.everlearners.io/api/v1/retrieval'
    

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    prompt={
        'question': state['prompt'], #"Overall system architecture"
        'dataset_ids':  ['d2b6253297c211f0b9d2c222576e005e'], #state.get('dataset_ids', []),
        'document_ids': state.get('doc_ids', []) #['dde3d636a03011f0a11e6ab5872eab3f']
    }

    response = requests.post(api_url, headers=headers, json=prompt)
    try:
        payload = response.json()
    except Exception:
        payload = {}

    # Chính xác trích xuất 'data' và 'chunks' từ payload
    data = payload.get('data', {}) if isinstance(payload, dict) else {}
    chunks = data.get('chunks', []) if isinstance(data, dict) else []

    # Lấy tối đa 5 chunks đầu tiên và trích xuất 'content'
    selected = chunks[:5] if isinstance(chunks, list) else []
    contents = []
    for item in selected:
        if isinstance(item, dict):
            content = item.get('content', '')
            if isinstance(content, str) and content:
                contents.append(content)

    # Kết hợp các nội dung thành một chuỗi duy nhất
    context_text = "\n\n".join(contents)
    return {'context': context_text}

# def main():
#     test_state = {
#         'prompt': 'Linear Regression là gì?',
#         'doc_ids': []
#     }
#     result = call_api(test_state)
#     print(result)

# if __name__ == "__main__":
#     main()
    