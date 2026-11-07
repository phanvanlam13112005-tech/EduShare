package com.edushare.resource.entity;

/**
 * Trạng thái kiểm duyệt tài liệu
 */
public enum ResourceStatus {
    /** Chờ kiểm duyệt - vừa được upload */
    PENDING_REVIEW,

    /** Đã được duyệt - hiển thị công khai */
    APPROVED,

    /** Bị từ chối - không phù hợp hoặc vi phạm */
    REJECTED,

    /** Đang xem xét bởi moderator */
    UNDER_REVIEW,

    /** Bị ẩn tạm thời (admin action) */
    HIDDEN
}
