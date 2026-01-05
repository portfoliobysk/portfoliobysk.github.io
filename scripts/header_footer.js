const headerContent = `
  <h1><img src="https://portfoliobysk.github.io/images/logo.svg" alt="S.K's Portfolio Logo"></h1>
  <div class="nav__wrapper">
    <input type="checkbox" id="nav__toggle" hidden>
    <label class="nav__icon" for="nav__toggle">
      <span></span>
      <span></span>
      <span></span>
    </label>
    <div class="overlay"></div>
    <nav>
      <div id="header__nav__contents">
        <a href="#profile__link">Profile</a>
        <a href="#skills__link">Skill's</a>
        <a href="#portfolio__link">Portfolio</a>
        <a href="#career__link">Career</a>
      </div>
      <div id="header__nav__links">
        <a href="https://github.com/portfoliobysk/"><img src="https://portfoliobysk.github.io/images/github.svg" alt="GitHub"></a>
        <a href="https://forms.gle/CALFLhAjRGj49LZC6"><img src="https://portfoliobysk.github.io/images/mail.svg" alt="Contact"></a>
      </div>
    </nav>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {

});

const breadcrumbContent = () => {
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment.length > 0);
    
    let currentPath = '/';
    let breadcrumbHTML = '<ol>';

    breadcrumbHTML += '<li><a href="/">Home</a></li>&nbsp;&gt;&nbsp;';

    pathSegments.forEach((segment, index) => {
        currentPath += segment + '/';
        const isLast = index === pathSegments.length - 1;
        const linkText = document.title.replace(" - S.K's Portfolio", ""); 

        if (!isLast) {
            breadcrumbHTML += `<li><a href="${currentPath}">${linkText}</a></li>&nbsp;&gt;&nbsp;`;
        } else {
            breadcrumbHTML += `<li>` + document.title.replace(" - S.K's Portfolio", "") + `</li>`;
        }
    });

    breadcrumbHTML += '</ol>';

    return breadcrumbHTML;
}

const footerContent = `
  <div id="footer__copy">
    <img src="https://portfoliobysk.github.io/images/logo.svg" alt="S.K's Portfolio Logo">
    <small>&#169; 2025 S.K</small>
  </div>
  <div id="footer__nav__contents">
    <a href="#profile__link">Profile</a>
    <a href="#skills__link">Skill's</a>
    <a href="#portfolio__link">Portfolio</a>
    <a href="#career__link">Career</a>
    <div id="footer__nav__links">
      <a class="icon__link" href="https://github.com/portfoliobysk/"><img src="https://portfoliobysk.github.io/images/github.svg" alt="GitHub"></a>
      <a class="icon__link" href="https://forms.gle/CALFLhAjRGj49LZC6"><img src="https://portfoliobysk.github.io/images/mail.svg" alt="Contact"></a>
    </div>
  </div>
`;

// ページロード後に実行
document.addEventListener('DOMContentLoaded', () => {

  const headerPlaceholder = document.querySelector('header');
  if (headerPlaceholder) {
      headerPlaceholder.innerHTML = headerContent;
  }

  const breadcrumbPlaceholder = document.getElementById('breadcrumb');
  if (breadcrumbPlaceholder) {
      breadcrumbPlaceholder.innerHTML = breadcrumbContent();
  }

  const footerPlaceholder = document.querySelector('footer');
  if (footerPlaceholder) {
      footerPlaceholder.innerHTML = footerContent;
  }

  /*
   * ハンバーガーメニューのページ内リンクでオーバーレイを閉じるためのスクリプト
   */
  const toggle = document.getElementById("nav__toggle");
  const nav = document.querySelector("nav");

  if (!toggle || !nav) return;

  nav.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    toggle.checked = false;
  });
        
});