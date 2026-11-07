import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ResourceItem {
  id: number;
  title: string;
  course: string;
  major: string;
  lecturer: string;
  semester: string;
  type: string;
  fileSize: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  uploader: string;
  createdAt: string;
  tier: 'FREE' | 'PREMIUM';
  tags: string[];
}

@Component({
  selector: 'app-resource-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './resource-list.page.html',
  styleUrl: './resource-list.page.scss'
})
export class ResourceListPage {
  searchQuery = signal('');
  selectedMajor = signal('ALL');
  selectedType = signal('ALL');
  selectedSemester = signal('ALL');
  selectedTier = signal('ALL');
  sortBy = signal<'downloads' | 'rating' | 'newest'>('downloads');
  previewResource = signal<ResourceItem | null>(null);

  readonly majors = [
    { id: 'ALL', name: 'Tất cả các ngành' },
    { id: 'DTVT', name: 'Điện tử viễn thông' },
    { id: 'TDH', name: 'Điều khiển & Tự động hóa' },
    { id: 'KT_DIEN', name: 'Kỹ thuật điện' },
    { id: 'KTMT', name: 'Công nghệ KT máy tính' }
  ];

  readonly resourceTypes = [
    { id: 'ALL', name: 'Tất cả tài liệu' },
    { id: 'GIAO_TRINH', name: 'Giáo trình chính thống' },
    { id: 'DE_THI', name: 'Đề thi & Đáp án' },
    { id: 'SLIDE', name: 'Slide bài giảng' },
    { id: 'LAB', name: 'Báo cáo thực hành' },
    { id: 'CODE', name: 'Code mẫu & Đồ án' },
    { id: 'NOTE', name: 'Ghi chép ôn tập' }
  ];

  readonly semesters = [
    { id: 'ALL', name: 'Tất cả học kỳ' },
    { id: 'HK1', name: 'Học kỳ 1' },
    { id: 'HK2', name: 'Học kỳ 2' },
    { id: 'HK_HE', name: 'Học kỳ hè' }
  ];

  readonly resources: ResourceItem[] = [
    {
      id: 1,
      title: 'Giáo trình Kỹ thuật Vi xử lý & Vi điều khiển ARM Cortex-M4',
      course: 'Vi xử lý',
      major: 'DTVT',
      lecturer: 'TS. Nguyễn Văn A',
      semester: 'HK1',
      type: 'GIAO_TRINH',
      fileSize: '14.2 MB',
      downloads: 742,
      rating: 4.9,
      ratingCount: 58,
      uploader: 'Bộ môn Kỹ thuật máy tính',
      createdAt: '2026-09-15',
      tier: 'FREE',
      tags: ['ARM', 'Cortex-M4', 'HaUI', 'Assembly', 'C nhúng']
    },
    {
      id: 2,
      title: 'Bộ đề thi cuối kỳ Mạch điện tử 2 kèm đáp án chi tiết các năm 2023-2025',
      course: 'Mạch điện tử 2',
      major: 'DTVT',
      lecturer: 'ThS. Trần Thị B',
      semester: 'HK2',
      type: 'DE_THI',
      fileSize: '6.8 MB',
      downloads: 1250,
      rating: 5.0,
      ratingCount: 112,
      uploader: 'CLB Học tập Điện - Điện tử',
      createdAt: '2026-10-02',
      tier: 'FREE',
      tags: ['Đề thi', 'Đáp án', 'Khuếch đại thuật toán', 'BJT', 'MOSFET']
    },
    {
      id: 3,
      title: 'Slide bài giảng Tự động hóa quá trình công nghệ với PLC S7-1200',
      course: 'Lập trình PLC',
      major: 'TDH',
      lecturer: 'TS. Vũ Đình C',
      semester: 'HK1',
      type: 'SLIDE',
      fileSize: '28.5 MB',
      downloads: 512,
      rating: 4.8,
      ratingCount: 39,
      uploader: 'TS. Vũ Đình C',
      createdAt: '2026-08-20',
      tier: 'FREE',
      tags: ['PLC', 'S7-1200', 'TIA Portal', 'Ladder']
    },
    {
      id: 4,
      title: 'Báo cáo bài tập lớn: Thiết kế hệ thống đo nhiệt độ & cảnh báo qua IoT ESP32',
      course: 'Hệ thống nhúng',
      major: 'KTMT',
      lecturer: 'TS. Lê Hoàng C',
      semester: 'HK2',
      type: 'LAB',
      fileSize: '4.1 MB',
      downloads: 418,
      rating: 4.7,
      ratingCount: 29,
      uploader: 'SV Nguyễn Văn Tuấn (K16)',
      createdAt: '2026-10-18',
      tier: 'FREE',
      tags: ['ESP32', 'MQTT', 'FreeRTOS', 'Báo cáo mẫu']
    },
    {
      id: 5,
      title: 'Tuyển tập 100 câu trắc nghiệm & tự luận ôn thi Lý thuyết mạch 1',
      course: 'Lý thuyết mạch',
      major: 'KT_DIEN',
      lecturer: 'PGS.TS Hoàng Văn D',
      semester: 'HK1',
      type: 'NOTE',
      fileSize: '3.2 MB',
      downloads: 890,
      rating: 4.9,
      ratingCount: 84,
      uploader: 'Ban Chuyên môn Liên chi đoàn',
      createdAt: '2026-09-01',
      tier: 'FREE',
      tags: ['Mạch 1', 'Định luật Kirchhoff', 'Dòng điện xoay chiều']
    },
    {
      id: 6,
      title: 'Code mẫu đồ án Thiết kế bộ nguồn xung Flyback Converter 24V-5A',
      course: 'Điện tử công suất',
      major: 'KT_DIEN',
      lecturer: 'TS. Bùi Minh E',
      semester: 'HK2',
      type: 'CODE',
      fileSize: '18.7 MB',
      downloads: 320,
      rating: 4.8,
      ratingCount: 22,
      uploader: 'SV Trần Đình Huy',
      createdAt: '2026-11-01',
      tier: 'PREMIUM',
      tags: ['Nguồn xung', 'Altium', 'Flyback', 'Mô phỏng PLECS']
    }
  ];

  filteredResources = computed(() => {
    let list = this.resources.filter(item => {
      const matchQuery = !this.searchQuery() || 
        item.title.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        item.course.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        item.lecturer.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(this.searchQuery().toLowerCase()));

      const matchMajor = this.selectedMajor() === 'ALL' || item.major === this.selectedMajor();
      const matchType = this.selectedType() === 'ALL' || item.type === this.selectedType();
      const matchSemester = this.selectedSemester() === 'ALL' || item.semester === this.selectedSemester();
      const matchTier = this.selectedTier() === 'ALL' || item.tier === this.selectedTier();

      return matchQuery && matchMajor && matchType && matchSemester && matchTier;
    });

    if (this.sortBy() === 'downloads') {
      list.sort((a, b) => b.downloads - a.downloads);
    } else if (this.sortBy() === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (this.sortBy() === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  });

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
    });
  }

  getTypeLabel(type: string): string {
    const found = this.resourceTypes.find(t => t.id === type);
    return found ? found.name : type;
  }

  downloadResource(res: ResourceItem) {
    res.downloads++;
    alert(`Bắt đầu tải xuống: "${res.title}" (${res.fileSize})`);
  }

  openPreview(res: ResourceItem) {
    this.previewResource.set(res);
  }

  closePreview() {
    this.previewResource.set(null);
  }
}

