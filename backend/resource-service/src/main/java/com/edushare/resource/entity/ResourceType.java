package com.edushare.resource.entity;

/**
 * Loại tài liệu học tập trên nền tảng EduShare+
 */
public enum ResourceType {
    /** Giáo trình / sách giáo khoa */
    TEXTBOOK,

    /** Slide bài giảng (PowerPoint, PDF) */
    SLIDE,

    /** Đề thi / đề kiểm tra (kèm hoặc không kèm đáp án) */
    EXAM,

    /** Bài tập / bài tập lớn */
    EXERCISE,

    /** Báo cáo thí nghiệm / thực hành */
    LAB_REPORT,

    /** Source code / dự án lập trình */
    CODE,

    /** Tóm tắt / note cá nhân */
    NOTE,

    /** Video bài giảng */
    VIDEO,

    /** Tài liệu tham khảo khác */
    OTHER
}
