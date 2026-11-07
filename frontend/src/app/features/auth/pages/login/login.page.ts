import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { AuthStore } from '../../../../core/store/auth.store';
import { GoogleLoginButtonComponent } from '../../components/google-login/google-login-button.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatProgressSpinnerModule, MatIconModule, MatRippleModule,
    GoogleLoginButtonComponent
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  readonly authStore = inject(AuthStore);
  readonly showPwd = signal(false);
  readonly emailFocused = signal(false);
  readonly pwdFocused = signal(false);
  private readonly fb = inject(FormBuilder);

  readonly features = [
    { icon: 'library_books', title: 'Kho học liệu HaUI', desc: 'Đúng môn, đúng giảng viên Trường Điện - Điện tử' },
    { icon: 'psychology', title: 'AI Assistant', desc: 'Hỏi đáp theo tài liệu và tạo bộ câu hỏi luyện thi' },
    { icon: 'school', title: 'Mentor 1:1', desc: 'Kết nối sinh viên xuất sắc và học nhóm hiệu quả' },
  ];

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    const { email, password } = this.form.getRawValue();
    if (email && password) {
      this.authStore.login({ email, password });
    }
  }

  loginDemo(role: 'ROLE_LEARNER' | 'ROLE_MENTOR' | 'ROLE_ADMIN' = 'ROLE_LEARNER'): void {
    this.authStore.loginAsGuest(role);
  }
}
