import { type Quiz, QuestionType } from "../quiz-types";

export const mlQuiz: Quiz = {
  questions: [
    // ✅ SHORT_ANSWER
    {
      id: "q1",
      type: QuestionType.SHORT_ANSWER,
      question: "Ai được xem là cha đẻ của Trí tuệ nhân tạo?",
      required: true,
      correctAnswer: "John McCarthy",
      explain: "✅ Chính xác! John McCarthy được xem là cha đẻ của Trí tuệ nhân tạo, ông đã đặt ra thuật ngữ 'Artificial Intelligence' vào năm 1956.",
    },

    // ✅ CHECKBOXES
    {
      id: "q2",
      type: QuestionType.CHECKBOXES,
          question: "Những ví dụ nào sau đây là ứng dụng của AI?",
      description: "Chọn tất cả các đáp án đúng",
      required: true,
      config: {
        options: [
          { id: "opt1", label: "Trợ lý giọng nói (ví dụ: Siri, Alexa)", value: "voice" },
          { id: "opt2", label: "Bộ lọc email rác", value: "spam" },
          { id: "opt3", label: "Công thức bảng tính", value: "spreadsheet" },
          { id: "opt4", label: "Phương tiện tự hành", value: "autonomous" },
        ],
        showSelectAll: false,
      },
      correctAnswer: ["voice", "spam", "autonomous"],
      explain: "✅ Chính xác! Trợ lý giọng nói, bộ lọc email rác và phương tiện tự hành đều là ứng dụng của AI, còn bảng tính chỉ thực hiện phép toán cố định, không có khả năng học.",
    },

    // ✅ MULTIPLE_CHOICE
    {
      id: "q3",
      type: QuestionType.MULTIPLE_CHOICE,
      question: "Định nghĩa chính xác nhất về Trí tuệ nhân tạo (AI) là gì?",
      required: true,
      config: {
        options: [
          { id: "opt1", label: "Lập trình máy tính để thực hiện các nhiệm vụ giống con người", value: "human_tasks" },
          { id: "opt2", label: "Chỉ sử dụng các hệ thống dựa trên quy tắc", value: "rule_based" },
          { id: "opt3", label: "Tạo ra các robot vật lý", value: "robots" },
          { id: "opt4", label: "Tự động hóa các nhiệm vụ mà không cần dữ liệu", value: "no_data" },
        ],
        layout: "vertical",
      },
      correctAnswer: "human_tasks",
      explain: "Trí tuệ nhân tạo (AI) là việc lập trình máy tính để thực hiện các nhiệm vụ giống con người như nhận diện, học tập và ra quyết định.",
    },
    // CHECKBOXES
    {
      id: "q3_var_rules",
      type: QuestionType.CHECKBOXES,
      question: "Theo nội dung bài học, những quy tắc nào sau đây áp dụng cho việc đặt tên biến?",
      description: "Chọn tất cả các đáp án đúng.",
      required: true,
      config: {
        minSelections: 1,
        options: [
          {
            id: "rule_1",
            label: "Không bắt đầu bằng số",
            value: "không bắt đầu bằng số"
          },
          {
            id: "rule_2",
            label: "Có thể chứa bất kỳ ký tự đặc biệt nào",
            value: "có thể chứa bất kỳ ký tự đặc biệt nào"
          },
          {
            id: "rule_3",
            label: "Không trùng với từ khóa của ngôn ngữ lập trình",
            value: "không trùng với từ khóa của ngôn ngữ lập trình"
          },
          {
            id: "rule_4",
            label: "Chỉ được chứa chữ cái viết thường",
            value: "chỉ được chứa chữ cái viết thường"
          },
          {
            id: "rule_5",
            label: "Không chứa ký tự đặc biệt (trừ dấu gạch dưới)",
            value: "không chứa ký tự đặc biệt (trừ dấu gạch dưới)"
          }
        ]
      },
      correctAnswer: [
        "không bắt đầu bằng số",
        "không trùng với từ khóa của ngôn ngữ lập trình",
        "không chứa ký tự đặc biệt (trừ dấu gạch dưới)"
      ],
      explain: "Bài học đã liệt kê rõ các quy tắc: 'không bắt đầu bằng số, không chứa ký tự đặc biệt (trừ dấu gạch dưới), và không trùng với từ khóa của ngôn ngữ lập trình.' Việc tuân thủ các quy tắc này là rất quan trọng để đảm bảo mã nguồn hợp lệ và dễ đọc, tránh lỗi cú pháp và xung đột với các thành phần khác của ngôn ngữ. Lựa chọn 'Có thể chứa bất kỳ ký tự đặc biệt nào' và 'Chỉ được chứa chữ cái viết thường' là sai vì chúng mâu thuẫn với các quy tắc đã nêu."
    },

  

    // ✅ PARAGRAPH
    {
      id: "q4",
      type: QuestionType.PARAGRAPH,
      question: "Hãy giải thích bằng lời của bạn cách mà AI đang ảnh hưởng đến cuộc sống hàng ngày của chúng ta.",
      description: "Viết một đoạn văn ngắn (3–5 câu)",
      required: true,
      explain: "Câu hỏi mở — người học cần trình bày hiểu biết của mình về tác động của AI trong cuộc sống (ví dụ: gợi ý nội dung, xe tự lái, chăm sóc sức khỏe, tài chính...).",
    },

     // ✅ DROPDOWN
    {
      id: "q5",
      type: QuestionType.DROPDOWN,
      question: "Lĩnh vực nào sau đây sử dụng nhiều kỹ thuật của Trí tuệ nhân tạo?",
      required: true,
      config: {
        options: [
          { id: "opt1", label: "Computer Vision", value: "cv" },
          { id: "opt2", label: "Natural Language Processing (NLP)", value: "nlp" },
          { id: "opt3", label: "Robotics", value: "robotics" },
          { id: "opt4", label: "Expert Systems", value: "expert" },
        ],
        placeholder: "Select an answer",
      },
      correctAnswer: "nlp",
      explain: "✅ Chính xác! Natural Language Processing (Xử lý ngôn ngữ tự nhiên) giúp máy tính hiểu và tạo ngôn ngữ con người.",
    },

  ]
};
