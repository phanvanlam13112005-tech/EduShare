import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  docCitation: string;
}

@Component({
  selector: 'app-ai-quiz-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ai-quiz.page.html',
  styleUrl: './ai-quiz.page.scss'
})
export class AiQuizPage {
  selectedCourse = signal('Vi xử lý & Vi điều khiển ARM');
  difficulty = signal<'EASY' | 'MEDIUM' | 'HARD'>('MEDIUM');
  questionCount = signal<number>(5);

  isGenerating = signal(false);
  quizStarted = signal(false);
  quizSubmitted = signal(false);

  currentQuestionIndex = signal(0);
  userAnswers = signal<number[]>([]);
  score = signal(0);

  questions = signal<QuizQuestion[]>([
    {
      id: 1,
      question: 'Trong kiến trúc ARM Cortex-M4, khối NVIC (Nested Vectored Interrupt Controller) hỗ trợ tối đa bao nhiêu mức ưu tiên ngắt lập trình được?',
      options: [
        'A. 16 mức',
        'B. 64 mức',
        'C. 256 mức',
        'D. 1024 mức'
      ],
      correctIndex: 2,
      explanation: 'NVIC trong Cortex-M4 hỗ trợ tới 256 mức ưu tiên ngắt lập trình được (thông qua tối đa 8-bit ưu tiên cho mỗi ngắt).',
      docCitation: 'Giáo trình Kỹ thuật Vi xử lý ARM, Mục 4.2 - Cấu trúc NVIC, trang 48'
    },
    {
      id: 2,
      question: 'Cơ chế nào của NVIC giúp giảm đáng kể độ trễ ngắt khi có một ngắt mới đến đúng lúc ngắt hiện tại vừa xử lý xong?',
      options: [
        'A. Late-arriving',
        'B. Tail-chaining',
        'C. Interrupt stacking',
        'D. Vector remapping'
      ],
      correctIndex: 1,
      explanation: 'Tail-chaining cho phép CPU bỏ qua bước khôi phục thanh ghi và cất thanh ghi lại, chuyển thẳng sang phục vụ ngắt kế tiếp chỉ trong 6 chu kỳ xung nhịp.',
      docCitation: 'Giáo trình Kỹ thuật Vi xử lý ARM, Mục 4.5 - Tối ưu hóa chu kỳ ngắt, trang 52'
    },
    {
      id: 3,
      question: 'Thanh ghi nào trong lõi ARM Cortex-M4 trỏ đến đỉnh của ngăn xếp (Stack Pointer) đang hoạt động?',
      options: [
        'A. R13 (SP)',
        'B. R14 (LR)',
        'C. R15 (PC)',
        'D. xPSR'
      ],
      correctIndex: 0,
      explanation: 'R13 là thanh ghi Stack Pointer (SP), Cortex-M4 hỗ trợ hai con trỏ ngăn xếp MSP (Main Stack Pointer) và PSP (Process Stack Pointer).',
      docCitation: 'Giáo trình Kỹ thuật Vi xử lý ARM, Mục 2.3 - Tập thanh ghi lập trình, trang 24'
    },
    {
      id: 4,
      question: 'Tập lệnh Thumb-2 trên ARM Cortex-M4 có đặc điểm nổi bật nào sau đây?',
      options: [
        'A. Chỉ thực thi các chỉ thị 16-bit',
        'B. Kết hợp linh hoạt cả chỉ thị 16-bit và 32-bit cho mật độ mã tối ưu',
        'C. Chỉ thực thi các chỉ thị 64-bit dấu phẩy động',
        'D. Bắt buộc chuyển đổi chế độ ARM/Thumb bằng chỉ thị BX'
      ],
      correctIndex: 1,
      explanation: 'Thumb-2 là công nghệ tập lệnh pha trộn cả chỉ thị 16-bit và 32-bit, đem lại hiệu năng tính toán cao đồng thời tiết kiệm dung lượng bộ nhớ Flash.',
      docCitation: 'Giáo trình Kỹ thuật Vi xử lý ARM, Chương 3 - Tập chỉ thị Thumb-2, trang 36'
    },
    {
      id: 5,
      question: 'Khi xảy ra ngắt phần cứng, phần cứng Cortex-M4 tự động đẩy (push) tối thiểu bao nhiêu thanh ghi vào Stack trước khi nhảy vào ISR?',
      options: [
        'A. 4 thanh ghi',
        'B. 8 thanh ghi (R0-R3, R12, LR, PC, xPSR)',
        'C. 16 thanh ghi toàn bộ',
        'D. 2 thanh ghi (PC và xPSR)'
      ],
      correctIndex: 1,
      explanation: 'Cortex-M4 tự động lưu 8 thanh ghi cơ bản (hardware context stacking: R0, R1, R2, R3, R12, LR, PC, xPSR) để giải phóng thời gian cho trình xử lý ngắt C.',
      docCitation: 'Giáo trình Kỹ thuật Vi xử lý ARM, Mục 4.4 - Cơ chế Stacking tự động, trang 50'
    }
  ]);

  startQuiz() {
    this.quizStarted.set(true);
    this.quizSubmitted.set(false);
    this.currentQuestionIndex.set(0);
    this.userAnswers.set(new Array(this.questions().length).fill(-1));
    this.score.set(0);
  }

  selectOption(optionIndex: number) {
    if (this.quizSubmitted()) return;
    const answers = [...this.userAnswers()];
    answers[this.currentQuestionIndex()] = optionIndex;
    this.userAnswers.set(answers);
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  submitQuiz() {
    let finalScore = 0;
    const answers = this.userAnswers();
    this.questions().forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        finalScore++;
      }
    });
    this.score.set(finalScore);
    this.quizSubmitted.set(true);
  }

  generateNewQuiz() {
    this.isGenerating.set(true);
    setTimeout(() => {
      this.isGenerating.set(false);
      this.startQuiz();
    }, 1500);
  }
}

