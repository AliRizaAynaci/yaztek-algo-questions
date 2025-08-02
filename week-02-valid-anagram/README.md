## İki Kelime Anagram mı?

### 1. Görsel İçeriği

Elinde `s` ve `t` adında iki kelime (string) var.  
`t` kelimesi, `s` kelimesinin harfleri kullanılarak oluşturulmuş bir **anagram** mı?

> Anagram: Harf sayıları aynı, sıralama farklı olabilir.

> ⏱ Bu soruyu `O(n)` zaman ve `O(1)` ek bellekle çözmen mümkün.

<br/>

### 2. Görsel İçeriği

### Örnekler (Input → Output):

"s" = `"anagram"`, "t" = `"nagaram"` → ✅ true  
**Tüm harfler aynı, sıralama farklı.**

---

"s" = `"rat"`, "t" = `"car"` → ❌ false  
**Harf sayıları farklı.**

---

"s" = `"aacc"`, "t" = `"ccac"` → ❌ false  
**Harfler tam olarak eşleşmiyor.**

<br/>

## Post Açıklamasına Konulabilir

### Benzer Soru (Group Anagrams)  
> https://leetcode.com/problems/group-anagrams/description/
