// 等待页面 DOM 结构加载完成
document.addEventListener('DOMContentLoaded', () => {
    
    // 获取元素
    const bgImage = document.getElementById('bgImage');
    const content = document.getElementById('content');
    
    // 配置你的图片路径 (必须与 CSS 中的一致)
    const imagePath = './images/lalaland1.jpg';

    // 1. 图片预加载逻辑
    // 创建一个新的 Image 对象在后台加载图片
    const imgLoader = new Image();
    imgLoader.src = imagePath;

    // 当图片完全加载完成后执行
    imgLoader.onload = () => {
        console.log("Background image loaded successfully.");
        
        // A. 让背景图淡入
        bgImage.classList.add('loaded');
        
        // B. 稍微延迟一点 (300ms)，让文字随后浮现，营造层次感
        setTimeout(() => {
            content.classList.add('visible');
        }, 300);
    };

    // 容错处理：如果图片已经在缓存中（秒开），onload 可能不会触发，需手动检查
    if (imgLoader.complete) {
        bgImage.classList.add('loaded');
        content.classList.add('visible');
    }

    // 2. 鼠标视差效果 (Parallax Effect)
    // 监听鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        // 计算鼠标位置相对于屏幕中心的偏移量
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        // 动态修改背景图的 transform
        // 注意：这里覆盖了 CSS 中的 breathe 动画的 transform，
        // 为了保留呼吸感，我们可以只应用微小平移，或者使用更复杂的组合。
        // 简单方案：仅在小范围内移动，不干扰缩放动画太多
        // 这里为了演示效果，直接应用平移，呼吸动画可能会在鼠标不动时恢复
        
        // 更高级的做法是结合 requestAnimationFrame，但为了代码简洁，
        // 我们这里做一个简单的叠加：
        // 由于 CSS 动画也在运行 transform，JS 直接赋值会覆盖 CSS 动画。
        // 解决方案：我们只对 overlay 或者 content 做视差，或者接受呼吸动画在鼠标移动时暂停。
        
        // 修正方案：只对文字内容做轻微视差，保持背景呼吸动画不被打断
        content.style.transform = `translate(${x}px, ${y}px)`;
        
        // 如果希望背景也动，取消下面注释，但会覆盖 CSS 呼吸动画
        // bgImage.style.transform = `scale(1.1) translate(${x}px, ${y}px)`;
    });

    // 鼠标移出时，重置文字位置（可选）
    document.addEventListener('mouseleave', () => {
         content.style.transition = 'transform 0.5s ease';
         content.style.transform = 'translate(0, 0)';
    });
    
    document.addEventListener('mouseenter', () => {
         // 移除过渡，让跟随更跟手
         content.style.transition = 'none';
    });

    console.log("Mona Mona Intro Script Initialized");
});