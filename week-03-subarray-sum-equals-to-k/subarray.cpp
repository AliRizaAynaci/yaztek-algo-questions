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
// -> Diziyi bir kez dolaşıyoruz; her hash map islemleri ortalama O(1)
// Space Complexity: O(n)
// -> En kötü durumda n farklı prefix toplamı hash map'te tutulur
int subarraySum(vector<int>& nums, int k) {
    int n = nums.size();
    // prefix toplamlarının frekansı: sum -> kaç kez görüldü
    unordered_map<int, int> freq;
    // Baştan başlayan alt dizileri saydırmak için 
    // boş prefix toplamı (0) bir kez varsayılır
    freq[0]++;
    int runningSum = 0; // o ana kadarki prefix toplamı
    int count = 0;      // toplamı k olan alt dizi sayısı
    for (int i = 0; i < n; i++) {
        // prefix toplamını güncelle
        runningSum += nums[i];
        // k elde etmek için gerekli önceki prefix: runningSum - k
        int diff = runningSum - k;
        // Eğer diff daha önce görüldüyse, o kadar alt dizi vardır
        if (freq.find(diff) != freq.end()) {
            count += freq[diff];
        }
        // Bu prefix toplamını da frekansa ekle
        freq[runningSum]++;
    }
    return count;
}
