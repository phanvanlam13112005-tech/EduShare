import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../../../core/store/auth.store';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly aiFeatures = [
    'Hỏi đáp trực tiếp trên nội dung giáo trình & bài giảng',
    'Tự động tóm tắt chương và trích xuất công thức trọng tâm',
    'Tạo câu hỏi trắc nghiệm & ôn tập thi theo từng môn học',
    'Dẫn nguồn chính xác theo từng trang trong file PDF/DOCX'
  ];

  readonly stats = [
    { value: '500+', label: 'Sinh viên HaUI tham gia' },
    { value: '1.200+', label: 'Tài liệu & đề thi' },
    { value: '50+', label: 'Mentor xuất sắc' },
    { value: '98%', label: 'Đánh giá tích cực' }
  ];

  constructor() {
    // Auto-redirect if already logged in
    if (this.authStore.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  demoLogin(role: 'ROLE_LEARNER' | 'ROLE_MENTOR' | 'ROLE_ADMIN' = 'ROLE_LEARNER', targetRoute: string = '/dashboard'): void {
    this.authStore.loginAsGuest(role);
    if (targetRoute) {
      this.router.navigate([targetRoute]);
    }
  }
}
