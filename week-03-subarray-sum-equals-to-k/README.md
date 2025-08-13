## Toplamı `k` Olan Alt Diziler (Subarray Sum Equals K)

### 1. Görsel İçeriği

Elinde `nums` adında bir tamsayı dizisi (array) ve `k` adında bir hedef sayı var.  
Görev: **Toplamı `k` olan tüm alt dizilerin (subarray) sayısını bul.**

> Alt dizi (subarray): Dizide ardışık (contiguous) ve boş olmayan elemanlardan oluşur.  
> ⏱ Bu soruyu `O(n)` zaman ve `O(n)` ek bellekle çözmelisin.

<br/>

### 2. Örnekler (Input → Output):

`nums = [1, 1, 1], k = 2` → `2`  
**Açıklama:** Toplamı 2 olan alt diziler: `[1, 1]` (ilk iki eleman) ve `[1, 1]` (son iki eleman).

---

`nums = [1, 2, 3], k = 3` → `2`  
**Açıklama:** `[1, 2]` ve `[3]` alt dizilerinin toplamı 3.

---

`nums = [3, 4, 7, -2, 2, 1, 4, 2], k = 7` → `4`  
**Açıklama:** Toplamı 7 olan alt diziler:  
- `[3, 4]`  
- `[7]`  
- `[7, -2, 2]`  
- `[-2, 2, 1, 4, 2]`

<br/>

## Post Açıklamasına Konulabilir

### Benzer Sorular
> https://leetcode.com/problems/continuous-subarray-sum/
