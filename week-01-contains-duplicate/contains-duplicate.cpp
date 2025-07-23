#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <string>

using namespace std;

// Time Complexity: O(n), 
// -> her elemanı bir kez geziyoruz ve set işlemleri O(1).
// Space Complexity: O(n), 
// -> en kötü durumda tüm elemanlar sete eklenebilir.
bool containsDuplicate(vector<int> &nums) {
    // Daha önce görülen sayılar burada tutulur
    unordered_set<int> set;

    for (int num : nums) {
        // Aynı sayı daha önce gelmişse tekrar var demektir
        if (set.find(num) != set.end())
            return true;

        // İlk kez görülen sayıyı sete ekle
        set.insert(num);
    }

    // Hiçbir sayı tekrar etmemişse
    return false;
}