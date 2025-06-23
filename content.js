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
    
    // 处理图片 - 转换为Markdown格式（增强版）
    const images = clonedElement.querySelectorAll('img');
    images.forEach(img => {
    const src = img.src || img.getAttribute('data-src') || '';
    const alt = img.alt || img.getAttribute('title') || '';
    const width = img.width || img.getAttribute('width') || '';
    const height = img.height || img.getAttribute('height') || '';
    
        if (src) {
            // 基础Markdown图片语法
            let mdImage = `![${alt}](${src})`;
            
            // 可选：添加尺寸信息作为HTML属性（兼容某些Markdown解析器）
            if (width || height) {
            mdImage += `{ width=${width}${height ? ` height=${height}` : ''} }`;
            }
            
            const mdNode = document.createTextNode(mdImage + '\n\n'); // 添加换行使图片更清晰
            img.parentNode.replaceChild(mdNode, img);
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