// 获取页面主要内容并处理
function getPageContent() {
    // 尝试获取文章主要内容，如果没有特定结构则获取整个body
    let contentElement = document.querySelector('article') || 
                        document.querySelector('.article') || 
                        document.querySelector('.content') || 
                        document.querySelector('main') || 
                        document.body;
    
    // 克隆元素以避免修改原始页面
    const clonedElement = contentElement.cloneNode(true);
    
    // 处理图片 - 只保留链接
    const images = clonedElement.querySelectorAll('img');
    images.forEach(img => {
      const src = img.src || img.getAttribute('data-src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = `[图片: ${src}]`;
        img.parentNode.replaceChild(link, img);
      } else {
        img.remove();
      }
    });
    
    // 处理其他媒体元素
    const mediaElements = clonedElement.querySelectorAll('video, audio, iframe, embed');
    mediaElements.forEach(el => {
      const src = el.src || el.getAttribute('data-src');
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.textContent = `[媒体: ${src}]`;
        el.parentNode.replaceChild(link, el);
      } else {
        el.remove();
      }
    });
    
    // 移除脚本和样式
    const scripts = clonedElement.querySelectorAll('script, style, link');
    scripts.forEach(el => el.remove());
    
    // 清理空白和多余的换行
    let textContent = clonedElement.textContent;
    textContent = textContent.replace(/\s+/g, ' ').trim();
    
    // 获取页面标题
    const title = document.title;
    
    // 获取页面URL
    const url = window.location.href;
    
    return {
      title,
      url,
      content: textContent
    };
  }
  
  // 监听来自弹出窗口的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
      const content = getPageContent();
      sendResponse(content);
    }
    return true; // 保持消息通道开放以允许异步响应
  });