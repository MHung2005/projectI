import { fetchEventSource, type EventSourceMessage } from '@microsoft/fetch-event-source';
import { type QuizQuestion } from './quiz-types';


export async function* streamQuizQuestions(message: string): AsyncGenerator<QuizQuestion, void> {
    const ctrl = new AbortController();

    // Promise chờ từng sự kiện để yield
    const nextEvent = () =>
        new Promise<EventSourceMessage>((resolve, reject) => {
            fetchEventSource('http://localhost:8000/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'message': message }),
                signal: ctrl.signal,
                onerror(err) {
                    ctrl.abort();
                    reject(err);
                },
                onmessage(event) {
                    resolve(event);
                }
            });
        });

    try {
        let count_questions = 0;
        while (true) {
            const event = await nextEvent();
            if (event.data === '[END]') {
                break; // kết thúc generator
            }
            try {
                const q: QuizQuestion = JSON.parse(event.data);
                console.log("Parsed question:", q);
                yield q; // trả về ngay gói vừa nhận
                if (++count_questions >= 3) {
                    break; // Giới hạn số câu hỏi để tránh vòng lặp vô hạn trong ví dụ
                }
            } catch (e) {
                ctrl.abort();
                throw e;
            }
        }
    } finally {
        ctrl.abort();
    }
}