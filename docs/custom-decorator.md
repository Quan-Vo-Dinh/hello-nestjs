# node về auth.decorator

Decorator này (`Auth`) dùng để **gắn metadata** lên route hoặc controller trong NestJS, nhằm phục vụ cho việc kiểm soát xác thực/phân quyền động.

### Cụ thể:

- **SetMetadata**: Hàm của NestJS để gắn dữ liệu tuỳ ý (metadata) lên method/class.
- **AUTH_TYPE_KEY**: Key để truy xuất metadata này trong guard/interceptor.
- **Auth(authTypes, options)**:
  - `authTypes`: Một mảng các kiểu xác thực (ví dụ: ['access-token', 'refresh-token', ...]).
  - `options.conditions`: Một mảng điều kiện guard bổ sung (ví dụ: kiểm tra role, trạng thái user...).

### Tác dụng:

- Khi bạn dùng `@Auth([...], { conditions: [...] })` trên route/controller, bạn có thể:
  - Định nghĩa các loại xác thực cần thiết cho route đó.
  - Định nghĩa các điều kiện guard bổ sung.
- Guard hoặc interceptor có thể đọc metadata này để quyết định có cho phép truy cập hay không.

### Ví dụ sử dụng:

```typescript
@Auth(['access-token'], { conditions: ['isAdmin'] })
@Get('admin')
getAdminData() { ... }
```

→ Guard sẽ kiểm tra route này cần access-token và phải là admin.

**Tóm lại:**  
Decorator này giúp bạn cấu hình xác thực/phân quyền động cho từng route/controller, và guard sẽ dựa vào metadata này để xử lý logic bảo vệ route.
