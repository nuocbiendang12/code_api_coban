# TƯ DUY PHẢN BIỆN VỀ SOFTWARE DESIGN

---

## Phần I. Bóc tách ngộ nhận trong thiết kế phần mềm

### Nhận định a) "Càng tách nhiều class càng đúng SRP"

**Phần đúng:**
- SRP yêu cầu mỗi class chỉ có một lý do để thay đổi. Tách class giúp mỗi class tập trung vào một việc duy nhất, dễ bảo trì hơn.

**Phần sai / bị tuyệt đối hóa:**
- Tách quá mức sẽ tạo ra hàng chục class nhỏ xíu, mỗi class chỉ có 1-2 dòng code. Khi đó, để hiểu một chức năng đơn giản, phải nhảy qua 5-10 file khác nhau. Điều này làm **tăng complexity**, khó debug, khó đọc hiểu, và tăng coupling giữa các class (vì chúng phải gọi nhau liên tục).

**Phản ví dụ:**
- Một class `UserService` có 2 method: `createUser()` và `validateUser()`. Nếu tách thành `UserCreator` và `UserValidator` riêng biệt chỉ vì "SRP", nhưng 2 method này luôn đi cùng nhau và cùng thay đổi khi logic user thay đổi → tách ra là **không cần thiết**, chỉ thêm phức tạp.

**Nhận định chính xác hơn:**
> SRP không có nghĩa là mỗi class chỉ có 1 method. SRP nghĩa là mỗi class chỉ có **một lý do để thay đổi** (one reason to change). Nếu nhiều method cùng phục vụ một mục đích và cùng thay đổi theo một nguyên nhân, chúng nên ở cùng một class. Tách class chỉ hợp lý khi các method phục vụ những mục đích khác nhau và thay đổi vì lý do khác nhau.

---

### Nhận định d) "Code không lặp là code tốt, nên DRY luôn ưu tiên hơn KISS"

**Phần đúng:**
- Code lặp lại ở nhiều nơi thì khi sửa phải sửa tất cả → dễ quên, dễ lỗi. DRY giúp giảm rủi ro này.

**Phần sai / bị tuyệt đối hóa:**
- Đôi khi 2 đoạn code trông giống nhau nhưng phục vụ **mục đích khác nhau**. Nếu ép gộp lại thành 1 function chung, khi một bên cần thay đổi, bên kia cũng bị ảnh hưởng. Kết quả: function chung ngày càng phức tạp với đầy if/else để xử lý các trường hợp khác nhau → **vi phạm KISS**.

**Phản ví dụ:**
```java
// Tính giá shipping và tính giá tax đều nhân amount * rate
// Nhưng mục đích hoàn toàn khác nhau
double calcShipping(double amount) { return amount * 0.05; }
double calcTax(double amount) { return amount * 0.1; }
```
- Nếu gộp thành `calcFee(amount, rate)` vì "DRY", sau này shipping cần thêm logic theo vùng miền, tax cần thêm logic theo loại hàng → function chung trở nên rối, khó maintain.

**Nhận định chính xác hơn:**
> DRY áp dụng khi 2 đoạn code lặp lại **vì cùng một lý do** và sẽ **thay đổi cùng nhau**. Nếu chúng chỉ tình cờ giống nhau nhưng phục vụ mục đích khác nhau, hãy để chúng riêng biệt. KISS đôi khi quan trọng hơn DRY — code đơn giản, dễ hiểu có giá trị hơn code "không lặp" nhưng phức tạp.

---

## Phần II. Chẩn đoán một thiết kế có vấn đề

### Class cần phân tích:
```java
class OrderManager {
   public void createOrder(Order order) { ... }
   public void validateOrder(Order order) { ... }
   public void saveToDatabase(Order order) { ... }
   public void sendConfirmationEmail(Order order) { ... }
   public void printInvoice(Order order) { ... }
   public double calculateShippingFee(Order order) { ... }
   public void exportExcelReport() { ... }
}
```

### 1. Vì sao class này low cohesion?

Cohesion nghĩa là các thành phần trong class có liên quan chặt chẽ với nhau. Class này **low cohesion** vì:
- `saveToDatabase` → liên quan đến **database**
- `sendConfirmationEmail` → liên quan đến **email**
- `printInvoice` → liên quan đến **in ấn**
- `exportExcelReport` → liên quan đến **xuất file**
- `calculateShippingFee` → liên quan đến **tính toán vận chuyển**

