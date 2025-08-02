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
// -> İki string'i bir kez geziyoruz, her işlem O(1)
// Space Complexity: O(1)
// -> 26 harflik sabit boyutlu dizi kullanıyoruz
bool isAnagram(string s, string t) {
    // Uzunluklar farklıysa anagram olamaz
    if (s.length() != t.length())
        return false;

    // Harf sayıları için sayaç
    vector<int> count(26, 0);

    // s için arttır, t için azalt
    for (int i = 0; i < s.length(); i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }

    // Tüm sayımlar sıfır mı kontrol et
    for (int val : count) {
        if (val != 0)
            return false;
    }

    return true;
}