#include <iostream>
#include <vector>
#include <set>
#include <map>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
#include <string>

using namespace std;

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