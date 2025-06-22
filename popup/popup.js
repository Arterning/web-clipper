document.addEventListener('DOMContentLoaded', function() {
    const clipButton = document.getElementById('clipButton');
    const copyButton = document.getElementById('copyButton');
    const saveButton = document.getElementById('saveButton');
    const contentPreview = document.getElementById('contentPreview');
    const includeUrl = document.getElementById('includeUrl');
    const includeTitle = document.getElementById('includeTitle');
    
    let currentContent = null;
    
    // 从存储加载设置
    chrome.storage.sync.get(['includeUrl', 'includeTitle'], function(data) {
      includeUrl.checked = data.includeUrl !== false; // 默认为true
      includeTitle.checked = data.includeTitle !== false; // 默认为true
    });
    
    // 裁剪页面内容
    clipButton.addEventListener('click', function() {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'getPageContent'}, function(response) {
          if (chrome.runtime.lastError) {
            contentPreview.value = "错误: 无法获取页面内容。请刷新页面后重试。";
            return;
          }
          
          currentContent = response;
          updatePreview();
        });
      });
    });
    
    // 复制到剪贴板
    copyButton.addEventListener('click', function() {
      if (!currentContent) {
        alert("请先裁剪页面内容");
        return;
      }
      
      navigator.clipboard.writeText(contentPreview.value)
        .then(() => alert("内容已复制到剪贴板"))
        .catch(err => alert("复制失败: " + err));
    });
    
    // 保存为文件
    saveButton.addEventListener('click', function() {
      if (!currentContent) {
        alert("请先裁剪页面内容");
        return;
      }
      
      const blob = new Blob([contentPreview.value], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const filename = currentContent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.txt';
      
      chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
      });
    });
    
    // 更新设置
    includeUrl.addEventListener('change', function() {
      chrome.storage.sync.set({includeUrl: includeUrl.checked});
      if (currentContent) updatePreview();
    });
    
    includeTitle.addEventListener('change', function() {
      chrome.storage.sync.set({includeTitle: includeTitle.checked});
      if (currentContent) updatePreview();
    });
    
    // 更新预览内容
    function updatePreview() {
      let result = '';
      
      if (includeTitle.checked && currentContent.title) {
        result += `标题: ${currentContent.title}\n\n`;
      }
      
      if (includeUrl.checked && currentContent.url) {
        result += `URL: ${currentContent.url}\n\n`;
      }
      
      result += currentContent.content;
      contentPreview.value = result;
    }
  });