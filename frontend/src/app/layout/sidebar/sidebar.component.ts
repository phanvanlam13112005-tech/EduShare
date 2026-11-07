import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../core/store/auth.store';

interface NavItem { 
  label: string; 
  icon: string; 
  route: string; 
  roles?: string[]; 
  excludeRoles?: string[];
  exact?: boolean;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() navClick = new EventEmitter<void>();
  private readonly authStore = inject(AuthStore);

  private readonly allItems: NavItem[] = [
    // --- General Dashboard ---
    { label: 'Tổng quan', icon: 'dashboard', route: '/dashboard', exact: true },

    // --- Core Learning ---
    { label: 'Kho học liệu', icon: 'menu_book', route: '/resources', excludeRoles: ['ROLE_ADMIN'] },
    { label: 'AI Assistant', icon: 'psychology', route: '/ai-assistant', badge: 'AI', excludeRoles: ['ROLE_ADMIN'] },
    { label: 'Mentor 1:1', icon: 'school', route: '/mentors', excludeRoles: ['ROLE_ADMIN'] },
    { label: 'Lịch học', icon: 'event_available', route: '/sessions', roles: ['ROLE_LEARNER', 'ROLE_MENTOR'] },
    { label: 'Nhóm học tập', icon: 'groups', route: '/groups', excludeRoles: ['ROLE_ADMIN'] },
    
    // --- Personal / Interaction ---
    { label: 'Tin nhắn', icon: 'chat_bubble_outline', route: '/messages', excludeRoles: ['ROLE_ADMIN'] },
    { label: 'Thông báo', icon: 'notifications_none', route: '/notifications' },
    { label: 'Hồ sơ sinh viên', icon: 'person_outline', route: '/profile', excludeRoles: ['ROLE_ADMIN'] },
    
    // --- Mentor Specific ---
    { label: 'Quản lý Mentor', icon: 'co_present', route: '/mentor-dashboard', roles: ['ROLE_MENTOR'] },
    
    // --- Administrative ---
    { label: 'Duyệt Mentor', icon: 'verified_user', route: '/admin', roles: ['ROLE_ADMIN'], exact: true },
    { label: 'Quản lý tài liệu', icon: 'folder_shared', route: '/admin/resources', roles: ['ROLE_ADMIN'] },
    { label: 'Quản lý sinh viên', icon: 'manage_accounts', route: '/admin/users', roles: ['ROLE_ADMIN'] },
  ];

  visibleItems() {
    return this.allItems.filter(i => {
      const userRoles = this.authStore.roles();
      
      // If item has excludeRoles, check if user has any of them
      if (i.excludeRoles && i.excludeRoles.some(r => userRoles.includes(r))) {
        return false;
      }
      
      // Standard role check
      return !i.roles || i.roles.some(r => userRoles.includes(r));
    });
  }

  logout() {
    this.authStore.logout();
  }
}
