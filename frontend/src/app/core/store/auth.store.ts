import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { pipe, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import {
  AuthResponse, LoginRequest, RegisterRequest,
  OtpVerifyRequest
} from '../../shared/models';
import { HttpErrorResponse } from '@angular/common/http';

interface AuthState {
  token: string | null;
  userId: number | null;
  email: string | null;
  username: string | null;
  roles: string[];
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
}

interface JwtClaims {
  userId?: number;
  roles?: string[];
  sub?: string;
  [key: string]: unknown;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
  email: localStorage.getItem('email'),
  username: localStorage.getItem('username'),
  roles: JSON.parse(localStorage.getItem('roles') ?? '[]'),
  loading: false,
  error: null,
  otpSent: false,
  otpVerified: false
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>(initialState),

  withComputed((store) => ({
    isAuthenticated: computed(() => !!store.token()),
    isAdmin: computed(() => store.roles().includes('ROLE_ADMIN')),
    isMentor: computed(() => store.roles().includes('ROLE_MENTOR')),
    isLearner: computed(() => store.roles().includes('ROLE_LEARNER')),
    canApplyToBeMentor: computed(() => store.roles().includes('ROLE_LEARNER') && !store.roles().includes('ROLE_MENTOR')),
    hasRole: computed(() => (role: string) => store.roles().includes(role))
  })),

  withMethods((store) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const updateFromResponse = (res: AuthResponse): void => {
      persistAuth(res);
      const claims = decodeJwt(res.token);
      patchState(store, {
        token: res.token,
        roles: res.roles ?? claims.roles ?? [],
        userId: claims.userId ?? null,
        email: claims.sub ?? res.email ?? null,
        username: res.username ?? claims.sub ?? null,
        loading: false,
        error: null
      });
    };

    const logout = (): void => {
      clearAuth();
      patchState(store, { ...initialState, token: null, userId: null, roles: [], email: null, username: null });
      router.navigate(['/auth/login']);
      authService.logout().subscribe();
    };

    return {
      updateFromResponse,
      logout,

      sendOtp: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(email =>
            authService.sendOtp(email).pipe(
              tapResponse({
                next: () => patchState(store, { loading: false, otpSent: true }),
                error: (err: HttpErrorResponse) => patchState(store, { loading: false, error: err.error?.message ?? 'Failed to send OTP' })
              })
            )
          )
        )
      ),

      verifyOtp: rxMethod<OtpVerifyRequest>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(req =>
            authService.verifyOtp(req.email, req.otp).pipe(
              tapResponse({
                next: () => patchState(store, { loading: false, otpVerified: true }),
                error: (err: HttpErrorResponse) => patchState(store, { loading: false, error: err.error?.message ?? 'Invalid OTP' })
              })
            )
          )
        )
      ),

      register: rxMethod<RegisterRequest>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(req =>
            authService.register(req).pipe(
              tapResponse({
                next: (res) => {
                  const claims = decodeJwt(res.token);
                  updateFromResponse(res);
                  router.navigate(['/auth/verify-otp'], { queryParams: { email: res.email ?? claims.sub } });
                },
                error: (err: HttpErrorResponse) => patchState(store, { loading: false, error: err.error?.message ?? 'Registration failed' })
              })
            )
          )
        )
      ),

      login: rxMethod<LoginRequest>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(req =>
            authService.login(req).pipe(
              tapResponse({
                next: (res) => {
                  const claims = decodeJwt(res.token);
                  const userRoles = res.roles ?? claims.roles ?? [];
                  updateFromResponse(res);

                  if (userRoles.includes('ROLE_ADMIN')) {
                    router.navigate(['/admin/users']);
                  } else if (userRoles.includes('ROLE_MENTOR')) {
                    router.navigate(['/mentor-dashboard']);
                  } else {
                    router.navigate(['/mentors']);
                  }
                },
                error: (err: HttpErrorResponse) => {
                  const msg = err.error?.message ?? 'Invalid credentials';
                  const lowerMsg = msg.toLowerCase();

                  if (lowerMsg.includes('user not found')) {
                    router.navigate(['/auth/register'], { queryParams: { email: req.email } });
                    patchState(store, { loading: false, error: 'User not found. Please register to continue.' });
                  } else if (lowerMsg.includes('invalid password')) {
                    patchState(store, { loading: false, error: 'Invalid password. Please try again.' });
                  } else {
                    patchState(store, { loading: false, error: msg });
                  }
                }
              })
            )
          )
        )
      ),

      googleLogin: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true, error: null })),
          switchMap(idToken =>
            authService.googleLogin(idToken).pipe(
              tapResponse({
                next: (res) => {
                  updateFromResponse(res);
                  const claims = decodeJwt(res.token);
                  const userRoles = res.roles ?? claims.roles ?? [];
                  if (userRoles.includes('ROLE_ADMIN')) {
                    router.navigate(['/admin/users']);
                  } else if (userRoles.includes('ROLE_MENTOR')) {
                    router.navigate(['/mentor-dashboard']);
                  } else {
                    router.navigate(['/mentors']);
                  }
                },
                error: (err: HttpErrorResponse) => patchState(store, { loading: false, error: err.error?.message ?? 'Google login failed' })
              })
            )
          )
        )
      ),

      setLoading(loading: boolean): void {
        patchState(store, { loading });
      },

      setError(error: string | null): void {
        patchState(store, { error });
      },

      refreshToken: rxMethod<void>(
        pipe(
          switchMap(() =>
            authService.refreshToken().pipe(
              tapResponse({
                next: (res) => {
                  updateFromResponse(res);
                },
                error: () => {
                  logout();
                }
              })
            )
          )
        )
      ),

      addRole(role: string): void {
        if (!store.roles().includes(role)) {
          const newRoles = [...store.roles(), role];
          patchState(store, { roles: newRoles });
          localStorage.setItem('roles', JSON.stringify(newRoles));
        }
      },

      updateUser(name?: string, username?: string): void {
        if (name) {
          localStorage.setItem('name', name);
        }
        if (username) {
          localStorage.setItem('username', username);
          patchState(store, { username });
        }
      },

      clearError(): void {
        patchState(store, { error: null });
      },

      loginAsGuest(targetRole: 'ROLE_LEARNER' | 'ROLE_MENTOR' | 'ROLE_ADMIN' = 'ROLE_LEARNER'): void {
        let username = 'Nguyễn Văn An (K16 - ĐTVT)';
        let email = 'nguyenvanan.k16@haui.edu.vn';
        let userId = 101;
        let roles = [targetRole];

        if (targetRole === 'ROLE_MENTOR') {
          username = 'Trần Minh Quân (Mentor GPA 3.8)';
          email = 'mentor.quan@haui.edu.vn';
          userId = 202;
          roles = ['ROLE_LEARNER', 'ROLE_MENTOR'];
        } else if (targetRole === 'ROLE_ADMIN') {
          username = 'Quản trị viên EduShare+';
          email = 'admin.edushare@haui.edu.vn';
          userId = 1;
          roles = ['ROLE_ADMIN'];
        }

        const payload = {
          sub: email,
          userId,
          roles,
          username,
          exp: Math.floor(Date.now() / 1000) + 86400 * 30
        };

        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
          btoa(unescape(encodeURIComponent(JSON.stringify(payload)))) + 
          '.mockSignatureForLocalDemo12345';

        localStorage.setItem('token', mockToken);
        localStorage.setItem('userId', String(userId));
        localStorage.setItem('email', email);
        localStorage.setItem('username', username);
        localStorage.setItem('roles', JSON.stringify(roles));

        patchState(store, {
          token: mockToken,
          userId,
          email,
          username,
          roles,
          loading: false,
          error: null
        });

        if (targetRole === 'ROLE_ADMIN') {
          router.navigate(['/admin/users']);
        } else if (targetRole === 'ROLE_MENTOR') {
          router.navigate(['/mentor-dashboard']);
        } else {
          router.navigate(['/dashboard']);
        }
      }
    };
  })
);

function persistAuth(res: AuthResponse): void {
  const claims = decodeJwt(res.token);
  localStorage.setItem('token', res.token);
  // refreshToken is now in HttpOnly cookie - NO LONGER in localStorage
  localStorage.setItem('userId', String(claims.userId ?? res.userId ?? ''));
  localStorage.setItem('email', claims.sub ?? res.email ?? '');
  localStorage.setItem('username', res.username ?? claims.sub ?? '');
  localStorage.setItem('roles', JSON.stringify(res.roles ?? claims.roles ?? []));
}

function clearAuth(): void {
  ['token', 'userId', 'email', 'username', 'roles'].forEach(k => localStorage.removeItem(k));
}

function decodeJwt(token: string): JwtClaims {
  try {
    return JSON.parse(atob(token.split('.')[1])) as JwtClaims;
  } catch { return {}; }
}
