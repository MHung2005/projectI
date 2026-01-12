import { fetchEventSource } from '@microsoft/fetch-event-source';
import { type QuizQuestion } from './quiz-types';

let currentAbortController: AbortController | null = null;

export async function* streamQuizQuestions(message: string): AsyncGenerator<QuizQuestion, void> {
    // Cancel any existing request
    if (currentAbortController) {
        currentAbortController.abort();
    }
    
    const ctrl = new AbortController();
    currentAbortController = ctrl;

    const STREAM_TIMEOUT_MS = 500000;

    const dataQueue: (QuizQuestion | 'END' | 'ERROR')[] = [];

    let resolveNext: (() => void) | null = null;
    const timeoutId = setTimeout(() => {
        console.error('Stream timeout');
        dataQueue.push('ERROR');
        if (resolveNext) {
            resolveNext();
            resolveNext = null;
        }
        ctrl.abort();
    }, STREAM_TIMEOUT_MS);

    const fetchPromise = fetchEventSource('http://localhost:8000/run', {
        method: 'POST',
        headers: {  
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream' 
        },
        body: JSON.stringify({ 'message': message }),
        signal: ctrl.signal,
        onopen(response: Response) {
            if (!response.ok) {
                console.error("Server connection failed", response);
                throw new Error("Failed to connect to backend");
            }
            return Promise.resolve();
        },

        onclose() {
            dataQueue.push('END');
            if (resolveNext) resolveNext();
            ctrl.abort();
            throw new Error('Stream closed'); 
        },

        onmessage(event: MessageEvent) {
            console.log("Raw event.data received:", event.data);
            
            if (event.data === '[[END]]') {
                dataQueue.push('END');
                console.log("Stream ended by server");
                if (resolveNext) resolveNext();
                ctrl.abort();
                return;
            }
            
            const lines = event.data.trim().split('\n').filter((line: string) => line.trim());
            console.log(`Processing ${lines.length} lines from event`);
            
            lines.forEach((line: string) => {
                try {
                    const payload = JSON.parse(line);
                    console.log("Parsed payload:", payload);
                    
                    // Nếu payload chứa lỗi từ server 
                    if (payload?.error) {
                        console.error("Server error payload:", payload.error);
                        dataQueue.push('ERROR');
                        if (resolveNext) {
                            resolveNext();
                            resolveNext = null;
                        }
                        ctrl.abort();
                        return;
                    }
                    const question: QuizQuestion = payload;
                    dataQueue.push(question);
                    console.log(`Pushed question, queue size: ${dataQueue.length}`);
                } catch (err) {
                    console.error("Lỗi parse JSON:", err, "Line:", line);
                }
            });
            
            if (resolveNext) {
                resolveNext();
                resolveNext = null;
            }
        },

        onerror(err: unknown) {
            console.error("Stream Error:", err);
            dataQueue.push('ERROR');
            if (resolveNext) {
                resolveNext();
                resolveNext = null;
            }
            ctrl.abort();
            throw err; 
        },
    } as any);
   try {
     while (true) {
        if (dataQueue.length === 0) {
            await new Promise<void>((resolve) => {
                resolveNext = resolve;
            });
        }
        const data = dataQueue.shift();
        if (data === 'END') {
            break;
        } else if (data === 'ERROR') {
            throw new Error("Error occurred in stream");
        } else if (data) {
            yield data;
        }
        }
    } 
    finally {
        ctrl.abort();
        clearTimeout(timeoutId);
        if (currentAbortController === ctrl) {
            currentAbortController = null;
        }
    }
}