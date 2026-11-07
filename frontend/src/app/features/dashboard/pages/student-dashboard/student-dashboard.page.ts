import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthStore } from '../../../../core/store/auth.store';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-dashboard.page.html',
  styleUrl: './student-dashboard.page.scss'
})
export class StudentDashboardPage {
  readonly authStore = inject(AuthStore);
  searchQuery = signal('');

  readonly quickActions = [
    { title: 'Kho học liệu', desc: '1.200+ tài liệu, đề thi', icon: 'menu_book', color: 'from-blue-600 to-indigo-600', link: '/resources' },
    { title: 'AI Assistant', desc: 'Hỏi đáp theo tài liệu 24/7', icon: 'psychology', color: 'from-purple-600 to-pink-600', link: '/ai-assistant', badge: 'AI' },
    { title: 'Đặt lịch Mentor', desc: '50+ Mentor GPA 3.2+', icon: 'school', color: 'from-cyan-600 to-teal-600', link: '/mentors' },
    { title: 'Nhóm học tập', desc: 'Trao đổi & cùng ôn thi', icon: 'groups', color: 'from-amber-500 to-orange-600', link: '/groups' },
  ];

  readonly featuredResources = [
    {
      id: 1,
      title: 'Giáo trình Vi xử lý & Vi điều khiển ARM Cortex-M',
      course: 'Vi xử lý',
      lecturer: 'TS. Nguyễn Văn A',
      faculty: 'Trường Điện - Điện tử',
      type: 'Giáo trình',
      downloads: 342,
      rating: 4.9,
      badge: 'Chính thống',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      id: 2,
      title: 'Tổng hợp đề thi giữa kỳ & cuối kỳ Mạch điện tử 2 kèm lời giải',
      course: 'Mạch điện tử 2',
      lecturer: 'ThS. Trần Thị B',
      faculty: 'Khoa Điện tử viễn thông',
      type: 'Đề thi',
      downloads: 628,
      rating: 4.8,
      badge: 'Hot đề thi',
      badgeColor: 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
    },
    {
      id: 3,
      title: 'Slide bài giảng & Code mẫu Hệ thống nhúng IoT ESP32',
      course: 'Hệ thống nhúng',
      lecturer: 'TS. Lê Hoàng C',
      faculty: 'Khoa Tự động hóa',
      type: 'Slide + Code',
      downloads: 415,
      rating: 5.0,
      badge: 'Tier 1',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
    }
  ];

  readonly topMentors = [
    {
      id: 1,
      name: 'Trần Minh Quân',
      major: 'Điện tử viễn thông - K16',
      gpa: '3.78',
      subjects: ['Vi xử lý', 'DSP', 'FPGA'],
      rating: 4.9,
      sessions: 42,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Nguyễn Thị Hải Yến',
      major: 'Kỹ thuật điều khiển & TĐH - K17',
      gpa: '3.85',
      subjects: ['PLC', 'Lý thuyết điều khiển', 'SCADA'],
      rating: 5.0,
      sessions: 56,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Phạm Đức Thắng',
      major: 'Hệ thống điện - K16',
      gpa: '3.65',
      subjects: ['Mạch điện 1, 2', 'Bảo vệ rơle', 'Lưới điện'],
      rating: 4.8,
      sessions: 31,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  readonly studyProgress = {
    documentsViewed: 18,
    sessionsCompleted: 4,
    questionsAskedAi: 35,
    coinsEarned: 120
  };
}

