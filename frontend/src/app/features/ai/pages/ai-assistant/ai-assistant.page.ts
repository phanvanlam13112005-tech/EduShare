import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citation?: {
    docName: string;
    page: number;
    quote: string;
  };
}

interface ConversationItem {
  id: string;
  title: string;
  docName: string;
  date: string;
}

@Component({
  selector: 'app-ai-assistant-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant.page.html',
  styleUrl: './ai-assistant.page.scss'
})
export class AiAssistantPage {
  private route = inject(ActivatedRoute);

  selectedDocTitle = signal<string>('Giáo trình Kỹ thuật Vi xử lý & Vi điều khiển ARM.pdf');
  userInput = signal('');
  isThinking = signal(false);

  conversations = signal<ConversationItem[]>([
    { id: '1', title: 'Hỏi đáp cấu trúc ARM Cortex-M4', docName: 'Giao_trinh_Vi_xu_ly_ARM.pdf', date: 'Hôm nay' },
    { id: '2', title: 'Giải thích mạch khuếch đại đảo Op-Amp', docName: 'Mach_dien_tu_2_chuong3.pdf', date: 'Hôm qua' },
    { id: '3', title: 'Tóm tắt lệnh Timer và Ngắt trong 8051', docName: 'Vi_dieu_khien_8051.pdf', date: '3 ngày trước' },
  ]);

  currentChat = signal<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Xin chào! Tôi là **EduShare+ AI Learning Assistant**. Tôi đã nạp tài liệu **Giáo trình Kỹ thuật Vi xử lý & Vi điều khiển ARM.pdf** vào không gian học tập. Bạn muốn tôi giải thích khái niệm nào, tóm tắt chương, hay tạo bộ câu hỏi trắc nghiệm ôn thi?',
      timestamp: '14:20'
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Giải thích nguyên lý hoạt động của khối NVIC (Nested Vectored Interrupt Controller) trong vi điều khiển ARM Cortex-M4?',
      timestamp: '14:21'
    },
    {
      id: 'm3',
      sender: 'ai',
      text: `Khối **NVIC (Nested Vectored Interrupt Controller)** trong kiến trúc ARM Cortex-M4 là bộ điều khiển ngắt lồng nhau được tích hợp trực tiếp vào lõi CPU, mang lại các đặc tính vượt trội:

1. **Độ trễ ngắt cực thấp:** NVIC sử dụng cơ chế ngắt vector phần cứng, CPU tự động lưu ngữ cảnh (stacking) vào stack khi có ngắt xảy ra mà không cần nhiều chỉ thị phần mềm.
2. **Hỗ trợ mức ưu tiên động:** Cung cấp tới 256 mức độ ưu tiên ngắt, cho phép ngắt có mức ưu tiên cao hơn lồng (preempt) ngắt có mức ưu tiên thấp hơn đang xử lý.
3. **Cơ chế Tail-chaining:** Khi một ngắt vừa hoàn tất và có ngắt tiếp theo đang chờ, CPU chuyển thẳng sang phục vụ ngắt mới mà không cần pop/push lại các thanh ghi, tiết kiệm thời gian chu kỳ xung nhịp.`,
      timestamp: '14:21',
      citation: {
        docName: 'Giao_trinh_Vi_xu_ly_ARM.pdf',
        page: 45,
        quote: 'Chương 4: Kiến trúc bộ điều khiển ngắt NVIC và cơ chế xử lý ngắt thời gian thực trên Cortex-M4.'
      }
    }
  ]);

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['docTitle']) {
        this.selectedDocTitle.set(params['docTitle']);
      }
    });
  }

  sendMessage() {
    const text = this.userInput().trim();
    if (!text || this.isThinking()) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.currentChat.update(msgs => [...msgs, userMsg]);
    this.userInput.set('');
    this.isThinking.set(true);

    // Simulate RAG Assistant response
    setTimeout(() => {
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `Dựa trên tài liệu **${this.selectedDocTitle()}**, câu trả lời cho vấn đề của bạn:

Nội dung liên quan được trích xuất từ phần trọng tâm của môn học. Cơ chế hoạt động bao gồm các bước xử lý tín hiệu và định thời theo chuẩn giảng dạy tại Trường Điện - Điện tử HaUI. Bạn có muốn tạo bài tập trắc nghiệm tự kiểm tra nội dung này không?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citation: {
          docName: this.selectedDocTitle(),
          page: 18,
          quote: 'Mục 2.3: Đặc tuyến kỹ thuật và phương pháp thiết kế mạch tiêu chuẩn.'
        }
      };
      this.currentChat.update(msgs => [...msgs, aiReply]);
      this.isThinking.set(false);
    }, 1200);
  }

  generateQuiz() {
    this.userInput.set('Hãy tạo cho tôi 5 câu hỏi trắc nghiệm ôn thi có đáp án và giải thích từ tài liệu này.');
    this.sendMessage();
  }

  summarizeDoc() {
    this.userInput.set('Hãy tóm tắt các công thức quan trọng và kiến thức cần nhớ nhất trong tài liệu này.');
    this.sendMessage();
  }

  generateFlashcards() {
    this.userInput.set('Hãy tạo 5 thẻ Flashcard ôn tập (Thuật ngữ - Định nghĩa) từ tài liệu này.');
    this.sendMessage();
  }

  newConversation() {
    this.currentChat.set([
      {
        id: Date.now().toString(),
        sender: 'ai',
        text: `Đã mở phiên hỏi đáp mới với tài liệu **${this.selectedDocTitle()}**. Hãy đặt câu hỏi hoặc chọn một tác vụ phân tích!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }
}

