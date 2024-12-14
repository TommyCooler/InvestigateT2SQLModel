package com.example.demo.config;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

 @Configuration
 @EnableWebSecurity
 @RequiredArgsConstructor
public class  SecurityConfiguration {

     private final List<String> ORIGIN_SOURCES = List.of("http://localhost:5173");
     private final List<String> ALLOWED_METHODS = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD");
     private final List<String> ALLOWED_HEADERS = List.of("*");
     private final Long MAX_AGE = 7200L;
     private final String CORS_PATTERN = "/**";


     @Bean
     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
         http
                 .csrf(AbstractHttpConfigurer::disable)
                 .cors(
                         cors -> cors.configurationSource(corsConfigurationSource())
                 )
                 .authorizeHttpRequests(
                         request -> request
                                 .requestMatchers("/**")
                                 .permitAll()
                 );

         return http.build();
     }

     @Bean
     public CorsConfigurationSource corsConfigurationSource() {
         CorsConfiguration corsConfiguration = new CorsConfiguration();
         corsConfiguration.setAllowedOrigins(ORIGIN_SOURCES);
         corsConfiguration.setAllowedMethods(ALLOWED_METHODS);
         corsConfiguration.setAllowCredentials(true);
         corsConfiguration.setAllowedHeaders(ALLOWED_HEADERS);
         corsConfiguration.setMaxAge(MAX_AGE);
         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
         source.registerCorsConfiguration(CORS_PATTERN, corsConfiguration);
         return source;
     }

}