Những thứ này **không liên quan gì đến nhau**, nhưng bị nhét chung vào 1 class. Giống như 1 người vừa làm bếp, vừa lái xe, vừa dạy học, vừa sửa ống nước → không chuyên môn gì cả.

### 2. Ít nhất 4 lý do thay đổi khác nhau:

| #   | Lý do thay đổi                      | Method bị ảnh hưởng            |
| --- | ----------------------------------- | ------------------------------ |
| 1   | Thay đổi logic nghiệp vụ đơn hàng   | `createOrder`, `validateOrder` |
| 2   | Đổi database (MySQL → MongoDB)      | `saveToDatabase`               |
| 3   | Đổi dịch vụ email (SMTP → SendGrid) | `sendConfirmationEmail`        |
| 4   | Thay đổi format hóa đơn             | `printInvoice`                 |
| 5   | Thay đổi công thức phí ship         | `calculateShippingFee`         |
| 6   | Thay đổi format báo cáo Excel       | `exportExcelReport`            |

→ **6 lý do thay đổi** trong 1 class = vi phạm SRP nghiêm trọng.

### 3. Hai vấn đề nghiêm trọng nhất:

**Vấn đề 1: `saveToDatabase` nằm chung với business logic**
- Đây là vấn đề **coupling giữa domain và infrastructure**. Nếu đổi database, phải sửa class chứa logic nghiệp vụ → rủi ro phá vỡ logic tạo đơn hàng. Unit test cũng rất khó vì phải mock database mỗi khi test `createOrder`.

**Vấn đề 2: `sendConfirmationEmail` nằm trong OrderManager**
- Email là **side effect**, không phải core logic. Nếu email service bị lỗi, có thể kéo theo cả flow tạo đơn hàng bị lỗi. Ngoài ra, khi test logic tạo đơn hàng, không muốn nó gửi email thật.

### 4. Đề xuất refactor:

```
┌─────────────────────────────────────────────────┐
│              DOMAIN (nghiệp vụ)                 │
│                                                 │
│  OrderService        → createOrder, validate    │
│  ShippingCalculator  → calculateShippingFee     │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│          INFRASTRUCTURE / SERVICE               │
│                                                 │
│  OrderRepository     → saveToDatabase           │
│  EmailService        → sendConfirmationEmail    │
│  InvoicePrinter      → printInvoice             │
│  ReportExporter      → exportExcelReport        │
└─────────────────────────────────────────────────┘
```

- **Domain:** `OrderService` (tạo, validate đơn hàng), `ShippingCalculator` (tính phí ship) → đây là logic nghiệp vụ cốt lõi.
- **Infrastructure:** `OrderRepository` (lưu DB), `EmailService` (gửi mail), `InvoicePrinter` (in hóa đơn), `ReportExporter` (xuất báo cáo) → đây là các dịch vụ bên ngoài.

### 5. Phản biện ngược:

> **"Tách quá mức sẽ gây phân mảnh code"** — Đúng! Nếu project nhỏ, chỉ 1-2 developer, đơn hàng đơn giản, thì việc tách thành 6-7 class có thể làm code khó theo dõi hơn. Developer mới phải nhảy qua nhiều file để hiểu flow tạo đơn hàng. Trong trường hợp project nhỏ, có thể chỉ cần tách thành 2-3 class (OrderService + OrderRepository + NotificationService) là đủ, không cần tách quá chi tiết.

---

## Phần III. Không phải cứ "đúng SOLID" là tốt hơn

### Code ban đầu:
```java
class PaymentProcessor {
   public void processPayment(String type, double amount) {
       if (type.equals("CREDIT_CARD")) { ... }
       else if (type.equals("PAYPAL")) { ... }
       else if (type.equals("MOMO")) { ... }
   }
}
```

### Đề xuất của sinh viên:
PaymentMethod interface, CreditCardPayment, PayPalPayment, MomoPayment, PaymentFactory, PaymentRegistry, PaymentStrategyResolver, AbstractPaymentHandler, BasePaymentAuditDecorator.

### Đánh giá: **Đúng ý nhưng làm quá tay (over-engineering)**

### 1. Code ban đầu vi phạm nguyên lý nào?

- **OCP (Open/Closed Principle):** Mỗi lần thêm phương thức thanh toán mới phải sửa code cũ (thêm else if) → class không "đóng" với sửa đổi.
- **SRP:** Class này vừa xử lý logic credit card, vừa PayPal, vừa MoMo → nhiều lý do để thay đổi.

