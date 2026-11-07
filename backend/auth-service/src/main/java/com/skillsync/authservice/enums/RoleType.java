package com.skillsync.authservice.enums;

/**
 * Platform roles for EduShare+
 * <p>
 * Original SkillSync roles: ROLE_LEARNER, ROLE_MENTOR, ROLE_ADMIN
 * EduShare+ additional roles: ROLE_STUDENT (HaUI verified), ROLE_MODERATOR (content moderation)
 */
public enum RoleType {
    /** Người học thông thường (chưa xác minh sinh viên) */
    ROLE_LEARNER,

    /** Người hướng dẫn / mentor */
    ROLE_MENTOR,

    /** Quản trị viên hệ thống */
    ROLE_ADMIN,

    /** Sinh viên HaUI đã xác minh mã sinh viên - có thể upload tài liệu */
    ROLE_STUDENT,

    /** Người kiểm duyệt nội dung tài liệu (giảng viên/cán bộ HaUI) */
    ROLE_MODERATOR
}
