#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <string>

using namespace std;

// Time Complexity: O(n)
// -> İki pointer tek seferde diziyi tarar;
//    her adımda bir pointer hareket eder.
// Space Complexity: O(1)
// -> Ekstra bellekte sabit sayıda değişken tutulur.
int maxArea(vector<int>& height) {
    // Başlangıçta en soldan ve en sağdan başla
    int left = 0, right = height.size() - 1;
    int maxArea = INT_MIN; // En büyük alanı tutan değişken

    while (left < right) {
        // Su alabilecek alan: 
        // iki çubuğun minimum yüksekliği * aralarındaki mesafe
        int area = (right - left) * min(height[left], height[right]);
        maxArea = max(maxArea, area); // En büyük alanı güncelle

        // Daha kısa olan çubuğu hareket ettir (potansiyel artış için)
        if (height[left] < height[right]) {
            left++;
        } else if (height[right] < height[left]) {
            right--;
        } else {
            // Eğer ikisi eşitse, herhangi birini oynatabiliriz
            left++;
        }
    }

    return maxArea;
}