### 2. Thành phần nào cần thiết, thành phần nào YAGNI?

| Thành phần                                          | Cần thiết? | Lý do                                      |
| --------------------------------------------------- | ---------- | ------------------------------------------ |
| `PaymentMethod` interface                           | ✅ Cần      | Tạo abstraction để mở rộng dễ dàng         |
| `CreditCardPayment`, `PayPalPayment`, `MomoPayment` | ✅ Cần      | Mỗi loại xử lý riêng biệt                  |
| `PaymentFactory`                                    | ✅ Cần      | Tạo đúng loại payment dựa trên type        |
| `PaymentRegistry`                                   | ⚠️ Có thể   | Chỉ cần khi số lượng payment method lớn    |
| `PaymentStrategyResolver`                           | ❌ YAGNI    | Thừa, Factory đã đủ                        |
| `AbstractPaymentHandler`                            | ❌ YAGNI    | Chưa biết có logic chung gì, đừng tạo sẵn  |
| `BasePaymentAuditDecorator`                         | ❌ YAGNI    | Chưa có yêu cầu audit, đừng thiết kế trước |

### 3. Xung đột giữa OCP/DIP và KISS/YAGNI:

```
OCP/DIP nói:   "Hãy tạo abstraction để dễ mở rộng"
KISS/YAGNI nói: "Đừng làm phức tạp khi chưa cần"
```

- OCP/DIP khuyến khích thiết kế linh hoạt, sẵn sàng mở rộng.
- KISS/YAGNI cảnh báo: đừng thiết kế cho tương lai mà mình **chưa biết chắc**.
- **Xung đột:** Nếu theo OCP triệt để, sẽ tạo ra nhiều abstraction layer → vi phạm KISS. Nếu theo KISS triệt để, code đơn giản nhưng khó mở rộng → vi phạm OCP.
- **Cách cân bằng:** Chỉ áp dụng abstraction ở những chỗ **chắc chắn sẽ thay đổi**, không thiết kế trước cho những thứ chưa biết.

### 4. Nếu chỉ có 2 phương thức và 6 tháng không đổi → Có refactor không?

**Không refactor ngay.** Vì:
- 6 tháng không đổi → chưa có áp lực thay đổi.
- Chỉ 2 phương thức → if/else đơn giản, dễ đọc, dễ hiểu.
- Refactor tốn thời gian, tạo thêm nhiều file, tăng complexity → không có lợi ích rõ ràng.
- Theo YAGNI: đừng làm khi chưa cần.

### 5. Nếu sắp tích hợp thêm 8 cổng thanh toán mới?

**Có, lúc này nên refactor.** Vì:
- 8 cổng mới = 8 else if thêm vào → code sẽ rất dài, khó maintain.
- Mỗi cổng có logic riêng, test riêng → cần tách.
- Lúc này OCP có giá trị thực tế, không còn là over-engineering.

### 6. Kết luận:

**Áp dụng ngay bây giờ (với 2-3 phương thức):**
```java
interface PaymentMethod {
    void pay(double amount);
}
class CreditCardPayment implements PaymentMethod { ... }
class PayPalPayment implements PaymentMethod { ... }
class MomoPayment implements PaymentMethod { ... }
class PaymentFactory {
    PaymentMethod create(String type) { ... }
}
```
→ Đơn giản, đủ dùng, dễ mở rộng.

**Để dành cho giai đoạn sau (khi có 8+ cổng):**
- `PaymentRegistry` (đăng ký động các payment method)
- Decorator pattern cho audit/logging (khi có yêu cầu cụ thể)
- Strategy resolver (khi logic chọn payment method phức tạp hơn)

---

## Phần IV. Phản biện các "đề xuất cải tiến nghe có vẻ đúng"

### Đề xuất 1: "Mọi class đều nên phụ thuộc vào interface, kể cả class nhỏ chỉ có 1 implementation"

**Nghe hợp lý vì:**
- DIP nói module cấp cao không nên phụ thuộc trực tiếp vào module cấp thấp → dùng interface là đúng hướng.

**Rủi ro nếu áp dụng cực đoan:**
- Nếu mọi class đều có 1 interface tương ứng → **gấp đôi số file** trong project.
- Interface chỉ có 1 implementation → không có giá trị abstraction thật sự, chỉ thêm boilerplate.
- Developer phải navigate qua interface mới tìm được code thật → chậm, mệt.

