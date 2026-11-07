package com.edushare.resource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * EduShare+ Resource Service
 * <p>
 * Quản lý tài liệu học tập: upload, download, search, rate.
 * Lưu trữ file trên MinIO, metadata trong MySQL.
 * Event-driven với RabbitMQ (upload approved/rejected notifications).
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EnableAsync
public class ResourceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResourceServiceApplication.class, args);
    }
}
