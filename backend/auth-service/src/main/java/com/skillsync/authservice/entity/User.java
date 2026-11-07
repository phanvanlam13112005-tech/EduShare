package com.skillsync.authservice.entity;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;

import com.skillsync.authservice.audit.Auditable;
import com.skillsync.authservice.enums.AuthProvider;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends Auditable {
    public User(String email, String password, String username, String role) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.role = role;
        this.isActive = true;
        this.authProvider = AuthProvider.LOCAL;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // OAuth users get a random dummy password - stays NOT NULL

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(nullable = false)
    private String role;

    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20)
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "provider_id", length = 100)
    private String providerId; // Google/GitHub unique user ID

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    // ─── EduShare+ Student Fields ──────────────────────────────────────────

    /** Mã sinh viên HaUI (vd: 2021600123) */
    @Column(name = "student_id", length = 20)
    private String studentId;

    /** Trường/Khoa (vd: Trường Điện - Điện tử) */
    @Column(name = "faculty", length = 100)
    private String faculty;

    /** Ngành học (vd: Điện tử viễn thông) */
    @Column(name = "major", length = 100)
    private String major;

    /** Năm nhập học (vd: 2022) */
    @Column(name = "enrollment_year")
    private Integer enrollmentYear;

    /** Đã xác minh mã sinh viên qua email trường */
    @Column(name = "student_verified")
    @Builder.Default
    private Boolean studentVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}