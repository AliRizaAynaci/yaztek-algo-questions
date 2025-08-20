## Container With Most Water

### 1. Görsel İçeriği

Elinde `height` adında `n` uzunluğunda bir tamsayı dizisi (array) var. Dizideki her bir eleman, x-eksenine dik çizilmiş bir dik çizgiyi temsil ediyor.
Yani: `i` konumundaki çizgi, noktaları `(i, 0)` ve `(i, height[i])` olan bir dik çizgi.

> Amaç: İki dik çizgi ve x-eksenini kullanarak **içi su dolu bir kap** oluşturmak. Bu kabın alabileceği **maksimum su miktarını** (alan olarak) bulman gerekiyor.

> Kural: Kap **yamuk duramaz**, yani çizgileri bükemezsin. Dikey kalmalılar.

> ⏱ Bu soruyu `O(n)` zaman ve `O(1)` ek bellekle çözmelisin.

<br/>

### 2. Örnekler (Input → Output):

`height = [1,8,6,2,5,4,8,3,7]` → `49`


![example](./question_11.jpg)

<br/>

### Benzer Sorular

> [https://leetcode.com/problems/trapping-rain-water/](https://leetcode.com/problems/trapping-rain-water/)
>
> [https://leetcode.com/problems/max-area-of-island/](https://leetcode.com/problems/max-area-of-island/)