**Ví dụ khi ĐÚNG:**
```java
interface IEmailService { void send(Email email); }
// Có thể có: SmtpEmailService, SendGridEmailService, MockEmailService
```
→ Có nhiều implementation hoặc cần mock khi test → interface có giá trị.

**Ví dụ khi SAI / lãng phí:**
```java
interface IStringHelper { String trim(String s); }
class StringHelper implements IStringHelper { ... }
// Chỉ có 1 implementation, không bao giờ thay đổi
```
→ Tạo interface cho class utility đơn giản là **thừa thãi**.

**Nguyên tắc cân bằng:**
> Chỉ tạo interface khi có **khả năng thực tế** sẽ có nhiều implementation, hoặc khi cần mock để test. Nếu class nhỏ, đơn giản, chỉ có 1 implementation và không cần test riêng → phụ thuộc trực tiếp là đủ.

---

### Đề xuất 3: "Để tránh vi phạm LSP, tốt nhất là hạn chế kế thừa, hầu như chỉ nên dùng composition"

**Nghe hợp lý vì:**
- Kế thừa dễ vi phạm LSP (class con thay đổi hành vi class cha).
- Composition linh hoạt hơn, dễ thay đổi, dễ test.
- Câu nổi tiếng: "Favor composition over inheritance".

**Rủi ro nếu áp dụng cực đoan:**
- Có những trường hợp kế thừa **rất tự nhiên và đúng**: ví dụ `Dog extends Animal`, `SilverCustomer extends Customer`.
- Nếu ép dùng composition cho mọi thứ, code sẽ dài hơn, phải viết nhiều wrapper/delegate → **vi phạm KISS**.
- Kế thừa giúp tận dụng code có sẵn (code reuse) mà composition phải viết lại hoặc delegate.

**Ví dụ khi ĐÚNG (nên dùng composition):**
```java
// Thay vì: class Robot extends Human (robot không phải human)
// Nên dùng:
class Robot {
    private ArmMovement arm;  // composition
    private VoiceModule voice; // composition
}
```
→ Robot không phải Human, không nên kế thừa. Composition hợp lý hơn.

**Ví dụ khi SAI (kế thừa tốt hơn):**
```java
// HttpException kế thừa Exception là tự nhiên
class HttpException extends Exception {
    private int statusCode;
}
class NotFoundException extends HttpException { ... }
```
→ NotFoundException **đúng nghĩa** là một loại HttpException. Dùng composition ở đây sẽ phức tạp không cần thiết.

**Nguyên tắc cân bằng:**
> Dùng kế thừa khi quan hệ **"is-a"** là tự nhiên và class con không thay đổi hành vi class cha. Dùng composition khi quan hệ là **"has-a"** hoặc khi kế thừa buộc class con phải override/vô hiệu hóa method của class cha. Không cần chọn 1 bỏ 1, hãy chọn cái phù hợp với ngữ cảnh.

---

## Tổng kết

| Nguyên lý | Khi nào nên áp dụng               | Khi nào nên cẩn thận                      |
| --------- | --------------------------------- | ----------------------------------------- |
| SRP       | Khi class có nhiều lý do thay đổi | Đừng tách quá nhỏ, gây phân mảnh          |
| OCP       | Khi biết chắc sẽ mở rộng          | Đừng tạo abstraction trước khi cần        |
| LSP       | Khi dùng kế thừa                  | Không phải mọi quan hệ đều nên kế thừa    |
| ISP       | Khi interface quá lớn             | Đừng tách mỗi method 1 interface          |
| DIP       | Khi cần linh hoạt, dễ test        | Đừng tạo interface cho mọi thứ            |
| DRY       | Khi code lặp **vì cùng lý do**    | Đừng gộp code chỉ vì trông giống nhau     |
| KISS      | Luôn luôn                         | Đừng lấy KISS làm cớ để viết code cẩu thả |
| YAGNI     | Khi chưa có yêu cầu cụ thể        | Đừng lấy YAGNI làm cớ để không thiết kế   |

> **Bài học lớn nhất:** Không có nguyên lý nào đúng tuyệt đối. Mọi nguyên lý đều là **công cụ**, không phải **luật pháp**. Giá trị thật sự nằm ở việc biết **khi nào nên áp dụng** và **khi nào nên dừng lại**.
