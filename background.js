// 后台脚本，可用于处理跨标签页通信或持久化数据
chrome.runtime.onInstalled.addListener(function() {
    // 设置默认值
    chrome.storage.sync.set({
      includeUrl: true,
      includeTitle: true
    });
  });