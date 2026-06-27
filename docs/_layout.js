// サイドバー注入
const res = await fetch('_sidebar.html');
document.getElementById('sidebar-mount').innerHTML = await res.text();

const currentPage = location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-link');

// ページレベルのアクティブ表示
navLinks.forEach(link => {
  const [page] = link.getAttribute('href').split('#');
  if (page === currentPage) link.classList.add('active');
});

// セクションが複数あるページはスクロール連動でアクティブを更新
const sections = document.querySelectorAll('section[id]');
if (sections.length > 1) {
  navLinks.forEach(link => {
    const [page] = link.getAttribute('href').split('#');
    if (page === currentPage) link.classList.remove('active');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const [page, hash] = link.getAttribute('href').split('#');
        if (page !== currentPage) return;
        link.classList.toggle('active', hash === entry.target.id);
      });
    });
  }, { rootMargin: '-10% 0px -80% 0px' });

  sections.forEach(s => observer.observe(s));
}
